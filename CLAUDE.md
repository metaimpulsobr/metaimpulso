# META IMPULSO: memória operacional

Este repositório é o site da Meta Impulso **e** a memória da operação. Leia antes de qualquer tarefa. Detalhes completos em `docs/`.

## 1. Quem somos (memória global)

- **Meta Impulso**: marketing, tecnologia e vendas, sediada em Brasília (DF), atende todo o Brasil. Não é agência de posts.
- **Posicionamento:** uma única empresa responsável por tudo o que gera venda, do anúncio ao fechamento: estratégia, marca, site, tráfego (Google/Meta Ads), CRM, automação, agentes de IA, software e dados.
- **Planos:** START (presença digital) · GROWTH (máquina de aquisição: estratégia + site + tráfego + CRM + automação + relatórios) · SCALE (GROWTH + software, agentes de IA, dados, processo comercial). Preço definido no diagnóstico; verba de mídia separada da gestão.
- **Grande ideia:** "prova antes de prometer". Mecanismo: **Funil Blindado** (fechar os 5 furos: anúncio, site, atendimento, follow-up, medição). Mensagem completa: `docs/MENSAGEM-E-COPY.md`.
- **Oferta de entrada:** Raio-X de Vendas grátis (`/analise-de-site-gratis`, nota de 0 a 100 do site) → diagnóstico digital gratuito (site no celular, rastreamento, Google, anúncios, atendimento) + conversa de 30 min.
- **NAP (usar sempre igual):** SCN Quadra 4, Bloco B, Asa Norte, Brasília - DF · WhatsApp +55 61 99501-1614 · seg–sex 9h–18h. Fonte única: `src/content/site.ts`.
- **Cases reais:** Grupo Voogle (portal, CRM, esteira de crédito, Infinity Club, Operator AI), Drogaria Central Farma, Meta Core CRM. Métricas dos cases só com evidência documentada e autorização.

## 2. Regras de operação (não negociáveis)

- **Nunca inventar** métricas, depoimentos, clientes, resultados ou integrações. Marcar afirmações como **[F]** fato ou **[H]** hipótese.
- **Aprovação humana** antes de: gastar verba, publicar campanhas, envios em massa, mudanças contratuais/jurídicas/financeiras, apagar dados.
- **LGPD:** prospecção B2B só com dados corporativos públicos (legítimo interesse), sem listas compradas, sem CPF, opt-out respeitado na hora e registrado. WhatsApp de prospecção é manual e personalizado; volume só pela API oficial.
- **Saúde e advocacia** (CFM/CFO/OAB): sem promessa de resultado e sem antes/depois nos anúncios. SENTINEL revisa.
- Agentes, comandos e protocolo: skill `meta-impulso-ai-os` (META SQUAD, ANALISAR, EXECUTAR, WAR ROOM, AUDIT...).

## 3. Vendas (HUNT · CLOSER · CORE): `docs/PROSPECCAO.md`

- **ICP por prioridade (DF):** 1 clínicas (odonto, estética, fisio, médicas) · 2 seguros/consultorias/financeiro · 3 farmácias e varejo local · 4 imobiliárias/construtoras · 5 escolas/cursos/clubes. Faturamento a partir de ~R$ 50 mil/mês [H].
- **Gancho:** Auditoria Digital Express (vídeo de 2–3 min, 5 itens). Usar 1–2 achados na 1ª mensagem.
- **Cadência 14 dias:** D1 LinkedIn + e-mail · D3 WhatsApp · D5 ligação · D7 vídeo · D10 case · D14 break-up.
- **Metas semanais [H]:** 100 empresas na lista · 100 abordagens · 40 WhatsApp · 20 vídeos · 4–6 reuniões.
- **SQL:** dor clara + orçamento ≥ START + decisor na conversa + prazo ≤ 90 dias.
- **Funil CRM:** Lead → Contatado → Respondeu → Auditoria enviada → Reunião agendada → Reunião realizada → Proposta → Negociação → Ganho / Perdido (motivo) / Opt-out.

## 4. Captação inbound (NEXA · CORE · QUANT): `docs/MAQUINA-DE-VENDAS.md`

- O quiz do site envia ao webhook (`VITE_LEAD_WEBHOOK_URL`) com `lead_score`, `lead_priority` (alta ≥ 70 · média ≥ 45 · baixa), `recommended_plan`, UTMs e `form_location`. Sem webhook, o lead vai pelo WhatsApp.
- **Roteamento:** alta → alerta imediato ao comercial (meta ≤ 5 min [H]) · média → mesmo dia · baixa → até 24 h.
- **Eventos:** `cta_click`, `quiz_start`, `quiz_step`, `generate_lead`, `whatsapp_click` (dataLayer/GTM após consentimento + Vercel Analytics).

- **Raio-X de Vendas:** `api/raio-x.ts` (função na Vercel, lê o HTML com proteção contra endereços internos) + PageSpeed no navegador (`VITE_PSI_API_KEY`). Lógica e textos da nota em `src/lib/raiox.ts`. O resultado vai junto com o lead (`site_url`, `raiox_score`, `raiox_alertas`).
- **Receptor inicial (grátis):** Google Sheets + Apps Script com e-mail de aviso: `docs/RECEBER-LEADS-GOOGLE-SHEETS.md`. Regra geral: todo lead respondido em até 15 min no horário comercial.

## 5. Proposta e preço (CLOSER · LEDGER · SENTINEL): `docs/PROPOSTA-MODELO.md`

- Proposta só **depois** da reunião de diagnóstico, com as palavras do cliente; validade 15 dias; nunca prometer resultado numérico (prometer método, prazo e transparência).
- Preço calculado pelo custo/hora × (1 + margem 40–60% [H]); faixas por plano ainda **não definidas** (preencher após 2–3 propostas reais; revisar a cada 5).
- Verba de mídia nunca passa pela conta da Meta Impulso; implantação cobrada (ao menos parte) antes de começar; contrato revisado por advogado.

## 6. SEO e medição (INDEX): `docs/SEO-POS-DEPLOY.md` e `docs/ESTRATEGIA-GOOGLE-TOP5.md`

Top 5 = aparecer no mapa (Perfil da Empresa, maior alavanca) + resultado orgânico + dentro das listas/diretórios que já ranqueiam. Search Console + sitemap, avaliações semanais, 2 conteúdos/mês (calendário no doc), Raio-X como ímã de links, backlinks "Desenvolvido por Meta Impulso". Nunca prometer posição.

## 7. Identidade visual (AURA · PIXEL): `docs/IDENTIDADE-VISUAL.md`

Cores oficiais do logo (`logopdf/`): ameixa `#B3529F` · violeta `#725BA7` · ciano `#6BCDE7` · grafite `#231F20`. Laranja e magenta neon **não** fazem parte da marca. Tokens em `src/index.css` (`--brand-*`, `--gradient-meta`, `--gradient-text`, `--gradient-brand`). Direção **"Brasília Branca" (minimalismo + 3D)**: página branca, seções em névoa `#F6F6F9`, marco de Brasília em 3D só no topo (Museu Nacional na home atrás do Raio-X e na página do Raio-X, Catedral nas páginas de serviço; demais cenas em `design/3d/` para peças; dados em `src/content/brasilia.ts`), mockups e cards com profundidade 3D, **violeta = cor de ação**, destaque dos títulos em violeta sólido, gradiente só no logo, títulos em Sora 700, rótulos e botões em Inter com letra normal. Sem faixas escuras, neon, grades, brilhos, legendas nos prédios ou detalhes com "cara de IA" (rótulos em maiúsculas espaçadas, fonte de código, bolinha ao vivo, numeração 01/02).

## 8. Pendências abertas (atualize ao resolver)

Roteiro do dono, na ordem: `docs/PASSO-A-PASSO.md` (Vercel Analytics → Search Console → Perfil da Empresa no Google → planilha de leads → robôs de IA na Cloudflare → prova social → preços e prospecção → GTM antes de anunciar).


- P0: confirmar `VITE_LEAD_WEBHOOK_URL` na Vercel e montar roteamento por prioridade; definir quem responde leads `alta`.
- P0: criar `VITE_PSI_API_KEY` (passo a passo, etapa 4.1); sem ela o Raio-X costuma sair sem a nota de velocidade.
- P1: decidir garantia formal (ex.: sem fidelidade) antes de publicar; nada de garantia inventada.
- P1: depoimentos autorizados (`TESTIMONIALS`), link de agenda (`SITE.bookingUrl`), decisão sobre preço "a partir de", e-mail no domínio, CNPJ na política de privacidade, Google Business Profile.
- P1: prints reais (sem dados de clientes) dos sistemas Voogle, Central Farma e Meta Core CRM para trocar as ilustrações dos cases (`shot` em `src/content/cases.ts`, arquivos em `public/cases/`).
- P1: Central Farma fora do ar (preencher `url` em `src/content/cases.ts` quando voltar); título "My Google AI Studio App" em `operator.voogle.com.br` e `meta-impulso-apresenta-o.vercel.app`.
- P1: tabela de preços por plano (`docs/PROPOSTA-MODELO.md`) e contrato padrão com advogado.

## 9. Código

- React 19 + TypeScript + Vite, pré-renderização estática por rota (`scripts/prerender.mjs`), deploy na Vercel.
- `npm run build` (inclui prerender e sitemap) e `npm run lint` devem passar antes de qualquer commit.
- Conteúdo em `src/content/` (site, serviços, cases), SEO em `src/seo/routes.ts`, captação em `src/lib/` e `src/components/Diagnostic*`.
- Nova página de serviço: item em `SERVICES` (`src/content/services.ts`), com `objectiveId` do quiz.
- Commits em português, mensagens descritivas.
