# Playbook de Prospecção — Meta Impulso

> Squad: HUNT (prospecção) · CLOSER (vendas) · CORE (CRM) · SENTINEL (LGPD)
> Legenda de evidência: **[H]** hipótese a validar com dados · **[F]** fato

---

## 1. Oferta de entrada (o "gancho")

**Auditoria Digital Express gratuita (vídeo de 2–3 min).**
Você grava a tela analisando o site e o Google da empresa do prospect e envia o link. É o mesmo tipo de análise que fizemos no nosso próprio site — e é extremamente difícil de ignorar porque é sobre a empresa *dele*.

O que olhar em cada prospect (5 itens, ~5 min por empresa):

| # | Item | Como checar | Gancho na mensagem |
|---|------|-------------|--------------------|
| 1 | Velocidade no celular | pagespeed.web.dev | "Seu site leva X s para abrir no celular" |
| 2 | Rastreamento | Extensões *Meta Pixel Helper* e *Tag Assistant* | "Vocês anunciam, mas não há pixel instalado" |
| 3 | Google Business Profile | Buscar o nome no Google Maps | "Perfil sem fotos / sem resposta às avaliações" |
| 4 | Tempo de resposta no WhatsApp | Mandar uma pergunta real como cliente | "Mandei mensagem às 10h e tive resposta às 16h" |
| 5 | Anúncios ativos | Biblioteca de Anúncios da Meta / buscar no Google | "Os anúncios levam para o Instagram, não para uma página de conversão" |

Use **apenas 1 ou 2 achados** na primeira mensagem. O restante vai no vídeo/reunião.

---

## 2. ICP — quem prospectar primeiro

Critérios gerais: empresa com faturamento a partir de ~R$ 50 mil/mês **[H]**, que já vende (tem demanda), depende de WhatsApp/agendamento e mostra pelo menos 2 falhas da auditoria acima.

| Prioridade | Segmento (DF) | Por que | Serviço de entrada | Case de apoio |
|---|---|---|---|---|
| 1 | Clínicas odontológicas, estética, fisioterapia, médicas | Ticket alto, alta dependência de agendamento via WhatsApp | Tráfego + automação de agendamento | Operator AI |
| 2 | Seguros, consultorias, serviços financeiros | Venda consultiva, ciclo longo, precisa de CRM | Site + CRM + tráfego | Voogle (portal, CRM, esteira de crédito) |
| 3 | Farmácias e varejo local | Vendem pelo WhatsApp, pouca estrutura digital | Catálogo + checkout WhatsApp | Central Farma |
| 4 | Imobiliárias e construtoras | Muito lead, follow-up fraco | Tráfego + CRM + IA de qualificação | Meta Core CRM |
| 5 | Escolas, cursos, clubes de benefícios | Captação sazonal, área de membros | LP + tráfego + portal | Infinity Club |

> ⚠️ **Advocacia e saúde têm regras de publicidade** (OAB, CFM/CFO). Não prometa resultados nem use antes/depois nos anúncios desses clientes — SENTINEL revisa os criativos.

---

## 3. Montagem da lista (meta: 100 empresas/semana na fase inicial [H])

1. **Google Maps:** buscar `"clínica odontológica" Asa Norte`, `"seguros" Brasília`, etc. Anotar nome, site, telefone comercial, Instagram, nota e nº de avaliações.
2. **Instagram:** perfis comerciais do DF com anúncios ativos (Biblioteca de Anúncios da Meta → filtrar Brasil + palavra-chave).
3. **LinkedIn:** decisores (sócio, diretor comercial, gerente de marketing) das empresas da lista.
4. **Bases de CNPJ públicas** (ex.: dados abertos da Receita) para filtrar por CNAE e município.

Campos mínimos na planilha/CRM: `empresa · segmento · cidade · site · whatsapp_comercial · instagram · decisor · cargo · linkedin · achados_auditoria · fonte · status · próxima_ação · data`.

### LGPD (SENTINEL)
- Prospecção B2B pode se apoiar em **legítimo interesse**, usando dados **corporativos e públicos** (telefone comercial, e-mail institucional), com mensagem relacionada ao negócio.
- **Não compre listas** de dados pessoais. Não use CPF.
- Em toda abordagem, ofereça saída ("se não fizer sentido, é só me avisar que não volto a escrever") e **respeite o pedido imediatamente** — marque como `opt-out` no CRM.
- Registre a fonte de cada contato. Recomenda-se validar com advogado um documento simples de Avaliação de Legítimo Interesse (LIA).

---

## 4. Cadência (14 dias, multicanal)

| Dia | Canal | Ação |
|-----|-------|------|
| D1 | LinkedIn | Pedido de conexão com nota curta (sem pitch) |
| D1 | E-mail | E-mail 1 — achado da auditoria |
| D3 | WhatsApp comercial | Mensagem 1 — personalizada, 1 achado |
| D5 | Ligação | Abordagem por telefone (roteiro abaixo) |
| D7 | E-mail / WhatsApp | Envio do vídeo de Auditoria Express |
| D10 | LinkedIn | Mensagem com case do mesmo segmento |
| D14 | E-mail | Encerramento ("break-up") |

**Regras do WhatsApp:** envio manual e personalizado, a partir do número comercial; nada de disparo em massa por ferramentas não oficiais (risco de bloqueio do número e de reclamação). Volume alto → API oficial do WhatsApp Business com templates aprovados.

---

## 5. Roteiros (PULSE + CLOSER)

### WhatsApp — mensagem 1
> Olá, [Nome], tudo bem? Aqui é o [Seu nome], da Meta Impulso, aqui de Brasília.
> Estava pesquisando [segmento] na [região] e vi que a [Empresa] tem ótimas avaliações no Google, mas o site leva quase [X] segundos para abrir no celular — boa parte das pessoas desiste antes disso.
> Gravei uma análise rápida de 2 minutos com 3 pontos que podem aumentar os contatos de vocês. Posso te enviar?

### E-mail 1
**Assunto:** [Empresa] — 1 ponto que pode estar custando clientes

> Olá, [Nome],
>
> Sou o [Seu nome], da Meta Impulso (marketing e tecnologia, Brasília). Fiz uma checagem rápida da presença digital da [Empresa] e um ponto chamou atenção: [achado concreto — ex.: vocês têm anúncios ativos no Instagram, mas não encontrei o Pixel da Meta no site, então não é possível saber quais anúncios geram clientes].
>
> Isso costuma ter solução simples e muda a forma de decidir onde investir.
>
> Posso te mandar um vídeo de 2 minutos mostrando isso e mais dois pontos? Sem compromisso.
>
> [Assinatura · WhatsApp · site]
>
> *Se não fizer sentido para vocês, é só responder "não" que não volto a escrever.*

### E-mail 2 (D7) — vídeo
**Assunto:** Gravei a análise da [Empresa]

> [Nome], conforme comentei, gravei a análise: [link do vídeo].
> Resumo: (1) [achado], (2) [achado], (3) [achado].
> Se quiser, em 30 minutos te mostro como resolveríamos e qual seria o impacto esperado. Que tal [dia] às [hora]?

### LinkedIn — conexão
> Olá, [Nome]! Trabalho com marketing e tecnologia para empresas de [segmento] em Brasília. Gostaria de acompanhar seu trabalho por aqui.

### Ligação — abertura (30 segundos)
> "[Nome], aqui é o [Seu nome], da Meta Impulso. Vou ser rápido: analisei o site e o Google da [Empresa] e encontrei [achado]. Liguei para saber se isso é uma prioridade para vocês agora ou se posso te mandar a análise por WhatsApp para você ver com calma."

### Break-up (D14)
> [Nome], imagino que a agenda esteja cheia. Vou encerrar meus contatos por aqui para não incomodar. Se em algum momento quiser a análise da [Empresa], é só responder este e-mail. Sucesso!

---

## 6. Objeções (CLOSER)

| Objeção | Resposta |
|---|---|
| "Já tenho agência." | "Ótimo. A maioria dos nossos clientes também tinha. A pergunta é: vocês sabem hoje quanto custa cada cliente que vem dos anúncios? Se sim, perfeito. Se não, a análise pode ser útil até para a sua agência atual." |
| "Agora não tenho verba." | "Faz sentido. O diagnóstico é gratuito e mostra o que dá para corrigir sem aumentar o investimento — rastreamento e tempo de resposta, por exemplo." |
| "Já tentei tráfego e não funcionou." | "O que acontecia depois do clique? Em geral o problema não é o anúncio, é a página, a demora no atendimento ou a falta de medição. É exatamente isso que analisamos." |
| "Me manda uma proposta." | "Mando sim. Para não te mandar algo genérico, preciso de 20 minutos para entender metas e números. Pode ser [dia] às [hora]?" |
| "Quanto custa?" | "Depende do escopo — temos três níveis (START, GROWTH, SCALE). Na conversa eu te digo em qual faixa vocês se encaixam e por quê." |

---

## 7. Qualificação na reunião (30 min)

Pergunte e registre no CRM:
1. Como chegam os clientes hoje? (canal, volume mensal)
2. Qual o ticket médio e a margem?
3. Quanto investem em marketing hoje? Sabem o custo por cliente?
4. Quem atende os leads e em quanto tempo?
5. Qual a meta para os próximos 6 meses?
6. Quem decide e quando pretendem começar?

**Critério de oportunidade (SQL):** dor clara + orçamento compatível com pelo menos o START + decisor na conversa + prazo de até 90 dias.

---

## 8. Funil no CRM (CORE)

`Lead (lista) → Contatado → Respondeu → Auditoria enviada → Reunião agendada → Reunião realizada → Proposta enviada → Negociação → Ganho / Perdido (motivo) / Opt-out`

Cada lead precisa ter: **origem, etapa, responsável, próxima ação com data, valor estimado, motivo de perda**.

### Metas semanais de atividade (ponto de partida — ajuste com os dados reais [H])
- 100 empresas novas na lista
- 100 primeiras abordagens (e-mail + LinkedIn)
- 40 mensagens de WhatsApp personalizadas
- 20 vídeos de Auditoria Express
- Meta de 4–6 reuniões realizadas

### Métricas para acompanhar (QUANT)
Taxa de resposta por canal e por segmento · % que aceita o vídeo · reuniões/abordagens · propostas/reuniões · fechamentos/propostas · ticket médio · ciclo de venda (dias). **Revisar toda sexta** e dobrar o investimento no segmento/canal com melhor conversão.

---

## 9. Automação (NEXA/SYN) — fase 2, depois de validar os roteiros manualmente

- Webhook do diagnóstico do site → CRM + notificação no WhatsApp do comercial (já preparado no site via `VITE_LEAD_WEBHOOK_URL`).
- Lembretes automáticos de próxima ação no CRM.
- Agente de IA para responder leads inbound fora do horário comercial.
- **Não automatizar** a primeira mensagem de prospecção fria: personalização é o que gera resposta.

---

## 10. Prova social (urgente)

1. Pedir **depoimento em vídeo ou texto** ao Grupo Voogle e à Central Farma (com autorização por escrito para uso).
2. Pedir **avaliações no Google Business Profile** da Meta Impulso a cada cliente.
3. Incluir **"Desenvolvido por Meta Impulso"** com link no rodapé dos sites de clientes (gera backlink e indicação).
4. Transformar cada projeto em um case com números **comprovados** (antes/depois) — só publicar métricas com evidência documentada.
