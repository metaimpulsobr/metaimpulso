import { motion } from 'framer-motion'
import { Target, Layout, Fingerprint, Workflow, Cpu, Share2, Search, Code, ArrowUpRight } from 'lucide-react'

interface Objective {
  title: string
  desc: string
  icon: React.ReactNode
  tag: string
  color: 'magenta' | 'cyan' | 'purple'
  whatsappMsg: string
}

export default function ObjectiveSelector() {
  const objectives: Objective[] = [
    {
      title: 'Gestão de Tráfego Pago',
      desc: 'Campanhas de alta performance no Google Ads, Meta Ads e TikTok Ads estrategicamente configuradas para gerar leads qualificados e vendas recorrentes.',
      icon: <Target size={28} />,
      tag: 'TRAFEGO_PAGO',
      color: 'magenta',
      whatsappMsg: 'Olá! Gostaria de alavancar minhas vendas com a Gestão de Tráfego Pago da Meta Impulso.'
    },
    {
      title: 'Criação de Sites e Landing Pages',
      desc: 'Desenvolvimento de landing pages focadas em conversão, sites institucionais otimizados para SEO e e-commerces ultravelozes com design premium.',
      icon: <Layout size={28} />,
      tag: 'WEBSITES_LPS',
      color: 'cyan',
      whatsappMsg: 'Olá! Gostaria de desenvolver um site ou landing page de alta conversão com a Meta Impulso.'
    },
    {
      title: 'Branding e Identidade Visual',
      desc: 'Criação de marcas memoráveis, logos corporativos e projetos de identidade visual completos para transmitir autoridade e valor ao mercado.',
      icon: <Fingerprint size={28} />,
      tag: 'BRANDING_LOGO',
      color: 'purple',
      whatsappMsg: 'Olá! Quero criar ou modernizar a identidade visual da minha marca com a Meta Impulso.'
    },
    {
      title: 'Automação Comercial e CRM',
      desc: 'Integração de sistemas de CRM, funis de atendimento via WhatsApp e automações de processos operacionais para multiplicar a produtividade comercial.',
      icon: <Workflow size={28} />,
      tag: 'AUTOMACAO_CRM',
      color: 'magenta',
      whatsappMsg: 'Olá! Gostaria de automatizar os processos de atendimento e vendas da minha empresa com a Meta Impulso.'
    },
    {
      title: 'Soluções de Inteligência Artificial',
      desc: 'Implementação de assistentes virtuais inteligentes, triagem automática de leads e agentes autônomos de IA integrados à sua operação diária.',
      icon: <Cpu size={28} />,
      tag: 'IA_OPERACIONAL',
      color: 'cyan',
      whatsappMsg: 'Olá! Tenho interesse em implementar soluções de Inteligência Artificial nas operações do meu negócio.'
    },
    {
      title: 'Social Media Estratégico',
      desc: 'Gestão estratégica de redes sociais (Instagram, LinkedIn) com criativos profissionais de alto impacto visual e textual para atrair e reter clientes.',
      icon: <Share2 size={28} />,
      tag: 'SOCIAL_MEDIA',
      color: 'purple',
      whatsappMsg: 'Olá! Gostaria de contratar a gestão de redes sociais com foco estratégico da Meta Impulso.'
    },
    {
      title: 'SEO (Otimização para o Google)',
      desc: 'Otimização técnica estrutural e de conteúdo para rankear seu site no topo do Google de forma orgânica, atraindo leads altamente qualificados sem custo de mídia.',
      icon: <Search size={28} />,
      tag: 'SEO_GOOGLE',
      color: 'magenta',
      whatsappMsg: 'Olá! Quero otimizar meu posicionamento orgânico e rankear meu site no Google com a Meta Impulso.'
    },
    {
      title: 'Desenvolvimento de Software',
      desc: 'Construção de aplicações web customizadas, painéis administrativos (dashboards), e-commerces robustos e soluções digitais sob medida para a sua operação.',
      icon: <Code size={28} />,
      tag: 'SISTEMAS_WEB',
      color: 'cyan',
      whatsappMsg: 'Olá! Tenho a necessidade de desenvolver um software sob medida e gostaria de fazer um diagnóstico.'
    }
  ]

  const handleSelect = (msg: string) => {
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/556195011614?text=${encoded}`, '_blank')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="objective-selector-section">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="title-lg" style={{ fontSize: 'clamp(1.6rem, 3.3vw, 3rem)' }}>
          Qual <span className="text-gradient">combustível de escala</span> sua empresa <span style={{ whiteSpace: 'nowrap' }}>precisa hoje?</span>
        </h2>
        <p className="subtitle-main" style={{ maxWidth: '650px' }}>
          Selecione a órbita de crescimento desejada para iniciar a decolagem do seu negócio imediata.
        </p>
      </div>

      <motion.div 
        className="objective-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
      >
        {objectives.map((obj, i) => {
          let borderGlowClass = 'card-glow-purple'
          let iconColor = 'var(--magenta-text)'
          
          if (obj.color === 'cyan') {
            borderGlowClass = 'card-glow-cyan'
            iconColor = 'var(--cyan-text)'
          } else if (obj.color === 'purple') {
            borderGlowClass = 'card-glow-purple'
            iconColor = 'var(--purple-text)'
          }

          return (
            <motion.div
              key={i}
              variants={itemVariants}
              onClick={() => handleSelect(obj.whatsappMsg)}
              className={`objective-card ${borderGlowClass}`}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                boxShadow: obj.color === 'cyan' 
                  ? '0 15px 40px rgba(0, 240, 255, 0.15), inset 0 0 10px rgba(0, 240, 255, 0.1)'
                  : '0 15px 40px rgba(214, 73, 251, 0.15), inset 0 0 10px rgba(214, 73, 251, 0.1)'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Telemetry coordinate header */}
              <div className="card-telemetry">
                <span>SYS_OP::{obj.tag}</span>
                <span className="dot" style={{ backgroundColor: iconColor }} />
              </div>

              {/* Icon assembly */}
              <div className="objective-icon-wrapper" style={{ color: iconColor }}>
                {obj.icon}
              </div>

              <h3 className="title-md objective-title" style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
                {obj.title}
              </h3>

              <p className="objective-desc" style={{ fontSize: '0.88rem', color: 'var(--text-tech)', lineHeight: '1.6', flexGrow: 1 }}>
                {obj.desc}
              </p>

              {/* Action indicator */}
              <div className="objective-action">
                <span>Decolar Solução</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
