import { motion } from 'framer-motion'
import { Check, MessageCircle, Target } from 'lucide-react'
import { PLANS, PROCESS_STEPS, whatsappLink, type Faq } from '../content/site'
import { track } from '../lib/analytics'

export function ProcessSection() {
  return (
    <section id="processo" className="section-v16">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Processo</span>
          <h2 className="title-lg">
            Como <span className="text-gradient">trabalhamos</span>
          </h2>
          <p className="subtitle-main">Do diagnóstico à escala: cinco etapas claras, com entregas e métricas definidas em cada uma.</p>
        </div>

        <ol className="launch-timeline">
          <div className="launch-track-bg" aria-hidden="true" />
          <motion.div
            className="launch-track-fill"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />

          {PROCESS_STEPS.map((p, i) => (
            <motion.li
              key={p.num}
              className="launch-step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="launch-node-wrapper" aria-hidden="true">
                <div className="launch-node-core" style={{ background: p.color, boxShadow: `0 0 16px ${p.color}` }} />
              </div>
              <div className="launch-card" style={{ '--step-color': p.color } as React.CSSProperties}>
                <div className="launch-num" style={{ color: p.color }}>{p.num}</div>
                <h3 className="title-md" style={{ marginBottom: '0.6rem', fontSize: '1rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-tech)', fontSize: '0.85rem', lineHeight: '1.6' }}>{p.desc}</p>
                <div className="launch-card-bar" style={{ background: p.color, transform: 'scaleX(1)' }} />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function PlansSection() {
  return (
    <section id="planos" className="section-v16">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Planos</span>
          <h2 className="title-lg">
            Escolha o estágio de <span className="text-gradient">crescimento</span> da sua empresa
          </h2>
          <p className="subtitle-main">
            Três níveis de entrega, do primeiro site à infraestrutura digital completa. O investimento é definido no diagnóstico, de acordo com o escopo.
          </p>
        </div>

        <div className="plans-grid">
          {PLANS.map((plan) => (
            <article key={plan.id} className={`plan-card ${plan.highlight ? 'plan-card-highlight' : ''}`}>
              {plan.highlight && <span className="plan-badge">Recomendado para crescer</span>}
              <span className="plan-name">{plan.name}</span>
              <h3 className="title-md plan-headline">{plan.headline}</h3>
              <p className="plan-for">{plan.forWho}</p>
              <ul className="plan-items">
                {plan.items.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(`Olá! Tenho interesse no plano ${plan.name} da Meta Impulso e gostaria de um diagnóstico.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-v16 ${plan.highlight ? 'btn-v16-primary' : 'btn-v16-secondary'}`}
                onClick={() => track('whatsapp_click', { origin: `plano_${plan.id}` })}
                style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              >
                Quero o plano {plan.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FaqSection({ faq, title = 'Perguntas frequentes' }: { faq: Faq[]; title?: string }) {
  return (
    <section id="faq" className="section-v16">
      <div className="container faq-container">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="title-lg">{title}</h2>
        </div>
        <div className="faq-list">
          {faq.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBanner({ title, whatsappMsg, origin }: { title: string; whatsappMsg: string; origin: string }) {
  return (
    <section className="section-v16">
      <div className="container">
        <div className="cta-banner">
          <h2 className="title-lg">{title}</h2>
          <p className="subtitle-main">
            Agende um diagnóstico digital gratuito de 30 minutos. Você sai da conversa com as prioridades para o seu negócio, mesmo que não feche com a gente.
          </p>
          <div className="cta-group" style={{ justifyContent: 'center' }}>
            <a href="/#contato" className="btn-v16 btn-v16-primary">
              Fazer diagnóstico gratuito <Target size={18} />
            </a>
            <a
              href={whatsappLink(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-v16 btn-v16-secondary"
              onClick={() => track('whatsapp_click', { origin })}
            >
              Falar no WhatsApp <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
