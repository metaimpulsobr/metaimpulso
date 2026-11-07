import { useEffect, useRef } from 'react'
import { Gauge, Radar, MousePointerClick, Search, CheckCircle2 } from 'lucide-react'
import { RaioXForm, RaioXProgress, RaioXResult } from '../components/RaioX'
import { FaqSection } from '../components/Sections'
import DiagnosticSection from '../components/DiagnosticSection'
import { RAIOX_CHECKS, RAIOX_HUMAN_CHECKS, TOOL_FAQ } from '../content/site'
import { useRaioX } from '../lib/useRaioX'

const CHECK_ICONS = [<Gauge size={24} key="g" />, <Radar size={24} key="r" />, <MousePointerClick size={24} key="m" />, <Search size={24} key="s" />]

export default function ToolPage() {
  const { state, run } = useRaioX('ferramenta')
  const resultRef = useRef<HTMLDivElement>(null)
  const busy = state.phase === 'running' || state.phase === 'partial'

  // Shared links and the home hero form arrive as ?url=...: run right away
  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get('url')
    if (url) run(url)
  }, [run])

  useEffect(() => {
    if (state.phase === 'running' || state.phase === 'error') resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state.phase])

  const runHere = (url: string) => {
    window.history.replaceState(null, '', `?url=${encodeURIComponent(url.trim())}`)
    run(url)
  }

  return (
    <main id="conteudo">
      <section className="hero-cmd hero-cmd-compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Você está em">
            <a href="/">Início</a> <span aria-hidden="true">/</span> <span>Análise de site grátis</span>
          </nav>
          <div className="tool-hero">
            <span className="eyebrow">Ferramenta gratuita · Raio-X de Vendas</span>
            <h1 className="title-lg hero-cmd-title">
              Análise de site grátis: descubra em 30 segundos <span className="text-gradient">onde o seu site perde vendas</span>
            </h1>
            <p className="hero-cmd-sub">
              Velocidade no celular, Pixel da Meta, Google Analytics, WhatsApp, formulário e o que o Google enxerga da sua página. Sem cadastro, sem cartão, sem enrolação.
            </p>
            <div className="hero-cmd-card">
              <RaioXForm location="ferramenta" onRun={runHere} busy={busy} />
            </div>
          </div>
          <img className="tool-art" src="/3d/alvorada.webp" width={1400} height={599} alt="" aria-hidden="true" />
        </div>
      </section>

      {state.phase !== 'idle' && (
        <section className="section-v16 raiox-section" aria-label="Resultado do Raio-X">
          <div className="container raiox-container" ref={resultRef}>
            {state.phase === 'running' && (
              <div className="raiox-card">
                <h2 className="title-md">Analisando {state.url.replace(/^https?:\/\//, '')}</h2>
                <RaioXProgress state={state} />
              </div>
            )}
            {state.phase === 'error' && (
              <div className="raiox-card raiox-error" role="alert">
                <h2 className="title-md">
                  {state.error === 'invalid_url' ? 'Esse endereço não parece um site' : 'Não conseguimos abrir esse site agora'}
                </h2>
                <p>
                  {state.error === 'invalid_url'
                    ? 'Digite o endereço completo, por exemplo: suaempresa.com.br'
                    : 'Ele pode estar fora do ar, bloqueando leituras automáticas ou demorando demais para responder. Isso também afasta clientes. Peça a análise feita por uma pessoa logo abaixo.'}
                </p>
                <a href="#contato" className="btn-v16 btn-v16-primary">Pedir a análise completa grátis</a>
              </div>
            )}
            {(state.phase === 'partial' || state.phase === 'done') && state.report && (
              <div className="raiox-card">
                <RaioXResult state={state} location="ferramenta" />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section-v16 section-compact">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">O que o Raio-X analisa</span>
            <h2 className="title-lg">Os quatro pontos onde um site <span className="text-gradient">deixa dinheiro na mesa</span></h2>
          </div>
          <div className="deliverables-grid tool-checks">
            {RAIOX_CHECKS.map((c, i) => (
              <article key={c.title} className="deliverable-card">
                <span className="deliverable-icon" aria-hidden="true">{CHECK_ICONS[i]}</span>
                <h3 className="title-md">{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-v16 section-compact section-tinted">
        <div className="container for-who">
          <div>
            <span className="eyebrow">Além da ferramenta</span>
            <h2 className="title-lg" style={{ textAlign: 'left' }}>O que só uma pessoa consegue ver</h2>
            <p className="subtitle-main" style={{ textAlign: 'left', margin: '1rem 0 0' }}>
              O Raio-X lê o seu site. As vendas também se perdem fora dele. No diagnóstico gratuito, a nossa equipe confere com você:
            </p>
          </div>
          <ul className="differentials">
            {RAIOX_HUMAN_CHECKS.map((c) => <li key={c}><CheckCircle2 size={18} aria-hidden="true" /> {c}</li>)}
          </ul>
        </div>
      </section>

      <FaqSection faq={TOOL_FAQ} title="Perguntas sobre a análise de site" />

      <DiagnosticSection
        location="analise-de-site-gratis"
        title={<>Quer que a gente feche <span className="text-gradient">esses furos</span> para você?</>}
        whatsappMsg="Olá! Fiz a análise de site grátis e quero ajuda para corrigir os pontos que apareceram."
      />
    </main>
  )
}
