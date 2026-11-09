import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { track } from '../lib/analytics'

const NAV_LINKS = [
  { name: 'Raio-X grátis', href: '/analise-de-site-gratis' },
  { name: 'Serviços', href: '/#servicos' },
  { name: 'Planos', href: '/#planos' },
  { name: 'Cases', href: '/#cases' },
  { name: 'FAQ', href: '/#faq' },
]

/** contactHref: "#contato" on pages that embed the diagnostic, "/#contato" elsewhere. */
export default function SiteHeader({ contactHref = '/#contato' }: { contactHref?: string }) {
  const links = [...NAV_LINKS, { name: 'Contato', href: contactHref }]
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`nav-pill-v16 ${scrolled ? 'nav-scrolled' : ''}`}>
        <a
          href="/"
          className="logo"
          aria-label="Meta Impulso: página inicial"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <img src="/logo-96.png" alt="" width="42" height="42" style={{ height: '42px', width: '42px', objectFit: 'contain' }} />
          <span className="logo-text" style={{ fontWeight: '900', fontSize: '1.35rem', letterSpacing: '0.1em' }}>
            META IMPULSO
          </span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="core-link">
              {link.name}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a
            href={contactHref}
            className="btn-v16 btn-v16-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}
            onClick={() => track('cta_click', { origin: 'header' })}
          >
            Diagnóstico gratuito
          </a>
        </div>

        <button className="burger-btn" onClick={() => setIsMenuOpen(true)} aria-label="Abrir menu" aria-expanded={isMenuOpen}>
          <div className="burger-line" />
          <div className="burger-line" />
          <div className="burger-line" />
        </button>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
              <X size={40} />
            </button>

            {links.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="mobile-menu-link"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}

            <motion.a
              href={contactHref}
              className="btn-v16 btn-v16-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.06 + 0.1 }}
              style={{ marginTop: '1rem', width: '100%', maxWidth: '280px' }}
              onClick={() => {
                setIsMenuOpen(false)
                track('cta_click', { origin: 'menu_mobile' })
              }}
            >
              Diagnóstico gratuito
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
