# Identidade visual — Meta Impulso

> Squad: AURA (marca) · VANTA (direção) · PIXEL (peças)
> Fonte: logo oficial em `logopdf/META IMPULSO.pdf.pdf` (cores medidas no arquivo) **[F]**

## Direção atual: "Brasília Branca" — minimalismo e 3D (novembro de 2026)

Página branca, tipografia calma e a arquitetura branca de Brasília em 3D. Niemeyer construiu uma capital de concreto branco, curvas e espelhos d'água: a identidade usa essa mesma linguagem, sem neon e sem tom futurista.

| Elemento | Regra |
|---|---|
| **Fundo** | Branco `#FFFFFF` em todo o site. Seções alternadas em névoa `#F6F6F9` e linhas finas `#E7E6EE`. Nenhuma faixa escura. |
| **Brasília no topo** | Só o topo das páginas leva um marco da cidade em 3D, em concreto branco com sombras suaves: Museu Nacional da República na home (atrás do Raio-X) e na página do Raio-X, Catedral nas páginas de serviço. O resto da página fica limpo. Outras cenas (Ponte JK, Congresso, Esplanada, Planalto, Itamaraty, Plano Piloto, Alvorada) ficam em `design/3d/` para posts e peças. Dados em `src/content/brasilia.ts`. |
| **Geometria de fundo: Plano Piloto** | O eixo e as "asas" de Brasília reduzidos a linhas finas lilás-claras (`#DCD8EA`, `#E8E6F0`, `#F0EFF5`) com poucos pontos de cor (violeta com anel, ciano, grafite). Topo das páginas: `PlanoPilotoLines.tsx` (só na metade direita, nunca sob o texto). Seções: `SectionLines.tsx`, uma composição por seção nos cantos e margens (arco, eixo, asas, cruzamento, órbita, trilha pontilhada). Divisas entre seções: `SectionSeam.tsx`, formas que atravessam a quebra (cúpula na cor da seção vizinha, nó com anel sobre a linha, ponte em S, asa). No celular ficam só cúpulas e anéis. Sem rosa no fundo. |
| **Profundidade** | Mockups dos cases inclinados em perspectiva e cards que "levantam" em 3D ao passar o mouse. |
| **Cor de ação** | Violeta `#725BA7` sólido nos botões principais (texto branco), sem brilho nem animação. Botão secundário branco com borda fina. |
| **Destaque nos títulos** | Uma palavra ou frase em violeta sólido por título. Gradiente só no logo. |
| **Tipografia** | Títulos em **Sora** peso 700 com espaçamento apertado; textos em **Inter**; rótulos, botões e menu em **Inter** com letra normal (sem MAIÚSCULAS espaçadas nem fonte de código). Nada com "cara de IA": sem legenda nos prédios 3D, sem bolinha "ao vivo", sem numeração 01/02, sem objetos flutuando. |
| **Menos é mais** | Sem brilhos, sem pulsar, sem grades de fundo. Sombras longas e suaves só para dar profundidade. |

**Direitos (SENTINEL):** desenhar obras situadas permanentemente em logradouros públicos é livre (Lei 9.610/98, art. 48). Não usar o nome de Niemeyer como endosso da marca.

Comparação das direções avaliadas: https://claude.ai/artifact/MguTiFd1EWnNSSGhnZs7e3

## Cores

| Papel | Cor | Uso |
|---|---|---|
| Ameixa | `#B3529F` | Início do gradiente, destaques, botões |
| Violeta | `#725BA7` | Cor do nome "META IMPULSO", fim do gradiente dos botões |
| Ciano | `#6BCDE7` | "Tecnologia" (os circuitos do logo): ícones, linhas, detalhes em fundo escuro |
| Grafite | `#231F20` | Fundo da versão escura (faixas de destaque, imagem de compartilhamento) |
| Fundo claro | `#F8FAFC` | Fundo do site |
| Texto | `#0F172A` / `#475569` | Títulos / textos de apoio |

**Tons escuros para texto em fundo claro (acessibilidade):** ameixa `#8E3A80`, violeta `#5B4790`, ciano `#1F6F8B`.
O ciano puro `#6BCDE7` não tem contraste suficiente sobre branco: use-o em ícones, linhas e fundos escuros, nunca em texto sobre fundo claro.

## Gradientes

- **Botões e superfícies:** `#B3529F → #725BA7` (texto branco passa no contraste AA).
- **Palavras de destaque nos títulos:** `#B3529F → #725BA7 → #3A8DC8`.
- **Linhas, bordas e barras:** `#B3529F → #725BA7 → #6BCDE7` (mesma direção do logo).
- **Sobre fundo escuro:** versão clara `#D78CC9 → #A795D6 → #6BCDE7`.

## Regras

- Laranja e magenta neon foram usados em versões antigas do site e **não fazem parte da marca**. Não usar em anúncios nem em peças.
- Nome da marca em violeta `#725BA7` (fundo claro) ou branco (fundo escuro).
- O logo antigo traz o subtítulo "Agência de marketing digital". No posicionamento atual, use "Marketing, tecnologia e vendas".
- Tipografia do site: **Sora** (títulos), **Inter** (textos), **Inter** também nos rótulos e botões, em letra normal.
- Imagem de compartilhamento (WhatsApp/LinkedIn): `public/og-image.png`, 1200×630, fundo branco com o Museu Nacional em 3D.

## Pendente (AURA)

- [ ] Arquivo vetorial (SVG) do logo e versão horizontal sem o subtítulo antigo.
- [ ] Manual de marca completo (tom de voz, aplicações, área de proteção do logo) quando houver demanda de peças em volume.
