import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, LogOut, MessageCircle, Mail, Search, X, Trash2, RefreshCw, ScanSearch, CalendarClock } from 'lucide-react'
import '../crm.css'

// Internal CRM for the site's leads (data and auth live in api/crm.ts).
// Sign-in uses Google Identity Services; only e-mails in CRM_ALLOWED_EMAILS get a session.

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type Stage = string
interface Note {
  at: string
  by: string
  text: string
}
interface Lead {
  id: string
  created_at: string
  status: Stage
  lead_priority?: 'alta' | 'media' | 'baixa'
  lead_score?: number
  recommended_plan?: string
  companyName?: string
  userName?: string
  userPhone?: string
  userEmail?: string
  objective?: string
  revenue?: string
  budget?: string
  form_location?: string
  site_url?: string
  raiox_score?: number
  raiox_alertas?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referrer?: string
  landing_page?: string
  next_action?: string
  next_action_date?: string
  lost_reason?: string
  notes?: Note[]
}
interface Setup {
  storage: boolean
  google: boolean
  allowlist: boolean
}

const PRIORITY_LABEL: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const OPEN_STAGES_END = ['Ganho', 'Perdido', 'Opt-out']

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
const waLink = (phone = '', name = '') => {
  const digits = phone.replace(/\D/g, '')
  const text = encodeURIComponent(`Olá${name ? `, ${name.split(' ')[0]}` : ''}! Aqui é da Meta Impulso. Recebemos o seu diagnóstico pelo site.`)
  return `https://wa.me/${digits.startsWith('55') ? digits : `55${digits}`}?text=${text}`
}
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })

async function api<T>(path: string, init?: RequestInit): Promise<{ status: number; data: T }> {
  const res = await fetch(`/api/crm${path}`, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'same-origin',
  })
  const data = (await res.json().catch(() => ({}))) as T
  return { status: res.status, data }
}

// ---------- Google sign-in ----------
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }) => void
          renderButton: (el: HTMLElement, o: Record<string, unknown>) => void
        }
      }
    }
  }
}

function GoogleButton({ onCredential }: { onCredential: (c: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    const render = () => {
      if (!window.google || !ref.current) return
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r) => onCredential(r.credential) })
      window.google.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill', locale: 'pt-BR' })
    }
    if (window.google) return render()
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = render
    document.head.appendChild(s)
  }, [onCredential])
  return <div ref={ref} className="crm-google-btn" />
}

function Login({ setup, error, onCredential }: { setup: Setup | null; error: string; onCredential: (c: string) => void }) {
  const missing = setup
    ? [
        !setup.storage && 'armazenamento (Upstash Redis) conectado ao projeto na Vercel',
        !(setup.google && GOOGLE_CLIENT_ID) && 'VITE_GOOGLE_CLIENT_ID (login com Google)',
        !setup.allowlist && 'CRM_ALLOWED_EMAILS (e-mails autorizados)',
      ].filter(Boolean)
    : []
  return (
    <main className="crm-login">
      <div className="crm-login-card">
        <a href="/" className="crm-brand">
          <img src="/logo-96.png" alt="" width={36} height={36} /> Meta Impulso
        </a>
        <h1>CRM do site</h1>
        <p>Leads do diagnóstico e do Raio-X, num só lugar. Entre com a sua conta Google autorizada.</p>
        {missing.length > 0 ? (
          <div className="crm-setup">
            <strong>Falta configurar na Vercel:</strong>
            <ul>{missing.map((m) => <li key={String(m)}>{m}</li>)}</ul>
            <span>Passo a passo em docs/CRM-DO-SITE.md.</span>
          </div>
        ) : (
          <GoogleButton onCredential={onCredential} />
        )}
        {error && <p className="crm-error" role="alert">{error}</p>}
      </div>
    </main>
  )
}

// ---------- lead detail ----------
function LeadDetail({
  lead,
  stages,
  onSave,
  onDelete,
  onClose,
}: {
  lead: Lead
  stages: string[]
  onSave: (patch: Record<string, string>) => Promise<boolean>
  onDelete: () => void
  onClose: () => void
}) {
  const [nextAction, setNextAction] = useState(lead.next_action || '')
  const [nextDate, setNextDate] = useState(lead.next_action_date || '')
  const [lostReason, setLostReason] = useState(lead.lost_reason || '')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async (patch: Record<string, string>) => {
    setSaving(true)
    const ok = await onSave(patch)
    setSaving(false)
    return ok
  }

  const rows: [string, React.ReactNode][] = [
    ['Objetivo', lead.objective],
    ['Faturamento', lead.revenue],
    ['Orçamento para marketing', lead.budget],
    ['Plano indicado', lead.recommended_plan],
    ['Formulário', lead.form_location === 'home' ? 'Página inicial' : lead.form_location],
    ['Origem', lead.utm_source ? `${lead.utm_source}${lead.utm_medium ? ` / ${lead.utm_medium}` : ''}${lead.utm_campaign ? ` · ${lead.utm_campaign}` : ''}` : lead.referrer || 'Direto'],
    ['Primeira página', lead.landing_page],
  ]

  return (
    <aside className="crm-detail" aria-label={`Lead ${lead.companyName}`}>
      <header className="crm-detail-head">
        <div>
          <span className={`crm-prio crm-prio-${lead.lead_priority}`}>{PRIORITY_LABEL[lead.lead_priority || ''] || '—'} · nota {lead.lead_score ?? '—'}</span>
          <h2>{lead.companyName}</h2>
          <p>{lead.userName} · recebido em {fmtDate(lead.created_at)}</p>
        </div>
        <button type="button" className="crm-icon-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
      </header>

      <div className="crm-contact">
        <a className="crm-btn crm-btn-primary" href={waLink(lead.userPhone, lead.userName)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={17} /> WhatsApp {lead.userPhone}
        </a>
        {lead.userEmail && (
          <a className="crm-btn" href={`mailto:${lead.userEmail}`}>
            <Mail size={17} /> {lead.userEmail}
          </a>
        )}
      </div>

      <section className="crm-block">
        <label className="crm-label" htmlFor="crm-stage">Etapa do funil</label>
        <select id="crm-stage" value={lead.status} disabled={saving} onChange={(e) => save({ status: e.target.value })}>
          {stages.map((s) => <option key={s}>{s}</option>)}
        </select>
        {lead.status === 'Perdido' && (
          <div className="crm-inline">
            <input placeholder="Motivo da perda (ex.: preço, timing, sem resposta)" value={lostReason} onChange={(e) => setLostReason(e.target.value)} maxLength={300} />
            <button type="button" className="crm-btn" disabled={saving || lostReason === (lead.lost_reason || '')} onClick={() => save({ lost_reason: lostReason })}>Salvar</button>
          </div>
        )}
      </section>

      <section className="crm-block">
        <span className="crm-label">Próxima ação</span>
        <div className="crm-inline">
          <input placeholder="Ex.: ligar para apresentar o diagnóstico" value={nextAction} onChange={(e) => setNextAction(e.target.value)} maxLength={300} />
          <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} aria-label="Data da próxima ação" />
          <button
            type="button"
            className="crm-btn"
            disabled={saving || (nextAction === (lead.next_action || '') && nextDate === (lead.next_action_date || ''))}
            onClick={() => save({ next_action: nextAction, next_action_date: nextDate })}
          >
            Salvar
          </button>
        </div>
      </section>

      {lead.site_url && (
        <section className="crm-block crm-raiox">
          <span className="crm-label"><ScanSearch size={15} /> Raio-X do site</span>
          <p>
            <a href={/^https?:\/\//.test(lead.site_url) ? lead.site_url : `https://${lead.site_url}`} target="_blank" rel="noopener noreferrer">{lead.site_url}</a>
            {lead.raiox_score !== undefined && <> · nota <strong>{lead.raiox_score}/100</strong></>}
          </p>
          {lead.raiox_alertas && <p className="crm-muted">Furos: {lead.raiox_alertas}</p>}
        </section>
      )}

      <section className="crm-block">
        <dl className="crm-facts">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>

      <section className="crm-block">
        <span className="crm-label">Anotações</span>
        <div className="crm-inline">
          <textarea placeholder="O que foi conversado, objeções, combinados…" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} rows={3} />
        </div>
        <button
          type="button"
          className="crm-btn crm-btn-primary crm-note-btn"
          disabled={saving || !note.trim()}
          onClick={async () => {
            if (await save({ note })) setNote('')
          }}
        >
          Adicionar anotação
        </button>
        <ol className="crm-notes">
          {[...(lead.notes || [])].reverse().map((n, i) => (
            <li key={`${n.at}-${i}`}>
              <span>{fmtDate(n.at)} · {n.by.split('@')[0]}</span>
              <p>{n.text}</p>
            </li>
          ))}
          {!lead.notes?.length && <li className="crm-muted">Nenhuma anotação ainda.</li>}
        </ol>
      </section>

      <footer className="crm-detail-foot">
        <button type="button" className="crm-btn crm-btn-danger" onClick={onDelete}>
          <Trash2 size={16} /> Excluir lead (pedido do titular, LGPD)
        </button>
      </footer>
    </aside>
  )
}

// ---------- page ----------
export default function CrmPage() {
  const [user, setUser] = useState<string | null>(null)
  const [setup, setSetup] = useState<Setup | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [stages, setStages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('abertos')
  const [prioFilter, setPrioFilter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'CRM | Meta Impulso'
  }, [])

  const loadLeads = useCallback(async () => {
    setLoading(true)
    const { status, data } = await api<{ leads?: Lead[]; stages?: string[]; error?: string }>('?op=leads')
    setLoading(false)
    if (status === 401) return setUser(null)
    if (status !== 200) return setError('Não foi possível carregar os leads. Tente de novo em instantes.')
    setError('')
    setLeads(data.leads || [])
    setStages(data.stages || [])
  }, [])

  useEffect(() => {
    api<{ email?: string; setup?: Setup }>('?op=me').then(({ status, data }) => {
      setChecking(false)
      if (status === 200 && data.email) {
        setUser(data.email)
        loadLeads()
      } else setSetup(data.setup || null)
    }).catch(() => setChecking(false))
  }, [loadLeads])

  const onCredential = useCallback(
    async (credential: string) => {
      setError('')
      const { status, data } = await api<{ email?: string; error?: string }>('?op=login', { method: 'POST', body: JSON.stringify({ credential }) })
      if (status === 200 && data.email) {
        setUser(data.email)
        loadLeads()
      } else setError(data.error === 'not_allowed' ? 'Esta conta Google não está autorizada a entrar no CRM.' : 'Não foi possível entrar. Tente de novo.')
    },
    [loadLeads],
  )

  const logout = async () => {
    await api('?op=logout', { method: 'POST' })
    setUser(null)
    setLeads([])
    const r = await api<{ setup?: Setup }>('?op=me')
    setSetup(r.data.setup || null)
  }

  const saveLead = async (id: string, patch: Record<string, string>) => {
    const { status, data } = await api<{ lead?: Lead }>('', { method: 'PATCH', body: JSON.stringify({ id, ...patch }) })
    if (status === 200 && data.lead) {
      setLeads((ls) => ls.map((l) => (l.id === id ? (data.lead as Lead) : l)))
      return true
    }
    if (status === 401) setUser(null)
    else setError('Não foi possível salvar. Tente de novo.')
    return false
  }

  const deleteLead = async (lead: Lead) => {
    if (!window.confirm(`Excluir definitivamente o lead de ${lead.companyName}? Use isto quando o titular pedir a exclusão dos dados (LGPD). Não dá para desfazer.`)) return
    const { status } = await api(`?id=${encodeURIComponent(lead.id)}`, { method: 'DELETE' })
    if (status === 200) {
      setLeads((ls) => ls.filter((l) => l.id !== lead.id))
      setSelectedId(null)
    } else setError('Não foi possível excluir. Tente de novo.')
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    leads.forEach((l) => (c[l.status] = (c[l.status] || 0) + 1))
    return c
  }, [leads])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((l) => {
      if (stageFilter === 'abertos' && OPEN_STAGES_END.includes(l.status)) return false
      if (stageFilter && stageFilter !== 'abertos' && stageFilter !== 'todos' && l.status !== stageFilter) return false
      if (prioFilter && l.lead_priority !== prioFilter) return false
      if (!q) return true
      return [l.companyName, l.userName, l.userEmail, l.userPhone, l.site_url].some((v) => v?.toLowerCase().includes(q))
    })
  }, [leads, query, stageFilter, prioFilter])

  const selected = leads.find((l) => l.id === selectedId) || null
  const overdue = (l: Lead) => Boolean(l.next_action_date && l.next_action_date < today() && !OPEN_STAGES_END.includes(l.status))

  if (checking) return <main className="crm-loading">Carregando o CRM…</main>
  if (!user) return <Login setup={setup} error={error} onCredential={onCredential} />

  return (
    <div className="crm">
      <header className="crm-top">
        <a href="/" className="crm-brand">
          <img src="/logo-96.png" alt="" width={30} height={30} /> Meta Impulso <span>CRM</span>
        </a>
        <div className="crm-top-actions">
          <span className="crm-user">{user}</span>
          <button type="button" className="crm-btn" onClick={logout}><LogOut size={16} /> Sair</button>
        </div>
      </header>

      <main className="crm-main">
        <div className="crm-toolbar">
          <h1>Leads <span>{leads.length}</span></h1>
          <div className="crm-search">
            <Search size={17} aria-hidden="true" />
            <input placeholder="Buscar empresa, nome, telefone, e-mail ou site" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar leads" />
          </div>
          <select value={prioFilter} onChange={(e) => setPrioFilter(e.target.value)} aria-label="Filtrar por prioridade">
            <option value="">Todas as prioridades</option>
            <option value="alta">Prioridade alta</option>
            <option value="media">Prioridade média</option>
            <option value="baixa">Prioridade baixa</option>
          </select>
          <button type="button" className="crm-btn" onClick={loadLeads} disabled={loading}><RefreshCw size={16} className={loading ? 'crm-spin' : ''} /> Atualizar</button>
          <a className="crm-btn crm-btn-primary" href="/api/crm?op=export"><Download size={16} /> Exportar planilha</a>
        </div>

        <nav className="crm-stages" aria-label="Etapas do funil">
          {[['abertos', 'Em andamento'], ['todos', 'Todos'], ...stages.map((s) => [s, s])].map(([key, label]) => {
            const n = key === 'todos' ? leads.length : key === 'abertos' ? leads.filter((l) => !OPEN_STAGES_END.includes(l.status)).length : counts[key] || 0
            return (
              <button type="button" key={key} className={`crm-stage ${stageFilter === key ? 'is-active' : ''}`} onClick={() => setStageFilter(key)}>
                {label} <span>{n}</span>
              </button>
            )
          })}
        </nav>

        {error && <p className="crm-error" role="alert">{error}</p>}

        <div className={`crm-body ${selected ? 'has-detail' : ''}`}>
          <ul className="crm-list">
            {visible.map((l) => (
              <li key={l.id}>
                <button type="button" className={`crm-row ${l.id === selectedId ? 'is-active' : ''}`} onClick={() => setSelectedId(l.id)}>
                  <span className={`crm-prio crm-prio-${l.lead_priority}`}>{PRIORITY_LABEL[l.lead_priority || ''] || '—'}</span>
                  <span className="crm-row-main">
                    <strong>{l.companyName}</strong>
                    <span>{l.userName} · {l.objective}</span>
                  </span>
                  <span className="crm-row-meta">
                    <span className="crm-chip">{l.status}</span>
                    {l.next_action_date && (
                      <span className={`crm-due ${overdue(l) ? 'is-late' : ''}`}>
                        <CalendarClock size={13} /> {l.next_action_date.split('-').reverse().join('/')}
                      </span>
                    )}
                    <span className="crm-date">{fmtDate(l.created_at)}</span>
                  </span>
                </button>
              </li>
            ))}
            {!loading && visible.length === 0 && (
              <li className="crm-empty">
                {leads.length === 0
                  ? 'Nenhum lead ainda. Quando alguém concluir o diagnóstico no site, ele aparece aqui.'
                  : 'Nenhum lead com esses filtros.'}
              </li>
            )}
          </ul>

          {selected && (
            <LeadDetail
              key={selected.id}
              lead={selected}
              stages={stages}
              onSave={(patch) => saveLead(selected.id, patch)}
              onDelete={() => deleteLead(selected)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
