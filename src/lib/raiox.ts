// Raio-X de Vendas (client): runs the HTML check (/api/raio-x) and the Google PageSpeed mobile test
// in parallel, then turns the raw signals into a 0–100 "Nota de Vendas" and plain-language findings.

/** Mirrors RaioXSignals in api/raio-x.ts */
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
  jsRendered: boolean
}

export interface RaioXApiOk {
  ok: true
  finalUrl: string
  host: string
  status: number
  responseMs: number
  htmlKb: number
  title: string
  signals: RaioXSignals
}
export interface RaioXApiError {
  ok: false
  error: 'invalid_url' | 'blocked_host' | 'unreachable' | 'timeout' | 'not_html' | 'too_many_redirects' | 'http_error' | 'network'
}

export interface SpeedResult {
  /** 0–1, Lighthouse performance score on a simulated mobile device */
  score: number
  lcp?: string
  fcp?: string
  tbt?: string
}

export type Group = 'velocidade' | 'rastreamento' | 'conversao' | 'google'
export type Severity = 'critico' | 'atencao' | 'ok' | 'info'

export interface Finding {
  id: string
  group: Group
  severity: Severity
  title: string
  detail: string
}

export interface RaioXReport {
  url: string
  host: string
  score: number
  groups: Record<Group, { earned: number; max: number } | null>
  findings: Finding[]
  speed: SpeedResult | null
}

export const GROUP_LABELS: Record<Group, string> = {
  velocidade: 'Velocidade no celular',
  rastreamento: 'Rastreamento',
  conversao: 'Conversão',
  google: 'O que o Google vê',
}

const PSI_KEY = import.meta.env.VITE_PSI_API_KEY as string | undefined

function withTimeout(ms: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, done: () => clearTimeout(timer) }
}

export async function fetchSignals(url: string): Promise<RaioXApiOk | RaioXApiError> {
  const t = withTimeout(15000)
  try {
    const res = await fetch(`/api/raio-x?url=${encodeURIComponent(url)}`, { signal: t.signal })
    const data = (await res.json()) as RaioXApiOk | RaioXApiError
    return data
  } catch {
    return { ok: false, error: 'network' }
  } finally {
    t.done()
  }
}

/** Google PageSpeed Insights, called from the browser (each visitor uses their own quota). */
export async function fetchSpeed(url: string): Promise<SpeedResult | null> {
  const qs = new URLSearchParams({ url, strategy: 'mobile', category: 'performance', locale: 'pt_BR' })
  if (PSI_KEY) qs.set('key', PSI_KEY)
  const t = withTimeout(60000)
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${qs}`, { signal: t.signal })
    if (!res.ok) return null
    const data = await res.json()
    const lh = data?.lighthouseResult
    const score = lh?.categories?.performance?.score
    if (typeof score !== 'number') return null
    const audits = lh.audits ?? {}
    return {
      score,
      lcp: audits['largest-contentful-paint']?.displayValue,
      fcp: audits['first-contentful-paint']?.displayValue,
      tbt: audits['total-blocking-time']?.displayValue,
    }
  } catch {
    return null
  } finally {
    t.done()
  }
}

export function buildReport(url: string, api: RaioXApiOk | null, speed: SpeedResult | null): RaioXReport {
  const findings: Finding[] = []
  const add = (f: Finding) => findings.push(f)
  const groups: RaioXReport['groups'] = { velocidade: null, rastreamento: null, conversao: null, google: null }

  // --- Velocidade (30) ---
  if (speed) {
    const nota = Math.round(speed.score * 100)
    const lcp = speed.lcp ? ` O conteúdo principal leva ${speed.lcp} para aparecer.` : ''
    groups.velocidade = { earned: speed.score * 30, max: 30 }
    if (speed.score < 0.5)
      add({ id: 'speed', group: 'velocidade', severity: 'critico', title: 'Site lento no celular', detail: `Nota de velocidade do Google: ${nota}/100.${lcp} Muita gente desiste antes de a página abrir, e o anúncio é pago do mesmo jeito.` })
    else if (speed.score < 0.9)
      add({ id: 'speed', group: 'velocidade', severity: 'atencao', title: 'Velocidade no celular pode melhorar', detail: `Nota de velocidade do Google: ${nota}/100.${lcp} Cada segundo a menos deixa mais gente chegar até o botão de contato.` })
    else add({ id: 'speed', group: 'velocidade', severity: 'ok', title: 'Site rápido no celular', detail: `Nota de velocidade do Google: ${nota}/100.` })
  } else {
    add({ id: 'speed', group: 'velocidade', severity: 'info', title: 'Velocidade não medida agora', detail: 'O medidor do Google não respondeu a tempo. Medimos na análise completa.' })
  }

  if (api) {
    const s = api.signals

    // --- Rastreamento (25) ---
    const analytics = s.ga4 || s.gtm
    let rast = 0
    if (analytics) {
      rast += 13
      add({ id: 'analytics', group: 'rastreamento', severity: 'ok', title: s.gtm ? 'Google Tag Manager instalado' : 'Google Analytics instalado', detail: 'A base para medir de onde vêm as visitas está no lugar.' })
    } else {
      add({ id: 'analytics', group: 'rastreamento', severity: 'critico', title: 'Não encontramos Google Analytics', detail: 'Sem medição, não dá para saber de onde vêm os clientes nem qual canal merece o próximo real. Se ele só carrega depois do aviso de cookies, confirmamos na análise completa.' })
    }
    if (s.metaPixel) {
      rast += 9
      add({ id: 'pixel', group: 'rastreamento', severity: 'ok', title: 'Pixel da Meta instalado', detail: 'Os anúncios do Instagram e do Facebook conseguem aprender com quem visita o site.' })
    } else if (s.gtm) {
      rast += 4.5
      add({ id: 'pixel', group: 'rastreamento', severity: 'atencao', title: 'Pixel da Meta não aparece no código', detail: 'Ele pode estar dentro do Tag Manager. Conferimos na análise completa.' })
    } else {
      add({ id: 'pixel', group: 'rastreamento', severity: 'critico', title: 'Sem Pixel da Meta', detail: 'Se você anuncia no Instagram ou no Facebook, não sabe quais anúncios trazem clientes e não consegue falar de novo com quem já visitou o site.' })
    }
    if (s.googleAds) {
      rast += 3
      add({ id: 'ads', group: 'rastreamento', severity: 'ok', title: 'Tag do Google Ads instalada', detail: 'As campanhas do Google conseguem registrar conversões.' })
    } else {
      if (s.gtm) rast += 1.5
      add({ id: 'ads', group: 'rastreamento', severity: s.gtm ? 'info' : 'atencao', title: 'Sem tag de conversão do Google Ads', detail: 'Se você anuncia no Google, os contatos e vendas não estão sendo atribuídos às campanhas certas.' })
    }
    groups.rastreamento = { earned: rast, max: 25 }

    // --- Conversão (25) ---
    let conv = 0
    if (s.whatsapp) {
      conv += 12
      add({ id: 'whatsapp', group: 'conversao', severity: 'ok', title: 'WhatsApp a um toque', detail: 'O visitante chega na conversa sem copiar número.' })
    } else {
      add({ id: 'whatsapp', group: 'conversao', severity: 'critico', title: 'Sem botão de WhatsApp', detail: 'O cliente precisa copiar o número ou procurar outro jeito de falar com você. No Brasil, o WhatsApp é o caminho mais curto até a conversa.' })
    }
    if (s.form) {
      conv += 7
      add({ id: 'form', group: 'conversao', severity: 'ok', title: 'Formulário de contato', detail: 'Quem não quer chamar agora consegue deixar o contato.' })
    } else {
      add({ id: 'form', group: 'conversao', severity: 'atencao', title: 'Sem formulário de contato', detail: 'Quem não quer chamar no WhatsApp agora não tem como deixar o contato, e esse lead vai embora.' })
    }
    if (s.tel) {
      conv += 6
      add({ id: 'tel', group: 'conversao', severity: 'ok', title: 'Telefone clicável', detail: 'No celular, dá para ligar com um toque.' })
    } else {
      add({ id: 'tel', group: 'conversao', severity: 'atencao', title: 'Telefone não é clicável', detail: 'No celular, o visitante não consegue ligar com um toque.' })
    }
    groups.conversao = { earned: conv, max: 25 }

    // --- O que o Google vê (20) ---
    let g = 0
    if (s.https) {
      g += 2
      add({ id: 'https', group: 'google', severity: 'ok', title: 'Site com cadeado (HTTPS)', detail: 'O navegador mostra a conexão como segura.' })
    } else add({ id: 'https', group: 'google', severity: 'critico', title: 'Site sem cadeado (HTTPS)', detail: 'O navegador mostra "Não seguro" para o visitante, e o Google dá preferência a sites seguros.' })
    if (s.viewport) {
      g += 3
      add({ id: 'viewport', group: 'google', severity: 'ok', title: 'Ajustado para celular', detail: 'A página se adapta à tela do celular.' })
    } else add({ id: 'viewport', group: 'google', severity: 'critico', title: 'Site não ajustado para celular', detail: 'Sem a configuração de tela para celular, a página aparece pequena e difícil de usar.' })

    if (s.titleLength >= 30 && s.titleLength <= 65) {
      g += 5
      add({ id: 'title', group: 'google', severity: 'ok', title: 'Título bem dimensionado', detail: `${s.titleLength} caracteres: aparece inteiro no Google.` })
    } else if (s.titleLength > 0) {
      g += 2.5
      add({ id: 'title', group: 'google', severity: 'atencao', title: 'Título fora do tamanho ideal', detail: `Tem ${s.titleLength} caracteres. Entre 30 e 65, ele aparece inteiro no Google e diz o que você vende.` })
    } else {
      add({ id: 'title', group: 'google', severity: 'critico', title: 'Página sem título para o Google', detail: 'O título é a primeira coisa que aparece na busca. Sem ele, o Google improvisa.' })
    }

    if (s.descriptionLength >= 70 && s.descriptionLength <= 160) {
      g += 5
      add({ id: 'description', group: 'google', severity: 'ok', title: 'Descrição para o Google', detail: 'O resumo que aparece na busca foi escrito por você.' })
    } else if (s.descriptionLength > 0) {
      g += 2.5
      add({ id: 'description', group: 'google', severity: 'atencao', title: 'Descrição fora do tamanho ideal', detail: `Tem ${s.descriptionLength} caracteres. Entre 70 e 160, ela aparece inteira e convence a pessoa a clicar.` })
    } else {
      add({ id: 'description', group: 'google', severity: 'atencao', title: 'Sem descrição para o Google', detail: 'O Google monta um resumo por conta própria, e nem sempre ele convence a pessoa a clicar.' })
    }

    if (s.h1Count === 1) {
      g += 3
      add({ id: 'h1', group: 'google', severity: 'ok', title: 'Um título principal (H1)', detail: 'O assunto da página fica claro para o Google e para o visitante.' })
    } else if (s.h1Count > 1) {
      g += 1.5
      add({ id: 'h1', group: 'google', severity: 'info', title: 'Mais de um título principal (H1)', detail: 'Um único título principal deixa claro para o Google do que a página trata.' })
    } else add({ id: 'h1', group: 'google', severity: 'atencao', title: 'Sem título principal (H1)', detail: 'O Google e o visitante não identificam de cara do que a página trata.' })

    if (s.schema) {
      g += 2
      add({ id: 'schema', group: 'google', severity: 'ok', title: 'Dados estruturados', detail: 'O Google recebe informações organizadas sobre a empresa.' })
    } else add({ id: 'schema', group: 'google', severity: 'atencao', title: 'Sem dados estruturados', detail: 'O Google entende menos sobre a sua empresa: endereço, horário, serviços e avaliações.' })
    groups.google = { earned: g, max: 20 }

    if (s.jsRendered)
      add({ id: 'js', group: 'google', severity: 'info', title: 'Site montado por JavaScript', detail: 'Parte do conteúdo só aparece depois que a página carrega, então alguns itens podem não ter sido detectados. Na análise completa, conferimos tudo manualmente.' })
  }

  const parts = Object.values(groups).filter((v): v is { earned: number; max: number } => v !== null)
  const max = parts.reduce((a, p) => a + p.max, 0)
  const earned = parts.reduce((a, p) => a + p.earned, 0)
  const order: Record<Severity, number> = { critico: 0, atencao: 1, info: 2, ok: 3 }
  findings.sort((a, b) => order[a.severity] - order[b.severity])

  return {
    url,
    host: api?.host ?? url.replace(/^https?:\/\//, '').split('/')[0],
    score: max > 0 ? Math.round((earned / max) * 100) : 0,
    groups,
    findings,
    speed,
  }
}

export function scoreLabel(score: number) {
  if (score >= 90) return { label: 'Excelente', tone: 'ok', text: 'Seu site está bem montado. O próximo ganho costuma estar no anúncio, no atendimento e no follow-up.' }
  if (score >= 75) return { label: 'Bom, com furos', tone: 'atencao', text: 'A base está boa, mas ainda há pontos deixando clientes escaparem.' }
  if (score >= 50) return { label: 'Perdendo vendas', tone: 'atencao', text: 'Seu site atrai visitas, mas deixa parte delas ir embora sem falar com você.' }
  return { label: 'Vazamento crítico', tone: 'critico', text: 'Hoje o site perde boa parte de quem chega. Cada real em anúncio rende menos do que poderia.' }
}

// Last report of this visit, attached to the diagnostic lead so the team starts the call already knowing the gaps.
let lastReport: { url: string; score: number; criticos: string[] } | null = null
export function rememberReport(r: RaioXReport) {
  lastReport = { url: r.host, score: r.score, criticos: r.findings.filter((f) => f.severity === 'critico').map((f) => f.title) }
}
export function getRememberedReport() {
  return lastReport
}
