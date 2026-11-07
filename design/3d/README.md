# Renders 3D do site

Peças 3D minimalistas da arquitetura branca de Brasília (Congresso Nacional, Catedral e Palácio da Alvorada), geradas com three.js e salvas como imagens em `public/3d/`. O site não carrega nenhuma biblioteca 3D: só as imagens WebP (cerca de 40 a 50 KB cada).

## Gerar de novo

```bash
cd design/3d
npm i three@0.170.0 --no-save
node render.cjs '[["congresso",1800,1200],["catedral",1300,1300],["alvorada",1800,1000]]'
```

O script abre `scene.html` num Chromium sem tela (Playwright), renderiza cada cena com fundo transparente e salva `congresso.png`, `catedral.png` e `alvorada.png` nesta pasta. Depois, recorte as bordas vazias e converta para WebP em `public/3d/` (largura usada: 1400 px no Congresso e na Alvorada, 900 px na Catedral).

- Materiais: concreto branco fosco e espelho d'água no ciano da marca.
- Luz: sol alto com sombras suaves (VSM) e ambiente de estúdio (`RoomEnvironment`).
- Câmera e proporções de cada prédio ficam em `scene.html`.

Desenhar obras situadas em locais públicos é livre (Lei 9.610/98, art. 48).
