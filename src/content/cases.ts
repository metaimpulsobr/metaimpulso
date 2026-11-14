// Real client and in-house projects shown on the home page (#cases).
// Facts only: no metrics without documented evidence and client authorization (CLAUDE.md §2).
//
// Real screenshots: save a sanitized print (no personal data of the client's customers) in
// public/cases/ and set `shot: '/cases/file.webp'`. Without it, the card shows an illustrative
// representation of the interface, labelled as such.

export type CaseVisual = 'portal' | 'crm' | 'credit' | 'club' | 'agent' | 'pharmacy' | 'corecrm'

export interface CaseProduct {
  id: string
  tab: string
  name: string
  problem: string
  delivered: string
  stack: string[]
  visual: CaseVisual
  /** Public address, shown as "no ar em ..." */
  url?: string
  shot?: string
}

export const FEATURED_CASE: {
  client: string
  segment: string
  title: string
  intro: string
  products: CaseProduct[]
} = {
  client: 'Grupo Voogle',
  segment: 'Seguros, consultoria e crédito',
  title: 'Um cliente. Cinco sistemas. Uma única equipe.',
  intro:
    'O Grupo Voogle não contratou cinco fornecedores. Contratou a Meta Impulso para construir o ecossistema digital inteiro: do site que atrai clientes ao agente de IA que atende fora do horário.',
  products: [
    {
      id: 'portal',
      tab: 'Portal',
      name: 'Portal institucional',
      problem: 'A marca precisava ser encontrada no Google e transformar visitas em contatos comerciais.',
      delivered: 'Site em Next.js com SEO técnico, carregamento rápido e chamada para contato em cada seção.',
      stack: ['Next.js', 'TypeScript', 'SEO técnico'],
      visual: 'portal',
      url: 'www.voogle.com.br',
    },
    {
      id: 'crm',
      tab: 'CRM',
      name: 'CRM com funil de vendas',
      problem: 'Leads se perdiam sem histórico de conversa e sem acompanhamento organizado.',
      delivered: 'CRM próprio com funil arrasta e solta, atendimento centralizado e integração com o WhatsApp.',
      stack: ['React', 'TypeScript', 'WhatsApp'],
      visual: 'crm',
      url: 'crm.voogle.com.br',
    },
    {
      id: 'credit',
      tab: 'Crédito',
      name: 'Esteira de análise de crédito',
      problem: 'Análises manuais geravam fila de espera e risco operacional.',
      delivered: 'Motor de regras que cruza dados, confere documentos e calcula o score de aprovação automaticamente.',
      stack: ['React', 'Python', 'PostgreSQL'],
      visual: 'credit',
      url: 'app.voogle.com.br',
    },
    {
      id: 'club',
      tab: 'Clube',
      name: 'Clube de benefícios',
      problem: 'Os associados precisavam usar descontos e vouchers pelo celular, sem complicação.',
      delivered: 'Aplicativo web (PWA) com carteira de benefícios, vouchers e validação por QR Code.',
      stack: ['Next.js', 'PWA', 'QR Code'],
      visual: 'club',
      url: 'infinityclub.voogle.com.br',
    },
    {
      id: 'agent',
      tab: 'Agente de IA',
      name: 'Agente de IA no atendimento',
      problem: 'Mensagens chegavam fora do horário comercial e ficavam sem resposta.',
      delivered: 'Agente treinado com a base de conhecimento da empresa, no WhatsApp e no site, que registra cada atendimento no CRM.',
      stack: ['IA (LLM)', 'WhatsApp', 'CRM'],
      visual: 'agent',
      url: 'operator.voogle.com.br',
    },
  ],
}

export interface OtherCase extends CaseProduct {
  client: string
  kind: string
}

export const OTHER_CASES: OtherCase[] = [
  {
    id: 'centralfarma',
    client: 'Drogaria Central Farma',
    kind: 'Varejo farmacêutico',
    tab: 'Central Farma',
    name: 'Catálogo com pedido pelo WhatsApp',
    problem: 'Comprar pelo celular exigia muitos passos e cadastro.',
    delivered: 'Catálogo rápido com busca e carrinho. O pedido chega pronto no WhatsApp da farmácia.',
    stack: ['Next.js', 'PWA', 'WhatsApp'],
    visual: 'pharmacy',
    // Back online? Set url: 'centralfarm.metaimpulso.com.br'
  },
  {
    id: 'metacore',
    client: 'Meta Core CRM',
    kind: 'Protótipo próprio',
    tab: 'Meta Core CRM',
    // Honest scope: a navigable prototype (no login, sample data). The production CRM is planned
    // in "META IMPULSO OS · Plano de Produto e Arquitetura"; update this card when it ships.
    name: 'Protótipo de CRM com IA',
    problem: 'Times comerciais com vários canais precisavam de uma visão única do funil.',
    delivered: 'Protótipo navegável de CRM: funil em Kanban, lista de leads com pontuação, propostas e uma central de IA para apoiar o comercial.',
    stack: ['React', 'Node.js', 'Tailwind', 'IA'],
    visual: 'corecrm',
    url: 'meta-core-crm.vercel.app',
  },
]
