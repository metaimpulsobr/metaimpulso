// Raio-X de Vendas: reads a public web page and reports the sales signals found in its HTML
// (tracking, WhatsApp, forms, what Google sees). Speed is measured in the browser via PageSpeed.
//
// Security (CIPHER): this function fetches user-supplied URLs, so it only follows http(s) URLs on
// ports 80/443 whose hostnames resolve exclusively to public IP addresses (checked on every redirect
// hop), caps time and body size, and returns derived booleans/lengths only, never the page itself.
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

const TIMEOUT_MS = 7000
const MAX_BYTES = 2_000_000
const MAX_REDIRECTS = 4
const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36 MetaImpulsoRaioX/1.0 (+https://www.metaimpulso.com.br/analise-de-site-gratis)'

export interface RaioXSignals {
  https: boolean
  viewport: boolean
  titleLength: number
  descriptionLength: number
  h1Count: number
  ga4: boolean
  gtm: boolean
  metaPixel: boolean
  googleAds: boolean
  tiktokPixel: boolean
  whatsapp: boolean
  tel: boolean
  form: boolean
  schema: boolean
  ogImage: boolean
  canonical: boolean
  /** Very little text in the raw HTML: the page is probably built by JavaScript */
  jsRendered: boolean
}

export interface RaioXResponse {
  ok: true
  finalUrl: string
  host: string
  status: number
  responseMs: number
  htmlKb: number
  title: string
  signals: RaioXSignals
}

type ErrorCode = 'invalid_url' | 'blocked_host' | 'unreachable' | 'timeout' | 'not_html' | 'too_many_redirects' | 'http_error'

class RaioXError extends Error {
  code: ErrorCode
  constructor(code: ErrorCode) {
    super(code)
    this.code = code
  }
}

/** Accepts "empresa.com.br", "www.empresa.com.br/pagina" or full http(s) URLs. */
export function normalizeUrl(input: string): URL | null {
  const raw = input.trim()
  if (!raw || raw.length > 2048) return null
  let url: URL
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username || url.password) return null
  if (url.port && url.port !== '80' && url.port !== '443') return null
  const host = url.hostname.toLowerCase()
  if (isIP(host.replace(/^\[|\]$/g, '')) !== 0) return null // IP literals are not company sites
  if (!host.includes('.') || host.endsWith('.local') || host.endsWith('.internal') || host === 'localhost') return null
  url.hash = ''
  return url
}

function ipv4ToInt(ip: string) {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0
}

const PRIVATE_V4: [string, number][] = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 3],
]

export function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip)
  if (version === 4) {
    const n = ipv4ToInt(ip)
    return PRIVATE_V4.some(([base, bits]) => {
      const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
      return (n & mask) === (ipv4ToInt(base) & mask)
    })
  }
  if (version === 6) {
    const v = ip.toLowerCase()
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isPrivateAddress(mapped[1])
    return v === '::' || v === '::1' || /^f[cd]/.test(v) || /^fe[89ab]/.test(v) || v.startsWith('ff') || v.startsWith('64:ff9b:') || v.startsWith('2001:db8')
  }
  return true
}

async function assertPublicHost(hostname: string) {
  let addresses: { address: string }[]
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw new RaioXError('unreachable')
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) throw new RaioXError('blocked_host')
}

async function readCapped(res: Response): Promise<string> {
  if (!res.body) return ''
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
  }
  await reader.cancel().catch(() => undefined)
  const buf = new Uint8Array(Math.min(total, MAX_BYTES))
  let offset = 0
  for (const c of chunks) {
    const slice = c.subarray(0, Math.max(0, buf.length - offset))
    buf.set(slice, offset)
    offset += slice.byteLength
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(buf)
}

async function fetchPublicPage(start: URL) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const t0 = Date.now()
  try {
    let url = start
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicHost(url.hostname)
      let res: Response
      try {
        res = await fetch(url, {
          redirect: 'manual',
          signal: controller.signal,
          headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'pt-BR,pt;q=0.9' },
        })
      } catch {
        throw new RaioXError(controller.signal.aborted ? 'timeout' : 'unreachable')
      }
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        const next = normalizeUrl(new URL(res.headers.get('location')!, url).toString())
        await res.body?.cancel().catch(() => undefined)
        if (!next) throw new RaioXError('blocked_host')
        url = next
        continue
      }
      if (res.status >= 400) throw new RaioXError('http_error')
      const type = res.headers.get('content-type') ?? ''
      if (type && !/html|xml/i.test(type)) throw new RaioXError('not_html')
      const html = await readCapped(res)
      return { html, finalUrl: url, status: res.status, ms: Date.now() - t0 }
    }
    throw new RaioXError('too_many_redirects')
  } finally {
    clearTimeout(timer)
  }
}

function metaContent(html: string, attr: 'name' | 'property', value: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  const keyRe = new RegExp(`${attr}\\s*=\\s*["']${value}["']`, 'i')
  for (const tag of tags) {
    if (keyRe.test(tag)) {
      const content = tag.match(/content\s*=\s*(["'])([\s\S]*?)\1/i)
      return content ? content[2].trim() : ''
    }
  }
  return null
}

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()

export function analyzeHtml(html: string, finalUrl: URL): { title: string; signals: RaioXSignals } {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
  const description = decode(metaContent(html, 'name', 'description') ?? '')
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    title: title.slice(0, 160),
    signals: {
      https: finalUrl.protocol === 'https:',
      viewport: metaContent(html, 'name', 'viewport') !== null,
      titleLength: title.length,
      descriptionLength: description.length,
      h1Count: (html.match(/<h1[\s>]/gi) ?? []).length,
      ga4: /googletagmanager\.com\/gtag\/js\?id=G-|gtag\(\s*['"]config['"]\s*,\s*['"]G-|google-analytics\.com\/(analytics|ga)\.js/i.test(html),
      gtm: /googletagmanager\.com\/gtm\.js|['"=]GTM-[A-Z0-9]{4,}/i.test(html),
      metaPixel: /connect\.facebook\.net\/[^"']*\/fbevents\.js|fbq\(\s*['"]init['"]/i.test(html),
      googleAds: /['"=/]AW-\d{6,}/.test(html),
      tiktokPixel: /analytics\.tiktok\.com\/i18n\/pixel/i.test(html),
      whatsapp: /(wa\.me\/|api\.whatsapp\.com\/send|web\.whatsapp\.com\/send|whatsapp:\/\/send)/i.test(html),
      tel: /href\s*=\s*["']tel:/i.test(html),
      form: /<form[\s>]/i.test(html),
      schema: /<script[^>]+type\s*=\s*["']application\/ld\+json["']/i.test(html),
      ogImage: metaContent(html, 'property', 'og:image') !== null,
      canonical: /<link[^>]+rel\s*=\s*["']canonical["']/i.test(html),
      jsRendered: visibleText.length < 400,
    },
  }
}

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache, 'X-Robots-Tag': 'noindex' },
  })

export async function GET(request: Request): Promise<Response> {
  const target = normalizeUrl(new URL(request.url).searchParams.get('url') ?? '')
  if (!target) return json({ ok: false, error: 'invalid_url' }, 400)
  try {
    const page = await fetchPublicPage(target)
    const { title, signals } = analyzeHtml(page.html, page.finalUrl)
    const body: RaioXResponse = {
      ok: true,
      finalUrl: page.finalUrl.toString(),
      host: page.finalUrl.hostname,
      status: page.status,
      responseMs: page.ms,
      htmlKb: Math.round(Buffer.byteLength(page.html) / 1024),
      title,
      signals,
    }
    // Same URL within 10 minutes is served from the CDN cache
    return json(body, 200, 'public, s-maxage=600, stale-while-revalidate=60')
  } catch (err) {
    const code: ErrorCode = err instanceof RaioXError ? err.code : 'unreachable'
    return json({ ok: false, error: code }, 200)
  }
}
