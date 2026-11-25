# CRM do site (área /crm)

Todo lead do diagnóstico (e o Raio-X que ele fez) fica guardado no próprio site e aparece em **https://www.metaimpulso.com.br/crm**, uma área fechada com **login pelo Google**. Só entra quem estiver na lista de e-mails autorizados.

No CRM dá para:

- Ver os leads por prioridade (alta, média, baixa) e por etapa do funil.
- Abrir o WhatsApp ou o e-mail do lead com um clique.
- Mudar a etapa: Novo → Contatado → Reunião agendada → Reunião realizada → Proposta enviada → Negociação → Ganho / Perdido / Opt-out. Cada mudança fica registrada no histórico.
- Registrar a próxima ação com data. As atrasadas ficam em vermelho.
- Escrever anotações da conversa.
- **Exportar planilha:** baixa um arquivo que abre no Google Planilhas ou no Excel, com todos os leads e as anotações.
- Excluir um lead quando a pessoa pedir (LGPD).

Onde os dados ficam: no **Upstash Redis**, o armazenamento que a Vercel oferece em **Storage**. Não usa Supabase. O plano gratuito atende com folga o volume de leads de um site.

---

## Configurar (uma vez só, cerca de 20 min)

### 1. Ligar o armazenamento na Vercel (3 min)

1. https://vercel.com → projeto **metaimpulso** → menu **Storage**.
2. **Create Database** → escolha **Upstash** (Redis) → **Continue**.
3. **Região:** **São Paulo (sa-east-1)**, se aparecer. Senão, a mais próxima. **Plano:** Free.
4. Dê o nome **leads-meta-impulso** → **Create**.
5. Na tela seguinte, **conecte ao projeto metaimpulso** (ambientes **Production** e **Preview**). Deixe o "prefixo" das variáveis **em branco**.
6. Confira em **Settings → Environment Variables**: devem ter aparecido `KV_REST_API_URL` e `KV_REST_API_TOKEN`.

### 2. Criar o login com Google (10 min)

1. https://console.cloud.google.com, no mesmo projeto da chave do PageSpeed (ou crie um, ex.: "Meta Impulso Site").
2. Menu **APIs e serviços → Tela de consentimento OAuth** (ou **Google Auth Platform**):
   - Tipo de usuário: **Externo** → Criar.
   - Nome do app: **Meta Impulso CRM** · e-mail de suporte: o seu · e-mail do desenvolvedor: o seu → Salvar.
   - Em **Público / Usuários de teste**, adicione os e-mails que vão usar o CRM (ex.: metaimpulsobr@gmail.com). Com o app "Em teste", só esses e-mails conseguem entrar. É o que queremos.
3. **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**:
   - Tipo de aplicativo: **Aplicativo da Web** · nome: **CRM do site**.
   - **Origens JavaScript autorizadas** → adicione `https://www.metaimpulso.com.br` e `https://metaimpulso.com.br`.
   - Deixe "URIs de redirecionamento" vazio → **Criar**.
4. Copie o **ID do cliente**. Ele termina com `.apps.googleusercontent.com`. Não precisa da "chave secreta".

### 3. Variáveis na Vercel (3 min)

Em **Settings → Environment Variables → Add**, marque **Production**:

| Key | Value |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | o ID do cliente copiado no passo 2 |
| `CRM_ALLOWED_EMAILS` | os e-mails autorizados, separados por vírgula (ex.: `metaimpulsobr@gmail.com`) |

### 4. Publicar

**Deployments** → três pontinhos no primeiro da lista → **Redeploy**. Espere aparecer **Ready**.

### 5. Testar

1. Abra https://www.metaimpulso.com.br/#contato e faça o diagnóstico com dados de teste.
2. Abra https://www.metaimpulso.com.br/crm → **Fazer login com o Google** → o lead de teste aparece na lista.
3. Exclua o lead de teste (botão no fim da ficha).

Se a tela do /crm mostrar **"Falta configurar na Vercel"**, ela lista exatamente qual item ficou faltando.

---

## Dia a dia

- **Responder primeiro os leads "Alta"** (meta: em até 5 min no horário comercial), depois "Média" (mesmo dia) e "Baixa" (até 24 h).
- Ao falar com o lead, mude a etapa e escreva a próxima ação com data.
- Toda segunda-feira, olhe as próximas ações em vermelho (atrasadas).
- Para relatório ou backup: **Exportar planilha** e importe no Google Planilhas (**Arquivo → Importar → Upload**; separador: ponto e vírgula).

## Para adicionar ou remover alguém

Edite `CRM_ALLOWED_EMAILS` na Vercel e faça **Redeploy**. Quem sai da lista perde o acesso na hora, mesmo com a sessão aberta. Se o app do Google estiver "Em teste", adicione a pessoa também como usuário de teste.

## Opcional: também mandar para uma planilha Google

O CRM não precisa disso. Se quiser uma cópia automática numa planilha (com e-mail de aviso a cada lead), siga [RECEBER-LEADS-GOOGLE-SHEETS.md](RECEBER-LEADS-GOOGLE-SHEETS.md). Os dois funcionam juntos.

## Segurança e LGPD (para quem for mexer no código)

- Login: o token do Google é conferido pelo próprio Google (`tokeninfo`), com checagem do app (`aud`), validade, e-mail verificado e lista de autorizados.
- Sessão: cookie assinado, `HttpOnly`, `Secure`, `SameSite=Strict`, válido só em `/api/crm`, por 12 h.
- Toda alteração só é aceita vinda do próprio site.
- A planilha exportada neutraliza fórmulas maliciosas escondidas em campos.
- `/crm` e `/api/` ficam fora do Google (`noindex` e `robots.txt`).
- Código: `api/lead.ts` (grava), `api/crm.ts` (login, lista, edição, exportação), `src/pages/CrmPage.tsx` (tela).
