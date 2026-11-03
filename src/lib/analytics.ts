// Lightweight tracking layer: events always go to dataLayer; GTM (GA4, Meta Pixel, etc.)
// is only loaded after the visitor consents (LGPD). Configure VITE_GTM_ID to enable.

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
