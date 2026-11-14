import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Layout, Workflow, Cpu, Code, Rocket, User, Phone, Mail, ArrowLeft, ArrowRight, MessageCircle, CheckCircle2, CalendarCheck } from 'lucide-react'
import { submitLead, HAS_LEAD_WEBHOOK } from '../lib/leads'
import { track } from '../lib/analytics'
import {
  OBJECTIVE_OPTIONS,
  REVENUE_OPTIONS,
  BUDGET_OPTIONS,
  qualifyLead,
  formatPhone,
  type ObjectiveId,
  type RevenueId,
  type BudgetId,
} from '../lib/leadScore'
import { SITE, whatsappLink } from '../content/site'
import { getRememberedReport } from '../lib/raiox'

interface QuizData {
  companyName: string
  objective: ObjectiveId | ''
  revenue: RevenueId | ''
  budget: BudgetId | ''
  userName: string
  userPhone: string
  userEmail: string
}

const OBJECTIVE_ICONS: Record<ObjectiveId, React.ReactNode> = {
  completo: <Rocket size={22} />,
  trafego: <Target size={22} />,
  site: <Layout size={22} />,
  crm: <Workflow size={22} />,
  ia: <Cpu size={22} />,
  software: <Code size={22} />,
}

const TOTAL_STEPS = 5

/** Raio-X result from this visit (if any), so the team starts the call already knowing the gaps. */
function raioxFields() {
  const r = getRememberedReport()
  return r ? { site_url: r.url, raiox_score: r.score, raiox_alertas: r.criticos.join('; ') } : {}
}

const labelOf = (list: { id: string; label: string }[], id: string) => list.find((o) => o.id === id)?.label ?? ''

interface DiagnosticQuizProps {
  /** "home" or the service page slug; sent with the lead and the analytics events */
  location?: string
  /** Pre-selects the objective on service pages */
  initialObjective?: ObjectiveId
}

export default function DiagnosticQuiz({ location = 'home', initialObjective }: DiagnosticQuizProps) {
  const initialData: QuizData = {
    companyName: '',
    objective: initialObjective ?? '',
    revenue: '',
    budget: '',
    userName: '',
    userPhone: '',
    userEmail: '',
  }
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<QuizData>(initialData)
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  // The automatic send failed (or there is no webhook): the success screen hands the lead to WhatsApp
  const [sendFailed, setSendFailed] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const [error, setError] = useState('')

  const qualification =
    formData.objective && formData.revenue && formData.budget
      ? qualifyLead(formData.objective, formData.revenue, formData.budget)
      : null

  const whatsappSummary = () => {
    const plan = qualification ? `\n🧭 *Plano indicado na pré-análise:* ${qualification.plan.name}` : ''
    const raiox = getRememberedReport()
    const raioxLine = raiox ? `\n🔎 *Raio-X do site:* ${raiox.url} · nota ${raiox.score}/100` : ''
    return `*DIAGNÓSTICO DIGITAL SOLICITADO PELO SITE*

🏢 *Empresa:* ${formData.companyName}
🎯 *Objetivo:* ${labelOf(OBJECTIVE_OPTIONS, formData.objective)}
📊 *Faturamento:* ${labelOf(REVENUE_OPTIONS, formData.revenue)}
💰 *Investimento mensal:* ${labelOf(BUDGET_OPTIONS, formData.budget)}${plan}${raioxLine}

👤 *Contato:* ${formData.userName}
✉️ *E-mail:* ${formData.userEmail}
📱 *WhatsApp:* ${formData.userPhone}

_Enviado pelo site da Meta Impulso_`
  }

  const openWhatsApp = (origin: string) => {
    track('whatsapp_click', { origin })
    window.open(whatsappLink(whatsappSummary()), '_blank', 'noopener,noreferrer')
  }

  const validate = (): string => {
    if (step === 1 && !formData.companyName.trim()) return 'Por favor, informe o nome da sua empresa.'
    if (step === 2 && !formData.objective) return 'Por favor, selecione um objetivo.'
    if (step === 3 && !formData.revenue) return 'Por favor, selecione uma faixa de faturamento.'
    if (step === 4 && !formData.budget) return 'Por favor, selecione o investimento disponível.'
    if (step === 5) {
      if (!formData.userName.trim()) return 'Por favor, informe seu nome.'
      if (formData.userPhone.replace(/\D/g, '').length < 10) return 'Informe um WhatsApp válido, com DDD.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail.trim())) return 'Por favor, informe um e-mail válido.'
      if (!consent) return 'Para continuar, autorize o contato e o uso dos dados conforme a política de privacidade.'
    }
    return ''
  }

  const handleNext = () => {
    const message = validate()
    setError(message)
    if (message) return

    if (step === 1) track('quiz_start', { form: 'diagnostico', location })

    // Bots fill the hidden field: show the success screen but send nothing.
    if (step === TOTAL_STEPS && !honeypot && qualification) {
      submitLead({
        companyName: formData.companyName.trim(),
        objective: labelOf(OBJECTIVE_OPTIONS, formData.objective),
        revenue: labelOf(REVENUE_OPTIONS, formData.revenue),
        budget: labelOf(BUDGET_OPTIONS, formData.budget),
        objective_id: formData.objective,
        revenue_id: formData.revenue,
        budget_id: formData.budget,
        userName: formData.userName.trim(),
        userPhone: formData.userPhone,
        userEmail: formData.userEmail.trim(),
        ...raioxFields(),
        lead_score: qualification.score,
        lead_priority: qualification.priority,
        recommended_plan: qualification.plan.name,
        form_location: location,
      }).then((ok) => {
        if (HAS_LEAD_WEBHOOK && !ok) setSendFailed(true)
      })
      track('generate_lead', {
        form: 'diagnostico',
        location,
        objective: formData.objective,
        revenue: formData.revenue,
        budget: formData.budget,
        recommended_plan: qualification.plan.id,
        lead_priority: qualification.priority,
      })
      // Without a webhook the lead would only exist in this browser: hand it straight to WhatsApp.
      if (!HAS_LEAD_WEBHOOK) openWhatsApp('diagnostico_envio')
    }

    track('quiz_step', { form: 'diagnostico', location, step: step + 1 })
    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const handlePrev = () => {
    setError('')
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  const handleRestart = () => {
    setFormData(initialData)
    setConsent(false)
    setStep(1)
    setError('')
  }

  const progressPercent = step <= TOTAL_STEPS ? (step / TOTAL_STEPS) * 100 : 100
  const firstName = formData.userName.trim().split(/\s+/)[0]

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' as const } }),
  }

  return (
    <form
      id="diagnostico-quiz"
      className="quiz-panel card-premium"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (step <= TOTAL_STEPS) handleNext()
      }}
    >
      <div className="card-telemetry" style={{ marginBottom: '1.5rem' }}>
        <span>Diagnóstico digital gratuito</span>
        {step <= TOTAL_STEPS ? (
          <span className="quiz-step-indicator">PASSO {step} DE {TOTAL_STEPS}</span>
        ) : (
          <span className="quiz-step-indicator" style={{ color: 'var(--cyan-text)' }}>CONCLUÍDO</span>
        )}
      </div>

      {step <= TOTAL_STEPS && (
        <div className="quiz-progress-track">
          <motion.div className="quiz-progress-bar" style={{ width: `${progressPercent}%` }} layoutId={`progress-${location}`} />
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="quiz-error-alert" role="alert">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="quiz-step-container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="quiz-slide-content">
            {step === 1 && (
              <div className="quiz-step">
                <h3 className="title-md">Qual é o nome da sua empresa?</h3>
                <p className="quiz-helper">Leva menos de 1 minuto. Já pesquisamos sua presença digital antes da conversa.</p>
                <div className="quiz-input-wrapper">
                  <input
                    type="text"
                    aria-label="Nome da empresa"
                    autoComplete="organization"
                    placeholder="Ex: Minha Empresa LTDA"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="quiz-input-text"
                  />
                  <div className="input-focus-line" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="quiz-step">
                <h3 className="title-md">O que é mais urgente para a sua empresa hoje?</h3>
                <p className="quiz-helper">Escolha a frente principal. Na conversa olhamos o cenário completo.</p>
                <div className="quiz-options-grid">
                  {OBJECTIVE_OPTIONS.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      aria-pressed={formData.objective === obj.id}
                      onClick={() => setFormData({ ...formData, objective: obj.id })}
                      className={`quiz-option-card ${formData.objective === obj.id ? 'active' : ''}`}
                    >
                      <div className="quiz-option-icon">{OBJECTIVE_ICONS[obj.id]}</div>
                      <div className="quiz-option-info">
                        <div className="quiz-option-label">{obj.label}</div>
                        <div className="quiz-option-desc">{obj.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="quiz-step">
                <h3 className="title-md">Qual o faturamento mensal da sua empresa?</h3>
                <p className="quiz-helper">Ajuda a indicar a solução adequada ao momento da empresa. Os dados são confidenciais.</p>
                <div className="quiz-options-vertical">
                  {REVENUE_OPTIONS.map((rev) => (
                    <button
                      key={rev.id}
                      type="button"
                      aria-pressed={formData.revenue === rev.id}
                      onClick={() => setFormData({ ...formData, revenue: rev.id })}
                      className={`quiz-option-strip ${formData.revenue === rev.id ? 'active' : ''}`}
                    >
                      <span className="strip-check-dot" />
                      <span>{rev.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="quiz-step">
                <h3 className="title-md">Quanto sua empresa pode investir em marketing e tecnologia por mês?</h3>
                <p className="quiz-helper">Considere mídia (anúncios) e serviços. Usamos essa resposta para montar uma proposta realista.</p>
                <div className="quiz-options-vertical">
                  {BUDGET_OPTIONS.map((bud) => (
                    <button
                      key={bud.id}
                      type="button"
                      aria-pressed={formData.budget === bud.id}
                      onClick={() => setFormData({ ...formData, budget: bud.id })}
                      className={`quiz-option-strip ${formData.budget === bud.id ? 'active' : ''}`}
                    >
                      <span className="strip-check-dot" />
                      <span>{bud.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="quiz-step">
                <h3 className="title-md">Para quem enviamos o diagnóstico?</h3>
                <p className="quiz-helper">Falamos com você pelo WhatsApp, em horário comercial, para agendar a conversa.</p>
                <div className="quiz-contact-fields">
                  <div className="quiz-field-group">
                    <label htmlFor={`quiz-nome-${location}`}><User size={14} /> Nome completo</label>
                    <input
                      id={`quiz-nome-${location}`}
                      autoComplete="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      className="quiz-input-text"
                    />
                  </div>
                  <div className="quiz-field-group">
                    <label htmlFor={`quiz-whatsapp-${location}`}><Phone size={14} /> WhatsApp (com DDD)</label>
                    <input
                      id={`quiz-whatsapp-${location}`}
                      autoComplete="tel-national"
                      inputMode="tel"
                      type="tel"
                      placeholder="(61) 99999-9999"
                      value={formData.userPhone}
                      onChange={(e) => setFormData({ ...formData, userPhone: formatPhone(e.target.value) })}
                      className="quiz-input-text"
                    />
                  </div>
                  <div className="quiz-field-group">
                    <label htmlFor={`quiz-email-${location}`}><Mail size={14} /> E-mail profissional</label>
                    <input
                      id={`quiz-email-${location}`}
                      autoComplete="email"
                      type="email"
                      placeholder="voce@empresa.com.br"
                      value={formData.userEmail}
                      onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                      className="quiz-input-text"
                    />
                  </div>
                  {/* Honeypot: invisible to people, filled by spam bots */}
                  <input
                    className="quiz-hp"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                  <label className="quiz-consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>
                      Autorizo a Meta Impulso a entrar em contato e a tratar meus dados para preparar o diagnóstico, conforme a{' '}
                      <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">política de privacidade</a>.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="quiz-step quiz-success-step">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={48} color="var(--cyan-text)" />
                </div>
                {HAS_LEAD_WEBHOOK && !sendFailed ? (
                  <h3 className="title-lg quiz-success-title">
                    {firstName ? `${firstName}, recebemos` : 'Recebemos'} <span className="text-gradient">suas respostas!</span>
                  </h3>
                ) : (
                  <>
                    <h3 className="title-lg quiz-success-title">
                      {firstName ? `${firstName}, falta` : 'Falta'} <span className="text-gradient">só um toque!</span>
                    </h3>
                    <p className="quiz-success-note">
                      {sendFailed
                        ? 'Não conseguimos registrar suas respostas automaticamente. Toque no botão abaixo para enviá-las pelo WhatsApp.'
                        : 'Abrimos o WhatsApp com suas respostas: é só tocar em enviar. Se a janela não apareceu, use o botão abaixo.'}
                    </p>
                  </>
                )}

                {qualification && (
                  <div className="quiz-plan-result">
                    <span className="quiz-plan-kicker">Pré-análise · plano indicado</span>
                    <strong className="quiz-plan-name">{qualification.plan.name}</strong>
                    <span className="quiz-plan-headline">{qualification.plan.headline}</span>
                    <p>{qualification.plan.forWho} Confirmamos o escopo na conversa.</p>
                  </div>
                )}

                <ol className="quiz-next-steps">
                  <li>Analisamos o site, o Google e os anúncios da <strong>{formData.companyName}</strong>.</li>
                  <li>Falamos com você pelo WhatsApp ({SITE.hoursLabel.toLowerCase()}).</li>
                  <li>Conversa de 30 minutos com o plano de ação priorizado, sem compromisso.</li>
                </ol>

                <button
                  type="button"
                  onClick={() => openWhatsApp('diagnostico_concluido')}
                  className="btn-v16 btn-v16-primary quiz-success-cta"
                >
                  {HAS_LEAD_WEBHOOK && !sendFailed ? 'Adiantar a conversa no WhatsApp' : 'Enviar pelo WhatsApp'} <MessageCircle size={18} />
                </button>

                {SITE.bookingUrl && (
                  <a
                    href={SITE.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-v16 btn-v16-secondary quiz-success-cta"
                    onClick={() => track('cta_click', { origin: 'diagnostico_agenda' })}
                  >
                    Escolher um horário na agenda <CalendarCheck size={18} />
                  </a>
                )}

                <button type="button" onClick={handleRestart} className="quiz-btn-restart">
                  Fazer novo diagnóstico
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step <= TOTAL_STEPS && (
        <div className="quiz-controls-bar">
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="quiz-btn-nav quiz-btn-prev">
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : (
            <div />
          )}

          <button type="submit" className="quiz-btn-nav quiz-btn-next">
            {step === TOTAL_STEPS ? (HAS_LEAD_WEBHOOK ? 'Quero meu diagnóstico' : 'Enviar pelo WhatsApp') : 'Avançar'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </form>
  )
}
