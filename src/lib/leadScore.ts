// Diagnostic quiz options + lead qualification.
// The score and priority go only to the webhook/CRM (never shown to the visitor);
// the recommended plan is shown on the success screen as a pre-analysis.
import { PLANS, type Plan } from '../content/site'

export type ObjectiveId = 'trafego' | 'site' | 'crm' | 'ia' | 'completo' | 'software'

interface Option<Id extends string> {
  id: Id
  label: string
  points: number
}

export const OBJECTIVE_OPTIONS: (Option<ObjectiveId> & { desc: string })[] = [
  { id: 'completo', label: 'Estrutura completa, tudo integrado', desc: 'Estratégia, site, tráfego, CRM e automação com um único responsável.', points: 30 },
  { id: 'trafego', label: 'Gestão de tráfego pago', desc: 'Mais leads e vendas com Google Ads e Meta Ads.', points: 18 },
  { id: 'site', label: 'Site, landing page ou SEO', desc: 'Ser encontrado no Google e transformar visitas em contatos.', points: 15 },
  { id: 'crm', label: 'CRM e automação comercial', desc: 'Organizar o funil e não perder nenhum lead.', points: 18 },
  { id: 'ia', label: 'Agentes de inteligência artificial', desc: 'Atendimento e qualificação 24h no WhatsApp.', points: 22 },
  { id: 'software', label: 'Software sob medida', desc: 'Sistema, portal ou integração para a sua operação.', points: 22 },
]

export type RevenueId = 'ate10' | '10a50' | '50a200' | '200mais'
export const REVENUE_OPTIONS: Option<RevenueId>[] = [
  { id: 'ate10', label: 'Até R$ 10 mil / mês', points: 5 },
  { id: '10a50', label: 'R$ 10 mil a R$ 50 mil / mês', points: 15 },
  { id: '50a200', label: 'R$ 50 mil a R$ 200 mil / mês', points: 25 },
  { id: '200mais', label: 'Acima de R$ 200 mil / mês', points: 35 },
]

export type BudgetId = 'ate1500' | '1500a5000' | '5000a15000' | '15000mais'
export const BUDGET_OPTIONS: Option<BudgetId>[] = [
  { id: 'ate1500', label: 'Até R$ 1.500 / mês', points: 5 },
  { id: '1500a5000', label: 'R$ 1.500 a R$ 5.000 / mês', points: 15 },
  { id: '5000a15000', label: 'R$ 5.000 a R$ 15.000 / mês', points: 28 },
  { id: '15000mais', label: 'Acima de R$ 15.000 / mês', points: 35 },
]

export type LeadPriority = 'alta' | 'media' | 'baixa'

export interface LeadQualification {
  score: number
  priority: LeadPriority
  plan: Plan
}

// SCALE adds software and AI agents on top of GROWTH
const TECH_HEAVY: ObjectiveId[] = ['ia', 'software']

export function qualifyLead(objective: ObjectiveId, revenue: RevenueId, budget: BudgetId): LeadQualification {
  const pts = (list: Option<string>[], id: string) => list.find((o) => o.id === id)?.points ?? 0
  const score = Math.min(100, pts(OBJECTIVE_OPTIONS, objective) + pts(REVENUE_OPTIONS, revenue) + pts(BUDGET_OPTIONS, budget))
  const priority: LeadPriority = score >= 70 ? 'alta' : score >= 45 ? 'media' : 'baixa'

  let planId: Plan['id'] = 'growth'
  if (budget === 'ate1500' || revenue === 'ate10') planId = 'start'
  else if (
    budget === '15000mais' ||
    (TECH_HEAVY.includes(objective) && (revenue === '50a200' || revenue === '200mais') && budget === '5000a15000')
  )
    planId = 'scale'

  return { score, priority, plan: PLANS.find((p) => p.id === planId)! }
}

/** Brazilian phone mask: (61) 99999-9999 / (61) 3333-4444. */
export function formatPhone(value: string) {
  let d = value.replace(/\D/g, '')
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2)
  d = d.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
