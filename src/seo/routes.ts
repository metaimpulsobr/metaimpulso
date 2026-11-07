import { SITE, HOME_FAQ, TOOL_FAQ, type Faq } from '../content/site'
import { SERVICES, type ServiceContent } from '../content/services'

export type RouteKind = 'home' | 'service' | 'tool' | 'privacy' | 'notfound'

export interface RouteMeta {
  path: string
  kind: RouteKind
  title: string
  description: string
  service?: ServiceContent
  noindex?: boolean
  /** Output file name inside dist (served with Vercel cleanUrls). */
  file: string
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    kind: 'home',
    file: 'index.html',
    title: 'Meta Impulso | Marketing Digital, Tráfego Pago e Sites em Brasília',
    description:
      'Agência de marketing digital em Brasília que prova antes de prometer: Raio-X de Vendas grátis do seu site, tráfego pago, sites, CRM e IA com um só time.',
  },
  ...SERVICES.map((s) => ({
    path: `/${s.slug}`,
    kind: 'service' as const,
    file: `${s.slug}.html`,
    title: s.metaTitle,
    description: s.metaDescription,
    service: s,
  })),
  {
    path: '/analise-de-site-gratis',
    kind: 'tool',
    file: 'analise-de-site-gratis.html',
    title: 'Análise de Site Grátis: Raio-X de Vendas em 30 Segundos | Meta Impulso',
    description:
      'Descubra grátis, em 30 segundos, onde o seu site perde vendas: velocidade no celular, Pixel da Meta, Google Analytics, WhatsApp, formulário e SEO. Sem cadastro.',
  },
  {
    path: '/politica-de-privacidade',
    kind: 'privacy',
    file: 'politica-de-privacidade.html',
    title: 'Política de Privacidade | Meta Impulso',
    description: 'Como a Meta Impulso coleta, usa e protege os dados pessoais enviados pelo site, de acordo com a LGPD.',
  },
  {
    path: '/404',
    kind: 'notfound',
    file: '404.html',
    title: 'Página não encontrada | Meta Impulso',
    description: 'A página que você procurou não existe ou foi movida.',
    noindex: true,
  },
]

export function resolveRoute(pathname: string): RouteMeta {
  const clean = pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/'
  return ROUTES.find((r) => r.path === clean) ?? ROUTES[ROUTES.length - 1]
}

const ORG_ID = `${SITE.url}/#organization`

function organization() {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    image: SITE.ogImage,
    description:
      'Empresa de marketing digital e tecnologia em Brasília: tráfego pago, criação de sites, SEO, CRM, automação, agentes de IA e software sob medida.',
    telephone: SITE.phoneE164,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Brasília' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [SITE.instagram, SITE.linkedin],
  }
}

function faqPage(faq: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function jsonLd(route: RouteMeta) {
  const url = `${SITE.url}${route.path === '/' ? '/' : route.path}`
  const graph: object[] = [organization()]

  if (route.kind === 'home') {
    graph.push(
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, inLanguage: 'pt-BR', publisher: { '@id': ORG_ID } },
      faqPage(HOME_FAQ),
    )
  }

  if (route.kind === 'service' && route.service) {
    const s = route.service
    graph.push(
      {
        '@type': 'Service',
        name: s.h1,
        serviceType: s.serviceType,
        description: s.metaDescription,
        url,
        provider: { '@id': ORG_ID },
        areaServed: [
          { '@type': 'City', name: 'Brasília' },
          { '@type': 'Country', name: 'Brasil' },
        ],
      },
      faqPage(s.faq),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: s.navLabel, item: url },
        ],
      },
    )
  }

  if (route.kind === 'tool') {
    graph.push(
      {
        '@type': 'WebApplication',
        name: 'Raio-X de Vendas: análise de site grátis',
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'pt-BR',
        description: route.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        provider: { '@id': ORG_ID },
      },
      faqPage(TOOL_FAQ),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Análise de site grátis', item: url },
        ],
      },
    )
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Full SEO <head> fragment for a route (used by the build-time prerender). */
export function renderHead(route: RouteMeta) {
  const url = `${SITE.url}${route.path === '/' ? '/' : route.path}`
  const ld = JSON.stringify(jsonLd(route)).replace(/</g, '\\u003c')
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
  ]
  if (!route.noindex) tags.push(`<link rel="canonical" href="${url}" />`)
  tags.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:image" content="${SITE.ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${SITE.ogImage}" />`,
  )
  if (route.kind !== 'notfound') tags.push(`<script type="application/ld+json">${ld}</script>`)
  return tags.join('\n    ')
}
