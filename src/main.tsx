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
// In dev the root is empty, so render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
