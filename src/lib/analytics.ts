// Lightweight tracking layer: events always go to dataLayer; GTM (GA4, Meta Pixel, etc.)
// is only loaded after the visitor consents (LGPD). Configure VITE_GTM_ID to enable.
// Conversion events are also sent to Vercel Web Analytics (cookieless, anonymous), so the
// sales funnel is measurable even before GTM is configured or when cookies are refused.
import { track as vercelTrack } from '@vercel/analytics'

const VERCEL_EVENTS = new Set(['generate_lead', 'whatsapp_click', 'cta_click', 'quiz_start', 'quiz_step'])

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined
const CONSENT_KEY = 'mi-consent'
const ATTRIBUTION_KEY = 'mi-attribution'

export type Consent = 'granted' | 'denied'

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
  if (VERCEL_EVENTS.has(event)) {
    const flat: Record<string, string | number | boolean | null> = {}
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) flat[k] = v
    }
    try {
      vercelTrack(event, flat)
    } catch {
      // analytics must never break the page
    }
  }
}

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // storage unavailable (private mode) — consent applies to this page view only
  }
  if (value === 'granted') loadGtm()
}

let gtmLoaded = false
export function loadGtm() {
  if (!GTM_ID || gtmLoaded || typeof document === 'undefined') return
  gtmLoaded = true
  track('gtm.js', { 'gtm.start': Date.now() })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
  document.head.appendChild(s)
}

const ATTRIBUTION_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

/** Stores first-touch campaign params for the session so leads keep their origin. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return
    const qs = new URLSearchParams(window.location.search)
    const data: Record<string, string> = { landing_page: window.location.pathname, referrer: document.referrer }
    ATTRIBUTION_PARAMS.forEach((p) => {
      const v = qs.get(p)
      if (v) data[p] = v
    })
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}')
  } catch {
    return {}
  }
}
