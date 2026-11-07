import { motion } from 'framer-motion'
import { Target, MessageCircle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import type { ServiceContent } from '../content/services'
import { SERVICES } from '../content/services'
import { whatsappLink } from '../content/site'
import { ProcessSection, FaqSection } from '../components/Sections'
import DiagnosticSection from '../components/DiagnosticSection'
import Landmark from '../components/Landmark'
import { LANDMARKS } from '../content/brasilia'
import { track } from '../lib/analytics'

export default function ServicePage({ service }: { service: ServiceContent }) {
  const others = SERVICES.filter((s) => s.slug !== service.slug)

  return (
    <main id="conteudo">
      <section className="hero-cmd hero-cmd-compact service-hero">
        <Landmark item={LANDMARKS.catedral} className="service-art" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Você está em">
            <a href="/">Início</a> <span aria-hidden="true">/</span> <span>{service.navLabel}</span>
          </nav>
          <span className="eyebrow">{service.eyebrow}</span>
          <h1 className="title-lg service-title">{service.h1}</h1>
          <p className="hero-subtitle service-intro">{service.intro}</p>
          <div className="cta-group" style={{ justifyContent: 'flex-start' }}>
            <a href="#contato" className="btn-v16 btn-v16-primary" onClick={() => track('cta_click', { origin: `${service.slug}_hero` })}>
              Quero um diagnóstico gratuito <Target size={20} />
            </a>
            <a
              href={whatsappLink(service.whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-v16 btn-v16-secondary"
              onClick={() => track('whatsapp_click', { origin: `${service.slug}_hero` })}
            >
              Falar no WhatsApp <MessageCircle size={20} />
            </a>
          </div>
          <p className="service-raiox-link">
            Quer ver antes onde está o problema? <a href="/analise-de-site-gratis" onClick={() => track('cta_click', { origin: `${service.slug}_raiox` })}>Faça o Raio-X grátis do seu site</a> em 30 segundos.
          </p>
        </div>
      </section>

      <section className="section-v16 section-compact">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Você se identifica?</span>
            <h2 className="title-lg">Sinais de que sua empresa precisa disso</h2>
          </div>
          <div className="problem-grid">
            {service.pains.map((pain) => (
              <article key={pain} className="problem-card">
                <div className="problem-icon" aria-hidden="true"><AlertCircle size={24} /></div>
                <p className="pain-text">{pain}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-v16 section-tinted">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Entregas</span>
            <h2 className="title-lg">{service.deliverablesTitle}</h2>
          </div>
          <div className="deliverables-grid">
            {service.deliverables.map((d, i) => (
              <motion.article
                key={d.title}
                className="deliverable-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <CheckCircle2 size={22} className="deliverable-icon" aria-hidden="true" />
                <h3 className="title-md">{d.title}</h3>
                <p>{d.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-v16 section-compact">
        <div className="container for-who">
          <div>
            <span className="eyebrow">Para quem é</span>
            <h2 className="title-lg" style={{ textAlign: 'left' }}>Indicado para</h2>
          </div>
          <ul className="differentials">
            {service.forWho.map((f) => (
              <li key={f}><CheckCircle2 size={18} aria-hidden="true" /> {f}</li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSection />

      <FaqSection faq={service.faq} title={`Dúvidas sobre ${service.navLabel.toLowerCase()}`} />

      <DiagnosticSection
        location={service.slug}
        initialObjective={service.objectiveId}
        title={service.ctaTitle}
        whatsappMsg={service.whatsappMsg}
      />

      <section className="section-v16 section-compact">
        <div className="container">
          <h2 className="title-md" style={{ marginBottom: '1.25rem' }}>Outros serviços da Meta Impulso</h2>
          <div className="related-links">
            {others.map((s) => (
              <a key={s.slug} href={`/${s.slug}`} className="related-link">
                {s.serviceType} <ArrowRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
