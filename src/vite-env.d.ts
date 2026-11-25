/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Tag Manager container ID (e.g. GTM-XXXXXXX). Loaded only after cookie consent. */
  readonly VITE_GTM_ID?: string
  /** Google PageSpeed Insights browser key (restrict it to the site's domain). Without it the speed test often hits the shared quota. */
  readonly VITE_PSI_API_KEY?: string
  /** Google OAuth client ID (Web) for the /crm sign-in. Public by design; the server checks the audience. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** True when the site has somewhere to deliver leads (CRM storage or webhook); details stay on the server (api/lead.ts). */
declare const __HAS_LEAD_WEBHOOK__: boolean
