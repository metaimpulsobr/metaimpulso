// Readable, illustrative interfaces for each case (no real customer data).
// Each one shows at a glance what the product does; replaced by a real print when `shot` is set.
import { Search, ShieldCheck, FileCheck2, Gauge, CheckCircle2, QrCode, Ticket, Bot, Check, ShoppingCart, MessageCircle, Users } from 'lucide-react'
import type { CaseVisual } from '../content/cases'

function Browser({ url, children, label = true }: { url: string; children: React.ReactNode; label?: boolean }) {
  return (
    <div className="cv-browser">
      <div className="cv-browser-bar">
        <span className="cv-dots"><i /><i /><i /></span>
        <span className="cv-url">{url}</span>
        {label && <span className="cv-tag">ilustração</span>}
      </div>
      <div className="cv-browser-body">{children}</div>
    </div>
  )
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="cv-phone-wrap">
      <div className="cv-phone">
        <div className="cv-notch" />
        <div className="cv-phone-body">{children}</div>
      </div>
      <span className="cv-tag cv-tag-float">ilustração</span>
    </div>
  )
}

function Portal() {
  return (
    <Browser url="www.voogle.com.br">
      <div className="cv-portal">
        <div className="cv-portal-nav"><b>VOOGLE</b><span>Seguros</span><span>Consultoria</span><span>Crédito</span><em>Fale conosco</em></div>
        <div className="cv-portal-hero">
          <small>Grupo Voogle</small>
          <strong>Seguros, consultoria e crédito para a sua empresa</strong>
          <span className="cv-btn">Falar com um consultor</span>
        </div>
        <div className="cv-portal-cards">
          <div><ShieldCheck size={16} /> Seguros</div>
          <div><Users size={16} /> Consultoria</div>
          <div><Gauge size={16} /> Crédito</div>
        </div>
        <div className="cv-serp">
          <Search size={13} /> <span>Encontrado no Google</span> <Check size={13} />
        </div>
      </div>
    </Browser>
  )
}

const KANBAN: { col: string; cards: { name: string; deal: string; anim?: 'leaving' | 'arriving' }[] }[] = [
  { col: 'Novo lead', cards: [{ name: 'Ana R.', deal: 'Seguro empresarial' }, { name: 'Bruno T.', deal: 'Consórcio' }] },
  { col: 'Atendimento', cards: [{ name: 'Carla M.', deal: 'Plano de saúde' }] },
  { col: 'Proposta', cards: [{ name: 'Diego S.', deal: 'Seguro frota', anim: 'leaving' }, { name: 'Elisa P.', deal: 'Crédito PJ' }] },
  { col: 'Fechado', cards: [{ name: 'Fábio L.', deal: 'Seguro vida' }, { name: 'Diego S.', deal: 'Seguro frota', anim: 'arriving' }] },
]

function Crm() {
  return (
    <Browser url="crm.voogle.com.br">
      <div className="cv-kanban">
        {KANBAN.map((c) => (
          <div key={c.col} className="cv-kanban-col">
            <span className="cv-kanban-head">{c.col}</span>
            {c.cards.map((card) => (
              <div key={card.name + c.col} className={`cv-kanban-card ${card.anim ? `cv-${card.anim}` : ''}`}>
                <strong>{card.name}</strong>
                <span>{card.deal}</span>
                {c.col === 'Fechado' ? <CheckCircle2 size={12} className="cv-ok" /> : <MessageCircle size={12} className="cv-wa" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Browser>
  )
}

function Credit() {
  const steps = ['Cadastro', 'Documentos', 'Score', 'Decisão']
  return (
    <Browser url="app.voogle.com.br">
      <div className="cv-credit">
        <div className="cv-credit-steps">
          {steps.map((s, i) => (
            <div key={s} className="cv-credit-step" style={{ animationDelay: `${i * 0.6}s` }}>
              <span>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <div className="cv-credit-panel">
          <span className="cv-credit-title">Análise automática · Proposta #2041</span>
          <ul>
            <li><FileCheck2 size={14} /> Dados cadastrais conferidos</li>
            <li><FileCheck2 size={14} /> Documentos validados</li>
            <li><Gauge size={14} /> Regras de risco aplicadas</li>
          </ul>
          <div className="cv-credit-result"><CheckCircle2 size={16} /> Aprovada pela esteira</div>
        </div>
      </div>
    </Browser>
  )
}

function Club() {
  return (
    <Phone>
      <div className="cv-club">
        <div className="cv-club-card">
          <small>Infinity Club</small>
          <strong>Membro</strong>
          <span>•••• 2041</span>
        </div>
        <span className="cv-club-label">Seus benefícios</span>
        <div className="cv-club-voucher"><Ticket size={14} /> <span>Restaurante parceiro</span> <b>20%</b></div>
        <div className="cv-club-voucher"><Ticket size={14} /> <span>Academia</span> <b>15%</b></div>
        <div className="cv-club-qr"><QrCode size={34} /> <span>Validar voucher</span></div>
      </div>
    </Phone>
  )
}

function Agent() {
  return (
    <Phone>
      <div className="cv-chat">
        <div className="cv-chat-head"><Bot size={16} /> <span>Atendimento Voogle</span> <i>online</i></div>
        <div className="cv-msg cv-in" style={{ animationDelay: '0.2s' }}>Oi! Quero cotar um seguro para a minha clínica.<small>22:47</small></div>
        <div className="cv-msg cv-out" style={{ animationDelay: '1.2s' }}>Claro! Quantas pessoas trabalham aí?<small>22:47</small></div>
        <div className="cv-msg cv-in" style={{ animationDelay: '2.2s' }}>12 pessoas.<small>22:48</small></div>
        <div className="cv-msg cv-out" style={{ animationDelay: '3.2s' }}>Perfeito. Registrei seu pedido e um consultor fala com você amanhã às 9h.<small>22:48</small></div>
        <div className="cv-chat-crm" style={{ animationDelay: '4.2s' }}><CheckCircle2 size={13} /> Lead registrado no CRM</div>
      </div>
    </Phone>
  )
}

function Pharmacy() {
  const items = ['Vitamina C', 'Protetor solar', 'Hidratante', 'Fralda infantil']
  return (
    <Phone>
      <div className="cv-shop">
        <div className="cv-shop-search"><Search size={13} /> Buscar produto</div>
        <div className="cv-shop-grid">
          {items.map((n) => (
            <div key={n} className="cv-shop-item"><span className="cv-shop-img" /> <strong>{n}</strong> <em>+ Adicionar</em></div>
          ))}
        </div>
        <div className="cv-shop-cart"><ShoppingCart size={14} /> 3 itens <b><MessageCircle size={13} /> Pedir no WhatsApp</b></div>
      </div>
    </Phone>
  )
}

function CoreCrm() {
  return (
    <Browser url="meta-core-crm.vercel.app">
      <div className="cv-core">
        <div className="cv-core-tabs"><b>Equipe Vendas</b><span>Equipe Pós-venda</span><span>Equipe Parceiros</span></div>
        <div className="cv-core-grid">
          <div className="cv-core-chart">
            <span>Leads por canal</span>
            <div className="cv-bars"><i style={{ height: '70%' }} /><i style={{ height: '45%' }} /><i style={{ height: '85%' }} /><i style={{ height: '35%' }} /></div>
            <div className="cv-bars-legend"><em>WhatsApp</em><em>Site</em><em>Anúncios</em><em>Indicação</em></div>
          </div>
          <div className="cv-core-list">
            <span>Conversas abertas</span>
            <p><MessageCircle size={12} /> WhatsApp · Equipe Vendas</p>
            <p><MessageCircle size={12} /> Site · Equipe Pós-venda</p>
            <p><MessageCircle size={12} /> Instagram · Equipe Vendas</p>
          </div>
        </div>
      </div>
    </Browser>
  )
}

const VISUALS: Record<CaseVisual, () => React.ReactElement> = {
  portal: Portal,
  crm: Crm,
  credit: Credit,
  club: Club,
  agent: Agent,
  pharmacy: Pharmacy,
  corecrm: CoreCrm,
}

export default function CaseVisualView({ visual, shot, url, alt }: { visual: CaseVisual; shot?: string; url?: string; alt: string }) {
  if (shot) {
    return (
      <Browser url={url ?? ''} label={false}>
        <img src={shot} alt={alt} loading="lazy" className="cv-shot" />
      </Browser>
    )
  }
  const View = VISUALS[visual]
  return (
    <div role="img" aria-label={`Representação ilustrativa: ${alt}`} className="cv-stage">
      <View />
    </div>
  )
}
