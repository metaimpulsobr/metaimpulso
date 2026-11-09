import { CheckCircle2, MessageCircle, Mail, Clock, Phone } from 'lucide-react'
import SectionLines from './SectionLines'
import DiagnosticQuiz from './DiagnosticQuiz'
import { SITE, DIAGNOSTIC_DELIVERABLES, whatsappLink } from '../content/site'
import { track } from '../lib/analytics'
import type { ObjectiveId } from '../lib/leadScore'

interface DiagnosticSectionProps {
  /** "home" or the service page slug */
  location: string
  initialObjective?: ObjectiveId
  title?: React.ReactNode
  whatsappMsg?: string
}

/** The site's main conversion block: concrete offer + qualification quiz. Anchor: #contato */
export default function DiagnosticSection({ location, initialObjective, title, whatsappMsg }: DiagnosticSectionProps) {
  return (
    <section id="contato" className="section-v16">
      <SectionLines variant="wings-bottom" />
      <div className="container">
        <div className="diag-grid">
          <div className="diag-head">
            <span className="eyebrow">Diagnóstico digital gratuito</span>
            <h2 className="title-lg contato-info-title">
              {title ?? (
                <>
                  Vamos encontrar onde sua empresa está <span className="text-gradient">perdendo vendas?</span>
                </>
              )}
            </h2>
            <p className="contato-info-subtitle">
              Responda 5 perguntas rápidas. Nossa equipe analisa seu cenário e marca uma conversa estratégica de 30 minutos, sem compromisso.
            </p>
          </div>

          <div className="diag-quiz">
            <DiagnosticQuiz location={location} initialObjective={initialObjective} />
          </div>

          <div className="diag-side">
            <div className="diag-offer">
              <span className="diag-offer-title">O que analisamos para você</span>
              <ul className="diag-offer-list">
                {DIAGNOSTIC_DELIVERABLES.map((d) => (
                  <li key={d.title}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span><strong>{d.title}:</strong> {d.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="diag-offer-foot">Você sai da conversa com as prioridades para o seu negócio, mesmo que não feche com a gente.</p>
            </div>

            <div className="diag-direct">
              <span className="contato-info-label">Prefere falar agora?</span>
              <a
                href={whatsappLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="diag-direct-item"
                onClick={() => track('whatsapp_click', { origin: `${location}_contato` })}
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp {SITE.phoneDisplay}
              </a>
              <a href={`tel:${SITE.phoneE164}`} className="diag-direct-item" onClick={() => track('cta_click', { origin: `${location}_ligar` })}>
                <Phone size={18} aria-hidden="true" /> Ligar: {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="diag-direct-item">
                <Mail size={18} aria-hidden="true" /> {SITE.email}
              </a>
              <span className="diag-direct-item">
                <Clock size={18} aria-hidden="true" /> {SITE.hoursLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
