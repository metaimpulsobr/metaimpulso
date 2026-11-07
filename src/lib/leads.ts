import { getAttribution } from './analytics'

// Sends leads to a webhook (Make, Zapier, n8n, Supabase Edge Function, CRM...).
// Configure VITE_LEAD_WEBHOOK_URL. Without it, the quiz sends the lead through WhatsApp instead.
const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined
export const HAS_LEAD_WEBHOOK = Boolean(WEBHOOK_URL)

export interface LeadPayload {
  companyName: string
  /** Human-readable answers (kept for existing webhook scenarios) */
  objective: string
  revenue: string
  budget: string
  /** Stable ids for filters/routing in the CRM */
  objective_id: string
  revenue_id: string
  budget_id: string
  userName: string
  userPhone: string
  userEmail: string
  /** 0–100, internal only */
  lead_score: number
  lead_priority: 'alta' | 'media' | 'baixa'
  recommended_plan: string
  /** Where the form was filled: "home" or the service page slug */
  form_location: string
  /** Present when the visitor ran the Raio-X before filling the form */
  site_url?: string
  raiox_score?: number
  raiox_alertas?: string
}

export async function submitLead(lead: LeadPayload): Promise<boolean> {
  if (!WEBHOOK_URL) return false
  const body = JSON.stringify({
    ...lead,
    source: 'site-diagnostico',
    page: window.location.href,
    created_at: new Date().toISOString(),
    consent_lgpd: true,
    ...getAttribution(),
  })
  try {
    // text/plain avoids a CORS preflight, so any webhook receiver works
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
    })
    return true
  } catch {
    return false
  }
}
