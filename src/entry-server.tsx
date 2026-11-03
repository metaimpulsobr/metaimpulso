import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { ROUTES, renderHead } from './seo/routes'
import { SITE } from './content/site'

export { ROUTES, SITE }

export function render(path: string) {
  const route = ROUTES.find((r) => r.path === path)!
  const html = renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
  return { html, head: renderHead(route), route }
}
