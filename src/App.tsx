import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Target, X, MessageCircle, Boxes, Phone, Mail, MapPin, Clock } from 'lucide-react'
import SpaceBackground, { HeroTechIcons } from './components/SpaceBackground'
// These are above-the-fold — load eagerly
import RocketShowcase from './components/RocketShowcase'
import RocketPreloader from './components/RocketPreloader'
// Below-the-fold: load lazily to reduce initial JS parse time
const ObjectiveSelector = lazy(() => import('./components/ObjectiveSelector'))
const AboutLogoVfx     = lazy(() => import('./components/AboutLogoVfx'))
const DiagnosticQuiz   = lazy(() => import('./components/DiagnosticQuiz'))
const PortfolioShowcase = lazy(() => import('./components/PortfolioShowcase'))
import './App.css'


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0)
    }
  }, [loading])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { name: 'Sobre',      href: '#sobre' },
    { name: 'Marketing',  href: '#marketing' },
    { name: 'Tecnologia', href: '#tecnologia' },
    { name: 'Portfólio',  href: '#portfolio' },
    { name: 'Processo',   href: '#processo' },
    { name: 'Contato',    href: '#contato' },
  ]

  if (loading) {
    return <RocketPreloader onComplete={() => {
      setLoading(false)
      window.scrollTo(0, 0)
    }} />
  }

  return (
    <div className="app">
      {/* Progress bar */}
      <motion.div
        className="progress-bar"
        style={{
          scaleX,
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '4px',
          background: 'var(--gradient-meta)',
          zIndex: 3000,
          originX: 0
        }}
      />

      {/* SPACE BACKGROUND */}
      <SpaceBackground />

      {/* NAVIGATION */}
      <nav className={`nav-pill-v16 ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="logo">
          <img src="/logo.png" alt="Meta Impulso" style={{ height: '48px' }} />
          <span className="logo-text" style={{ fontWeight: '900', fontSize: '1.35rem', letterSpacing: '0.1em' }}>
            META <span className="text-gradient">IMPULSO</span>
          </span>
        </div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="core-link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="nav-cta">
          <button 
            className="btn-v16 btn-v16-primary" 
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.72rem' }}
            onClick={() => {
              const el = document.getElementById('contato');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            DIAGNÓSTICO DIGITAL
          </button>
        </div>

        <button className="burger-btn" onClick={() => setIsMenuOpen(true)} aria-label="Abrir menu">
          <div className="burger-line" />
          <div className="burger-line" />
          <div className="burger-line" />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(2, 3, 8, 0.98)',
              zIndex: 3000,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '2.5rem',
              padding: '2rem'
            }}
          >
            <button
              style={{ position: 'absolute', top: '28px', right: '28px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={40} />
            </button>

            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                  fontWeight: '900',
                  color: 'white',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-heading)'
                }}
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleNavClick(e, link.href);
                }}
              >
                {link.name}
              </motion.a>
            ))}

            <motion.button
              className="btn-v16 btn-v16-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08 + 0.1 }}
              style={{ marginTop: '1rem', width: '100%', maxWidth: '280px' }}
              onClick={() => {
                setIsMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('contato');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              COMEÇAR AGORA
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ======== HERO (SPLIT LAYOUT) ======== */}
        <section
          className="section-v16"
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px', position: 'relative', overflow: 'hidden' }}
        >
          {/* 🚀 TECH ICONS — hero only, eject on scroll */}
          <HeroTechIcons />
          <div className="container">
            <div className="hero-split-grid">
              {/* Text Left */}
              <motion.div
                className="hero-text-col"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
                style={{ textAlign: 'left' }}
              >
                <h1
                  className="title-lg glow-magenta"
                  style={{
                    lineHeight: '1.05',
                    marginBottom: '1.5rem',
                    textAlign: 'left'
                  }}
                >
                  Acelere o Crescimento da Sua Empresa com{' '}
                  <span className="text-gradient glitch-text" data-text="Marketing Digital">Marketing Digital</span> e{' '}
                  <span className="text-gradient glitch-text" data-text="Tecnologia">Tecnologia</span> de Ponta
                </h1>

                <h2
                  style={{
                    color: 'var(--text-tech)',
                    maxWidth: '650px',
                    marginBottom: '3.5rem',
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
                    lineHeight: '1.7',
                    fontWeight: '400',
                    textAlign: 'left'
                  }}
                >
                  Do tráfego pago de alto impacto ao desenvolvimento de sites e sistemas sob medida integrados com Inteligência Artificial. Sediada em Brasília e com atendimento a nível nacional, estruturamos processos de aquisição digital para gerar previsibilidade e lucro.
                </h2>

                <div className="cta-group" style={{ justifyContent: 'flex-start' }}>
                  <button 
                    className="btn-v16 btn-v16-primary"
                    onClick={() => {
                      const el = document.getElementById('contato');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Diagnóstico Digital <Target size={20} />
                  </button>
                  <a href="#solucoes" className="btn-v16 btn-v16-secondary">
                    Ver Soluções <Boxes size={20} />
                  </a>
                </div>
              </motion.div>

              {/* Rocket Right */}
              <motion.div
                className="hero-rocket-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <RocketShowcase />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======== INFINITE LOGO CAROUSEL ======== */}
        <section className="partners-carousel-section">
          <div className="logos-slide-track">
            {['GOOGLE ADS', 'META ADS', 'REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'TAILWIND CSS', 'IA', 'AUTOMATION'].map((tech, idx) => (
              <div key={idx} className="logo-slide-item">
                <span className="text-gradient" style={{ fontWeight: '900', letterSpacing: '0.15em', fontSize: '0.85rem' }}>{tech}</span>
              </div>
            ))}
            {/* Duplicate list for loop seamless animation */}
            {['GOOGLE ADS', 'META ADS', 'REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'TAILWIND CSS', 'IA', 'AUTOMATION'].map((tech, idx) => (
              <div key={`dup-${idx}`} className="logo-slide-item">
                <span className="text-gradient" style={{ fontWeight: '900', letterSpacing: '0.15em', fontSize: '0.85rem' }}>{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ======== SOBRE ======== */}
        <section id="sobre" className="section-v16">
          <div className="container">
            <div className="sobre-split">
              <motion.div
                className="sobre-text-col"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="title-lg" style={{ textAlign: 'left' }}>
                  Sua Empresa no Topo do Mercado com <br />
                  <motion.span
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    style={{ 
                      display: 'inline-block', 
                      position: 'relative', 
                      cursor: 'default'
                    }}
                  >
                    {/* Shockwave Ring 1 (Magenta) */}
                    <motion.span
                      variants={{
                        hidden: { scale: 0.8, opacity: 0 },
                        visible: {
                          scale: [0.8, 0.8, 1.35],
                          opacity: [0, 0.65, 0],
                          transition: {
                            duration: 0.8,
                            times: [0, 0.3, 1],
                            ease: "easeOut"
                          }
                        }
                      }}
                      style={{
                        position: 'absolute',
                        inset: '-5px -15px',
                        borderRadius: '6px',
                        border: '2px solid var(--magenta-neon)',
                        pointerEvents: 'none',
                        zIndex: -1
                      }}
                    />
                    {/* Shockwave Ring 2 (Orange) */}
                    <motion.span
                      variants={{
                        hidden: { scale: 0.8, opacity: 0 },
                        visible: {
                          scale: [0.8, 0.8, 1.6],
                          opacity: [0, 0.5, 0],
                          transition: {
                            duration: 0.9,
                            times: [0, 0.3, 1],
                            ease: "easeOut",
                            delay: 0.05
                          }
                        }
                      }}
                      style={{
                        position: 'absolute',
                        inset: '-5px -15px',
                        borderRadius: '6px',
                        border: '1.2px solid #FF9F43',
                        pointerEvents: 'none',
                        zIndex: -1
                      }}
                    />
                    {/* Meteor Drop & Impact Vibrating text */}
                    <motion.span
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: -60,
                          scale: 1.4,
                          filter: "blur(6px)"
                        },
                        visible: {
                          opacity: [0, 1, 1, 1, 1, 1, 1, 1],
                          scale: [1.4, 1, 1, 1, 1, 1, 1, 1],
                          filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
                          y: [-60, 0, 6, -5, 3, -2, 1, 0],
                          x: [0, 0, -10, 8, -6, 4, -2, 0],
                          transition: {
                            duration: 0.8,
                            times: [0, 0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 1],
                            ease: "easeOut"
                          }
                        }
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      <span className="text-gradient" style={{ filter: 'drop-shadow(0 0 12px rgba(214, 73, 251, 0.4))' }}>
                        Estratégias Digitais de Alto Impacto
                      </span>
                    </motion.span>
                  </motion.span>
                </h2>
                <div style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: 'var(--text-tech)', lineHeight: '1.8' }}>
                  <p style={{ marginBottom: '1.5rem' }}>
                    A META IMPULSO é uma assessoria de marketing digital e tecnologia sediada em Brasília - DF com atuação a nível nacional. Unimos engenharia de dados, estratégias avançadas de tráfego pago e desenvolvimento de software sob medida para criar ecossistemas de vendas previsíveis.
                  </p>
                  <p style={{ marginBottom: '1.5rem' }}>
                    Desenhamos jornadas de conversão completas: desde o primeiro impacto visual com anúncios no Google ou redes sociais, até a automatização do atendimento com Inteligência Artificial e sistemas integrados de CRM.
                  </p>
                  <p style={{ fontWeight: 'bold', color: 'var(--text-tech)' }}>
                    Nosso foco é dar tração ao seu modelo de negócio, otimizando investimentos e maximizando o seu Retorno sobre o Investimento (ROI).
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="sobre-card-col"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="card-premium" style={{ textAlign: 'center' }}>
                  <Suspense fallback={<div style={{ height: '160px' }} />}>
                    <AboutLogoVfx />
                  </Suspense>
                  <h3 className="title-md">
                    ENGENHARIA E <br />
                    <span className="text-gradient">PERFORMANCE COMERCIAL</span>
                  </h3>
                  <p style={{ color: 'var(--text-tech)', fontSize: '0.9rem', marginTop: '1rem' }}>
                    Decisões orientadas a dados estruturados, telemetria em tempo real e foco obsessivo no Retorno sobre Investimento (ROI).
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======== MARKETING E SOLUÇÕES ======== */}
        <section id="marketing" className="section-v16">
          <div id="solucoes" />
          <div className="container">
            <Suspense fallback={<div style={{ minHeight: '300px' }} />}>
              <ObjectiveSelector />
            </Suspense>
          </div>
        </section>

        {/* ======== TECNOLOGIA E PORTFÓLIO DE PROJETOS ======== */}
        <section id="tecnologia" className="section-v16" style={{ background: 'rgba(15, 23, 42, 0.02)', borderTop: '1px solid rgba(15, 23, 42, 0.06)', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
          <div id="portfolio" />
          <div className="container">
            <Suspense fallback={<div style={{ minHeight: '500px', background: 'rgba(255,255,255,0.7)', borderRadius: '2rem' }} />}>
              <PortfolioShowcase />
            </Suspense>
          </div>
        </section>

        {/* ======== PROCESSO (PLAN DE DECOLAGEM) ======== */}
        <section id="processo" className="section-v16">
          <div className="container">
            <motion.div
              style={{ textAlign: 'center', marginBottom: '5rem' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="title-lg">
                Nosso <span className="text-gradient">Plano de Decolagem</span>
              </h2>
              <p className="subtitle-main">
                Do diagnóstico à escala orbital — como conduzimos seu projeto até o sucesso.
              </p>
            </motion.div>

            {/* ── LAUNCH SEQUENCE TIMELINE ── */}
            <div className="launch-timeline">
              {/* Connector track (background) */}
              <div className="launch-track-bg" />

              {/* Animated fill line */}
              <motion.div
                className="launch-track-fill"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />

              {[
                { num: '01', title: 'Ignição',    desc: 'Diagnóstico e análise aprofundada de oportunidades comerciais.',                color: '#FF9F43' },
                { num: '02', title: 'Vetores',    desc: 'Planejamento e estruturação de estratégias e layouts.',                          color: '#D649FB' },
                { num: '03', title: 'Lançamento', desc: 'Desenvolvimento ágil de websites, campanhas e fluxos de automação.',             color: '#7B2EFF' },
                { num: '04', title: 'Telemetria', desc: 'Análise detalhada de métricas, conversões e otimização constante.',              color: '#0597D8' },
                { num: '05', title: 'Órbita',     desc: 'Escala orientada à máxima performance, vendas e novos mercados.',               color: '#00B4CC' },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  className="launch-step"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Node dot on track */}
                  <div className="launch-node-wrapper">
                    {/* Outer pulse ring */}
                    <motion.div
                      className="launch-node-pulse"
                      style={{ borderColor: p.color }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: [0, 1.6, 1], opacity: [0, 0.6, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.18, ease: 'easeOut' }}
                    />
                    {/* Secondary ring */}
                    <motion.div
                      className="launch-node-pulse launch-node-pulse-2"
                      style={{ borderColor: p.color }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: [0, 2.2, 1.4], opacity: [0, 0.3, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, delay: 0.6 + i * 0.18, ease: 'easeOut' }}
                    />
                    {/* Core node */}
                    <motion.div
                      className="launch-node-core"
                      style={{ background: p.color, boxShadow: `0 0 16px ${p.color}` }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.45 + i * 0.18, type: 'spring', stiffness: 300 }}
                    />
                  </div>

                  {/* Step card */}
                  <motion.div
                    className="launch-card"
                    whileHover={{ y: -8, boxShadow: `0 20px 50px ${p.color}28` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ '--step-color': p.color } as React.CSSProperties}
                  >
                    {/* Number burst */}
                    <motion.div
                      className="launch-num"
                      initial={{ scale: 1.8, opacity: 0, filter: 'blur(8px)' }}
                      whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.55 + i * 0.18, ease: 'easeOut' }}
                      style={{ color: p.color, textShadow: `0 0 20px ${p.color}88` }}
                    >
                      {p.num}
                    </motion.div>


                    <h4 className="title-md" style={{ marginBottom: '0.6rem', fontSize: '1rem' }}>
                      {p.title}
                    </h4>
                    <p style={{ color: 'var(--text-tech)', fontSize: '0.82rem', lineHeight: '1.6' }}>
                      {p.desc}
                    </p>

                    {/* Bottom accent bar */}
                    <motion.div
                      className="launch-card-bar"
                      style={{ background: p.color, boxShadow: `0 0 10px ${p.color}90` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.9 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ======== SEÇÃO CONTATO COM QUIZ ======== */}
        <section id="contato" className="section-v16">
          <div className="container">
            <div className="contato-grid">
              
              {/* Coluna da Esquerda: Informações de Contato */}
              <motion.div 
                className="contato-info-col"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="title-lg contato-info-title">
                  Pronto para <span className="text-gradient">Decolar?</span>
                </h2>
                <p className="contato-info-subtitle" style={{ maxWidth: '480px' }}>
                  Fale com a nossa equipe de engenharia e marketing. Estamos prontos para analisar seu projeto e estruturar sua próxima órbita de vendas.
                </p>

                <div className="contato-info-list">
                  {/* WhatsApp */}
                  <div className="contato-info-item">
                    <div className="contato-info-icon-box">
                      <Phone size={20} />
                    </div>
                    <div className="contato-info-details">
                      <span className="contato-info-label">WHATSAPP COMERCIAL</span>
                      <a 
                        href="https://wa.me/556195011614?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20especialista%20da%20Meta%20Impulso." 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="contato-info-value"
                      >
                        +55 (61) 99501-1614
                      </a>
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="contato-info-item">
                    <div className="contato-info-icon-box">
                      <Mail size={20} />
                    </div>
                    <div className="contato-info-details">
                      <span className="contato-info-label">E-MAIL CORPORATIVO</span>
                      <a href="mailto:metaimpulsobr@gmail.com" className="contato-info-value">
                        metaimpulsobr@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="contato-info-item">
                    <div className="contato-info-icon-box">
                      <MapPin size={20} />
                    </div>
                    <div className="contato-info-details">
                      <span className="contato-info-label">QG ESPACIAL (ENDEREÇO)</span>
                      <span className="contato-info-value">
                        SCN Quadra 4, Bloco B, Asa Norte - Brasília, DF
                      </span>
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="contato-info-item">
                    <div className="contato-info-icon-box">
                      <Clock size={20} />
                    </div>
                    <div className="contato-info-details">
                      <span className="contato-info-label">HORÁRIO DE VOO</span>
                      <span className="contato-info-value">
                        Segunda a Sexta, das 9h às 18h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="contato-social-links">
                  <a href="https://instagram.com/metaimpulso" target="_blank" rel="noopener noreferrer" className="contato-social-icon" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/company/metaimpulso" target="_blank" rel="noopener noreferrer" className="contato-social-icon" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Coluna da Direita: Quiz Diagnóstico */}
              <motion.div 
                className="contato-quiz-col"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Suspense fallback={<div style={{ minHeight: '520px', background: 'rgba(255,255,255,0.7)', borderRadius: '2rem' }} />}>
                  <DiagnosticQuiz />
                </Suspense>
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      {/* FLOATING CONTACT CAPSULE */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        className="floating-capsule"
        onClick={() => {
          const msg = encodeURIComponent("Olá! Gostaria de solicitar um diagnóstico digital e decolar meu projeto com a Meta Impulso.");
          window.open(`https://wa.me/556195011614?text=${msg}`, '_blank');
        }}
      >
        <span className="capsule-pulse" />
        <MessageCircle size={20} color="white" />
        <span className="capsule-text">Decolar Projeto</span>
      </motion.div>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
            <img src="/logo.png" alt="Meta Impulso" loading="lazy" style={{ height: '48px' }} />
              <span className="logo-text" style={{ fontSize: '1.6rem', fontWeight: '950' }}>
                META <span className="text-gradient">IMPULSO</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-tech)', letterSpacing: '0.2em', fontSize: '0.78rem' }}>
              ESTRATÉGIA // TECNOLOGIA // PERFORMANCE_COMERCIAL
            </p>
          </div>

          <div style={{ textAlign: 'center', color: 'rgba(15, 23, 42, 0.35)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            © 2026 META_IMPULSO // BRASÍLIA - DF // MARKETING_DIGITAL // DESENVOLVIMENTO_SOFTWARE // ALL_RIGHTS_RESERVED
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
