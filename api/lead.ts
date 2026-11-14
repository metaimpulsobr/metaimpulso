// Lead intake for the diagnostic quiz: the browser posts here (same origin) and this function
// validates the data, recalculates the qualification and forwards the lead to the webhook
// (Google Sheets today, the future CRM later). The webhook address never reaches the browser.
//
// Env (Vercel → Settings → Environment Variables):
//   VITE_LEAD_WEBHOOK_URL  where leads go (name kept for compatibility with the setup docs)
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

  const webhook = process.env.VITE_LEAD_WEBHOOK_URL
  if (!webhook) return json(503, { ok: false, error: 'not_configured' })

  const token = process.env.LEAD_WEBHOOK_TOKEN
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FORWARD_TIMEOUT_MS)
  try {
    // text/plain JSON: what the Google Apps Script receiver (and most webhook tools) read as-is
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(token ? { ...built.lead, token } : built.lead),
      redirect: 'follow',
      signal: ctrl.signal,
    })
    if (!res.ok) return json(502, { ok: false, error: 'webhook_error' })
    return json(200, { ok: true })
  } catch {
    return json(502, { ok: false, error: 'webhook_unreachable' })
  } finally {
    clearTimeout(timer)
  }
}
