// Build-time static rendering: turns the client bundle into one SEO-ready HTML file per route
// (full content, <head> metadata and JSON-LD), plus sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

const { render, ROUTES, SITE } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
const HEAD_RE = /<!--seo:start-->[\s\S]*?<!--seo:end-->/

if (!HEAD_RE.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error('prerender: index.html is missing the <!--seo:start/end--> markers or the empty #root')
}

for (const route of ROUTES) {
  const { html, head } = render(route.path)
  const page = template.replace(HEAD_RE, head).replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  fs.writeFileSync(path.join(dist, route.file), page)
  console.log(`prerender: ${route.path} -> dist/${route.file}`)
}

const today = new Date().toISOString().slice(0, 10)
const urls = ROUTES.filter((r) => !r.noindex)
  .map((r) => {
    const loc = `${SITE.url}${r.path === '/' ? '/' : r.path}`
    const priority = r.kind === 'home' ? '1.0' : r.kind === 'service' ? '0.8' : '0.3'
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
console.log('prerender: sitemap.xml written')

fs.rmSync(serverDir, { recursive: true, force: true })
