/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Tag Manager container ID (e.g. GTM-XXXXXXX). Loaded only after cookie consent. */
  readonly VITE_GTM_ID?: string
  /** Google PageSpeed Insights browser key (restrict it to the site's domain). Without it the speed test often hits the shared quota. */
  readonly VITE_PSI_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** True when VITE_LEAD_WEBHOOK_URL is set at build time; the address itself stays on the server (api/lead.ts). */
declare const __HAS_LEAD_WEBHOOK__: boolean
