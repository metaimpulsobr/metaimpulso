import type { Faq } from './site'

export interface ServiceContent {
  slug: string
  navLabel: string
  serviceType: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  intro: string
  pains: string[]
  deliverablesTitle: string
  deliverables: { title: string; desc: string }[]
  forWho: string[]
  faq: Faq[]
  ctaTitle: string
  whatsappMsg: string
}

export const SERVICES: ServiceContent[] = [
  {
    slug: 'trafego-pago-brasilia',
    navLabel: 'Tráfego pago',
    serviceType: 'Gestão de tráfego pago',
    metaTitle: 'Tráfego Pago em Brasília: Google Ads e Meta Ads | Meta Impulso',
    metaDescription:
      'Gestão de tráfego pago em Brasília com Google Ads e Meta Ads focada em leads qualificados e vendas. Campanhas integradas a site, CRM e WhatsApp.',
    eyebrow: 'Gestão de tráfego pago · Brasília e todo o Brasil',
    h1: 'Gestão de tráfego pago em Brasília para gerar clientes, não só cliques',
    intro:
      'Planejamos, criamos e otimizamos campanhas no Google Ads e no Meta Ads (Instagram e Facebook) conectadas ao seu site, ao WhatsApp e ao CRM. Assim você sabe quanto custa cada lead, cada venda e onde investir o próximo real.',
    pains: [
      'Você investe em anúncios, mas não sabe quanto cada cliente realmente custou.',
      'Os contatos chegam frios ou desqualificados e o comercial perde tempo.',
      'A estratégia se resume a impulsionar posts e para de funcionar quando a verba acaba.',
    ],
    deliverablesTitle: 'O que está incluído na gestão de tráfego',
    deliverables: [
      { title: 'Google Ads', desc: 'Campanhas de pesquisa para quem já procura o que você vende, além de Performance Max, Display e YouTube quando fizer sentido.' },
      { title: 'Meta Ads', desc: 'Instagram e Facebook com públicos segmentados, criativos testados e remarketing para quem já demonstrou interesse.' },
      { title: 'Rastreamento de conversões', desc: 'GA4, Google Tag Manager, Meta Pixel e API de Conversões configurados para medir lead e venda, não só clique.' },
      { title: 'Landing pages de conversão', desc: 'Páginas rápidas, específicas por campanha e com mensagem alinhada ao anúncio.' },
      { title: 'Leads direto no CRM e no WhatsApp', desc: 'Cada contato entra organizado no funil, com origem da campanha registrada e follow-up automático.' },
      { title: 'Relatórios que orientam decisão', desc: 'Custo por lead (CPL), custo por aquisição (CPA) e retorno sobre investimento (ROAS) em linguagem clara.' },
    ],
    forWho: [
      'Clínicas, consultórios e escritórios que dependem de agendamentos',
      'Negócios locais do DF que querem ser encontrados no Google',
      'Empresas B2B com venda consultiva e ticket médio alto',
      'E-commerces e catálogos que vendem pelo WhatsApp',
    ],
    faq: [
      {
        q: 'Quanto preciso investir em anúncios?',
        a: 'Depende do seu mercado, da concorrência e da meta de vendas. No diagnóstico estimamos uma verba mínima viável para gerar dados e aprender rápido. A verba de mídia é paga direto ao Google e à Meta, separada do valor da gestão.',
      },
      {
        q: 'Google Ads ou Meta Ads: qual é melhor para minha empresa?',
        a: 'O Google Ads captura quem já está procurando seu serviço (alta intenção). O Meta Ads gera demanda e alcança pessoas pelo perfil e interesse. A maioria das empresas se beneficia da combinação dos dois, e definimos o peso de cada canal pelos seus números.',
      },
      {
        q: 'Em quanto tempo as campanhas trazem resultado?',
        a: 'Os primeiros contatos costumam chegar logo após a publicação. A otimização para reduzir o custo por venda exige algumas semanas de dados. Acompanhamos e ajustamos as campanhas continuamente.',
      },
      {
        q: 'Vocês atendem empresas fora de Brasília?',
        a: 'Sim. Somos de Brasília e gerenciamos campanhas para empresas de todo o Brasil, com segmentação local, regional ou nacional.',
      },
    ],
    ctaTitle: 'Quer saber quanto pode custar cada cliente no seu mercado?',
    whatsappMsg: 'Olá! Vim pela página de tráfego pago e quero um diagnóstico das minhas campanhas.',
  },
  {
    slug: 'criacao-de-sites-brasilia',
    navLabel: 'Criação de sites',
    serviceType: 'Criação de sites e landing pages',
    metaTitle: 'Criação de Sites e Landing Pages em Brasília | Meta Impulso',
    metaDescription:
      'Criação de sites, landing pages e e-commerces em Brasília: rápidos, otimizados para SEO e feitos para converter visitantes em clientes pelo WhatsApp e CRM.',
    eyebrow: 'Sites, landing pages e e-commerce · Brasília',
    h1: 'Criação de sites e landing pages em Brasília feitos para vender',
    intro:
      'Desenvolvemos sites institucionais, landing pages e catálogos digitais com tecnologia moderna (React, Next.js e TypeScript), carregamento rápido, SEO técnico desde a base e integração com WhatsApp, CRM e ferramentas de análise.',
    pains: [
      'Seu site é bonito, mas não gera contatos.',
      'Ele demora para abrir no celular e o visitante desiste antes de ler.',
      'Ninguém encontra sua empresa no Google quando procura pelo seu serviço.',
    ],
    deliverablesTitle: 'O que entregamos no seu site',
    deliverables: [
      { title: 'Site institucional', desc: 'Apresentação clara da empresa, dos serviços e das provas de confiança, com chamadas para ação em cada seção.' },
      { title: 'Landing pages', desc: 'Páginas de alta conversão para campanhas, lançamentos e captação de leads.' },
      { title: 'E-commerce e catálogo', desc: 'Vitrine de produtos com carrinho e envio do pedido pelo WhatsApp, sem cadastros longos.' },
      { title: 'SEO técnico', desc: 'HTML semântico, metadados, dados estruturados, sitemap e páginas otimizadas para palavras-chave locais.' },
      { title: 'Performance', desc: 'Foco em Core Web Vitals: imagens otimizadas, código enxuto e hospedagem em CDN.' },
      { title: 'Integrações', desc: 'Formulários que alimentam o CRM, rastreamento de conversões (GA4, Pixel) e automações de atendimento.' },
    ],
    forWho: [
      'Empresas sem site ou com site desatualizado',
      'Negócios que vão investir em tráfego pago e precisam de uma página que converta',
      'Lojas e farmácias que vendem pelo WhatsApp',
      'Prestadores de serviço que querem aparecer no Google',
    ],
    faq: [
      {
        q: 'Quanto tempo leva para criar um site?',
        a: 'O prazo é definido no escopo, após o diagnóstico. Landing pages costumam ser as entregas mais rápidas, e sites com mais páginas, integrações ou catálogo exigem mais etapas de conteúdo e validação.',
      },
      {
        q: 'Vocês usam WordPress?',
        a: 'Trabalhamos principalmente com React, Next.js e TypeScript, o que garante velocidade, segurança e liberdade de integração. Quando o projeto exige edição frequente de conteúdo, integramos um painel de gestão.',
      },
      {
        q: 'O site já sai otimizado para o Google?',
        a: 'Sim. Todo projeto inclui SEO técnico: estrutura de títulos, metadados, dados estruturados, sitemap, URLs amigáveis e desempenho. O ranqueamento também depende de conteúdo e autoridade, que trabalhamos no serviço de SEO.',
      },
      {
        q: 'Vocês cuidam de domínio e hospedagem?',
        a: 'Sim. Orientamos o registro do domínio e publicamos o site em infraestrutura de CDN, com HTTPS e monitoramento.',
      },
    ],
    ctaTitle: 'Vamos transformar seu site em um canal de vendas?',
    whatsappMsg: 'Olá! Vim pela página de criação de sites e gostaria de um orçamento.',
  },
  {
    slug: 'seo-brasilia',
    navLabel: 'SEO',
    serviceType: 'Otimização para mecanismos de busca (SEO)',
    metaTitle: 'SEO em Brasília: Otimização de Sites para o Google | Meta Impulso',
    metaDescription:
      'Consultoria de SEO em Brasília: auditoria técnica, SEO local, conteúdo e Google Business Profile para atrair clientes que já estão buscando o seu serviço.',
    eyebrow: 'SEO técnico, local e de conteúdo · Brasília',
    h1: 'SEO em Brasília: apareça no Google para quem já está procurando o que você vende',
    intro:
      'O SEO coloca sua empresa nos resultados orgânicos e no mapa do Google sem custo por clique. Combinamos SEO técnico, conteúdo estratégico e SEO local para atrair visitantes com intenção de compra.',
    pains: [
      'Seus concorrentes aparecem no Google e sua empresa não.',
      'Você depende 100% de anúncios pagos para gerar contatos.',
      'Seu perfil no Google Maps está incompleto ou sem avaliações.',
    ],
    deliverablesTitle: 'Como trabalhamos o SEO do seu site',
    deliverables: [
      { title: 'Auditoria técnica', desc: 'Indexação, velocidade, estrutura de URLs, erros de rastreamento e experiência no celular.' },
      { title: 'Pesquisa de palavras-chave', desc: 'Mapeamento dos termos que seus clientes realmente buscam, com foco em intenção de compra.' },
      { title: 'Otimização on-page', desc: 'Títulos, descrições, headings, links internos e conteúdo de cada página.' },
      { title: 'SEO local', desc: 'Google Business Profile otimizado, consistência de endereço e telefone e estratégia de avaliações.' },
      { title: 'Conteúdo', desc: 'Páginas de serviço e artigos que respondem às dúvidas do seu público e geram autoridade.' },
      { title: 'Dados estruturados e relatórios', desc: 'Schema.org e acompanhamento pelo Google Search Console, com evolução de posições e cliques.' },
    ],
    forWho: [
      'Empresas locais do DF que dependem de buscas no Google',
      'Negócios que querem reduzir a dependência de anúncios',
      'Sites com bom conteúdo, mas sem posicionamento',
      'Empresas B2B com ciclo de pesquisa longo',
    ],
    faq: [
      {
        q: 'Quanto tempo o SEO leva para dar resultado?',
        a: 'SEO é um trabalho de médio prazo. Correções técnicas e de SEO local podem trazer ganhos nas primeiras semanas, enquanto o posicionamento para termos competitivos costuma levar meses de trabalho consistente.',
      },
      {
        q: 'Vocês garantem a primeira posição no Google?',
        a: 'Não. Ninguém controla o algoritmo do Google, e desconfie de quem garante posição. Garantimos um método técnico, transparente e medido pelo Search Console.',
      },
      {
        q: 'SEO local é diferente de SEO comum?',
        a: 'Sim. O SEO local foca em aparecer no Google Maps e em buscas como "perto de mim" ou "em Brasília", com otimização do perfil da empresa, avaliações e consistência de dados.',
      },
      {
        q: 'Preciso ter blog?',
        a: 'Nem sempre. Para muitos negócios, páginas de serviço bem construídas e o SEO local geram mais resultado que um blog. Indicamos o formato certo no diagnóstico.',
      },
    ],
    ctaTitle: 'Quer descobrir por que sua empresa não aparece no Google?',
    whatsappMsg: 'Olá! Vim pela página de SEO e gostaria de uma análise do meu site.',
  },
  {
    slug: 'desenvolvimento-de-software-brasilia',
    navLabel: 'Software e CRM',
    serviceType: 'Desenvolvimento de software sob medida',
    metaTitle: 'Desenvolvimento de Software e CRM sob Medida em Brasília | Meta Impulso',
    metaDescription:
      'Desenvolvimento de software sob medida em Brasília: CRM personalizado, sistemas internos, portais de clientes e integrações com React, Node.js e PostgreSQL.',
    eyebrow: 'Software, CRM e sistemas web · Brasília',
    h1: 'Desenvolvimento de software sob medida em Brasília: CRM, sistemas e plataformas web',
    intro:
      'Quando planilhas e ferramentas prontas não acompanham sua operação, construímos o sistema certo para o seu processo: CRMs, painéis de gestão, portais de clientes, áreas de membros e integrações entre plataformas.',
    pains: [
      'Sua equipe perde tempo com planilhas e retrabalho manual.',
      'O CRM pronto não se adapta ao seu processo comercial.',
      'Seus sistemas não conversam entre si e os dados ficam espalhados.',
    ],
    deliverablesTitle: 'O que desenvolvemos',
    deliverables: [
      { title: 'CRM personalizado', desc: 'Funil Kanban, histórico de atendimento, integração com WhatsApp e relatórios de conversão.' },
      { title: 'Sistemas internos e painéis', desc: 'Dashboards administrativos, controle de operações e automação de rotinas.' },
      { title: 'Portais e áreas de membros', desc: 'Experiências web e PWA para clientes, associados e parceiros, com foco no celular.' },
      { title: 'Plataformas com regras de negócio', desc: 'Esteiras de aprovação, análise de dados e fluxos de decisão automatizados.' },
      { title: 'Integrações e APIs', desc: 'Conexão entre CRM, ERP, meios de pagamento, WhatsApp e ferramentas de marketing.' },
      { title: 'Arquitetura e segurança', desc: 'React, Next.js, Node.js, PostgreSQL e Supabase, com controle de acesso e boas práticas de LGPD.' },
    ],
    forWho: [
      'Empresas com processo comercial próprio que não cabe em ferramentas prontas',
      'Operações financeiras, de crédito e de serviços com fluxos de aprovação',
      'Clubes de benefícios, associações e programas de fidelidade',
      'Agências e times comerciais que precisam de CRM multi-equipes',
    ],
    faq: [
      {
        q: 'Quanto custa desenvolver um software sob medida?',
        a: 'Depende do escopo, das integrações e do nível de complexidade. Começamos com um diagnóstico e uma proposta por etapas, priorizando um MVP que já gere valor para a operação.',
      },
      {
        q: 'O sistema fica sendo meu?',
        a: 'As condições de propriedade, hospedagem e manutenção ficam definidas em contrato antes do início do projeto.',
      },
      {
        q: 'Vocês fazem manutenção e evolução depois da entrega?',
        a: 'Sim. Oferecemos suporte, monitoramento e evolução contínua com novas funcionalidades conforme a operação cresce.',
      },
      {
        q: 'É possível integrar com o sistema que já uso?',
        a: 'Na maioria dos casos, sim, via API, webhooks ou importação de dados. Avaliamos a viabilidade técnica no diagnóstico.',
      },
    ],
    ctaTitle: 'Tem um processo que precisa de um sistema próprio?',
    whatsappMsg: 'Olá! Vim pela página de desenvolvimento de software e quero conversar sobre um projeto.',
  },
  {
    slug: 'automacao-e-inteligencia-artificial',
    navLabel: 'Automação e IA',
    serviceType: 'Automação comercial e agentes de inteligência artificial',
    metaTitle: 'Automação de WhatsApp, CRM e Agentes de IA para Empresas | Meta Impulso',
    metaDescription:
      'Automação comercial e agentes de inteligência artificial para atender, qualificar e acompanhar leads pelo WhatsApp 24h, integrados ao seu CRM. Brasília e todo o Brasil.',
    eyebrow: 'Automação comercial, CRM e IA · Brasília e todo o Brasil',
    h1: 'Automação comercial e agentes de IA para atender, qualificar e vender pelo WhatsApp',
    intro:
      'Implantamos automações e agentes de inteligência artificial que respondem em segundos, qualificam o contato, agendam e registram tudo no CRM, liberando sua equipe para as conversas que fecham negócio.',
    pains: [
      'Leads esperam horas por resposta e compram do concorrente.',
      'Sua equipe responde as mesmas perguntas o dia inteiro.',
      'O follow-up depende da memória do vendedor e oportunidades se perdem.',
    ],
    deliverablesTitle: 'O que automatizamos',
    deliverables: [
      { title: 'Agente de IA no WhatsApp e no site', desc: 'Atendimento 24h treinado com as informações da sua empresa, com transferência para um humano quando necessário.' },
      { title: 'Qualificação automática', desc: 'Perguntas-chave, pontuação de leads e distribuição para o vendedor certo.' },
      { title: 'Follow-up automatizado', desc: 'Sequências de mensagens e lembretes para que nenhum lead fique sem retorno.' },
      { title: 'CRM integrado', desc: 'Cada conversa, origem e etapa registrada no funil, com visão clara do pipeline.' },
      { title: 'Fluxos e integrações', desc: 'Webhooks, Make e Zapier conectando formulários, planilhas, ERPs e ferramentas de marketing.' },
      { title: 'Agendamentos e notificações', desc: 'Marcação de reuniões e consultas e avisos automáticos para cliente e equipe.' },
    ],
    forWho: [
      'Empresas que recebem muitas mensagens no WhatsApp',
      'Clínicas e serviços com agendamento',
      'Times comerciais com leads de tráfego pago',
      'Operações que querem crescer sem aumentar a equipe na mesma proporção',
    ],
    faq: [
      {
        q: 'A IA substitui minha equipe de atendimento?',
        a: 'Não. Ela resolve o repetitivo, como dúvidas frequentes, triagem e agendamentos, e transfere para um humano as conversas que exigem negociação ou cuidado especial.',
      },
      {
        q: 'O agente de IA pode responder algo errado?',
        a: 'Reduzimos esse risco limitando o agente à base de conhecimento da sua empresa, definindo regras claras e revisando as conversas na implantação. Assuntos sensíveis são sempre direcionados a um humano.',
      },
      {
        q: 'Funciona com o meu número de WhatsApp atual?',
        a: 'Na maioria dos casos, sim. Para operações com volume, recomendamos a API oficial do WhatsApp Business, que oferece mais estabilidade e menor risco de bloqueio.',
      },
      {
        q: 'Como fica a LGPD?',
        a: 'Os fluxos são desenhados com finalidade definida, coleta mínima de dados, controle de acesso e informação clara ao usuário. Recomendamos validação jurídica da política de privacidade do seu negócio.',
      },
    ],
    ctaTitle: 'Quantos leads você perde por demorar para responder?',
    whatsappMsg: 'Olá! Vim pela página de automação e IA e quero automatizar meu atendimento.',
  },
]

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug)
}
