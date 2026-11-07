import { useState } from 'react'
import { ScanSearch, XCircle, AlertTriangle, CheckCircle2, Info, Loader2, ArrowRight, MessageCircle, Eye } from 'lucide-react'
import { GROUP_LABELS, scoreLabel, type Group, type RaioXReport, type Severity } from '../lib/raiox'
import type { RaioXState } from '../lib/useRaioX'
import { RAIOX_HUMAN_CHECKS, whatsappLink } from '../content/site'
import { track } from '../lib/analytics'

export const RAIOX_PATH = '/analise-de-site-gratis'

interface RaioXFormProps {
  location: string
  /** Inline mode: runs on this page. Without it the form navigates to the Raio-X page (works without JS). */
  onRun?: (url: string) => void
  busy?: boolean
  defaultValue?: string
  dark?: boolean
}

export function RaioXForm({ location, onRun, busy = false, defaultValue = '', dark = false }: RaioXFormProps) {
  const [value, setValue] = useState(defaultValue)
  const inputId = `raiox-url-${location}`

  return (
    <form
      className={`raiox-form ${dark ? 'raiox-form-dark' : ''}`}
      action={RAIOX_PATH}
      method="get"
      role="search"
      onSubmit={(e) => {
        if (!value.trim()) {
          e.preventDefault()
          return
        }
        if (onRun) {
          e.preventDefault()
          onRun(value)
        } else {
          track('cta_click', { origin: `raiox_${location}` })
        }
      }}
    >
      <label htmlFor={inputId} className="raiox-label">Qual é o site da sua empresa?</label>
      <div className="raiox-input-row">
        <input
          id={inputId}
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="suaempresa.com.br"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="raiox-input"
        />
        <input type="hidden" name="de" value={location} />
        <button type="submit" className="btn-v16 btn-v16-primary raiox-submit" disabled={busy}>
          {busy ? <Loader2 size={18} className="raiox-spin" aria-hidden="true" /> : <ScanSearch size={18} aria-hidden="true" />}
          {busy ? 'Analisando...' : 'Fazer meu Raio-X grátis'}
        </button>
      </div>
      <p className="raiox-hint">Sem cadastro. Resultado em segundos.</p>
    </form>
  )
}

const STEPS = [
  { key: 'html', label: 'Lendo o seu site' },
  { key: 'html', label: 'Procurando Google Analytics e Pixel da Meta' },
  { key: 'html', label: 'Conferindo WhatsApp, telefone e formulário' },
  { key: 'html', label: 'Checando o que o Google vê' },
  { key: 'speed', label: 'Medindo a velocidade no celular com o Google (até 30 s)' },
] as const

export function RaioXProgress({ state }: { state: RaioXState }) {
  return (
    <ol className="raiox-progress" aria-live="polite">
      {STEPS.map((s) => {
        const done = s.key === 'html' ? state.htmlDone : state.speedDone
        return (
          <li key={s.label} className={done ? 'is-done' : ''}>
            {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <Loader2 size={18} className="raiox-spin" aria-hidden="true" />}
            {s.label}
          </li>
        )
      })}
    </ol>
  )
}

const SEVERITY_ICON: Record<Severity, React.ReactNode> = {
  critico: <XCircle size={20} aria-hidden="true" />,
  atencao: <AlertTriangle size={20} aria-hidden="true" />,
  info: <Info size={20} aria-hidden="true" />,
  ok: <CheckCircle2 size={20} aria-hidden="true" />,
}
const SEVERITY_TEXT: Record<Severity, string> = { critico: 'Furo crítico', atencao: 'Atenção', info: 'Observação', ok: 'Ok' }

function ScoreRing({ score, tone }: { score: number; tone: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg className={`raiox-ring tone-${tone}`} viewBox="0 0 120 120" role="img" aria-label={`Nota de vendas ${score} de 100`}>
      <circle cx="60" cy="60" r={r} className="raiox-ring-bg" />
      <circle cx="60" cy="60" r={r} className="raiox-ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      <text x="60" y="58" textAnchor="middle" className="raiox-ring-num">{score}</text>
      <text x="60" y="78" textAnchor="middle" className="raiox-ring-max">de 100</text>
    </svg>
  )
}

export function RaioXResult({ state, location }: { state: RaioXState; location: string }) {
  const report = state.report as RaioXReport
  const partial = state.phase === 'partial'
  const verdict = scoreLabel(report.score)
  const criticos = report.findings.filter((f) => f.severity === 'critico')
  const atencao = report.findings.filter((f) => f.severity === 'atencao')
  const problems = report.findings.filter((f) => f.severity !== 'ok')
  const passed = report.findings.filter((f) => f.severity === 'ok')
  const whatsMsg = `Olá! Fiz o Raio-X de Vendas do site ${report.host} e tirei ${report.score}/100. Quero ajuda para corrigir os pontos que apareceram.`

  return (
    <div className="raiox-result">
      <div className="raiox-summary">
        <ScoreRing score={report.score} tone={verdict.tone} />
        <div>
          <span className="raiox-kicker">Nota de vendas{partial ? ' (parcial)' : ''} · {report.host}</span>
          <h2 className="raiox-verdict">{verdict.label}</h2>
          <p className="raiox-verdict-text">{verdict.text}</p>
          <p className="raiox-count">
            <strong>{criticos.length}</strong> {criticos.length === 1 ? 'furo crítico' : 'furos críticos'} · <strong>{atencao.length}</strong>{' '}
            {atencao.length === 1 ? 'ponto de atenção' : 'pontos de atenção'}
          </p>
          {partial && (
            <p className="raiox-pending">
              <Loader2 size={16} className="raiox-spin" aria-hidden="true" /> Medindo a velocidade no celular com o Google. A nota será atualizada.
            </p>
          )}
        </div>
      </div>

      <div className="raiox-groups">
        {(Object.keys(GROUP_LABELS) as Group[]).map((g) => {
          const v = report.groups[g]
          const pct = v ? Math.round((v.earned / v.max) * 100) : null
          return (
            <div key={g} className="raiox-group">
              <span>{GROUP_LABELS[g]}</span>
              <div className="raiox-bar" aria-hidden="true"><i style={{ width: `${pct ?? 0}%` }} /></div>
              <strong>{pct === null ? (g === 'velocidade' && partial ? 'medindo…' : 'n/d') : `${pct}%`}</strong>
            </div>
          )
        })}
      </div>

      {problems.length > 0 && (
        <>
          <h3 className="raiox-list-title">Onde o seu site está perdendo vendas</h3>
          <ul className="raiox-findings">
            {problems.map((f) => (
              <li key={f.id} className={`sev-${f.severity}`}>
                <span className="raiox-sev">{SEVERITY_ICON[f.severity]}<span className="sr-only">{SEVERITY_TEXT[f.severity]}:</span></span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {passed.length > 0 && (
        <details className="raiox-passed">
          <summary>O que já está certo ({passed.length})</summary>
          <ul className="raiox-findings">
            {passed.map((f) => (
              <li key={f.id} className="sev-ok">
                <span className="raiox-sev">{SEVERITY_ICON.ok}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="raiox-blind">
        <Eye size={22} aria-hidden="true" />
        <div>
          <strong>O que nenhuma ferramenta enxerga (e a nossa equipe confere com você):</strong>
          <ul>
            {RAIOX_HUMAN_CHECKS.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>

      <div className="raiox-cta">
        <a href="#contato" className="btn-v16 btn-v16-primary" onClick={() => track('cta_click', { origin: `raiox_resultado_${location}` })}>
          Quero o plano para fechar esses furos <ArrowRight size={18} aria-hidden="true" />
        </a>
        <a
          href={whatsappLink(whatsMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-v16 btn-v16-secondary"
          onClick={() => track('whatsapp_click', { origin: `raiox_resultado_${location}` })}
        >
          Mandar o resultado no WhatsApp <MessageCircle size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
