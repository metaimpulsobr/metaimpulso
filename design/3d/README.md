# Renders 3D do site

Peças 3D minimalistas da arquitetura de Brasília, geradas com three.js e salvas como imagens em `public/3d/`. O site não carrega nenhuma biblioteca 3D: só as imagens WebP (de 14 a 90 KB cada).

| Cena | Onde aparece |
|---|---|
| `museu` (Museu Nacional da República) | Topo da home, atrás do Raio-X, e página do Raio-X |
| `ponte` (Ponte JK) | "Onde as vendas se perdem" |
| `congresso` (Congresso Nacional) | "Um único responsável" |
| `esplanada` (Esplanada dos Ministérios) | Serviços |
| `planalto` (Palácio do Planalto) | Planos |
| `itamaraty` (Palácio Itamaraty) | Cases |
| `catedral` (Catedral de Brasília) | Sobre e topo das páginas de serviço |
| `plano` (maquete do Plano Piloto) | Processo |
| `alvorada` (Palácio da Alvorada) | Diagnóstico gratuito |

Dados de cada peça (arquivo, tamanho e crédito): `src/content/brasilia.ts`.

## Gerar de novo

```bash
cd design/3d
npm i three@0.170.0 --no-save
node render.cjs '[["museu",1600,1100],["ponte",1800,900],["congresso",1800,1200],["esplanada",1500,1000],["planalto",1700,1000],["itamaraty",1400,1100],["catedral",1300,1300],["plano",1500,1100],["alvorada",1800,1000]]'
```

O script abre `scene.html` num Chromium sem tela (Playwright), renderiza cada cena com fundo transparente e salva um PNG por cena nesta pasta. Depois, recorte as bordas vazias, converta para WebP em `public/3d/` (até 1400 px de largura) e atualize largura e altura em `src/content/brasilia.ts`.

- Materiais: concreto branco fosco e espelho d'água no ciano da marca.
- Luz: sol alto com sombras suaves (VSM) e ambiente de estúdio (`RoomEnvironment`).
- Câmera e proporções de cada prédio ficam em `scene.html`.

Desenhar obras situadas em locais públicos é livre (Lei 9.610/98, art. 48).
