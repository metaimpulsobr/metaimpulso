import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Layout, Workflow, Cpu, HelpCircle, User, Phone, Mail, ArrowLeft, ArrowRight, Rocket, CheckCircle2 } from 'lucide-react'

interface QuizData {
  companyName: string
  objective: string
  revenue: string
  budget: string
  userName: string
  userPhone: string
  userEmail: string
}

const INITIAL_DATA: QuizData = {
  companyName: '',
  objective: '',
  revenue: '',
  budget: '',
  userName: '',
  userPhone: '',
  userEmail: '',
}

export default function DiagnosticQuiz() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<QuizData>(INITIAL_DATA)
  const [loadingTextIndex, setLoadingTextIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [error, setError] = useState('')

  const objectives = [
    { label: 'Gestão de Tráfego Pago', icon: <Target size={22} />, desc: 'Aumentar vendas, leads e visibilidade no Google/Meta.' },
    { label: 'Novo Website / Landing Page', icon: <Layout size={22} />, desc: 'Páginas velozes de alta conversão e design premium.' },
    { label: 'Automação Comercial / CRM', icon: <Workflow size={22} />, desc: 'Otimizar o funil de atendimento e processos.' },
    { label: 'Soluções de Inteligência Artificial', icon: <Cpu size={22} />, desc: 'Integrar agentes inteligentes e chatbots à operação.' },
    { label: 'Outro / Solução Customizada', icon: <HelpCircle size={22} />, desc: 'Desenvolvimento de software ou outras estratégias.' }
  ]

  const revenues = [
    'Até R$ 10k / mês',
    'R$ 10k a R$ 50k / mês',
    'R$ 50k a R$ 200k / mês',
    'Acima de R$ 200k / mês'
  ]

  const budgets = [
    'Até R$ 1.500 / mês',
    'R$ 1.500 a R$ 5.000 / mês',
    'R$ 5.000 a R$ 15.000 / mês',
    'Acima de R$ 15.000 / mês'
  ]

  const loadingSteps = [
    'Inicializando telemetria de negócios...',
    'Escaneando gargalos de captação digital...',
    'Calculando vetores de aceleração comercial...',
    'Mapeando soluções sob medida de IA e tráfego...',
    'Planilha de voo estruturada com sucesso!'
  ]

  // Animate processing step texts
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            // Auto advance to final step after processing
            setTimeout(() => {
              setDirection(1)
              setStep(7)
            }, 800)
            return prev
          }
        })
      }, 700)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleNext = () => {
    setError('')
    if (step === 1 && !formData.companyName.trim()) {
      setError('Por favor, informe o nome da sua empresa.')
      return
    }
    if (step === 2 && !formData.objective) {
      setError('Por favor, selecione um objetivo.')
      return
    }
    if (step === 3 && !formData.revenue) {
      setError('Por favor, selecione uma faixa de faturamento.')
      return
    }
    if (step === 4 && !formData.budget) {
      setError('Por favor, selecione o orçamento disponível.')
      return
    }
    if (step === 5) {
      if (!formData.userName.trim()) {
        setError('Por favor, informe seu nome.')
        return
      }
      if (!formData.userPhone.trim()) {
        setError('Por favor, informe seu WhatsApp.')
        return
      }
      if (!formData.userEmail.trim()) {
        setError('Por favor, informe seu e-mail.')
        return
      }
    }

    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const handlePrev = () => {
    setError('')
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  const handleRestart = () => {
    setFormData(INITIAL_DATA)
    setLoadingTextIndex(0)
    setStep(1)
    setError('')
  }

  const sendToWhatsApp = () => {
    const phone = '556195011614' // Target phone number (Brasília)
    const text = `🚀 *NOVO DIAGNÓSTICO DIGITAL SOLICITADO*

🏢 *Empresa:* ${formData.companyName}
🎯 *Objetivo:* ${formData.objective}
📊 *Faturamento:* ${formData.revenue}
💰 *Verba p/ Investimento:* ${formData.budget}

👤 *Contato:* ${formData.userName}
✉️ *E-mail:* ${formData.userEmail}
📱 *WhatsApp:* ${formData.userPhone}

_Gerado automaticamente pelo Portal Meta Impulso_`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const totalSteps = 5
  const progressPercent = step <= totalSteps ? (step / totalSteps) * 100 : 100

  // Framer Motion slide animation configs
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' as const }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' as const }
    })
  }

  return (
    <div id="diagnostico-quiz" className="quiz-panel card-premium glow-magenta" style={{ border: '1px solid var(--magenta-neon)' }}>
      {/* HUD Telemetry Top Header */}
      <div className="card-telemetry" style={{ marginBottom: '1.5rem' }}>
        <span>DIAGNOSTIC_PROTOCOL::V1.6</span>
        {step <= totalSteps ? (
          <span className="quiz-step-indicator">PASSO {step} DE {totalSteps}</span>
        ) : (
          <span className="quiz-step-indicator" style={{ color: 'var(--cyan-text)' }}>
            {step === 6 ? 'PROCESSANDO_TELEMETRIA' : 'SISTEMA_PRONTO'}
          </span>
        )}
      </div>

      {/* Progress Bar (Only show on input steps) */}
      {step <= totalSteps && (
        <div className="quiz-progress-track">
          <motion.div 
            className="quiz-progress-bar" 
            style={{ width: `${progressPercent}%` }}
            layoutId="progress"
          />
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="quiz-error-alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Contents wrapper */}
      <div className="quiz-step-container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="quiz-slide-content"
          >
            {/* STEP 1: Company Name */}
            {step === 1 && (
              <div className="quiz-step">
                <h3 className="title-md">Qual é o nome da sua empresa?</h3>
                <p className="quiz-helper">Para iniciarmos a varredura e mapeamento de marca.</p>
                <div className="quiz-input-wrapper">
                  <input
                    type="text"
                    placeholder="Ex: Minha Empresa LTDA"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className="quiz-input-text"
                    autoFocus
                  />
                  <div className="input-focus-line" />
                </div>
              </div>
            )}

            {/* STEP 2: Main Objective */}
            {step === 2 && (
              <div className="quiz-step">
                <h3 className="title-md">Qual é o seu principal objetivo hoje?</h3>
                <p className="quiz-helper">Selecione o vetor de tração que seu negócio precisa.</p>
                <div className="quiz-options-grid">
                  {objectives.map((obj, i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, objective: obj.label })}
                      className={`quiz-option-card ${formData.objective === obj.label ? 'active' : ''}`}
                    >
                      <div className="quiz-option-icon">{obj.icon}</div>
                      <div className="quiz-option-info">
                        <div className="quiz-option-label">{obj.label}</div>
                        <div className="quiz-option-desc">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Monthly Revenue */}
            {step === 3 && (
              <div className="quiz-step">
                <h3 className="title-md">Qual o faturamento mensal da sua empresa?</h3>
                <p className="quiz-helper">Essencial para entender a maturidade e capacidade operacional.</p>
                <div className="quiz-options-vertical">
                  {revenues.map((rev, i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, revenue: rev })}
                      className={`quiz-option-strip ${formData.revenue === rev ? 'active' : ''}`}
                    >
                      <span className="strip-check-dot" />
                      <span>{rev}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Budget */}
            {step === 4 && (
              <div className="quiz-step">
                <h3 className="title-md">Quanto sua empresa pode investir em marketing e tecnologia por mês?</h3>
                <p className="quiz-helper">Orçamento disponível para alocação de anúncios e desenvolvimento.</p>
                <div className="quiz-options-vertical">
                  {budgets.map((bud, i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, budget: bud })}
                      className={`quiz-option-strip ${formData.budget === bud ? 'active' : ''}`}
                    >
                      <span className="strip-check-dot" />
                      <span>{bud}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Contact Details */}
            {step === 5 && (
              <div className="quiz-step">
                <h3 className="title-md">Quem receberá este diagnóstico?</h3>
                <p className="quiz-helper">Insira seus dados para entrarmos em contato com a análise.</p>
                <div className="quiz-contact-fields">
                  <div className="quiz-field-group">
                    <label><User size={14} /> Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="quiz-input-text"
                    />
                  </div>
                  <div className="quiz-field-group">
                    <label><Phone size={14} /> WhatsApp (com DDD)</label>
                    <input
                      type="tel"
                      placeholder="Ex: (61) 99999-9999"
                      value={formData.userPhone}
                      onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                      className="quiz-input-text"
                    />
                  </div>
                  <div className="quiz-field-group">
                    <label><Mail size={14} /> E-mail Profissional</label>
                    <input
                      type="email"
                      placeholder="voce@empresa.com.br"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      className="quiz-input-text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Simulated calculation */}
            {step === 6 && (
              <div className="quiz-step quiz-loading-step">
                <div className="quiz-loader-orb">
                  <div className="loader-inner-core" />
                  <div className="loader-pulse-ring" />
                </div>
                <h3 className="title-md glow-cyan" style={{ color: 'var(--cyan-text)', marginTop: '2rem' }}>
                  PROCESSANDO DADOS
                </h3>
                <div className="loading-step-box">
                  {loadingSteps.map((txt, idx) => (
                    <div 
                      key={idx} 
                      className={`loading-step-item ${idx === loadingTextIndex ? 'active' : ''} ${idx < loadingTextIndex ? 'completed' : ''}`}
                    >
                      <span className="step-icon">
                        {idx < loadingTextIndex ? '✓' : '●'}
                      </span>
                      <span>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: Success & Call to Action */}
            {step === 7 && (
              <div className="quiz-step quiz-success-step">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={54} color="var(--cyan-text)" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))' }} />
                </div>
                <h3 className="title-lg" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                  Plano de Decolagem <span className="text-gradient">Estruturado!</span>
                </h3>
                <p style={{ color: 'var(--text-tech)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  A telemetria da <strong>{formData.companyName}</strong> está pronta! Para receber o diagnóstico completo e reservar sua sessão estratégica gratuita de 30 minutos com nossos especialistas, clique no botão abaixo para iniciar o contato no WhatsApp.
                </p>

                <button 
                  onClick={sendToWhatsApp}
                  className="btn-v16 btn-v16-primary"
                  style={{ width: '100%', padding: '1.1rem', fontSize: '0.88rem' }}
                >
                  DECOLAR CONVERSA NO WHATSAPP <Rocket size={18} />
                </button>

                <button 
                  onClick={handleRestart}
                  className="quiz-btn-restart"
                  style={{ marginTop: '1.25rem', background: 'none', border: 'none', color: 'var(--text-tech)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Fazer novo diagnóstico
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Bar (Only show on input steps) */}
      {step <= totalSteps && (
        <div className="quiz-controls-bar">
          {step > 1 ? (
            <button 
              onClick={handlePrev} 
              className="quiz-btn-nav quiz-btn-prev"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : (
            <div />
          )}

          <button 
            onClick={handleNext} 
            className="quiz-btn-nav quiz-btn-next"
          >
            {step === totalSteps ? 'Finalizar' : 'Avançar'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
