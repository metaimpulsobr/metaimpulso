import { SITE } from '../content/site'

export default function PrivacyPage() {
  return (
    <main id="conteudo" className="section-v16 legal-page">
      <div className="container legal-container">
        <h1 className="title-lg">Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: outubro de 2026</p>

        <h2>1. Quem somos</h2>
        <p>
          Esta política explica como a {SITE.name}, com endereço em {SITE.address.street}, {SITE.address.district}, {SITE.address.city} - {SITE.address.region}, trata os dados pessoais coletados neste site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
        </p>

        <h2>2. Quais dados coletamos</h2>
        <ul>
          <li><strong>Formulário de diagnóstico:</strong> nome, WhatsApp, e-mail, nome da empresa, objetivo, faixa de faturamento e orçamento disponível.</li>
          <li><strong>Contato pelo WhatsApp ou e-mail:</strong> as informações que você enviar na conversa.</li>
          <li><strong>Dados de navegação:</strong> páginas visitadas, origem da visita (por exemplo, parâmetros de campanha) e, somente com o seu consentimento, cookies de análise e marketing.</li>
        </ul>

        <h2>3. Para que usamos</h2>
        <ul>
          <li>Responder à sua solicitação e preparar o diagnóstico digital;</li>
          <li>Classificar internamente a solicitação (prioridade e plano indicado, a partir das respostas do formulário) para direcioná-la à pessoa certa da equipe;</li>
          <li>Entrar em contato com uma proposta comercial relacionada ao que você pediu;</li>
          <li>Medir o desempenho do site e das campanhas de divulgação;</li>
          <li>Cumprir obrigações legais.</li>
        </ul>

        <h2>4. Bases legais</h2>
        <p>
          Tratamos os dados com base no seu consentimento (art. 7º, I), em procedimentos preliminares relacionados a contrato solicitado por você (art. 7º, V) e no legítimo interesse para comunicação comercial relacionada aos nossos serviços (art. 7º, IX), sempre com a possibilidade de oposição.
        </p>

        <h2>5. Compartilhamento</h2>
        <p>
          Os dados podem ser processados por fornecedores que nos ajudam a operar, como ferramentas de CRM, automação, hospedagem, WhatsApp e análise (por exemplo, Google e Meta), apenas na medida necessária. Não vendemos dados pessoais.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Cookies de análise e marketing só são ativados se você clicar em “Aceitar” no aviso de cookies. Você pode mudar sua escolha limpando os dados do site no navegador. Também utilizamos medições de audiência anônimas e sem cookies (Vercel Web Analytics e Cloudflare Web Analytics), que contam visitas e páginas acessadas sem identificar o visitante.
        </p>

        <h2>7. Por quanto tempo guardamos</h2>
        <p>
          Mantemos os dados pelo tempo necessário para as finalidades acima ou enquanto houver relação comercial, e os excluímos ou anonimizamos depois disso, salvo obrigação legal.
        </p>

        <h2>8. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação, acesso, correção, anonimização, portabilidade, eliminação dos dados e revogação do consentimento (art. 18 da LGPD) pelo e-mail <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>9. Segurança</h2>
        <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda ou alteração.</p>
      </div>
    </main>
  )
}
