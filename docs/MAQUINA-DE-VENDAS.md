# Máquina de vendas: como o site capta, qualifica e entrega leads

> Squad: NOVA (oferta) · PULSE (copy) · FLOW (conversão) · CORE (CRM) · QUANT (dados) · SENTINEL (LGPD)
> Legenda: **[F]** fato · **[H]** hipótese a validar com dados

## 1. O caminho do visitante

```
Anúncio / Google / Instagram
  → página (home ou serviço)
  → seção "Um único responsável" (por que a Meta Impulso)
  → Diagnóstico gratuito (#contato): oferta concreta + quiz de 5 passos
  → tela final com plano indicado + próximos passos + WhatsApp
  → webhook → CRM + alerta para o comercial
```

- **Todas as páginas de serviço têm o diagnóstico embutido**, com o objetivo já selecionado (tráfego, site/SEO, software, IA). O visitante não precisa voltar para a home para converter.
- **Barra fixa no celular** (Diagnóstico gratuito + WhatsApp) aparece depois do topo da página e some quando o formulário está na tela.
- **Sem webhook configurado, nenhum lead se perde:** ao finalizar, o quiz abre o WhatsApp com as respostas prontas para envio.

## 2. Qualificação automática (CORE)

Cada lead chega ao webhook com estes campos extras (além de nome, WhatsApp, e-mail, respostas, UTMs, gclid e fbclid):

| Campo | Exemplo | Uso |
|---|---|---|
| `lead_score` | `85` | 0–100. Soma de objetivo + faturamento + investimento. Não é exibido ao visitante. |
| `lead_priority` | `alta` / `media` / `baixa` | `alta` ≥ 70 · `media` ≥ 45 · `baixa` < 45 |
| `recommended_plan` | `START` / `GROWTH` / `SCALE` | Mesmo plano mostrado ao visitante como "pré-análise" |
| `objective_id`, `revenue_id`, `budget_id` | `ia`, `200mais`, `5000a15000` | Ids estáveis para filtros no CRM |
| `form_location` | `home` ou slug da página | Qual página converteu |

Regras de pontuação e plano: `src/lib/leadScore.ts`. **[H]** Os pesos são um ponto de partida: revise depois de 30–50 leads comparando score × fechamento.

### Roteamento sugerido no Make / Zapier / n8n

| Prioridade | Ação automática | Meta de resposta [H] |
|---|---|---|
| `alta` | Criar no CRM + alerta imediato no WhatsApp do comercial | até 5 min em horário comercial |
| `media` | Criar no CRM + tarefa de contato no mesmo dia | mesmo dia |
| `baixa` | Criar no CRM + mensagem com material/plano START | até 24 h |

Tempo de resposta é a variável que mais pesa na conversão de lead inbound. Meça no CRM (`created_at` × primeiro contato).

## 3. Medição do funil (QUANT)

Eventos enviados ao `dataLayer` (GTM, após consentimento) **e** ao Vercel Web Analytics (anônimo, sem cookies):

| Evento | Quando | Parâmetros |
|---|---|---|
| `cta_click` | Clique em botão de diagnóstico | `origin` (header, hero, barra_mobile, responsavel, planos_ajuda...) |
| `quiz_start` | Passo 1 concluído | `location` |
| `quiz_step` | Cada avanço (2 a 6; 6 = concluído) | `step`, `location` |
| `generate_lead` | Envio do diagnóstico | `objective`, `revenue`, `budget`, `recommended_plan`, `lead_priority`, `location` |
| `whatsapp_click` | Qualquer botão de WhatsApp | `origin` |

Funil para acompanhar toda sexta: `cta_click → quiz_start → quiz_step (2…5) → generate_lead → reunião → proposta → venda`. O passo com maior queda é o primeiro a otimizar.

> Eventos personalizados no Vercel Web Analytics dependem do plano da Vercel. Confira em *Analytics → Events*; se não aparecerem, use o GA4 via GTM.

## 4. Pendências que dependem de você

### P0 — impacto direto em vendas
- [ ] **Confirmar `VITE_LEAD_WEBHOOK_URL` na Vercel** (não foi possível verificar daqui). Sem ele, o lead depende do visitante tocar em "enviar" no WhatsApp.
- [ ] **Montar o roteamento por prioridade** (seção 2) e testar com um envio real.
- [ ] **Definir quem responde os leads `alta`** e em quanto tempo.

### P1 — prova e fricção
- [ ] **Depoimentos reais** (2 a 3, com autorização por escrito): preencher `TESTIMONIALS` em `src/content/site.ts`. A seção aparece automaticamente.
- [ ] **Link de agendamento** (Google Agenda / Calendly): preencher `SITE.bookingUrl`. A tela final passa a oferecer "Escolher um horário na agenda".
- [ ] **Preço de referência por plano** ("a partir de R$ X"): decisão comercial. Costuma filtrar leads sem orçamento e acelerar a decisão dos qualificados [H].
- [ ] **Números dos cases** com evidência documentada (ver `docs/SEO-POS-DEPLOY.md`).
- [ ] **E-mail no domínio** (`contato@metaimpulso.com.br`).

### P2 — otimização contínua
- [ ] Teste A/B do título da home e da ordem das perguntas do quiz após ter volume.
- [ ] Páginas por segmento (clínicas, seguros, varejo) usando o mesmo componente de diagnóstico.

## 5. Onde editar

| O quê | Arquivo |
|---|---|
| Itens do "O que analisamos", comparação "Um único responsável", depoimentos, link de agenda | `src/content/site.ts` |
| Opções do quiz, pontuação e plano indicado | `src/lib/leadScore.ts` |
| Quiz e tela final | `src/components/DiagnosticQuiz.tsx` |
| Seção do diagnóstico (#contato) | `src/components/DiagnosticSection.tsx` |
| Barra fixa no celular | `src/components/MobileCtaBar.tsx` |
| Objetivo pré-selecionado em cada página de serviço | `objectiveId` em `src/content/services.ts` |
