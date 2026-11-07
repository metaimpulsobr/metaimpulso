import { useEffect, useRef, useState } from 'react'
import { Globe, KanbanSquare, Landmark, Ticket, Bot, ArrowUpRight, ScanSearch, ArrowRight, CircleAlert, Wrench } from 'lucide-react'
import CaseVisualView from './CaseVisuals'
import { FEATURED_CASE, OTHER_CASES, type CaseProduct } from '../content/cases'
import { track } from '../lib/analytics'

const TAB_ICONS: Record<string, React.ReactNode> = {
  portal: <Globe size={18} />,
  crm: <KanbanSquare size={18} />,
  credit: <Landmark size={18} />,
  club: <Ticket size={18} />,
  agent: <Bot size={18} />,
}

function LiveLink({ url, origin }: { url?: string; origin: string }) {
  if (!url) return null
  return (
    <a
      className="cases-live"
      href={`https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('cta_click', { origin: `case_${origin}` })}
    >
      <span className="cases-live-dot" aria-hidden="true" /> No ar em {url} <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  )
}

function ProblemDelivered({ p }: { p: CaseProduct }) {
  return (
    <dl className="cases-pd">
      <div>
        <dt><CircleAlert size={15} aria-hidden="true" /> O problema</dt>
        <dd>{p.problem}</dd>
      </div>
      <div>
        <dt><Wrench size={15} aria-hidden="true" /> O que entregamos</dt>
        <dd>{p.delivered}</dd>
      </div>
    </dl>
  )
}

export default function CasesShowcase() {
  const products = FEATURED_CASE.products
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const featuredRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const current = products[active]

  // On phones the tab row scrolls sideways: keep the active tab in view (without moving the page)
  useEffect(() => {
    const row = tabsRef.current
    const btn = row?.children[active] as HTMLElement | undefined
    if (row && btn && row.scrollWidth > row.clientWidth) row.scrollTo({ left: btn.offsetLeft - 16, behavior: 'smooth' })
  }, [active])

  // Walks through the five systems while the case is on screen, until the visitor picks one
  useEffect(() => {
    if (!autoplay || typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const el = featuredRef.current
    let visible = false
    const io = el && 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.35 })
      : null
    if (io && el) io.observe(el)
    const timer = window.setInterval(() => {
      if (visible) setActive((i) => (i + 1) % products.length)
    }, 6000)
    return () => {
      window.clearInterval(timer)
      io?.disconnect()
    }
  }, [autoplay, products.length])

  const pick = (i: number) => {
    setAutoplay(false)
    setActive(i)
    track('cta_click', { origin: `case_tab_${products[i].id}` })
  }

  return (
    <div className="cases">
      <div className="section-head">
        <span className="eyebrow">Cases reais</span>
        <h2 className="title-lg">
          Não é promessa. <span className="text-gradient">É o que já construímos.</span>
        </h2>
        <p className="subtitle-main">
          Sites, CRMs, sistemas de crédito, clubes de benefícios e agentes de IA feitos pela mesma equipe que cuida do marketing.
        </p>
      </div>

      {/* Featured: one client, the whole ecosystem */}
      <div className="cases-featured" ref={featuredRef}>
        <div className="cases-featured-head">
          <span className="cases-kicker">Case principal · {FEATURED_CASE.client} · {FEATURED_CASE.segment}</span>
          <h3 className="cases-featured-title">{FEATURED_CASE.title}</h3>
          <p className="cases-featured-intro">{FEATURED_CASE.intro}</p>
        </div>

        <div className="cases-tabs" ref={tabsRef} role="tablist" aria-label={`Sistemas entregues para o ${FEATURED_CASE.client}`}>
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`case-tab-${p.id}`}
              aria-selected={i === active}
              aria-controls="case-panel"
              className={`cases-tab ${i === active ? 'is-active' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="cases-tab-num">{String(i + 1).padStart(2, '0')}</span>
              {TAB_ICONS[p.id]}
              {p.tab}
              {i === active && autoplay && <span className="cases-tab-timer" aria-hidden="true" key={active} />}
            </button>
          ))}
        </div>

        <div className="cases-panel" role="tabpanel" id="case-panel" aria-labelledby={`case-tab-${current.id}`}>
          <div className="cases-panel-text" key={`t-${current.id}`}>
            <h4 className="cases-product-name">{current.name}</h4>
            <ProblemDelivered p={current} />
            <ul className="cases-stack">
              {current.stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <LiveLink url={current.url} origin={current.id} />
          </div>
          <div className="cases-panel-visual" key={`v-${current.id}`}>
            <CaseVisualView visual={current.visual} shot={current.shot} url={current.url} alt={`${current.name} do ${FEATURED_CASE.client}`} />
          </div>
        </div>
      </div>

      {/* Other cases + the next one */}
      <div className="cases-grid">
        {OTHER_CASES.map((c) => (
          <article key={c.id} className="cases-card">
            <div className="cases-card-visual">
              <CaseVisualView visual={c.visual} shot={c.shot} url={c.url} alt={`${c.name}: ${c.client}`} />
            </div>
            <span className="cases-card-kicker">{c.client} · {c.kind}</span>
            <h3 className="cases-card-title">{c.name}</h3>
            <ProblemDelivered p={c} />
            <LiveLink url={c.url} origin={c.id} />
          </article>
        ))}

        <article className="cases-card cases-card-next">
          <span className="cases-card-kicker">Próximo case</span>
          <h3 className="cases-card-title">O próximo pode ser o da sua empresa.</h3>
          <p>
            Comece vendo onde o seu site perde clientes hoje. Leva 30 segundos e não pede cadastro.
          </p>
          <a href="/analise-de-site-gratis" className="btn-v16 btn-v16-primary" onClick={() => track('cta_click', { origin: 'cases_raiox' })}>
            <ScanSearch size={18} aria-hidden="true" /> Fazer o Raio-X grátis
          </a>
          <a href="#contato" className="cases-next-alt" onClick={() => track('cta_click', { origin: 'cases_diagnostico' })}>
            ou peça o diagnóstico com um especialista <ArrowRight size={15} aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  )
}
