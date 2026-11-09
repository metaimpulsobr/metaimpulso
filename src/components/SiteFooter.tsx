import { SITE, whatsappLink } from '../content/site'
import SectionLines from './SectionLines'
import SectionSeam from './SectionSeam'
import { SERVICES } from '../content/services'

export default function SiteFooter() {
  return (
    <>
    <SectionSeam variant="dome-up" pos="c" />
    <footer className="footer-section">
      <SectionLines variant="horizon" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <img src="/logo-96.png" alt="" width="44" height="44" loading="lazy" />
              <span className="logo-text" style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                META IMPULSO
              </span>
            </a>
            <p>
              Marketing digital e tecnologia em Brasília. Tráfego pago, sites, SEO, CRM, automação e IA integrados para gerar vendas.
            </p>
          </div>

          <div>
            <h2 className="footer-title">Serviços</h2>
            <ul className="footer-list">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a href={`/${s.slug}`}>{s.serviceType}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Empresa</h2>
            <ul className="footer-list">
              <li><a href="/analise-de-site-gratis">Análise de site grátis</a></li>
              <li><a href="/#planos">Planos</a></li>
              <li><a href="/#cases">Cases</a></li>
              <li><a href="/#processo">Como trabalhamos</a></li>
              <li><a href="/#faq">Perguntas frequentes</a></li>
              <li><a href="/politica-de-privacidade">Política de privacidade</a></li>
            </ul>
          </div>

          <address className="footer-contact">
            <h2 className="footer-title">Contato</h2>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <span>{SITE.address.street}, {SITE.address.district}, {SITE.address.city} - {SITE.address.region}</span>
            <span>{SITE.hoursLabel}</span>
            <span className="footer-social">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </span>
          </address>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Meta Impulso · Marketing digital e desenvolvimento de software em Brasília - DF
        </div>
      </div>
    </footer>
    </>
  )
}
