# Checklist pós-deploy — SEO, medição e captação

> Squad: INDEX (SEO) · QUANT (dados) · NEXA (automação) · SENTINEL (LGPD)

## 1. Depois do deploy (dia 1)

- [ ] Abrir `https://www.metaimpulso.com.br/sitemap.xml` e `/robots.txt` e confirmar que respondem 200.
- [ ] Testar cada página: `/`, `/trafego-pago-brasilia`, `/criacao-de-sites-brasilia`, `/seo-brasilia`, `/desenvolvimento-de-software-brasilia`, `/automacao-e-inteligencia-artificial`, `/politica-de-privacidade`.
- [ ] Validar dados estruturados em https://search.google.com/test/rich-results (home e uma página de serviço).
- [ ] Testar a prévia de link colando a URL no WhatsApp/LinkedIn (deve aparecer a imagem `og-image.png`).
- [ ] Rodar https://pagespeed.web.dev na home (mobile).

## 2. Google Search Console

- [ ] Adicionar a propriedade de **domínio** `metaimpulso.com.br` (verificação por registro TXT no DNS da Cloudflare).
- [ ] Enviar o sitemap: `https://www.metaimpulso.com.br/sitemap.xml`.
- [ ] Em "Inspeção de URL", solicitar indexação das 6 páginas principais.
- [ ] Revisar o relatório de páginas após 7–14 dias.

Repetir no **Bing Webmaster Tools** (importa direto do Search Console).

## 3. Google Business Profile (SEO local — maior alavanca para "em Brasília")

- [ ] Criar/reivindicar o perfil "Meta Impulso" com o **mesmo** nome, endereço e telefone do site (SCN Quadra 4, Bloco B, Asa Norte · +55 61 99501-1614).
- [ ] Categoria principal: *Agência de marketing*; secundárias: *Criador de sites*, *Empresa de software*, *Consultor de marketing*.
- [ ] Adicionar serviços (os 5 das páginas), fotos da equipe/escritório, horário e link para o site.
- [ ] Pedir avaliações aos clientes atuais e responder todas.
- [ ] Publicar um post por semana no perfil.

> Se o endereço for de um coworking/escritório virtual, confira as diretrizes do Google para perfis — em alguns casos é necessário ocultar o endereço e definir área de atendimento.

## 4. Medição (GTM + GA4 + Meta Pixel)

1. Criar um container no Google Tag Manager e um fluxo de dados no GA4.
2. Na Vercel → Settings → Environment Variables, cadastrar `VITE_GTM_ID=GTM-XXXXXXX` e fazer redeploy.
3. No GTM, configurar:
   - Tag Google (GA4) disparando em todas as páginas.
   - Meta Pixel (PageView).
   - Eventos personalizados (gatilho "Evento personalizado" do dataLayer) que o site já envia:
     - `generate_lead` → conversão principal (GA4 key event, Meta `Lead`, conversão do Google Ads).
     - `whatsapp_click` (parâmetro `origin`) → conversão secundária.
     - `quiz_start`, `cta_click`.
4. O GTM só é carregado depois que o visitante aceita o aviso de cookies.

## 5. Recebimento de leads (webhook)

1. Criar um cenário no Make (ou Zapier/n8n) com gatilho **Custom Webhook**.
2. Cadastrar a URL na Vercel como `VITE_LEAD_WEBHOOK_URL` e fazer redeploy.
3. O site envia um JSON (`Content-Type: text/plain`) com: empresa, objetivo, faturamento, orçamento, nome, WhatsApp, e-mail, página, data, consentimento LGPD e UTMs/gclid/fbclid. No Make, use o módulo *Parse JSON*.
4. Ações sugeridas: criar o lead no CRM (ou Google Sheets) + mensagem de alerta no WhatsApp/e-mail do comercial.
5. Fazer um envio de teste pelo site e conferir.

## 6. Conteúdo e autoridade (meses 1–3)

| Página | Palavra-chave principal [H] | Variações |
|---|---|---|
| Home | agência de marketing digital Brasília | marketing digital DF, agência de tráfego Brasília |
| /trafego-pago-brasilia | gestão de tráfego pago Brasília | Google Ads Brasília, gestor de tráfego DF |
| /criacao-de-sites-brasilia | criação de sites Brasília | landing page Brasília, desenvolvimento de sites DF |
| /seo-brasilia | SEO Brasília | consultoria SEO DF, otimização de sites |
| /desenvolvimento-de-software-brasilia | desenvolvimento de software Brasília | CRM personalizado, sistema sob medida DF |
| /automacao-e-inteligencia-artificial | automação WhatsApp empresas | agente de IA para atendimento, chatbot com IA |

> **[H]** Volumes de busca não foram medidos. Validar no Planejador de Palavras-chave do Google Ads e ajustar títulos depois de 60 dias de dados do Search Console.

- [ ] Publicar 2 artigos/mês respondendo dúvidas reais de clientes (ex.: "Quanto investir em Google Ads em Brasília", "Como responder leads no WhatsApp mais rápido").
- [ ] Páginas por segmento quando houver cases (ex.: "Marketing para clínicas em Brasília").
- [ ] Backlinks: rodapé dos sites de clientes, LinkedIn da empresa, diretórios (OHub, parceiros Kommo/RD se houver), parcerias locais.

## 7. Pendências que dependem de você

- [ ] **Central Farma:** o deploy em `centralfarm.metaimpulso.com.br` está fora do ar (Vercel `DEPLOYMENT_NOT_FOUND`). Ao republicar, reativar `isOnline` e `vercelUrl` em `src/components/PortfolioShowcase.tsx`.
- [ ] **Títulos dos projetos publicados:** `operator.voogle.com.br` e `meta-impulso-apresenta-o.vercel.app` exibem "My Google AI Studio App" como título — corrigir nos respectivos repositórios.
- [ ] **Métricas dos cases:** os números anteriores (+350%, 28% de conversão, +12.000 membros etc.) foram substituídos por descrições qualitativas. Reinserir apenas os que tiverem comprovação documentada e autorização do cliente.
- [ ] **Stack declarada nos cases:** confirmar as tecnologias listadas (ex.: Python/FastAPI na esteira de crédito, Redis no Infinity Club).
- [ ] **E-mail no domínio:** trocar `metaimpulsobr@gmail.com` por `contato@metaimpulso.com.br` em `src/content/site.ts`.
- [ ] **CNPJ e razão social** na política de privacidade (`src/pages/PrivacyPage.tsx`) e revisão jurídica do texto.
- [ ] **LinkedIn:** confirmar que `linkedin.com/company/metaimpulso` existe (o link não pôde ser verificado).
