import { getAttribution } from './analytics'

// Sends leads to a webhook (Make, Zapier, n8n, Supabase Edge Function, CRM...).
// Configure VITE_LEAD_WEBHOOK_URL. Without it, leads only go through WhatsApp.
const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined

export interface LeadPayload {
  companyName: string
  objective: string
  revenue: string
  budget: string
  userName: string
  userPhone: string
  userEmail: string
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
