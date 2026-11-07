# Passo a passo para começar a operar — Meta Impulso

Faça **na ordem**. Cada etapa diz quanto tempo leva e como saber que deu certo.
O site já está pronto; estas etapas ligam o Google, os leads e as vendas.

---

## ✅ Etapa 1 — Ligar a medição de visitas (2 min)

1. Entre em https://vercel.com → projeto **metaimpulso** → menu **Analytics**.
2. Clique no botão branco **Enable**.

**Deu certo quando:** o selo "Demo Data" sumir do gráfico (pode levar algumas horas para aparecerem as primeiras visitas reais).

---

## ✅ Etapa 2 — Colocar o site no Google: Search Console (20 min)

1. Acesse https://search.google.com/search-console e entre com a conta Google da empresa.
2. Clique em **Adicionar propriedade** → escolha **Domínio** → digite `metaimpulso.com.br` → **Continuar**.
3. O Google mostra um código que começa com `google-site-verification=...`. Clique em **Copiar**.
4. Em outra aba, entre na **Cloudflare** (https://dash.cloudflare.com) → clique em **metaimpulso.com.br** → **DNS → Records → Add record**:
   - **Type:** TXT
   - **Name:** `@`
   - **Content:** cole o código copiado
   - **Save**
5. Volte ao Search Console e clique em **Verificar**. (Se falhar, espere 10 minutos e tente de novo.)
6. No menu da esquerda, clique em **Sitemaps** → digite `sitemap.xml` → **Enviar**.
7. No campo de busca do topo ("Inspecionar URL"), cole cada endereço abaixo e clique em **Solicitar indexação** (um de cada vez):
   - `https://www.metaimpulso.com.br/`
   - `https://www.metaimpulso.com.br/trafego-pago-brasilia`
   - `https://www.metaimpulso.com.br/criacao-de-sites-brasilia`
   - `https://www.metaimpulso.com.br/seo-brasilia`
   - `https://www.metaimpulso.com.br/desenvolvimento-de-software-brasilia`
   - `https://www.metaimpulso.com.br/automacao-e-inteligencia-artificial`

**Deu certo quando:** o sitemap aparecer como "Sucesso". Em 3 a 14 dias as páginas começam a aparecer no Google.

---

## ✅ Etapa 3 — Aparecer no Google Maps: Perfil da Empresa (30 min)

1. Acesse https://business.google.com → **Gerenciar agora**.
2. Nome: **Meta Impulso**.
3. Categoria principal: **Agência de marketing**. Depois adicione: *Criador de sites*, *Empresa de software*.
4. Endereço: **exatamente igual ao do site** — SCN Quadra 4, Bloco B, Asa Norte, Brasília - DF.
   - Se for escritório compartilhado/virtual, marque que **não atende clientes no endereço** e defina a área de atendimento "Brasília" e "Brasil".
5. Telefone: **(61) 99501-1614** · Site: **https://www.metaimpulso.com.br**
6. Horário: segunda a sexta, 9h às 18h.
7. Conclua a **verificação** que o Google pedir (vídeo, ligação ou carta).
8. Depois de verificado: adicione logo, 5 a 10 fotos, a descrição da empresa e os serviços.

**Deu certo quando:** a empresa aparecer ao pesquisar "Meta Impulso" no Google Maps.

---

## ✅ Etapa 4 — Receber os leads numa planilha (10 min)

Siga o guia **[RECEBER-LEADS-GOOGLE-SHEETS.md](RECEBER-LEADS-GOOGLE-SHEETS.md)**. Resumo:
1. Criar a planilha → colar o código no Apps Script → publicar.
2. Colar a URL gerada na Vercel em **Settings → Environment Variables** como `VITE_LEAD_WEBHOOK_URL`.
3. **Redeploy** e fazer um teste pelo site.

**Deu certo quando:** o teste aparecer na planilha e chegar o e-mail de aviso.

---

## ✅ Etapa 4.1 — Ligar o medidor de velocidade do Raio-X (10 min)

O Raio-X usa o Google PageSpeed para medir a velocidade no celular. Sem uma chave própria, o Google costuma recusar por excesso de uso compartilhado e o relatório sai sem a nota de velocidade.

1. Acesse https://console.cloud.google.com e crie um projeto (ex.: "Meta Impulso Site").
2. Menu **APIs e serviços → Biblioteca** → procure **PageSpeed Insights API** → **Ativar**.
3. **APIs e serviços → Credenciais → Criar credenciais → Chave de API**.
4. Clique na chave criada e restrinja:
   - **Restrições de aplicativo:** Sites → adicione `https://www.metaimpulso.com.br/*` e `https://metaimpulso.com.br/*`
   - **Restrições de API:** PageSpeed Insights API
   - **Salvar**
5. Na Vercel → **Settings → Environment Variables** → `VITE_PSI_API_KEY` com a chave → **Redeploy**.

**Deu certo quando:** o Raio-X mostrar "Nota de velocidade do Google: X/100" em vez de "Velocidade não medida agora". A chave é gratuita e fica visível no site, por isso a restrição ao domínio é obrigatória.

---

## ✅ Etapa 5 — Aparecer nas respostas de IA (ChatGPT, Gemini) — 2 min, opcional

Hoje a Cloudflare bloqueia esses robôs.
1. Cloudflare → **metaimpulso.com.br** → **Security → Bots** (ou **AI Crawl Control**).
2. Desative **"Block AI bots"** / **"Manage your robots.txt"** se quiser ser citado por essas ferramentas.

Decisão sua: liberar ajuda a aparecer quando alguém pergunta a uma IA por agências em Brasília; bloquear impede que o conteúdo seja usado por elas.

---

## ✅ Etapa 6 — Prova social (esta semana)

1. Peça à **Voogle** e à **Central Farma** um depoimento curto (texto ou vídeo) e **autorização por escrito** para publicar.
2. Peça que avaliem a Meta Impulso no Google (envie o link de avaliação do Perfil da Empresa).
3. Peça um link **"Desenvolvido por Meta Impulso"** no rodapé dos sites deles apontando para `https://www.metaimpulso.com.br`.
4. Coloque o link do site na bio do **Instagram** e no **LinkedIn** da empresa.

Me envie os depoimentos que eu coloco no site.

---

## ✅ Etapa 7 — Definir preços e começar a prospectar (semana 2)

1. Preencha a tabela de preços do **[PROPOSTA-MODELO.md](PROPOSTA-MODELO.md)** (seção "como precificar").
2. Siga o **[PROSPECCAO.md](PROSPECCAO.md)**:
   - monte a lista das primeiras **100 empresas** (Google Maps);
   - faça **20 abordagens por dia** com os roteiros prontos;
   - envie a "Auditoria Express" em vídeo para quem responder;
   - registre tudo na planilha de leads (coluna status).

**Meta das 2 primeiras semanas:** 4 a 6 reuniões de diagnóstico realizadas.

---

## ✅ Etapa 8 — Antes de investir em anúncios (quando for anunciar)

1. Criar conta no **Google Tag Manager** (https://tagmanager.google.com) e no **GA4**.
2. Colocar o código do GTM (`GTM-XXXXXXX`) na Vercel como `VITE_GTM_ID` → Redeploy.
3. Me avise: eu configuro as conversões (lead e clique no WhatsApp) para Google Ads e Meta Ads.

---

## Pendências que dependem de você (sem pressa, mas importantes)

- [ ] Criar e-mail no domínio (`contato@metaimpulso.com.br`) — me avise para trocar no site.
- [ ] Informar CNPJ e razão social para a política de privacidade.
- [ ] Republicar o projeto da Central Farma (o endereço está fora do ar).
- [ ] Corrigir o título "My Google AI Studio App" nos projetos `operator.voogle.com.br` e `meta-impulso-apresenta-o.vercel.app`.
- [ ] Contrato padrão revisado por advogado.
