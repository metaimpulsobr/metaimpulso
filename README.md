# Meta Impulso — site institucional

Site da Meta Impulso (marketing digital e tecnologia, Brasília) em React 19 + TypeScript + Vite, com **pré-renderização estática** para SEO: cada rota é gerada no build como HTML completo (conteúdo, metatags, Open Graph e JSON-LD) e depois hidratada no navegador.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento (renderiza no cliente)
npm run build     # build + pré-renderização + sitemap.xml em dist/
npm run lint
```

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `src/content/site.ts` | Dados da empresa (NAP), planos, FAQ, processo — fonte única para UI e schema |
| `src/content/services.ts` | Conteúdo das páginas de serviço (SEO) |
| `src/seo/routes.ts` | Rotas, títulos, descrições, canonical e JSON-LD |
| `src/pages/` | Home, página de serviço, privacidade e 404 |
| `src/lib/analytics.ts` | dataLayer, carregamento do GTM após consentimento, UTMs |
| `src/lib/leads.ts` | Envio dos leads do diagnóstico para webhook |
| `src/lib/leadScore.ts` | Opções do quiz, lead score, prioridade e plano indicado |
| `src/components/DiagnosticSection.tsx` | Bloco de conversão (#contato) usado na home e nas páginas de serviço |
| `src/entry-server.tsx` + `scripts/prerender.mjs` | Pré-renderização no build |
| `vercel.json` | `cleanUrls`, cache dos assets e headers de segurança |
| `docs/` | Máquina de vendas (funil, qualificação, roteamento), checklist pós-deploy de SEO e playbook de prospecção |

### Nova página de serviço

Adicione um item em `SERVICES` (`src/content/services.ts`). A rota, o menu do rodapé, o sitemap e o schema são gerados automaticamente.

## Variáveis de ambiente

Veja `.env.example`. Cadastre na Vercel e faça redeploy:

- `VITE_GTM_ID` — container do Google Tag Manager (carregado só após aceite de cookies).
- `VITE_LEAD_WEBHOOK_URL` — webhook que recebe os leads do diagnóstico (campos em `docs/MAQUINA-DE-VENDAS.md`). Sem ele, o quiz envia o lead pelo WhatsApp.
