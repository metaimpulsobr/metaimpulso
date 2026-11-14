import { getAttribution } from './analytics'

// Sends quiz leads to /api/lead (api/lead.ts), which validates them, recalculates the score and
// forwards them to the webhook configured on Vercel (VITE_LEAD_WEBHOOK_URL, read on the server only).
// __HAS_LEAD_WEBHOOK__ is set at build time (vite.config.ts) so the quiz knows whether to promise an
// automatic reply or hand the lead to WhatsApp, without the webhook address ever reaching the browser.
export const HAS_LEAD_WEBHOOK = __HAS_LEAD_WEBHOOK__

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
  if (!HAS_LEAD_WEBHOOK) return false
  const body = JSON.stringify({
    ...lead,
    page: window.location.href,
    consent_lgpd: true,
    ...getAttribution(),
  })
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    return res.ok
  } catch {
    return false
  }
}
