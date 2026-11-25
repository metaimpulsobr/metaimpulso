// Lead intake for the diagnostic quiz: the browser posts here (same origin) and this function
// validates the data, recalculates the qualification and delivers the lead to every destination that
// is configured: a Notion database (the team's CRM), the site's own /crm (Upstash Redis on Vercel)
// and/or a webhook (e.g. a Google Sheet). Nothing about the destinations reaches the browser.
//
// Env (Vercel → Settings → Environment Variables):
//   NOTION_TOKEN / NOTION_DATABASE_ID    Notion internal integration secret + the leads database (ID or link);
//                                        missing columns are created on the first lead (docs/CRM-NOTION.md)
//   KV_REST_API_URL / KV_REST_API_TOKEN  CRM storage (created when Upstash Redis is connected to the project;
//                                        UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN also work)
//   VITE_LEAD_WEBHOOK_URL  optional extra destination (name kept for compatibility with the setup docs)
//   LEAD_WEBHOOK_TOKEN     optional; sent as "token" in the body so the receiver can reject forgeries
//
// Security (CIPHER): same-origin only, 16 KB body cap, strict field validation, honeypot,
// score/priority/plan recomputed here (the browser's values are ignored), 8 s forward timeout.
// Self-contained on purpose (Vercel compiles each api file on its own in this ESM project).
// KEEP THE TABLES BELOW IN SYNC WITH src/lib/leadScore.ts.

const MAX_BODY = 16_000
const FORWARD_TIMEOUT_MS = 8000

const OBJECTIVES: Record<string, { label: string; points: number }> = {
  completo: { label: 'Estrutura completa, tudo integrado', points: 30 },
  trafego: { label: 'Gestão de tráfego pago', points: 18 },
  site: { label: 'Site, landing page ou SEO', points: 15 },
  crm: { label: 'CRM e automação comercial', points: 18 },
  ia: { label: 'Agentes de inteligência artificial', points: 22 },
  software: { label: 'Software sob medida', points: 22 },
}
const REVENUES: Record<string, { label: string; points: number }> = {
  ate10: { label: 'Até R$ 10 mil / mês', points: 5 },
  '10a50': { label: 'R$ 10 mil a R$ 50 mil / mês', points: 15 },
  '50a200': { label: 'R$ 50 mil a R$ 200 mil / mês', points: 25 },
  '200mais': { label: 'Acima de R$ 200 mil / mês', points: 35 },
}
const BUDGETS: Record<string, { label: string; points: number }> = {
  ate1500: { label: 'Até R$ 1.500 / mês', points: 5 },
  '1500a5000': { label: 'R$ 1.500 a R$ 5.000 / mês', points: 15 },
  '5000a15000': { label: 'R$ 5.000 a R$ 15.000 / mês', points: 28 },
  '15000mais': { label: 'Acima de R$ 15.000 / mês', points: 35 },
}
const PLAN_NAMES = { start: 'START', growth: 'GROWTH', scale: 'SCALE' } as const

export function qualify(objective: string, revenue: string, budget: string) {
  const score = Math.min(100, OBJECTIVES[objective].points + REVENUES[revenue].points + BUDGETS[budget].points)
  const priority = score >= 70 ? 'alta' : score >= 45 ? 'media' : 'baixa'
  let plan: keyof typeof PLAN_NAMES = 'growth'
  if (budget === 'ate1500' || revenue === 'ate10') plan = 'start'
  else if (
    budget === '15000mais' ||
    (['ia', 'software'].includes(objective) && (revenue === '50a200' || revenue === '200mais') && budget === '5000a15000')
  )
    plan = 'scale'
  return { score, priority, plan: PLAN_NAMES[plan] }
}

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'landing_page', 'referrer']

const ALLOWED_HOSTS = [/^(www\.)?metaimpulso\.com\.br$/, /\.vercel\.app$/, /^localhost(:\d+)?$/, /^127\.0\.0\.1(:\d+)?$/]

function json(status: number, body: object) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** Returns the lead as the webhook expects it, or an error code. */
export function buildLead(input: Record<string, unknown>, now = new Date()): { lead: Record<string, unknown> } | { error: string } {
  const companyName = str(input.companyName, 120)
  const userName = str(input.userName, 80)
  const userEmail = str(input.userEmail, 120)
  const phoneDigits = str(input.userPhone, 30).replace(/\D/g, '')
  const objective_id = str(input.objective_id, 20)
  const revenue_id = str(input.revenue_id, 20)
  const budget_id = str(input.budget_id, 20)
  const form_location = str(input.form_location, 60)

  if (!companyName || !userName) return { error: 'missing_name' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) return { error: 'invalid_email' }
  if (phoneDigits.length < 10 || phoneDigits.length > 13) return { error: 'invalid_phone' }
  if (!OBJECTIVES[objective_id] || !REVENUES[revenue_id] || !BUDGETS[budget_id]) return { error: 'invalid_answers' }
  if (!/^[a-z0-9_-]{1,60}$/.test(form_location)) return { error: 'invalid_location' }
  if (input.consent_lgpd !== true) return { error: 'no_consent' }

  const q = qualify(objective_id, revenue_id, budget_id)
  const lead: Record<string, unknown> = {
    companyName,
    objective: OBJECTIVES[objective_id].label,
    revenue: REVENUES[revenue_id].label,
    budget: BUDGETS[budget_id].label,
    objective_id,
    revenue_id,
    budget_id,
    userName,
    userPhone: str(input.userPhone, 30),
    userEmail,
    lead_score: q.score,
    lead_priority: q.priority,
    recommended_plan: q.plan,
    form_location,
    source: 'site-diagnostico',
    page: str(input.page, 300),
    created_at: now.toISOString(),
    consent_lgpd: true,
  }

  const siteUrl = str(input.site_url, 300)
  if (siteUrl) {
    lead.site_url = siteUrl
    const rs = Number(input.raiox_score)
    if (Number.isInteger(rs) && rs >= 0 && rs <= 100) lead.raiox_score = rs
    const alerts = str(input.raiox_alertas, 600)
    if (alerts) lead.raiox_alertas = alerts
  }
  for (const k of ATTRIBUTION_KEYS) {
    const v = str(input[k], 300)
    if (v) lead[k] = v
  }
  return { lead }
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  let host = ''
  try {
    host = origin ? new URL(origin).host : ''
  } catch {
    host = ''
  }
  if (!ALLOWED_HOSTS.some((re) => re.test(host))) return json(403, { ok: false, error: 'forbidden' })

  const raw = await request.text()
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'too_large' })
  let input: Record<string, unknown>
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
    input = parsed as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }

  // Bots fill the hidden "website" field: pretend success, forward nothing.
  if (str(input.website, 200)) return json(200, { ok: true })

  const built = buildLead(input)
  if ('error' in built) return json(422, { ok: false, error: built.error })

  const results = await Promise.all([saveToNotion(built.lead), saveToCrm(built.lead), forwardToWebhook(built.lead)])
  if (results.every((r) => r === 'skipped')) return json(503, { ok: false, error: 'not_configured' })
  if (results.includes('ok')) return json(200, { ok: true })
  return json(502, { ok: false, error: 'delivery_failed' })
}

type Delivery = 'ok' | 'failed' | 'skipped'

/** Saves the lead where the /crm page reads it (same keys as api/crm.ts). */
async function saveToCrm(lead: Record<string, unknown>): Promise<Delivery> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return 'skipped'
  const id = crypto.randomUUID()
  const record = { id, status: 'Novo', ...lead }
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['SET', `mi:lead:${id}`, JSON.stringify(record)],
        ['ZADD', 'mi:leads', String(Date.parse(String(lead.created_at)) || Date.now()), id],
      ]),
    })
    if (!res.ok) return 'failed'
    const out = (await res.json()) as { error?: string }[]
    return out.some((r) => r.error) ? 'failed' : 'ok'
  } catch {
    return 'failed'
  }
}

async function forwardToWebhook(lead: Record<string, unknown>): Promise<Delivery> {
  const webhook = process.env.VITE_LEAD_WEBHOOK_URL
  if (!webhook) return 'skipped'
  const token = process.env.LEAD_WEBHOOK_TOKEN
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FORWARD_TIMEOUT_MS)
  try {
    // text/plain JSON: what the Google Apps Script receiver (and most webhook tools) read as-is
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(token ? { ...lead, token } : lead),
      redirect: 'follow',
      signal: ctrl.signal,
    })
    return res.ok ? 'ok' : 'failed'
  } catch {
    return 'failed'
  } finally {
    clearTimeout(timer)
  }
}

// ---------- Notion ----------
const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

/** Columns the leads database gets (created automatically when missing). Objetivo is text: Notion selects can't hold commas. */
export const NOTION_SCHEMA: Record<string, Record<string, unknown>> = {
  Etapa: {
    select: {
      options: ['Novo', 'Contatado', 'Reunião agendada', 'Reunião realizada', 'Proposta enviada', 'Negociação', 'Ganho', 'Perdido', 'Opt-out'].map(
        (name) => ({ name }),
      ),
    },
  },
  Prioridade: { select: { options: [{ name: 'Alta', color: 'red' }, { name: 'Média', color: 'yellow' }, { name: 'Baixa', color: 'gray' }] } },
  Nota: { number: { format: 'number' } },
  'Plano indicado': { select: {} },
  Contato: { rich_text: {} },
  WhatsApp: { phone_number: {} },
  'Abrir WhatsApp': { url: {} },
  'E-mail': { email: {} },
  Objetivo: { rich_text: {} },
  Faturamento: { select: {} },
  Orçamento: { select: {} },
  'Site analisado': { url: {} },
  'Nota do Raio-X': { number: { format: 'number' } },
  'Furos do Raio-X': { rich_text: {} },
  Origem: { rich_text: {} },
  Formulário: { rich_text: {} },
  'Recebido em': { date: {} },
  'Próxima ação': { rich_text: {} },
  'Data da próxima ação': { date: {} },
  // Filled in by the team while working the lead
  Responsável: { people: {} },
  'Último contato': { date: {} },
  'Valor da proposta': { number: { format: 'real' } },
  'Motivo da perda': {
    select: {
      options: ['Preço', 'Momento errado', 'Sem resposta', 'Escolheu concorrente', 'Sem orçamento', 'Fora do perfil'].map((name) => ({ name })),
    },
  },
}

/** Page content for each lead: a quick summary plus the response playbook as to-dos (by priority). */
export function notionPlaybook(lead: Record<string, unknown>) {
  const p = (content: string) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: content.slice(0, 2000) } }] } })
  const h = (content: string) => ({ object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content } }] } })
  const todo = (content: string) => ({ object: 'block', type: 'to_do', to_do: { rich_text: [{ text: { content } }], checked: false } })
  const priority = String(lead.lead_priority)
  const deadline = priority === 'alta' ? 'em até 5 minutos' : priority === 'media' ? 'ainda hoje' : 'em até 24 horas'
  const blocks: object[] = [
    {
      object: 'block',
      type: 'callout',
      callout: {
        icon: { type: 'emoji', emoji: priority === 'alta' ? '🔥' : priority === 'media' ? '⚡' : '📌' },
        color: priority === 'alta' ? 'red_background' : priority === 'media' ? 'yellow_background' : 'gray_background',
        rich_text: [
          {
            text: {
              content: `Prioridade ${PRIORITY_NAMES[priority] || '—'} (nota ${lead.lead_score}): responder ${deadline} no horário comercial. Plano indicado na pré-análise: ${lead.recommended_plan}.`,
            },
          },
        ],
      },
    },
    h('O que a pessoa respondeu'),
    p(`Objetivo: ${lead.objective}`),
    p(`Faturamento: ${lead.revenue} · Orçamento para marketing: ${lead.budget}`),
  ]
  if (lead.site_url) {
    blocks.push(h('Raio-X do site'), p(`${lead.site_url} · nota ${lead.raiox_score ?? '—'}/100`))
    if (lead.raiox_alertas) blocks.push(p(`Furos encontrados: ${lead.raiox_alertas}`))
  }
  blocks.push(
    h('Roteiro de atendimento'),
    todo(`Responder no WhatsApp ${deadline} (use a coluna "Abrir WhatsApp")`),
    todo(lead.site_url ? 'Citar 1 ou 2 furos do Raio-X na primeira mensagem' : 'Rodar o Raio-X do site da empresa e citar 1 ou 2 furos'),
    todo('Gravar a Auditoria Digital Express (vídeo de 2 a 3 min) e enviar'),
    todo('Agendar a conversa de 30 minutos (mudar Etapa para "Reunião agendada")'),
    todo('Confirmar se é SQL: dor clara, orçamento ≥ START, decisor na conversa, prazo ≤ 90 dias'),
    todo('Depois da reunião: proposta com as palavras do cliente, validade de 15 dias'),
    h('Anotações da conversa'),
    p('Escreva aqui o que foi conversado, objeções e combinados.'),
  )
  return blocks
}

const PRIORITY_NAMES: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

/** Accepts the raw ID or a full Notion link and returns the 32-hex database ID. */
export function notionDatabaseId(raw: string) {
  // Links look like notion.so/<workspace>/<Page-title>-<32 hex>?v=...: the ID is the last 32 hex of the last segment
  const segment = raw.trim().split(/[?#]/)[0].split('/').pop() || ''
  const hex = segment.replace(/-/g, '').match(/[0-9a-f]{32}$/i)
  return hex ? hex[0].toLowerCase() : ''
}

const notionText = (v: unknown) => ({ rich_text: v ? [{ text: { content: String(v).slice(0, 2000) } }] : [] })
const notionSelect = (v: unknown) => (v ? { select: { name: String(v).replace(/,/g, ' ').slice(0, 100) } } : { select: null })

/** Notion page properties for a lead, keyed by column name. */
export function notionProperties(lead: Record<string, unknown>, titleColumn: string) {
  const phone = String(lead.userPhone || '')
  const digits = phone.replace(/\D/g, '')
  const site = String(lead.site_url || '')
  const origin = lead.utm_source
    ? [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ')
    : String(lead.referrer || 'Direto')
  const props: Record<string, unknown> = {
    [titleColumn]: { title: [{ text: { content: String(lead.companyName || 'Lead do site').slice(0, 200) } }] },
    Etapa: { select: { name: 'Novo' } },
    Prioridade: notionSelect(PRIORITY_NAMES[String(lead.lead_priority)]),
    Nota: { number: typeof lead.lead_score === 'number' ? lead.lead_score : null },
    'Plano indicado': notionSelect(lead.recommended_plan),
    Contato: notionText(lead.userName),
    WhatsApp: { phone_number: phone || null },
    'Abrir WhatsApp': { url: digits ? `https://wa.me/${digits.startsWith('55') ? digits : `55${digits}`}` : null },
    'E-mail': { email: lead.userEmail || null },
    Objetivo: notionText(lead.objective),
    Faturamento: notionSelect(lead.revenue),
    Orçamento: notionSelect(lead.budget),
    'Site analisado': { url: site ? (/^https?:\/\//.test(site) ? site : `https://${site}`) : null },
    'Nota do Raio-X': { number: typeof lead.raiox_score === 'number' ? lead.raiox_score : null },
    'Furos do Raio-X': notionText(lead.raiox_alertas),
    Origem: notionText(origin),
    Formulário: notionText(lead.form_location === 'home' ? 'Página inicial' : lead.form_location),
    'Recebido em': { date: { start: String(lead.created_at) } },
  }
  return props
}

async function notion(path: string, init: RequestInit) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FORWARD_TIMEOUT_MS)
  try {
    return await fetch(`${NOTION_API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      signal: ctrl.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

/** Creates the lead as a row of the Notion database, adding any missing columns first. */
async function saveToNotion(lead: Record<string, unknown>): Promise<Delivery> {
  const dbId = notionDatabaseId(process.env.NOTION_DATABASE_ID || '')
  if (!process.env.NOTION_TOKEN || !dbId) return 'skipped'
  try {
    const dbRes = await notion(`/databases/${dbId}`, { method: 'GET' })
    if (!dbRes.ok) return notionFailed('read database', dbRes)
    const db = (await dbRes.json()) as { properties: Record<string, { type: string }> }
    const titleColumn = Object.keys(db.properties).find((k) => db.properties[k].type === 'title') || 'Name'

    const known = new Set(Object.keys(db.properties))
    const missing = Object.fromEntries(Object.entries(NOTION_SCHEMA).filter(([name]) => !known.has(name)))
    if (Object.keys(missing).length) {
      const patch = await notion(`/databases/${dbId}`, { method: 'PATCH', body: JSON.stringify({ properties: missing }) })
      // If the columns can't be created, still save the lead with the columns that exist
      if (patch.ok) Object.keys(missing).forEach((k) => known.add(k))
      else await notionFailed('create columns', patch)
    }

    // Skip missing columns and columns someone changed to another type, so nothing blocks a new lead
    const props = notionProperties(lead, titleColumn)
    for (const name of Object.keys(props)) {
      const existing = db.properties[name]
      const expected = name === titleColumn ? 'title' : Object.keys(NOTION_SCHEMA[name] || {})[0]
      if (!known.has(name) || (existing && expected && existing.type !== expected)) delete props[name]
    }
    const page = await notion('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: dbId },
        icon: { type: 'emoji', emoji: lead.lead_priority === 'alta' ? '🔥' : lead.lead_priority === 'media' ? '⚡' : '📌' },
        properties: props,
        children: notionPlaybook(lead),
      }),
    })
    return page.ok ? 'ok' : notionFailed('create page', page)
  } catch (e) {
    console.error('[lead] notion: request error', (e as Error).message)
    return 'failed'
  }
}

/** Logs Notion's error code/message (never the token or the lead's personal data) for Vercel runtime logs. */
async function notionFailed(step: string, res: Response): Promise<Delivery> {
  const body = (await res.json().catch(() => ({}))) as { code?: string; message?: string }
  console.error(`[lead] notion ${step} failed: ${res.status} ${body.code ?? ''} ${String(body.message ?? '').slice(0, 300)}`)
  return 'failed'
}
