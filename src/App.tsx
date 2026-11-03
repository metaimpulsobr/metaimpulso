import { useEffect } from 'react'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import SpaceBackground from './components/SpaceBackground'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import ConsentBanner from './components/ConsentBanner'
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'
import { resolveRoute } from './seo/routes'
import { whatsappLink } from './content/site'
import { captureAttribution, track } from './lib/analytics'
import './App.css'
import './site.css'

function App({ path }: { path: string }) {
  const route = resolveRoute(path)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    captureAttribution()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>

        <motion.div className="progress-bar" style={{ scaleX }} aria-hidden="true" />

        <SpaceBackground />
        <SiteHeader />

        {route.kind === 'home' && <HomePage />}
        {route.kind === 'service' && route.service && <ServicePage service={route.service} />}
        {route.kind === 'privacy' && <PrivacyPage />}
        {route.kind === 'notfound' && <NotFoundPage />}

        <a
          href={whatsappLink('Olá! Vim pelo site e gostaria de solicitar um diagnóstico digital.')}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-capsule"
          aria-label="Falar com a Meta Impulso no WhatsApp"
          onClick={() => track('whatsapp_click', { origin: 'botao_flutuante' })}
        >
          <span className="capsule-pulse" />
          <MessageCircle size={20} color="white" />
          <span className="capsule-text">Falar no WhatsApp</span>
        </a>

        <SiteFooter />
        <ConsentBanner />
      </div>
    </MotionConfig>
  )
}

export default App
