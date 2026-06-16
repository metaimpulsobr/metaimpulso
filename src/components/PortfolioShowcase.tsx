import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, TrendingUp } from 'lucide-react'

interface PortfolioItem {
  id: number
  title: string
  client: string
  category: 'trafego' | 'websites' | 'sistemas'
  categoryLabel: string
  stat: string
  statLabel: string
  shortDesc: string
  longDesc: string
  challenge: string
  solution: string
  techStack: string[]
  glowColor: 'magenta' | 'cyan' | 'purple'
  url: string
}

// Mini animated card visual selector component
function MiniCardPreview({ url, glowColor }: { url: string; glowColor: 'magenta' | 'cyan' | 'purple' }) {
  if (url === 'www.voogle.com.br' || url === 'dramarianasimoes.com.br') {
    return (
      <div className={`mini-card-visual glow-${glowColor}`}>
        <div className="mini-browser-bar">
          <div className="mini-dots"><span /><span /><span /></div>
          <div className="mini-url">{url}</div>
        </div>
        <div className="mini-viewport page-scroll-container">
          <div className="simulated-website-mini">
            <div className="mini-web-hero">
              <span className="mini-wh-1" />
              <span className="mini-wh-2" />
            </div>
            <div className="mini-web-cards">
              <span /><span />
            </div>
            <div className="mini-web-text" />
            <div className="mini-web-text" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (url === 'app.voogle.com.br') {
    return (
      <div className={`mini-card-visual glow-${glowColor}`}>
        <div className="mini-browser-bar">
          <div className="mini-dots"><span /><span /><span /></div>
          <div className="mini-url">{url}</div>
        </div>
        <div className="mini-viewport flex-row">
          <div className="mini-sidebar-nav">
            <span /><span /><span />
          </div>
          <div className="mini-dashboard-main">
            <div className="mini-m-row">
              <span /><span />
            </div>
            <div className="mini-chart-area">
              <svg viewBox="0 0 100 40" className="mini-svg-line-chart">
                <path d="M0,40 Q15,10 30,25 T60,5 T90,20 L100,40 Z" fill="rgba(0, 240, 255, 0.05)" />
                <motion.path
                  d="M0,40 Q15,10 30,25 T60,5 T90,20"
                  fill="none"
                  stroke="var(--cyan-neon)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (url === 'crm.voogle.com.br') {
    return (
      <div className={`mini-card-visual glow-${glowColor}`}>
        <div className="mini-browser-bar">
          <div className="mini-dots"><span /><span /><span /></div>
          <div className="mini-url">{url}</div>
        </div>
        <div className="mini-viewport flex-row padding-mini">
          <div className="mini-kanban-col">
            <span className="mini-card-slide-1" />
            <span />
          </div>
          <div className="mini-kanban-col">
            <span className="mini-card-slide-2" />
          </div>
          <div className="mini-kanban-col">
            <span className="mini-card-slide-3" />
          </div>
        </div>
      </div>
    )
  }

  if (url.includes('autoparts')) {
    return (
      <div className={`mini-card-visual glow-${glowColor}`}>
        <div className="mini-radar-mesh">
          <div className="radar-circle rc-1" />
          <div className="radar-circle rc-2" />
          <div className="radar-sweep" />
          <div className="radar-blip rb-1" />
          <div className="radar-blip rb-2" />
        </div>
      </div>
    )
  }

  // Fallback for AI node pulse (purple glow)
  return (
    <div className={`mini-card-visual glow-${glowColor}`}>
      <div className="mini-ai-mesh">
        <div className="ai-core-node" />
        <div className="ai-pulse-ring-1" />
        <div className="ai-pulse-ring-2" />
        <div className="ai-node-connector n-c-1" />
        <div className="ai-node-connector n-c-2" />
        <div className="ai-node-connector n-c-3" />
      </div>
    </div>
  )
}

// Simulated Browser Animation Component
function AnimatedProjectPreview({ url }: { url: string }) {
  if (url === 'www.voogle.com.br') {
    return (
      <div className="browser-mockup glow-cyan">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="browser-address">{url}</div>
        </div>
        <div className="browser-viewport page-scroll-container">
          <div className="simulated-website">
            <div className="sim-hero">
              <div className="sim-logo">VOOGLE</div>
              <div className="sim-tagline">Buscador Inteligente de Leads B2B</div>
              <div className="sim-btn" />
            </div>
            <div className="sim-feature-grid">
              <div className="sim-feature-card">
                <div className="sim-f-icon" />
                <div className="sim-f-line" style={{ width: '80%' }} />
              </div>
              <div className="sim-feature-card">
                <div className="sim-f-icon" />
                <div className="sim-f-line" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="sim-section-dark">
              <div className="sim-dark-title" />
              <div className="sim-dark-line" />
              <div className="sim-dark-line" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (url === 'app.voogle.com.br') {
    return (
      <div className="browser-mockup glow-cyan">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="browser-address">{url}</div>
        </div>
        <div className="browser-viewport flex-row">
          <div className="sim-sidebar">
            <div className="sim-side-logo" />
            <div className="sim-side-item active" />
            <div className="sim-side-item" />
            <div className="sim-side-item" />
          </div>
          <div className="sim-main-content">
            <div className="sim-header-metrics">
              <div className="sim-metric-pill">
                <span className="sim-m-lbl" />
                <span className="sim-m-val" />
              </div>
              <div className="sim-metric-pill">
                <span className="sim-m-lbl" />
                <span className="sim-m-val" />
              </div>
            </div>
            <div className="sim-chart-container">
              <svg viewBox="0 0 300 100" className="sim-svg-chart">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan-neon)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--cyan-neon)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M10,95 Q50,55 100,70 T200,30 T290,10 L290,95 Z" fill="url(#chartGlow)" />
                <motion.path
                  d="M10,95 Q50,55 100,70 T200,30 T290,10"
                  fill="none"
                  stroke="var(--cyan-neon)"
                  strokeWidth="3.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (url === 'crm.voogle.com.br') {
    return (
      <div className="browser-mockup glow-purple">
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="browser-address">{url}</div>
        </div>
        <div className="browser-viewport flex-col">
          <div className="sim-kanban-board">
            <div className="kanban-col">
              <div className="kanban-header">LEADS</div>
              <div className="kanban-card card-slide-1">Voogle Cliente #12</div>
              <div className="kanban-card">AutoParts Lead</div>
            </div>
            <div className="kanban-col">
              <div className="kanban-header">NEGÓCIO</div>
              <div className="kanban-card card-slide-2">Clínica Mariana</div>
            </div>
            <div className="kanban-col">
              <div className="kanban-header">DECOLADO</div>
              <div className="kanban-card card-slide-3" style={{ borderLeft: '3px solid var(--cyan-neon)' }}>FinTech Portal</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback for other projects
  return (
    <div className={`browser-mockup ${url.includes('autoparts') ? 'glow-magenta' : 'glow-cyan'}`}>
      <div className="browser-bar">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-address">{url}</div>
      </div>
      <div className="browser-viewport default-viewport">
        <div className="default-mockup-logo" style={{ color: url.includes('autoparts') ? 'var(--magenta-neon)' : 'var(--cyan-neon)' }}>
          {url.includes('autoparts') ? 'MÓDULO PARTS' : 'MARIANA ODONTO'}
        </div>
        <div className="default-mockup-hud">
          <div className="telemetry-bar" />
          <div className="telemetry-bar" style={{ width: '60%' }} />
          <div className="telemetry-bar" style={{ width: '80%' }} />
        </div>
      </div>
    </div>
  )
}

export default function PortfolioShowcase() {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'trafego' | 'websites' | 'sistemas'>('todos')
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)

  const categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'trafego', label: 'Tráfego Pago' },
    { value: 'websites', label: 'Websites & LPs' },
    { value: 'sistemas', label: 'Sistemas & IA' }
  ]

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      client: 'Buscador de Leads Voogle',
      title: 'Criação de Site Otimizado para SEO',
      category: 'websites',
      categoryLabel: 'WEBSITES & LANDING PAGES',
      stat: '1ª Página do Google',
      statLabel: 'Aparecer no Google sem pagar anúncios',
      shortDesc: 'Criação de site institucional profissional estruturado com as melhores práticas de SEO técnico para atrair milhares de acessos orgânicos e gerar leads comerciais.',
      longDesc: 'Desenvolvimento do portal institucional Voogle com otimização completa de desempenho e metadados, focado em rankeamento SEO e em capturar tráfego de busca de forma gratuita.',
      challenge: 'A marca precisava de um site veloz, moderno e otimizado para o Google que carregasse instantaneamente para reter visitas de potenciais clientes B2B.',
      solution: 'Estruturamos o site utilizando Next.js com renderização no servidor (SSR). Configuramos metatags dinâmicos e otimizamos o desempenho do código para atingir notas acima de 95 no Google PageSpeed Insights.',
      techStack: ['Next.js', 'React', 'TypeScript', 'SEO Técnico', 'Google Analytics'],
      glowColor: 'cyan',
      url: 'www.voogle.com.br'
    },
    {
      id: 2,
      client: 'Painel de Clientes Voogle',
      title: 'Desenvolvimento de Plataforma SaaS',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & INTEGRAÇÕES',
      stat: 'Carregamento < 1s',
      statLabel: 'Velocidade que o cliente e o Google valorizam',
      shortDesc: 'Desenvolvimento de sistema web sob medida de altíssima performance. Painel interativo de gestão de leads com gráficos em tempo real e carregamento instantâneo.',
      longDesc: 'Painel administrativo para clientes assinantes do software Voogle, integrado com APIs de leads e painéis gráficos interativos de alta velocidade.',
      challenge: 'A plataforma precisava receber e processar milhares de requisições de dados em tempo real sem lentidão na tela do usuário.',
      solution: 'Desenvolvemos a área de clientes em React otimizado com conexão via WebSockets. Renderizamos gráficos vetoriais SVG leves que garantem carregamento abaixo de 1 segundo.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'Chart.js'],
      glowColor: 'cyan',
      url: 'app.voogle.com.br'
    },
    {
      id: 3,
      client: 'CRM de Vendas Voogle',
      title: 'Automação Comercial com WhatsApp',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & AUTOMAÇÃO',
      stat: 'Vendas Organizadas',
      statLabel: 'Chega de perder leads no WhatsApp',
      shortDesc: 'Automação de processos comerciais com quadro Kanban integrado de WhatsApp. Controle e organize o atendimento da sua equipe e feche mais negócios.',
      longDesc: 'Desenvolvimento de CRM de vendas personalizado com funil Kanban dinâmico, multiatendimento e disparos automatizados integrados diretamente.',
      challenge: 'A equipe comercial do cliente utilizava planilhas manuais e celulares separados, gerando atrasos no atendimento e perda frequente de negócios.',
      solution: 'Criamos um sistema web Kanban com recurso de arrastar e soltar (Drag-and-drop), integrado com uma API unificada de envio de mensagens no WhatsApp e triagem de dados.',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Framer Motion', 'API WhatsApp'],
      glowColor: 'purple',
      url: 'crm.voogle.com.br'
    },
    {
      id: 4,
      client: 'E-commerce AutoParts',
      title: 'Gestão de Tráfego Pago e Performance',
      category: 'trafego',
      categoryLabel: 'TRÁFEGO & MARKETING',
      stat: 'R$ 5,20 de Retorno',
      statLabel: 'Para cada R$ 1,00 investido em anúncios',
      shortDesc: 'Gestão de tráfego pago altamente segmentada no Google Ads e Meta Ads (Instagram/Facebook) focada em acelerar vendas e otimizar o ROI de lojas virtuais.',
      longDesc: 'Configuração e otimização diária de campanhas de anúncios patrocinados, com pixel de conversão integrado e públicos direcionados para aumento direto no faturamento.',
      challenge: 'A loja virtual de autopeças sofria com custos de aquisição de clientes (CPA) muito altos e falta de retorno claro dos investimentos em publicidade.',
      solution: 'Implementamos rastreamento de dados de servidor (Server-side API), reestruturamos as campanhas de Google Shopping e rodamos criativos em vídeo focados em públicos compradores específicos.',
      techStack: ['Google Ads', 'Meta Ads', 'Server-Side API', 'Looker Studio', 'Copywriting'],
      glowColor: 'magenta',
      url: 'modulo.autoparts.com.br'
    },
    {
      id: 5,
      client: 'Clínica Dra. Mariana Simões',
      title: 'Landing Page de Alta Conversão',
      category: 'websites',
      categoryLabel: 'WEBSITES & LANDING PAGES',
      stat: '22% de Conversão',
      statLabel: 'A cada 100 visitas, 22 chamam no WhatsApp',
      shortDesc: 'Desenvolvimento de landing page profissional estruturada especificamente para atração e conversão de pacientes de alto padrão em clínicas e consultórios.',
      longDesc: 'Landing Page estética de alta performance, contendo design limpo, depoimentos reais, prova social estruturada e foco total no agendamento de consultas pelo WhatsApp.',
      challenge: 'O site institucional anterior convertia menos de 3% das visitas geradas pelas redes sociais, desperdiçando o orçamento de publicidade da clínica.',
      solution: 'Nova Landing Page ultraveloz com carregamento instantâneo, gatilhos mentais estruturados, design premium focado em credibilidade e botão de contato em destaque.',
      techStack: ['HTML5', 'Vanilla CSS', 'JavaScript', 'Google Tag Manager', 'Copywriting'],
      glowColor: 'cyan',
      url: 'dramarianasimoes.com.br'
    },
    {
      id: 6,
      client: 'IA Commerce Pilot',
      title: 'Inteligência Artificial de Vendas',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & INTELIGÊNCIA ARTIFICIAL',
      stat: 'Atendimento 24h por Dia',
      statLabel: 'IA atende e qualifica clientes sozinha',
      shortDesc: 'Implementação de assistente virtual inteligente integrado ao WhatsApp para fazer a triagem automática de leads, tirar dúvidas técnicas e agendar reuniões.',
      longDesc: 'Criação de agente autônomo baseado em Inteligência Artificial treinado com as informações específicas da empresa para atuar no atendimento de leads em tempo integral.',
      challenge: 'Os vendedores de campo perdiam muito tempo respondendo a dúvidas repetitivas ou qualificando leads sem perfil de compra real.',
      solution: 'Integramos um agente inteligente de IA (baseado na API da OpenAI) conectado ao WhatsApp. O robô atende de forma natural, qualifica o lead e registra tudo no CRM automaticamente.',
      techStack: ['OpenAI API', 'Node.js', 'WhatsApp Business API', 'CRM Integration', 'Webhooks'],
      glowColor: 'purple',
      url: 'ia.commercepilot.com'
    }
  ]

  const filteredItems = activeFilter === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter)

  const openModal = (project: PortfolioItem) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  const handleModalCTA = () => {
    closeModal()
    // Scroll smoothly to diagnostic quiz section
    setTimeout(() => {
      const el = document.getElementById('contato')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div id="portfolio" className="portfolio-section">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="title-lg">
          Nossos <span className="text-gradient">Casos de Sucesso</span>
        </h2>
        <p className="subtitle-main">
          Conheça os sites profissionais, campanhas de tráfego pago e automações de vendas que desenvolvemos para acelerar negócios.
        </p>

        {/* Category Filters */}
        <div className="portfolio-filters">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value as any)}
              className={`portfolio-filter-btn ${activeFilter === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <motion.div 
        layout 
        className="portfolio-grid grid-responsive"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            let glowClass = 'card-glow-purple'
            let accentColor = 'var(--purple-text)'
            
            if (item.glowColor === 'cyan') {
              glowClass = 'card-glow-cyan'
              accentColor = 'var(--cyan-text)'
            } else if (item.glowColor === 'magenta') {
              glowClass = 'card-glow-magenta'
              accentColor = 'var(--magenta-text)'
            }

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => openModal(item)}
                className={`portfolio-card ${glowClass}`}
                whileHover={{ 
                  y: -10,
                  boxShadow: item.glowColor === 'cyan'
                    ? '0 15px 40px rgba(0, 240, 255, 0.15), inset 0 0 10px rgba(0, 240, 255, 0.1)'
                    : item.glowColor === 'magenta'
                    ? '0 15px 40px rgba(214, 73, 251, 0.15), inset 0 0 10px rgba(214, 73, 251, 0.1)'
                    : '0 15px 40px rgba(123, 46, 255, 0.15), inset 0 0 10px rgba(123, 46, 255, 0.1)'
                }}
              >
                {/* 🎨 NEW MINI ANIMATED SCREEN */}
                <MiniCardPreview url={item.url} glowColor={item.glowColor} />

                {/* HUD Header */}
                <div className="card-telemetry" style={{ marginTop: '1.25rem' }}>
                  <span>CASE_PROTOCOL::0{item.id}</span>
                  <span className="dot" style={{ backgroundColor: accentColor }} />
                </div>

                <span className="card-seo-tag" style={{ color: accentColor, marginBottom: '0.25rem' }}>
                  {item.categoryLabel}
                </span>

                <h3 className="title-md portfolio-card-title" style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.2rem', lineHeight: '1.3' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tech)', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Cliente: {item.client}
                </div>

                {/* Big Stat Showcase */}
                <div className="text-gradient portfolio-card-stat" style={{ fontSize: '2rem', fontWeight: '950', margin: '0.5rem 0 0.2rem', lineHeight: '1.1' }}>
                  {item.stat}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: '#0F172A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '1.25rem', lineHeight: '1.3' }}>
                  {item.statLabel}
                </div>

                <p className="portfolio-card-desc" style={{ color: 'var(--text-tech)', fontSize: '0.84rem', lineHeight: '1.6', flexGrow: 1 }}>
                  {item.shortDesc}
                </p>

                {/* Action details */}
                <div className="portfolio-card-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: '700', color: accentColor }}>
                  <span>Ver Como Fizemos Isso</span>
                  <ArrowUpRight size={14} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Details Dialog Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="portfolio-modal-overlay">
            {/* Clickable dark backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="portfolio-modal-bg"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="portfolio-modal-box"
              style={{ border: `1px solid ${selectedProject.glowColor === 'cyan' ? 'var(--cyan-neon)' : selectedProject.glowColor === 'magenta' ? 'var(--magenta-neon)' : 'var(--purple-cosmic)'}` }}
            >
              {/* Close Button */}
              <button onClick={closeModal} className="portfolio-modal-close" aria-label="Fechar modal">
                <X size={24} />
              </button>

              {/* Modal Contents */}
              <div className="portfolio-modal-content">
                
                {/* Left Side Visual Representation */}
                <div className="portfolio-modal-left">
                  <AnimatedProjectPreview url={selectedProject.url} />
                  
                  <div className="modal-telemetry-metrics">
                    <div className="metric-box">
                      <TrendingUp size={24} className="metric-icon" />
                      <div className="metric-value">{selectedProject.stat}</div>
                      <div className="metric-label">{selectedProject.statLabel}</div>
                    </div>
                  </div>

                  <div className="modal-tech-stack">
                    <h4>Tecnologias Utilizadas</h4>
                    <div className="tech-badges">
                      {selectedProject.techStack.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side Descriptions */}
                <div className="portfolio-modal-right">
                  <span className="modal-seo-tag" style={{ color: selectedProject.glowColor === 'cyan' ? 'var(--cyan-text)' : selectedProject.glowColor === 'magenta' ? 'var(--magenta-text)' : 'var(--purple-text)' }}>
                    {selectedProject.categoryLabel}
                  </span>
                  
                  <h3 className="title-lg" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '0.5rem 0 1.5rem', lineHeight: '1.2' }}>
                    {selectedProject.title}
                  </h3>
                  <div style={{ fontSize: '1rem', color: 'var(--text-tech)', fontWeight: '700', marginBottom: '1.5rem', marginTop: '-1rem' }}>
                    Projeto desenvolvido para: {selectedProject.client}
                  </div>

                  <div className="modal-description-section">
                    <h4>Visão Geral</h4>
                    <p>{selectedProject.longDesc}</p>
                  </div>

                  <div className="modal-description-section">
                    <h4>O Desafio</h4>
                    <p>{selectedProject.challenge}</p>
                  </div>

                  <div className="modal-description-section">
                    <h4>Nossa Solução</h4>
                    <p>{selectedProject.solution}</p>
                  </div>

                  {/* Modal CTA */}
                  <button 
                    onClick={handleModalCTA}
                    className="btn-v16 btn-v16-primary modal-cta-btn"
                    style={{ width: '100%', marginTop: '2rem' }}
                  >
                    SOLICITAR PROJETO SIMILAR
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
