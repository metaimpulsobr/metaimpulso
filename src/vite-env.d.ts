/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Tag Manager container ID (e.g. GTM-XXXXXXX). Loaded only after cookie consent. */
  readonly VITE_GTM_ID?: string
  /** Webhook that receives diagnostic quiz leads as JSON (text/plain body). */
  readonly VITE_LEAD_WEBHOOK_URL?: string
  /** Google PageSpeed Insights browser key (restrict it to the site's domain). Without it the speed test often hits the shared quota. */
  readonly VITE_PSI_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
