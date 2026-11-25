import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App.tsx'

// Vercel Web Analytics: cookieless, anonymous pageviews (no consent banner required).
// Only reports in production after Analytics is enabled in the Vercel project.
inject()

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
  </StrictMode>
)

// Production pages are prerendered at build time (scripts/prerender.mjs): hydrate them.
// In dev the root is empty, and the internal /crm page is client-only (its prerendered HTML is just a
// loading placeholder), so both render from scratch.
const clientOnly = window.location.pathname.replace(/\/+$/, '') === '/crm'
if (container.hasChildNodes() && !clientOnly) hydrateRoot(container, app)
else createRoot(container).render(app)
