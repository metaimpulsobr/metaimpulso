/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Tag Manager container ID (e.g. GTM-XXXXXXX). Loaded only after cookie consent. */
  readonly VITE_GTM_ID?: string
  /** Webhook that receives diagnostic quiz leads as JSON (text/plain body). */
  readonly VITE_LEAD_WEBHOOK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
