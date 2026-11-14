# Receber os leads do site numa planilha Google (grátis, ~10 min)

Quando alguém conclui o **Diagnóstico Digital** no site, os dados vão automaticamente para uma planilha e você recebe um **e-mail de aviso**. Não precisa de Make, Zapier nem de pagar nada.

## Passo 1 — Criar a planilha

1. Acesse https://sheets.new (cria uma planilha nova).
2. Dê o nome: **Leads Meta Impulso**.

## Passo 2 — Colar o código

1. Na planilha, clique em **Extensões → Apps Script**.
2. Apague tudo o que estiver no editor e cole o código abaixo.
3. Clique no ícone de **disquete (Salvar)**.

```javascript
// Recebe os leads do site metaimpulso.com.br e grava na planilha.
const COLUNAS = [
  'created_at', 'lead_priority', 'lead_score', 'recommended_plan',
  'userName', 'userPhone', 'userEmail', 'companyName',
  'objective', 'revenue', 'budget', 'form_location', 'site_url', 'raiox_score', 'raiox_alertas',
  'utm_source', 'utm_medium',
  'utm_campaign', 'gclid', 'fbclid', 'landing_page', 'referrer', 'page', 'consent_lgpd',
];

// Opcional (recomendado): a mesma senha que você colocar na Vercel como LEAD_WEBHOOK_TOKEN.
// Deixe vazio ('') para não exigir senha.
const SENHA = '';

function doPost(e) {
  const lead = JSON.parse(e.postData.contents);
  if (SENHA && lead.token !== SENHA) return ContentService.createTextOutput('negado');
  delete lead.token;
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS.concat(['status', 'proxima_acao']));
  }
  aba.appendRow(COLUNAS.map((c) => (lead[c] === undefined ? '' : lead[c])).concat(['Novo', '']));

  const prioridade = String(lead.lead_priority || 'sem prioridade').toUpperCase();
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: '[' + prioridade + '] Novo lead no site: ' + (lead.companyName || 'sem empresa'),
    body:
      'Prioridade: ' + prioridade + ' (score ' + lead.lead_score + ') · Plano indicado: ' + lead.recommended_plan + '\n\n' +
      'Empresa: ' + lead.companyName + '\n' +
      'Contato: ' + lead.userName + '\n' +
      'WhatsApp: ' + lead.userPhone + '\n' +
      'E-mail: ' + lead.userEmail + '\n' +
      'Objetivo: ' + lead.objective + '\n' +
      'Faturamento: ' + lead.revenue + '\n' +
      'Orçamento: ' + lead.budget + '\n' +
      'Página: ' + lead.form_location + '\n' +
      (lead.raiox_score !== undefined ? 'Raio-X: ' + lead.site_url + ' · nota ' + lead.raiox_score + '/100 · ' + (lead.raiox_alertas || 'sem furos críticos') + '\n' : '') +
      'Origem: ' + (lead.utm_source || lead.referrer || 'direto') + '\n\n' +
      'WhatsApp direto: https://wa.me/55' + String(lead.userPhone).replace(/\D/g, ''),
  });

  return ContentService.createTextOutput('ok');
}
```

> **Já criou a planilha com a versão anterior do código?** As colunas mudaram de posição. Crie uma aba nova vazia e coloque-a como a primeira aba (o código grava sempre na primeira), ou apague a linha de títulos antes de testar.

## Passo 3 — Publicar o receptor

1. No canto superior direito, clique em **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**.
5. O Google vai pedir autorização: **Autorizar acesso → escolha sua conta → Avançado → Acessar (não seguro) → Permitir**. (O aviso aparece porque o script é seu e não foi publicado na loja do Google — é normal.)
6. Copie a **URL do app da Web** (começa com `https://script.google.com/macros/s/` e termina com `/exec`).

## Passo 4 — Ligar no site (Vercel)

O site não envia direto para a planilha: o formulário manda para `/api/lead` (uma função do próprio site), que confere os dados, recalcula a nota do lead e só então repassa para a planilha. O endereço da planilha fica guardado na Vercel e nunca aparece no navegador.

1. Acesse https://vercel.com → projeto **metaimpulso** → **Settings → Environment Variables**.
2. Clique em **Add**:
   - **Key:** `VITE_LEAD_WEBHOOK_URL`
   - **Value:** a URL copiada no passo 3
   - **Environments:** marque **Production** (e Preview, se quiser)
3. **Opcional (recomendado):** clique em **Add** de novo e crie `LEAD_WEBHOOK_TOKEN` com uma senha qualquer (ex.: uma frase longa sem espaços). Coloque a mesma senha na linha `const SENHA = '...'` do script e publique uma nova versão dele (**Implantar → Gerenciar implantações → editar → Nova versão**). Assim, só o site consegue gravar na planilha.
4. Salve.
5. Vá em **Deployments**, clique nos **três pontinhos** do deploy mais recente → **Redeploy**.

## Passo 5 — Testar

1. Abra https://www.metaimpulso.com.br/#contato e preencha o diagnóstico com dados de teste.
2. Em até 1 minuto deve aparecer uma linha nova na planilha e um e-mail na sua caixa.
3. Apague a linha de teste.

## Usando a planilha como CRM inicial

Ordene pela coluna **lead_priority**: `alta` primeiro (responder em até 5 minutos), depois `media` (no mesmo dia) e `baixa` (até 24 h). Detalhes em [MAQUINA-DE-VENDAS.md](MAQUINA-DE-VENDAS.md).

Use as colunas **status** e **proxima_acao** para acompanhar cada lead:
`Novo → Contatado → Reunião agendada → Proposta enviada → Ganho / Perdido`

Regra de ouro: **responder todo lead novo em menos de 15 minutos** no horário comercial.

> Se um dia você alterar o código do Apps Script, faça **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**. A URL continua a mesma.
