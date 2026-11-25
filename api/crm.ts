// CRM do site: login com Google, lista de leads, atualização de etapa/anotações, exclusão (LGPD)
// e exportação em planilha (CSV). Os leads ficam no Redis da Vercel (Upstash), gravados por api/lead.ts.
//
// Env (Vercel → Settings → Environment Variables):
//   KV_REST_API_URL / KV_REST_API_TOKEN   criados ao conectar o Upstash Redis (Storage) ao projeto
//                                         (também aceita UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
//   VITE_GOOGLE_CLIENT_ID                 ID do cliente OAuth do Google (tipo "Aplicativo da Web")
//   CRM_ALLOWED_EMAILS                    e-mails que podem entrar, separados por vírgula
//   CRM_SESSION_SECRET                    opcional; sem ele a sessão é assinada com uma chave derivada do token do Redis
//
// Security (CIPHER): Google ID token verified by Google (tokeninfo) + audience/issuer/expiry/email_verified
// + allowlist; session = HMAC-signed HttpOnly/Secure/SameSite=Strict cookie scoped to /api/crm (12 h);
// every write checks the Origin; inputs validated and capped. Self-contained on purpose (see api/lead.ts).

const COOKIE = 'mi_crm'
const SESSION_HOURS = 12
const KEY_PREFIX = 'mi:'
const MAX_LEADS = 2000

export const STAGES = [
  'Novo',
  'Contatado',
  'Reunião agendada',
  'Reunião realizada',
  'Proposta enviada',
  'Negociação',
  'Ganho',
  'Perdido',
  'Opt-out',
] as const

const ALLOWED_ORIGINS = [/^(www\.)?metaimpulso\.com\.br$/, /\.vercel\.app$/, /^localhost(:\d+)?$/, /^127\.0\.0\.1(:\d+)?$/]

// ---------- helpers ----------
function json(status: number, body: object, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', ...headers },
  })
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return ALLOWED_ORIGINS.some((re) => re.test(new URL(origin).host))
  } catch {
    return false
  }
}

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

type RedisCmd = (string | number)[]
async function redis(commands: RedisCmd[]): Promise<unknown[]> {
  const cfg = redisConfig()
  if (!cfg) throw new Error('storage_not_configured')
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands.map((c) => c.map(String))),
  })
  if (!res.ok) throw new Error('storage_error')
  const out = (await res.json()) as { result?: unknown; error?: string }[]
  if (out.some((r) => r.error)) throw new Error('storage_error')
  return out.map((r) => r.result)
}

const enc = new TextEncoder()
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).toString('base64url')

async function hmac(data: string) {
  const secret = process.env.CRM_SESSION_SECRET || `mi-crm-session:${redisConfig()?.token ?? ''}`
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function allowedEmails() {
  return (process.env.CRM_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

async function sessionCookie(email: string) {
  const payload = b64url(enc.encode(JSON.stringify({ email, exp: Date.now() + SESSION_HOURS * 3600_000 })))
  const value = `${payload}.${await hmac(payload)}`
  return `${COOKIE}=${value}; Path=/api/crm; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`
}

/** Returns the signed-in e-mail, or null. Re-checks the allowlist so removing an e-mail locks it out at once. */
async function currentUser(request: Request): Promise<string | null> {
  const cookie = (request.headers.get('cookie') || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`))
  if (!cookie || !redisConfig()) return null
  const [payload, sig] = cookie.slice(COOKIE.length + 1).split('.')
  if (!payload || !sig || !safeEqual(sig, await hmac(payload))) return null
  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email: string; exp: number }
    if (typeof exp !== 'number' || exp < Date.now()) return null
    return allowedEmails().includes(email) ? email : null
  } catch {
    return null
  }
}

function setupStatus() {
  return {
    storage: Boolean(redisConfig()),
    google: Boolean(process.env.VITE_GOOGLE_CLIENT_ID),
    allowlist: allowedEmails().length > 0,
  }
}

// ---------- leads ----------
export interface CrmLead {
  id: string
  created_at: string
  status: (typeof STAGES)[number]
  next_action?: string
  next_action_date?: string
  lost_reason?: string
  notes?: { at: string; by: string; text: string }[]
  updated_at?: string
  [field: string]: unknown
}

async function listLeads(): Promise<CrmLead[]> {
  const [ids] = (await redis([['ZREVRANGE', `${KEY_PREFIX}leads`, 0, MAX_LEADS - 1]])) as string[][]
  if (!ids || ids.length === 0) return []
  const [values] = (await redis([['MGET', ...ids.map((id) => `${KEY_PREFIX}lead:${id}`)]])) as (string | null)[][]
  return values.flatMap((v) => {
    if (!v) return []
    try {
      return [JSON.parse(v) as CrmLead]
    } catch {
      return []
    }
  })
}

async function getLead(id: string): Promise<CrmLead | null> {
  const [v] = (await redis([['GET', `${KEY_PREFIX}lead:${id}`]])) as (string | null)[]
  return v ? (JSON.parse(v) as CrmLead) : null
}

const CSV_COLUMNS: [string, string][] = [
  ['created_at', 'Data'],
  ['status', 'Etapa'],
  ['lead_priority', 'Prioridade'],
  ['lead_score', 'Nota'],
  ['recommended_plan', 'Plano indicado'],
  ['companyName', 'Empresa'],
  ['userName', 'Contato'],
  ['userPhone', 'WhatsApp'],
  ['userEmail', 'E-mail'],
  ['objective', 'Objetivo'],
  ['revenue', 'Faturamento'],
  ['budget', 'Orçamento'],
  ['next_action', 'Próxima ação'],
  ['next_action_date', 'Data da próxima ação'],
  ['lost_reason', 'Motivo da perda'],
  ['notes', 'Anotações'],
  ['site_url', 'Site analisado'],
  ['raiox_score', 'Nota do Raio-X'],
  ['raiox_alertas', 'Alertas do Raio-X'],
  ['form_location', 'Página do formulário'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['gclid', 'gclid'],
  ['fbclid', 'fbclid'],
  ['referrer', 'Veio de'],
  ['landing_page', 'Primeira página'],
]

function toCsv(leads: CrmLead[]) {
  const cell = (v: unknown) => {
    let s = v === undefined || v === null ? '' : String(v)
    // Spreadsheet formula injection guard
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
    return `"${s.replace(/"/g, '""')}"`
  }
  const rows = leads.map((l) =>
    CSV_COLUMNS.map(([k]) => {
      if (k === 'notes') return cell((l.notes || []).map((n) => `${n.at.slice(0, 10)} ${n.text}`).join(' | '))
      if (k === 'created_at') return cell(new Date(l.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))
      return cell(l[k])
    }).join(';'),
  )
  // BOM + ";" so Excel (pt-BR) and Google Sheets open the accents and columns correctly
  return '﻿' + [CSV_COLUMNS.map(([, h]) => cell(h)).join(';'), ...rows].join('\r\n')
}

// ---------- handlers ----------
async function verifyGoogle(credential: string): Promise<string | null> {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !credential || credential.length > 4096) return null
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
  if (!res.ok) return null
  const t = (await res.json()) as { aud?: string; iss?: string; exp?: string; email?: string; email_verified?: string | boolean }
  const issOk = t.iss === 'accounts.google.com' || t.iss === 'https://accounts.google.com'
  const verified = t.email_verified === true || t.email_verified === 'true'
  if (t.aud !== clientId || !issOk || !verified || !t.email || Number(t.exp) * 1000 < Date.now()) return null
  const email = t.email.toLowerCase()
  return allowedEmails().includes(email) ? email : null
}

export async function GET(request: Request): Promise<Response> {
  const op = new URL(request.url).searchParams.get('op')
  const user = await currentUser(request)

  if (op === 'me') return user ? json(200, { ok: true, email: user }) : json(401, { ok: false, setup: setupStatus() })
  if (!user) return json(401, { ok: false, error: 'unauthorized' })

  try {
    if (op === 'leads') return json(200, { ok: true, leads: await listLeads(), stages: STAGES })
    if (op === 'export') {
      const stamp = new Date().toISOString().slice(0, 10)
      return new Response(toCsv(await listLeads()), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="leads-meta-impulso-${stamp}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    }
  } catch (e) {
    return json(503, { ok: false, error: (e as Error).message })
  }
  return json(404, { ok: false, error: 'not_found' })
}

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'forbidden' })
  const op = new URL(request.url).searchParams.get('op')

  if (op === 'logout') {
    return json(200, { ok: true }, { 'Set-Cookie': `${COOKIE}=; Path=/api/crm; HttpOnly; Secure; SameSite=Strict; Max-Age=0` })
  }
  if (op === 'login') {
    if (!redisConfig()) return json(503, { ok: false, error: 'storage_not_configured' })
    const body = (await request.json().catch(() => null)) as { credential?: unknown } | null
    if (!body) return json(400, { ok: false, error: 'invalid_json' })
    const credential = str(body.credential, 4096)
    const email = await verifyGoogle(credential)
    if (!email) return json(403, { ok: false, error: 'not_allowed' })
    return json(200, { ok: true, email }, { 'Set-Cookie': await sessionCookie(email) })
  }
  return json(404, { ok: false, error: 'not_found' })
}

export async function PATCH(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'forbidden' })
  const user = await currentUser(request)
  if (!user) return json(401, { ok: false, error: 'unauthorized' })

  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }
  const id = str(input.id, 64)
  if (!/^[a-f0-9-]{8,64}$/.test(id)) return json(400, { ok: false, error: 'invalid_id' })

  try {
    const lead = await getLead(id)
    if (!lead) return json(404, { ok: false, error: 'not_found' })
    const now = new Date().toISOString()
    lead.notes = lead.notes || []

    if (input.status !== undefined) {
      const status = str(input.status, 40)
      if (!(STAGES as readonly string[]).includes(status)) return json(422, { ok: false, error: 'invalid_status' })
      if (status !== lead.status) lead.notes.push({ at: now, by: user, text: `Etapa: ${lead.status} → ${status}` })
      lead.status = status as CrmLead['status']
    }
    if (input.next_action !== undefined) lead.next_action = str(input.next_action, 300)
    if (input.next_action_date !== undefined) {
      const d = str(input.next_action_date, 10)
      if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) return json(422, { ok: false, error: 'invalid_date' })
      lead.next_action_date = d
    }
    if (input.lost_reason !== undefined) lead.lost_reason = str(input.lost_reason, 300)
    const note = str(input.note, 2000)
    if (note) lead.notes.push({ at: now, by: user, text: note })
    lead.updated_at = now

    await redis([['SET', `${KEY_PREFIX}lead:${id}`, JSON.stringify(lead)]])
    return json(200, { ok: true, lead })
  } catch (e) {
    return json(503, { ok: false, error: (e as Error).message })
  }
}

export async function DELETE(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return json(403, { ok: false, error: 'forbidden' })
  const user = await currentUser(request)
  if (!user) return json(401, { ok: false, error: 'unauthorized' })
  const id = new URL(request.url).searchParams.get('id') || ''
  if (!/^[a-f0-9-]{8,64}$/.test(id)) return json(400, { ok: false, error: 'invalid_id' })
  try {
    await redis([
      ['DEL', `${KEY_PREFIX}lead:${id}`],
      ['ZREM', `${KEY_PREFIX}leads`, id],
    ])
    return json(200, { ok: true })
  } catch (e) {
    return json(503, { ok: false, error: (e as Error).message })
  }
}
