# Trilha — Atlas ClubOS

**Conceito.** Cada conquista abre o próximo trecho. Uma faixa contínua sobe por três patamares. O vazio entre os degraus revela o percurso e diferencia a marca de uma seta ou de um gráfico de barras.

**Geometria.** Grade de 48 unidades; faixa de 8; avanços de 12; extremos em 8 e 40. Cantos retos e terminais planos preservam a leitura em tamanhos pequenos.

**Melhor aplicação.** Trilhas de aprendizagem, evolução de competências e comunicação de jornadas.

## Uso e arquivos

Arquivos em `apps/web/public/atlas/brand/03-trilha/`:
- `horizontal-{light,dark}.svg` e `vertical-{light,dark}.svg`: assinaturas com texto editável em Inter/Manrope (Arial como fallback).
- `symbol-{light,dark}.svg`: símbolo isolado com respiro na própria prancheta.
- `favicon-{light,dark}.svg` e PNGs de 16, 32 e 48 px para cada fundo.
- `app-{24,32,48}-{light,dark}.svg`: ícones nas dimensões nominais.

`light` usa #172335 sobre fundo claro; `dark` usa branco sobre #172335. Todos têm fundo transparente. Azul #3268D6 fica reservado às ações da interface, mantendo a marca sóbria. Não esticar, rotacionar, acrescentar sombras ou reduzir o símbolo abaixo de 16 px. Manter ao redor pelo menos 4/48 da largura do símbolo; nas assinaturas, preservar as proporções fornecidas.

Os PNGs são rasterizados diretamente dos favicons SVG pelo script local com sharp. Os desenhos são vetores próprios; nenhuma imagem raster é incorporada aos SVGs. Para fidelidade tipográfica nas assinaturas, disponibilizar Inter ou Manrope no ambiente de apresentação.
