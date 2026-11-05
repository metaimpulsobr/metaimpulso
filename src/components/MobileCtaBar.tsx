import { useEffect, useState } from 'react'
import { MessageCircle, Target } from 'lucide-react'
import { whatsappLink } from '../content/site'
import { track } from '../lib/analytics'

/**
 * Phone-only sticky bar with the two conversion actions. Appears after the hero and
 * steps aside while the diagnostic section (#contato) is on screen.
 */
export default function MobileCtaBar({ contactHref }: { contactHref: string }) {
  const [pastHero, setPastHero] = useState(false)
  const [contactInView, setContactInView] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const contact = document.getElementById('contato')
    let observer: IntersectionObserver | undefined
    if (contact && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), { threshold: 0.15 })
      observer.observe(contact)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  const visible = pastHero && !contactInView

  return (
    <div className={`mobile-cta-bar ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <a
        href={contactHref}
        className="btn-v16 btn-v16-primary mobile-cta-main"
        tabIndex={visible ? 0 : -1}
        onClick={() => track('cta_click', { origin: 'barra_mobile' })}
      >
        Diagnóstico gratuito <Target size={18} aria-hidden="true" />
      </a>
      <a
        href={whatsappLink('Olá! Vim pelo site e gostaria de solicitar um diagnóstico digital.')}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-cta-whatsapp"
        aria-label="Falar no WhatsApp"
        tabIndex={visible ? 0 : -1}
        onClick={() => track('whatsapp_click', { origin: 'barra_mobile' })}
      >
        <MessageCircle size={22} aria-hidden="true" />
      </a>
    </div>
  )
}
