// Single source of truth for company data (NAP), used by UI, JSON-LD and prerender.

export const SITE = {
  name: 'Meta Impulso',
  url: 'https://www.metaimpulso.com.br',
  tagline: 'Marketing digital e tecnologia em Brasília',
  phoneDisplay: '+55 (61) 99501-1614',
  phoneE164: '+5561995011614',
  whatsapp: '556195011614',
  email: 'metaimpulsobr@gmail.com',
  address: {
    street: 'SCN Quadra 4, Bloco B',
    district: 'Asa Norte',
    city: 'Brasília',
    region: 'DF',
    country: 'BR',
  },
  hoursLabel: 'Segunda a sexta, das 9h às 18h',
  instagram: 'https://instagram.com/metaimpulso',
  linkedin: 'https://linkedin.com/company/metaimpulso',
  ogImage: 'https://www.metaimpulso.com.br/og-image.png',
  logo: 'https://www.metaimpulso.com.br/logo.png',
} as const

export const DEFAULT_WHATSAPP_MSG =
  'Olá! Vim pelo site da Meta Impulso e gostaria de falar com um especialista.'

export function whatsappLink(message: string = DEFAULT_WHATSAPP_MSG) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}

export interface Faq {
  q: string
  a: string
}

export interface Plan {
  id: 'start' | 'growth' | 'scale'
  name: string
  headline: string
  forWho: string
  items: string[]
  highlight?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'start',
    name: 'START',
    headline: 'Presença digital profissional',
    forWho: 'Para quem está começando ou precisa sair do improviso e ser encontrado no Google.',
    items: [
      'Site ou landing page rápida e otimizada para SEO',
      'Perfil da empresa no Google (Google Business Profile)',
      'Botão e fluxo de atendimento pelo WhatsApp',
      'Rastreamento configurado (GA4 e Meta Pixel)',
      'Identidade visual ajustada para o digital',
    ],
  },
  {
    id: 'growth',
    name: 'GROWTH',
    headline: 'Máquina de aquisição de clientes',
    forWho: 'Para empresas que já vendem e querem um fluxo previsível de leads qualificados.',
    items: [
      'Tudo do START',
      'Estratégia, posicionamento e oferta',
      'Tráfego pago no Google Ads e Meta Ads',
      'Landing pages de conversão por campanha',
      'CRM com funil de vendas e follow-up automatizado',
      'Relatórios mensais com custo por lead e por venda',
    ],
    highlight: true,
  },
  {
    id: 'scale',
    name: 'SCALE',
    headline: 'Infraestrutura digital completa',
    forWho: 'Para operações que precisam de tecnologia própria para crescer sem aumentar a equipe.',
    items: [
      'Tudo do GROWTH',
      'Software e sistemas sob medida',
      'Agentes de IA para atendimento e qualificação',
      'Integração de dados e dashboards de gestão',
      'Otimização do processo comercial',
    ],
  },
]

export const HOME_FAQ: Faq[] = [
  {
    q: 'O que a Meta Impulso faz?',
    a: 'Somos uma empresa de marketing digital e tecnologia de Brasília. Planejamos e executamos tráfego pago (Google Ads e Meta Ads), criamos sites e landing pages, implantamos CRM, automações e agentes de IA e desenvolvemos software sob medida. Tudo integrado para que o investimento em marketing vire venda.',
  },
  {
    q: 'Vocês atendem apenas empresas de Brasília?',
    a: 'Não. Nossa sede é em Brasília (DF) e atendemos empresas de todo o Brasil. Reuniões, implantação e acompanhamento podem ser feitos de forma remota ou presencial no DF.',
  },
  {
    q: 'Qual a diferença para uma agência de marketing comum?',
    a: 'Além de anúncios e criativos, construímos a tecnologia que transforma o clique em cliente: sites rápidos, CRM, automações de WhatsApp, agentes de IA e sistemas próprios. Marketing e engenharia ficam na mesma equipe, com uma única responsabilidade pelo resultado.',
  },
  {
    q: 'Quanto custa contratar a Meta Impulso?',
    a: 'O investimento depende do escopo e do plano (START, GROWTH ou SCALE). Em tráfego pago, a verba de mídia é paga diretamente ao Google e à Meta e fica separada da gestão. Definimos tudo após o diagnóstico gratuito, com proposta por escrito.',
  },
  {
    q: 'Em quanto tempo vejo resultados?',
    a: 'Campanhas de tráfego pago costumam gerar os primeiros contatos logo após a publicação, mas a otimização para custo por venda leva algumas semanas de dados. SEO é um trabalho de médio prazo, normalmente de meses. No diagnóstico mostramos o que é realista para o seu mercado, sem promessas genéricas.',
  },
  {
    q: 'Como funciona o diagnóstico digital gratuito?',
    a: 'Você responde um questionário rápido aqui no site e agendamos uma conversa estratégica de 30 minutos. Analisamos sua presença digital, seus canais de aquisição e seu processo comercial e indicamos as prioridades, mesmo que você não feche com a gente.',
  },
]

export const PROCESS_STEPS = [
  { num: '01', title: 'Diagnóstico', desc: 'Analisamos seu mercado, sua presença digital, seus números e o processo comercial atual.', color: '#FF9F43' },
  { num: '02', title: 'Estratégia', desc: 'Definimos posicionamento, oferta, canais, metas e o plano de execução priorizado.', color: '#D649FB' },
  { num: '03', title: 'Implementação', desc: 'Colocamos no ar sites, campanhas, CRM, automações e integrações.', color: '#7B2EFF' },
  { num: '04', title: 'Medição', desc: 'Acompanhamos custo por lead, conversão e vendas com rastreamento ponta a ponta.', color: '#0597D8' },
  { num: '05', title: 'Escala', desc: 'Otimizamos o que funciona e ampliamos verba, canais e automações com segurança.', color: '#00B4CC' },
]
