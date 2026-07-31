import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, TrendingUp, ExternalLink, Code, Globe } from 'lucide-react'

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
  githubUrl?: string
  vercelUrl?: string
  isOnline?: boolean
}

// Mini animated card visual selector component
function MiniCardPreview({ url, glowColor }: { url: string; glowColor: 'magenta' | 'cyan' | 'purple' }) {
  if (url.includes('voogle.com.br') && !url.includes('crm') && !url.includes('app') && !url.includes('operator')) {
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

  if (url.includes('app.voogle')) {
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

  if (url.includes('crm')) {
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

  if (url.includes('operator') || url.includes('apresenta')) {
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
  if (url.includes('voogle.com.br') && !url.includes('crm') && !url.includes('app') && !url.includes('operator')) {
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

  if (url.includes('app.voogle')) {
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

  if (url.includes('crm')) {
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
    <div className={`browser-mockup ${url.includes('centralfarma') ? 'glow-magenta' : 'glow-cyan'}`}>
      <div className="browser-bar">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-address">{url}</div>
      </div>
      <div className="browser-viewport default-viewport">
        <div className="default-mockup-logo" style={{ color: url.includes('centralfarma') ? 'var(--magenta-neon)' : 'var(--cyan-neon)' }}>
          {url.includes('centralfarma') ? 'DROGARIA CENTRAL FARMA' : 'META IMPULSO SUITE'}
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
      client: 'Grupo Voogle (Portal Corporativo)',
      title: 'Portal Institucional & Inteligência B2B',
      category: 'websites',
      categoryLabel: 'WEBSITES & PORTAIS',
      stat: '1ª Página do Google',
      statLabel: 'SEO Orgânico de Alto Desempenho',
      shortDesc: 'Desenvolvimento do portal corporativo do Grupo Voogle em Next.js com SEO técnico e velocidade de carregamento instantânea.',
      longDesc: 'Construção do portal de comunicação corporativa do Grupo Voogle com renderização no servidor (SSR) e arquitetura de dados otimizada para capturar tráfego de busca qualificado.',
      challenge: 'A marca necessitava de uma presença web autoritária, moderna e perfeitamente otimizada para rankear nos motores de busca e converter visitantes B2B.',
      solution: 'Desenvolvemos a estrutura em Next.js e TypeScript com metadados estruturados dinâmicos, garantindo pontuação máxima de performance no Google PageSpeed Insights.',
      techStack: ['Next.js', 'React', 'TypeScript', 'SEO Técnico', 'Tailwind CSS'],
      glowColor: 'cyan',
      url: 'voogle-institucional.vercel.app',
      vercelUrl: 'https://voogle-institucional.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-institucional',
      isOnline: true
    },
    {
      id: 2,
      client: 'Voogle CRM Commercial Suite',
      title: 'Plataforma CRM Omnichannel com Kanban',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & AUTOMAÇÃO',
      stat: '+350% de Produtividade',
      statLabel: 'Organização do Funil Comercial via WhatsApp',
      shortDesc: 'Desenvolvimento de software CRM customizado com funil de vendas Kanban, multiatendimento e automação de acompanhamento comercial.',
      longDesc: 'Plataforma corporativa de gestão comercial com acompanhamento de leads em tempo real, relatórios de conversão e integração direta ao WhatsApp.',
      challenge: 'As equipes comerciais perdiam leads por falta de histórico de conversas e desorganização no acompanhamento dos potenciais clientes.',
      solution: 'Criamos um ecossistema CRM web com visualização Kanban drag-and-drop, centralização de chats em tempo real e relatórios analíticos em tempo real.',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'API WhatsApp', 'WebSockets'],
      glowColor: 'purple',
      url: 'voogle-crm.vercel.app',
      vercelUrl: 'https://voogle-crm.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-crm',
      isOnline: true
    },
    {
      id: 3,
      client: 'Voogle Credit System (FinTech)',
      title: 'Sistema de Análise e Esteira de Crédito',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & FINTECH',
      stat: 'Aprovação em < 3min',
      statLabel: 'Automação da Análise Cadastral e Risco',
      shortDesc: 'Plataforma web de alta segurança para triagem financeira, cálculo de score de crédito e automação da esteira de aprovação.',
      longDesc: 'Desenvolvimento do sistema corporativo de crédito da Voogle com checagem automática de dados, validação de documentos e esteira de decisão em tempo real.',
      challenge: 'Análises manuais de crédito geravam filas de espera demoradas e riscos operacionais nas operações de financiamento.',
      solution: 'Estruturamos um motor de regras de crédito automatizado que cruza dados e calcula o score de aprovação instantaneamente para os operadores.',
      techStack: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      glowColor: 'cyan',
      url: 'voogle-credit-system.vercel.app',
      vercelUrl: 'https://voogle-credit-system.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-credit-system',
      isOnline: true
    },
    {
      id: 4,
      client: 'Voogle Infinity Club',
      title: 'Portal de Membros & Clube de Benefícios',
      category: 'websites',
      categoryLabel: 'WEBSITES & ÁREA DE MEMBROS',
      stat: '+12.000 Membros',
      statLabel: 'Engajamento e Retenção Ativa de Clientes',
      shortDesc: 'Desenvolvimento de portal exclusivo de membros com cupons dinâmicos, programa de vantagens e carteira de benefícios.',
      longDesc: 'Plataforma interativa desenvolvida para o programa de fidelidade Voogle Infinity Club com resgate de vouchers e parcerias estratégicas.',
      challenge: 'Criar uma experiência fluida no celular para milhares de associados acessarem seus descontos e vouchers sem travamentos.',
      solution: 'Desenvolvemos a aplicação PWA leve e ultra-responsiva integrada com banco de dados em tempo real e sistema de validação via QR Code.',
      techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Redis', 'PWA'],
      glowColor: 'magenta',
      url: 'voogle-infinityclub.vercel.app',
      vercelUrl: 'https://voogle-infinityclub.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-infinityclub',
      isOnline: true
    },
    {
      id: 5,
      client: 'Voogle Operator AI',
      title: 'Agente de Inteligência Artificial para Atendimento',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & IA',
      stat: 'Atendimento 24h por Dia',
      statLabel: 'Triagem e Qualificação Automática por IA',
      shortDesc: 'Assistente inteligente baseado em IA treinado com a base de dados da empresa para atendimento, triagem e agendamento automático de clientes.',
      longDesc: 'Implementação de agente autônomo de Inteligência Artificial conectado ao WhatsApp e chat web corporativo para qualificar contatos e direcionar leads.',
      challenge: 'Atender centenas de mensagens diárias fora do horário comercial com respostas precisas e humanas.',
      solution: 'Integramos modelos de linguagem natural (LLM) avançados configurados com a base de conhecimento da empresa e webhook direto com o CRM.',
      techStack: ['OpenAI API', 'Node.js', 'WebSockets', 'WhatsApp Business API', 'Docker'],
      glowColor: 'purple',
      url: 'voogle-operator.vercel.app',
      vercelUrl: 'https://voogle-operator.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-operator',
      isOnline: true
    },
    {
      id: 6,
      client: 'Voogle Academy',
      title: 'Plataforma EAD & Treinamento Comercial',
      category: 'sistemas',
      categoryLabel: 'SISTEMAS & EAD',
      stat: '+1.500 Alunos',
      statLabel: 'Capacitação Contínua de Equipes de Vendas',
      shortDesc: 'Plataforma de ensino a distância sob medida para treinamento de consultores, streaming de vídeos e gestão de certificados.',
      longDesc: 'Ambiente EAD customizado para formação de times de vendas com trilhas de aprendizagem, avaliações práticas e relatórios de progresso.',
      challenge: 'Garantir a reprodução fluida de videoaulas em qualquer conexão de internet e acompanhar o desempenho dos colaboradores.',
      solution: 'Desenvolvemos a plataforma com reprodutor de vídeo adaptativo HLS e dashboard analítico para os gestores acompanharem o aprendizado.',
      techStack: ['React', 'TypeScript', 'Node.js', 'AWS S3', 'GraphQL'],
      glowColor: 'cyan',
      url: 'voogle-academy.vercel.app',
      vercelUrl: 'https://voogle-academy.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-academy',
      isOnline: true
    },
    {
      id: 7,
      client: 'Voogle Seguros & Consultoria',
      title: 'Gestão de Tráfego Pago & Performance',
      category: 'trafego',
      categoryLabel: 'TRÁFEGO & MARKETING',
      stat: 'R$ 6,80 de Retorno',
      statLabel: 'Para cada R$ 1,00 investido em anúncios',
      shortDesc: 'Gestão estratégica de tráfego pago no Google Ads e Meta Ads focada em capturar clientes em busca de apólices e consultoria de seguros.',
      longDesc: 'Estruturação de campanhas de alta intenção de busca no Google e criativos patrocinados de alta conversão no Instagram/Facebook.',
      challenge: 'Reduzir o Custo por Lead (CPL) no mercado altamente competitivo de seguros e aumentar a taxa de fechamento de contratos.',
      solution: 'Implementamos páginas de captura ultralógicas combinadas com anúncios direcionados por palavra-chave de alta intenção e remarketing estratégico.',
      techStack: ['Google Ads', 'Meta Ads', 'Google Tag Manager', 'Looker Studio', 'Copywriting'],
      glowColor: 'magenta',
      url: 'voogle-seguros.vercel.app',
      vercelUrl: 'https://voogle-seguros.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/voogle-seguros-e-consultoria',
      isOnline: true
    },
    {
      id: 8,
      client: 'Dom Delivery & Drogaria Central Farma',
      title: 'Plataforma de Pedidos & E-Commerce',
      category: 'websites',
      categoryLabel: 'WEBSITES & E-COMMERCE',
      stat: '28% de Conversão',
      statLabel: 'Compras Rápidas com Checkout no WhatsApp',
      shortDesc: 'Desenvolvimento de plataforma de vendas e e-commerce ultraveloz otimizado para compras no celular e disparo direto de pedidos.',
      longDesc: 'Construção de catálogo digital responsivo para farmacêutica e delivery com sistema de carrinho inteligente e checkout simplificado.',
      challenge: 'Simplificar o processo de compra do cliente em pouquíssimos toques sem necessidade de cadastros extensos.',
      solution: 'Criamos um catálogo PWA leve com busca instantânea de produtos e envio automático de pedido pré-formatado via WhatsApp.',
      techStack: ['Next.js', 'React', 'Tailwind CSS', 'PWA', 'WhatsApp Checkout'],
      glowColor: 'cyan',
      url: 'dom-delivery.vercel.app',
      vercelUrl: 'https://dom-delivery.vercel.app',
      githubUrl: 'https://github.com/metaimpulsobr/meta-impulso-Dom-Delivery',
      isOnline: true
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
          Conheça os sistemas corporativos, portais interativos e plataformas digitais reais que desenvolvemos e colocamos no ar.
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
            let glowClass = 'glow-purple'
            let accentColor = 'var(--purple-text)'
            
            if (item.glowColor === 'cyan') {
              glowClass = 'glow-cyan'
              accentColor = 'var(--cyan-text)'
            } else if (item.glowColor === 'magenta') {
              glowClass = 'glow-magenta'
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
                {/* 🎨 MINI ANIMATED SCREEN */}
                <MiniCardPreview url={item.url} glowColor={item.glowColor} />

                {/* HUD Header */}
                <div className="card-telemetry" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>CASE_PROTOCOL::0{item.id}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {item.isOnline && (
                      <span style={{ fontSize: '0.6rem', background: 'rgba(0, 240, 255, 0.12)', color: 'var(--cyan-text)', border: '1px solid rgba(0, 240, 255, 0.3)', padding: '0.1rem 0.45rem', borderRadius: '100px', fontWeight: 'bold' }}>
                        ● ONLINE
                      </span>
                    )}
                    <span className="dot" style={{ backgroundColor: accentColor }} />
                  </div>
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
                  <span>Ver Detalhes do Projeto</span>
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

                  {/* Modal Action Buttons: Vercel & GitHub */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                    {selectedProject.vercelUrl && (
                      <a
                        href={selectedProject.vercelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-v16 btn-v16-primary"
                        style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                      >
                        <Globe size={18} /> VER PROJETO <ExternalLink size={16} />
                      </a>
                    )}

                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-v16 btn-v16-secondary"
                        style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                      >
                        <Code size={18} /> CÓDIGO NO GITHUB <ExternalLink size={16} />
                      </a>
                    )}

                    <button 
                      onClick={handleModalCTA}
                      className="btn-v16 btn-v16-secondary"
                      style={{ width: '100%', background: 'rgba(214, 73, 251, 0.06)', borderColor: 'var(--magenta-neon)', justifyContent: 'center' }}
                    >
                      SOLICITAR PROJETO SIMILAR
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
