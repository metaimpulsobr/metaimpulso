import { CheckCircle2, ScanLine, ArrowRight, XCircle, Wrench } from 'lucide-react'
import SectionSeam from '../components/SectionSeam'
import SectionLines from '../components/SectionLines'
import ObjectiveSelector from '../components/ObjectiveSelector'
import Landmark from '../components/Landmark'
import PlanoPilotoLines from '../components/PlanoPilotoLines'
import AboutLogoVfx from '../components/AboutLogoVfx'
import DiagnosticSection from '../components/DiagnosticSection'
import CasesShowcase from '../components/CasesShowcase'
import { RaioXForm } from '../components/RaioX'
import { ProcessSection, PlansSection, FaqSection, OneTeamSection, TestimonialsSection } from '../components/Sections'
import { HOME_FAQ, FUNNEL_LEAKS, RAIOX_CHECKS, whatsappLink } from '../content/site'
import { track } from '../lib/analytics'
import { LANDMARKS } from '../content/brasilia'

const TECH = ['GOOGLE ADS', 'META ADS', 'GA4', 'REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'SUPABASE', 'WHATSAPP', 'IA']

const DIFFERENTIALS = [
  'Estratégia antes da execução: diagnóstico, posicionamento e metas definidos no início',
  'Tecnologia própria: sites, CRMs, automações e sistemas desenvolvidos pela nossa equipe',
  'Tudo medido: custo por lead, custo por venda e retorno de cada canal',
  'Uma única equipe responsável do anúncio ao sistema, sem jogo de empurra entre fornecedores',
]

export default function HomePage() {
  return (
    <main id="conteudo">
      {/* HERO: the proof comes first: a live Raio-X of the visitor's own site.
          No entrance animation on the H1 so the LCP text paints straight from the prerendered HTML. */}
      <section id="hero" className="hero-cmd">
        <PlanoPilotoLines />
        <div className="container hero-cmd-grid">
          <div className="hero-cmd-copy">
            <span className="eyebrow">Marketing, tecnologia e vendas · Brasília - DF</span>
            <h1 className="title-lg hero-cmd-title">
              Agência de marketing digital em Brasília que <span className="text-gradient">prova antes de prometer</span>
            </h1>
            <p className="hero-cmd-sub">
              Cole o endereço do seu site e veja agora, de graça, onde ele está perdendo clientes. Se fizer sentido, uma única equipe fecha todos os furos: anúncio, site, WhatsApp, CRM e IA, medidos até a venda.
            </p>
          </div>

          {/* Raio-X on the right, standing in front of the Museu Nacional */}
          <div className="hero-stage">
            <Landmark item={LANDMARKS.museu} className="hero-landmark" priority />
            <div className="hero-cmd-card" id="raio-x">
              <div className="hero-cmd-card-head">
                Raio-X de Vendas grátis
              </div>
              <RaioXForm location="home_hero" />
              <ul className="raiox-scanlist" aria-label="O que o Raio-X analisa">
                {RAIOX_CHECKS.map((c) => (
                  <li key={c.title}><ScanLine size={15} aria-hidden="true" /> {c.title}</li>
                ))}
              </ul>
              <p className="hero-cmd-alt">
                Ainda não tem site?{' '}
                <a href="#contato" onClick={() => track('cta_click', { origin: 'hero_sem_site' })}>Faça o diagnóstico gratuito</a> ou{' '}
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { origin: 'hero' })}
                >
                  fale no WhatsApp
                </a>
                .
              </p>
            </div>
          </div>

          <ul className="hero-cmd-trust">
            <li><CheckCircle2 size={16} aria-hidden="true" /> Do anúncio à venda, um só time responsável</li>
            <li><CheckCircle2 size={16} aria-hidden="true" /> Diagnóstico gratuito de 30 minutos</li>
            <li><CheckCircle2 size={16} aria-hidden="true" /> Brasília e todo o Brasil</li>
          </ul>
        </div>
      </section>

      <section className="partners-carousel-section" aria-label="Plataformas e tecnologias que utilizamos">
        <div className="logos-slide-track">
          {[...TECH, ...TECH].map((tech, idx) => (
            <div key={idx} className="logo-slide-item" aria-hidden={idx >= TECH.length}>
              <span className="text-gradient" style={{ fontWeight: '900', letterSpacing: '0.15em', fontSize: '0.85rem' }}>{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FUNIL FURADO: problem + agitation + named mechanism */}
      <section id="problema" className="section-v16">
        <SectionLines variant="arc-tl" />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Onde as vendas se perdem</span>
            <h2 className="title-lg">
              Você não precisa de mais anúncio. <span className="text-gradient">Precisa parar de perder quem já chegou.</span>
            </h2>
            <p className="subtitle-main">
              Todo funil tem furos. Eles costumam estar em um destes cinco pontos, e basta um para o anúncio sair caro.
            </p>
          </div>

          <ol className="leak-flow">
            {FUNNEL_LEAKS.map((l, i) => (
              <li key={l.stage} className="leak-step">
                <span className="leak-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="leak-stage">{l.stage}</h3>
                <p className="leak-text"><XCircle size={16} aria-hidden="true" /> <span><strong>O furo:</strong> {l.leak}</span></p>
                <p className="leak-fix"><Wrench size={16} aria-hidden="true" /> <span><strong>Como fechamos:</strong> {l.fix}</span></p>
              </li>
            ))}
          </ol>

          <div className="leak-foot">
            <p>
              É isso que chamamos de <strong>Funil Blindado</strong>: os cinco pontos cuidados pela mesma equipe e medidos do clique até a venda.
            </p>
            <a href="#raio-x" className="btn-v16 btn-v16-primary" onClick={() => track('cta_click', { origin: 'funil_raiox' })}>
              Descobrir os furos do meu site <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <SectionSeam variant="dome-up" pos="r" />
      <OneTeamSection />

      <SectionSeam variant="dome-down" pos="l" />
      <section id="servicos" className="section-v16">
        <SectionLines variant="wings-top" />
        <div className="container">
          <ObjectiveSelector />
        </div>
      </section>

      <SectionSeam variant="node" pos="r" />
      <PlansSection />

      <SectionSeam variant="dome-up" pos="l" />
      <section id="cases" className="section-v16 section-tinted">
        <SectionLines variant="axis-l" />
        <div className="container">
          <CasesShowcase />
        </div>
      </section>

      <TestimonialsSection />

      <SectionSeam variant="dome-down" pos="r" />
      <section id="sobre" className="section-v16">
        <SectionLines variant="arc-tr" />
        <div className="container">
          <div className="sobre-split">
            <div className="sobre-text-col">
              <span className="eyebrow">Sobre a Meta Impulso</span>
              <h2 className="title-lg" style={{ textAlign: 'left' }}>
                Marketing e engenharia de software <span className="text-gradient">na mesma equipe</span>
              </h2>
              <div className="sobre-copy">
                <p>
                  A Meta Impulso é uma empresa de marketing digital e tecnologia sediada em Brasília (DF), com atendimento em todo o Brasil. Não somos uma agência de posts: estruturamos o caminho completo entre o primeiro anúncio e a venda fechada.
                </p>
                <p>
                  Geramos demanda com tráfego pago e SEO, capturamos com sites e landing pages, organizamos no CRM, aceleramos com automação e IA e usamos os dados para decidir onde investir.
                </p>
              </div>
              <ul className="differentials">
                {DIFFERENTIALS.map((d) => (
                  <li key={d}><CheckCircle2 size={18} aria-hidden="true" /> {d}</li>
                ))}
              </ul>
            </div>

            <div className="sobre-card-col">
              <div className="card-premium" style={{ textAlign: 'center' }}>
                <AboutLogoVfx />
                <h3 className="title-md">
                  Estratégia, tecnologia e <br />
                  <span className="text-gradient">performance comercial</span>
                </h3>
                <p style={{ color: 'var(--text-tech)', fontSize: '0.9rem', marginTop: '1rem' }}>
                  Decisões orientadas por dados, com foco no retorno sobre o investimento (ROI).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionSeam variant="bridge" pos="l" />
      <ProcessSection />

      <SectionSeam variant="node" pos="r" />
      <FaqSection faq={HOME_FAQ} />

      <SectionSeam variant="wing" pos="l" />
      <DiagnosticSection location="home" />
    </main>
  )
}
