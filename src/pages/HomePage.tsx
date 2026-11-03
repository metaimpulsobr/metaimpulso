import { motion } from 'framer-motion'
import { Target, MessageCircle, Phone, Mail, MapPin, Clock, Clock3, MonitorSmartphone, BarChart3, CheckCircle2 } from 'lucide-react'
import { HeroTechIcons } from '../components/SpaceBackground'
import RocketShowcase from '../components/RocketShowcase'
import ObjectiveSelector from '../components/ObjectiveSelector'
import AboutLogoVfx from '../components/AboutLogoVfx'
import DiagnosticQuiz from '../components/DiagnosticQuiz'
import PortfolioShowcase from '../components/PortfolioShowcase'
import { ProcessSection, PlansSection, FaqSection } from '../components/Sections'
import { SITE, HOME_FAQ, whatsappLink } from '../content/site'
import { track } from '../lib/analytics'

const TECH = ['GOOGLE ADS', 'META ADS', 'GA4', 'REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'SUPABASE', 'WHATSAPP', 'IA']

const PROBLEMS = [
  {
    icon: <Clock3 size={26} />,
    title: 'O lead chega e ninguém responde a tempo',
    desc: 'Quem pede orçamento fala com vários fornecedores. Se a resposta demora, a venda vai para o concorrente.',
    fix: 'Automação e agentes de IA no WhatsApp respondem em segundos e registram tudo no CRM.',
  },
  {
    icon: <MonitorSmartphone size={26} />,
    title: 'O site não convence ou demora para abrir',
    desc: 'O anúncio funciona, mas a página é lenta, confusa no celular e não deixa claro o próximo passo.',
    fix: 'Sites e landing pages rápidos, com mensagem alinhada ao anúncio e chamada clara para a ação.',
  },
  {
    icon: <BarChart3 size={26} />,
    title: 'Ninguém sabe qual campanha trouxe o cliente',
    desc: 'Sem rastreamento, a verba é decidida no achismo e campanhas boas são cortadas junto com as ruins.',
    fix: 'Rastreamento ponta a ponta: do clique no anúncio até a venda fechada no CRM.',
  },
]

const DIFFERENTIALS = [
  'Estratégia antes da execução: diagnóstico, posicionamento e metas definidos no início',
  'Tecnologia própria: sites, CRMs, automações e sistemas desenvolvidos pela nossa equipe',
  'Tudo medido: custo por lead, custo por venda e retorno de cada canal',
  'Uma única equipe responsável do anúncio ao sistema, sem jogo de empurra entre fornecedores',
]

export default function HomePage() {
  return (
    <main id="conteudo">
      {/* HERO: no entrance fade on the H1 so the LCP text paints straight from the prerendered HTML */}
      <section id="hero" className="section-v16 hero-section">
        <div className="hero-icons" aria-hidden="true">
          <HeroTechIcons />
        </div>
        <div className="container">
          <div className="hero-split-grid">
            <div className="hero-text-col">
              <span className="eyebrow">Marketing digital e tecnologia · Brasília - DF</span>
              <h1 className="title-lg hero-title">
                Agência de marketing digital em Brasília que transforma <span className="text-gradient">cliques em clientes</span>
              </h1>
              <p className="hero-subtitle">
                Tráfego pago no Google e no Meta Ads, sites que convertem, CRM, automação de WhatsApp e agentes de IA, construídos pela mesma equipe e medidos do anúncio até a venda.
              </p>

              <div className="cta-group" style={{ justifyContent: 'flex-start' }}>
                <a href="#contato" className="btn-v16 btn-v16-primary" onClick={() => track('cta_click', { origin: 'hero_diagnostico' })}>
                  Quero meu diagnóstico gratuito <Target size={20} />
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-v16 btn-v16-secondary"
                  onClick={() => track('whatsapp_click', { origin: 'hero' })}
                >
                  Falar no WhatsApp <MessageCircle size={20} />
                </a>
              </div>

              <ul className="hero-trust">
                <li><CheckCircle2 size={16} aria-hidden="true" /> Atendimento em Brasília e em todo o Brasil</li>
                <li><CheckCircle2 size={16} aria-hidden="true" /> Marketing e engenharia de software no mesmo time</li>
                <li><CheckCircle2 size={16} aria-hidden="true" /> Diagnóstico estratégico gratuito de 30 minutos</li>
              </ul>
            </div>

            <div className="hero-rocket-col" aria-hidden="true">
              <RocketShowcase />
            </div>
          </div>
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

      {/* PROBLEMA → SOLUÇÃO */}
      <section id="problema" className="section-v16">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Onde as vendas se perdem</span>
            <h2 className="title-lg">
              Anúncio sozinho não vende. <span className="text-gradient">O que vende é o que acontece depois do clique.</span>
            </h2>
          </div>
          <div className="problem-grid">
            {PROBLEMS.map((p, i) => (
              <motion.article
                key={p.title}
                className="problem-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="problem-icon" aria-hidden="true">{p.icon}</div>
                <h3 className="title-md">{p.title}</h3>
                <p>{p.desc}</p>
                <p className="problem-fix"><strong>Como resolvemos:</strong> {p.fix}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE / DIFERENCIAL */}
      <section id="sobre" className="section-v16">
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

      <section id="servicos" className="section-v16">
        <div className="container">
          <ObjectiveSelector />
        </div>
      </section>

      <PlansSection />

      <section id="cases" className="section-v16 section-tinted">
        <div className="container">
          <PortfolioShowcase />
        </div>
      </section>

      <ProcessSection />

      <FaqSection faq={HOME_FAQ} />

      {/* CONTATO + DIAGNÓSTICO */}
      <section id="contato" className="section-v16">
        <div className="container">
          <div className="contato-grid">
            <div className="contato-info-col">
              <span className="eyebrow">Diagnóstico digital gratuito</span>
              <h2 className="title-lg contato-info-title">
                Vamos encontrar onde sua empresa está <span className="text-gradient">perdendo vendas?</span>
              </h2>
              <p className="contato-info-subtitle" style={{ maxWidth: '480px' }}>
                Responda 5 perguntas rápidas. Nossa equipe analisa seu cenário e agenda uma conversa estratégica de 30 minutos, sem compromisso.
              </p>

              <div className="contato-info-list">
                <div className="contato-info-item">
                  <div className="contato-info-icon-box"><Phone size={20} /></div>
                  <div className="contato-info-details">
                    <span className="contato-info-label">WhatsApp comercial</span>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contato-info-value"
                      onClick={() => track('whatsapp_click', { origin: 'contato' })}
                    >
                      {SITE.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="contato-info-item">
                  <div className="contato-info-icon-box"><Mail size={20} /></div>
                  <div className="contato-info-details">
                    <span className="contato-info-label">E-mail</span>
                    <a href={`mailto:${SITE.email}`} className="contato-info-value">{SITE.email}</a>
                  </div>
                </div>
                <div className="contato-info-item">
                  <div className="contato-info-icon-box"><MapPin size={20} /></div>
                  <div className="contato-info-details">
                    <span className="contato-info-label">Endereço</span>
                    <span className="contato-info-value">{SITE.address.street}, {SITE.address.district} - {SITE.address.city}, {SITE.address.region}</span>
                  </div>
                </div>
                <div className="contato-info-item">
                  <div className="contato-info-icon-box"><Clock size={20} /></div>
                  <div className="contato-info-details">
                    <span className="contato-info-label">Horário de atendimento</span>
                    <span className="contato-info-value">{SITE.hoursLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contato-quiz-col">
              <DiagnosticQuiz />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
