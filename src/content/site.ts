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
  /** Online scheduling link (Google Agenda, Calendly...). When set, the quiz offers "escolher horário". */
  bookingUrl: '' as string,
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
    q: 'A Meta Impulso cuida de tudo ou só de uma parte?',
    a: 'Você escolhe. Podemos assumir uma frente específica, como o tráfego pago ou o site, ou toda a estrutura: estratégia, marca, site, anúncios, CRM, automação, agentes de IA e software. No modelo completo, uma única equipe responde pelo resultado, do anúncio até a venda, e você deixa de coordenar vários fornecedores.',
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
    q: 'Já tenho agência. Por que falaria com vocês?',
    a: 'Porque a pergunta certa não é quem faz os anúncios, e sim se você sabe quanto custa cada cliente que eles trazem. Se a resposta for sim, ótimo. Se não for, o Raio-X e o diagnóstico mostram onde está o furo, e o resultado serve até para a sua agência atual.',
  },
  {
    q: 'Já tentei tráfego pago e não funcionou. Por que agora seria diferente?',
    a: 'Na maioria das vezes, o problema não é o anúncio: é o que acontece depois do clique. Página lenta, ninguém respondendo o WhatsApp a tempo, nenhum follow-up e nenhuma medição. Nós cuidamos do caminho inteiro, do anúncio até a venda, e mostramos os números de cada etapa.',
  },
  {
    q: 'Vocês garantem resultado?',
    a: 'Não prometemos número garantido, e desconfie de quem promete. Garantimos método, prazo de entrega e transparência: você vê o custo por lead e por venda de cada canal, e decide com dados.',
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
  { num: '01', title: 'Diagnóstico', desc: 'Analisamos seu mercado, sua presença digital, seus números e o processo comercial atual.', color: '#B3529F' },
  { num: '02', title: 'Estratégia', desc: 'Definimos posicionamento, oferta, canais, metas e o plano de execução priorizado.', color: '#935AA6' },
  { num: '03', title: 'Implementação', desc: 'Colocamos no ar sites, campanhas, CRM, automações e integrações.', color: '#725BA7' },
  { num: '04', title: 'Medição', desc: 'Acompanhamos custo por lead, conversão e vendas com rastreamento ponta a ponta.', color: '#4A7FC0' },
  { num: '05', title: 'Escala', desc: 'Otimizamos o que funciona e ampliamos verba, canais e automações com segurança.', color: '#2E8FBF' },
]

/** What the free diagnostic actually checks (offer made concrete). */
export const DIAGNOSTIC_DELIVERABLES = [
  { title: 'Site no celular', desc: 'velocidade, clareza da oferta e o caminho até o contato.' },
  { title: 'Rastreamento', desc: 'se GA4, Meta Pixel e conversões medem lead e venda de verdade.' },
  { title: 'Google', desc: 'perfil da empresa, avaliações e presença nas buscas locais.' },
  { title: 'Anúncios', desc: 'para onde levam e onde a verba pode estar sendo desperdiçada.' },
  { title: 'Atendimento', desc: 'tempo de resposta e follow-up no WhatsApp e no CRM.' },
]

/** "One team responsible for everything": the core positioning argument. */
export const ONE_TEAM = {
  usual: [
    'Uma agência para os anúncios e outro fornecedor para o site',
    'CRM e automações montados por terceiros, sem integração',
    'Cada um mede uma coisa e ninguém mede a venda',
    'Quando o resultado não vem, um culpa o outro',
    'Você vira o gerente de projeto de todo mundo',
  ],
  withUs: [
    'Uma equipe cuida de estratégia, marca, site, anúncios, CRM, automação e IA',
    'Tudo integrado: o lead do anúncio cai no CRM e recebe resposta na hora',
    'Custo por lead e por venda de cada canal em um só relatório',
    'Um único responsável pelo resultado, do clique ao fechamento',
    'Você decide as prioridades; nós executamos e prestamos contas',
  ],
  chain: ['Estratégia', 'Marca', 'Site', 'Tráfego', 'CRM', 'Automação', 'IA', 'Dados'],
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

/**
 * Real client testimonials only, with written authorization to publish.
 * The section stays hidden while this list is empty.
 */
export const TESTIMONIALS: Testimonial[] = []

/** Home "funil furado": the five places where sales leak, and how we close each one. */
export const FUNNEL_LEAKS = [
  { stage: 'Anúncio', leak: 'O anúncio leva para o Instagram ou para uma página genérica, e ninguém sabe qual campanha trouxe o cliente.', fix: 'Campanhas no Google e no Meta com rastreamento do clique até a venda.' },
  { stage: 'Site', leak: 'A página demora no celular, a oferta não fica clara e não existe um próximo passo óbvio.', fix: 'Site e landing pages rápidos, com uma única ação: falar com você.' },
  { stage: 'Atendimento', leak: 'O lead chama no WhatsApp e espera horas. Quem pede orçamento fala com três concorrentes ao mesmo tempo.', fix: 'Resposta em segundos com automação e agente de IA, inclusive fora do horário.' },
  { stage: 'Follow-up', leak: 'Quem não fechou na hora é esquecido, e a venda dependia de um segundo contato.', fix: 'CRM com funil e follow-up automático: nenhum lead fica sem retorno.' },
  { stage: 'Medição', leak: 'Sem números, a verba é decidida no achismo e campanhas boas são cortadas junto com as ruins.', fix: 'Custo por lead e por venda de cada canal em um só relatório.' },
]

/** What the Raio-X checks automatically (hero preview + tool page). */
export const RAIOX_CHECKS = [
  { title: 'Velocidade no celular', desc: 'Nota oficial do Google PageSpeed e tempo até o conteúdo principal aparecer.' },
  { title: 'Rastreamento', desc: 'Google Analytics, Tag Manager, Pixel da Meta e tag de conversão do Google Ads.' },
  { title: 'Conversão', desc: 'Botão de WhatsApp, telefone clicável e formulário de contato.' },
  { title: 'O que o Google vê', desc: 'Título, descrição, título principal, HTTPS, ajuste para celular e dados estruturados.' },
]

/** What only a person checks: the bridge from the free tool to the free diagnostic. */
export const RAIOX_HUMAN_CHECKS = [
  'Perfil no Google Maps, fotos e avaliações',
  'Anúncios ativos e para onde eles levam',
  'Quanto tempo sua equipe leva para responder no WhatsApp',
  'Follow-up, CRM e o caminho até a venda',
]

export const TOOL_FAQ: Faq[] = [
  {
    q: 'O Raio-X de Vendas é grátis mesmo?',
    a: 'Sim. Não pedimos cadastro nem cartão. Se quiser ajuda para corrigir o que apareceu, você pode pedir o diagnóstico gratuito com um especialista da Meta Impulso.',
  },
  {
    q: 'O que a análise de site verifica?',
    a: 'A velocidade no celular (medida pelo Google PageSpeed Insights), o rastreamento (Google Analytics, Tag Manager, Pixel da Meta e Google Ads), os caminhos de contato (WhatsApp, telefone e formulário) e o que o Google lê da página (título, descrição, HTTPS, ajuste para celular e dados estruturados).',
  },
  {
    q: 'Por que a nota de velocidade muda a cada teste?',
    a: 'A velocidade é medida pelo Google em um celular simulado, e pequenas variações de rede e de servidor mudam a nota de um teste para outro. Olhe a faixa (lento, médio ou rápido), não o número exato.',
  },
  {
    q: 'Meu site tem aviso de cookies. O Raio-X detecta o rastreamento?',
    a: 'Se o Google Analytics ou o Pixel só carregam depois do aceite dos cookies, eles não aparecem na leitura automática. Nesse caso, conferimos manualmente na análise completa.',
  },
  {
    q: 'Não tenho site, só Instagram. Serve para mim?',
    a: 'O Raio-X precisa do endereço de um site. Se você vende pelo Instagram ou pelo WhatsApp, o diagnóstico gratuito é o caminho: analisamos perfil, anúncios e atendimento com você.',
  },
  {
    q: 'Vocês guardam o endereço que eu analiso?',
    a: 'Não pedimos cadastro e não salvamos o resultado em banco de dados. A velocidade é medida pelo Google PageSpeed Insights. Seus dados só chegam até nós se você pedir o diagnóstico e enviar o formulário.',
  },
]
