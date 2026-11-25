# CRM no Notion (leads do site)

Cada pessoa que conclui o diagnóstico no site vira, sozinha, uma **ficha no Notion**. A ficha traz:

- empresa, contato, WhatsApp clicável, e-mail;
- nota, prioridade e plano indicado;
- respostas do diagnóstico, Raio-X do site e origem (Google, Instagram…);
- **um roteiro de atendimento com caixinhas para marcar**, com o prazo certo para a prioridade do lead.

Não precisa de Supabase, banco da Vercel nem login extra. O `/crm` do site continua lá como opção, mas com o Notion ele não é necessário.

---

## Parte 1: ligar o site ao Notion (15 min, uma vez só)

### 1. Criar a "integração" (a chave que deixa o site escrever no Notion)
1. Abra https://www.notion.so/profile/integrations e clique em **Nova integração**.
2. Nome: **Site Meta Impulso**. Espaço de trabalho: o seu. Tipo: **Interna**. Clique em **Salvar**.
3. Em **Recursos**, deixe marcados **Ler**, **Atualizar** e **Inserir conteúdo**.
4. Copie o **Token de integração interna** (começa com `ntn_`). **Ele é uma senha:** não mande por WhatsApp nem cole em documentos.

### 2. Criar a página do CRM e a tabela de leads
1. No Notion, crie uma página chamada **CRM Meta Impulso**.
2. Dentro dela, digite `/banco de dados` e escolha **Banco de dados – página inteira**. Dê o nome **Leads do site**.
3. **Não precisa criar colunas:** o site cria todas sozinho no primeiro lead. Deixe uma tabela só dentro desse banco de dados.

### 3. Dar acesso à integração
1. Abra a tabela **Leads do site**, clique nos **três pontinhos (•••)** no canto de cima → **Conexões** → procure **Site Meta Impulso** → **Confirmar**.
2. Ainda nos **•••**, clique em **Copiar link**.

### 4. Colocar na Vercel
Na Vercel, projeto **metaimpulso** → **Settings → Environment Variables** → **Add** (marque **Production**):

| Key | Value |
|---|---|
| `NOTION_TOKEN` | o token copiado no passo 1 |
| `NOTION_DATABASE_ID` | o link copiado no passo 3 (pode colar o link inteiro) |

Depois: **Deployments** → **•••** no primeiro da lista → **Redeploy**.

### 5. Testar
Faça o diagnóstico em https://www.metaimpulso.com.br/#contato com dados de teste. Em segundos aparece uma linha na tabela, com todas as colunas criadas. Abra a linha para ver o roteiro e depois apague o teste.

---

## Parte 2: organizar o CRM (20 min, uma vez só)

O site cria estas colunas:

- **Do lead:** Empresa (título) · Etapa · Prioridade · Nota · Plano indicado · Contato · WhatsApp · Abrir WhatsApp · E-mail · Objetivo · Faturamento · Orçamento · Site analisado · Nota do Raio-X · Furos do Raio-X · Origem · Formulário · Recebido em.
- **De gestão, que a equipe preenche:** Próxima ação · Data da próxima ação · Responsável · Último contato · Valor da proposta · Motivo da perda.

Crie as **visões** abaixo na tabela: botão **+** ao lado do nome da visão, no topo da tabela.

| Visão | Tipo | Como configurar | Para quê |
|---|---|---|---|
| 🔥 **Responder agora** | Tabela | Filtro: Etapa **é** Novo. Ordenar: Prioridade (crescente), depois Recebido em (mais antigo primeiro) | Abrir **todo dia às 9h e depois do almoço**. Lead "Alta" em até 5 min. |
| 🧭 **Funil** | Quadro | Agrupar por **Etapa**. Propriedades do cartão: Prioridade, Nota, Responsável, Próxima ação, Data da próxima ação | Ver o pipeline e arrastar o cartão quando o lead avança. |
| 📅 **Agenda** | Calendário | Mostrar por **Data da próxima ação** | Ver os retornos combinados da semana. |
| ⏰ **Atrasados** | Tabela | Filtros: Data da próxima ação **antes de hoje** E Etapa **não é** Ganho, Perdido, Opt-out | Revisar **toda segunda-feira**. Nenhum lead esquecido. |
| 🙋 **Meus leads** | Tabela | Filtro: Responsável **é** *Eu* (opção "Eu", que muda para cada pessoa) | Cada vendedor vê só a própria carteira. |
| 💰 **Resultados** | Tabela | Filtro: Etapa é Ganho ou Perdido. Agrupar por Etapa. Rodapé de "Valor da proposta": **Soma** | Quanto foi fechado e quanto foi perdido. |
| 🧪 **Motivos de perda** | Quadro | Filtro: Etapa é Perdido. Agrupar por **Motivo da perda** | Descobrir por que perdemos (preço? momento?) e ajustar a oferta. |
| 📣 **Origem dos leads** | Tabela | Agrupar por **Origem** | Ver se os leads vêm do Google, do Instagram ou de indicação. Guia o investimento em anúncios. |

**Dica de leitura:** na visão Funil, use **Ocultar grupos vazios** e arraste as etapas na ordem: Novo → Contatado → Reunião agendada → Reunião realizada → Proposta enviada → Negociação → Ganho / Perdido / Opt-out.

### Página "CRM Meta Impulso" como painel
Na página-mãe, adicione:
1. Um título com as **metas da semana** [H]: 4 a 6 reuniões, resposta a lead "Alta" em até 5 min.
2. **Visão vinculada** (`/visão vinculada` → Leads do site → escolha **🔥 Responder agora**).
3. **Visão vinculada** de **⏰ Atrasados**.
4. **Visão vinculada** de **🧭 Funil**.

Assim você abre uma página só e vê tudo o que precisa fazer.

### Automações do próprio Notion (se o seu plano permitir)
Na tabela, use o raio ⚡ (**Automações**):
- **Quando** um item é adicionado → **Enviar notificação** para você, ou para o Slack/e-mail se estiver conectado. Isso substitui o e-mail de aviso da planilha.
- **Quando** Etapa muda para **Contatado** → **Editar propriedade** "Último contato" = **Agora**.
- **Quando** Etapa muda para **Ganho** → notificar a equipe para começar o onboarding.

---

## Rotina de uso

| Quando | O quê |
|---|---|
| Ao chegar um lead | Abrir a ficha, seguir o **roteiro de atendimento** e marcar as caixinhas. Mudar a Etapa e preencher a Próxima ação com data. |
| Todo dia, 9h e 14h | Visão **🔥 Responder agora** zerada. |
| Toda segunda | Visões **⏰ Atrasados** e **🧭 Funil**: quem está parado há mais de 7 dias recebe nova ação. |
| Todo fim de mês | **💰 Resultados**, **🧪 Motivos de perda** e **📣 Origem**: o que ajustar na oferta e nos anúncios. |

Exportar planilha quando quiser: na tabela, **•••** → **Exportar** → **CSV**.

---

## LGPD
- O Notion passa a guardar dados pessoais dos leads (nome, telefone, e-mail). A política de privacidade já cita "ferramentas de CRM" entre os fornecedores.
- Os servidores do Notion ficam fora do Brasil. Vale pedir ao advogado para mencionar transferência internacional na política (decisão sua).
- Se alguém pedir para apagar os dados: exclua a linha e esvazie a **Lixeira** do Notion.
- Dê acesso à página do CRM só a quem atende leads.

## Para quem for mexer no código
- O envio está em `api/lead.ts` (`saveToNotion`), com a API do Notion na versão `2022-06-28`.
- Colunas que faltam são criadas automaticamente. Se alguém mudar o tipo de uma coluna à mão, ela é pulada e o lead entra mesmo assim.
- O lead vai para todos os destinos configurados: Notion, `/crm` do site (Upstash) e planilha (webhook). Basta um funcionar para o visitante ver "recebemos". Se nenhum funcionar, o visitante vê um botão para mandar as respostas pelo WhatsApp.
