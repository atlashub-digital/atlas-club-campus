# Vínculo — Atlas ClubOS

**Conceito.** O espaço comum nasce do encontro. Dois colchetes se voltam para um núcleo compartilhado. Os intervalos de respiro mantêm as partes reconhecíveis: comunidade como aproximação, com autonomia individual.

**Geometria.** Grade de 48 unidades; limites em 8 e 40; hastes de 8; núcleo de 8 × 8; intervalos de 4. A assimetria entre os braços cria um encaixe próprio.

**Melhor aplicação.** Comunidades, encontros, programas de mentoria e experiências de colaboração.

## Uso e arquivos

Arquivos em `apps/web/public/atlas/brand/02-vinculo/`:
- `horizontal-{light,dark}.svg` e `vertical-{light,dark}.svg`: assinaturas com texto editável em Inter/Manrope (Arial como fallback).
- `symbol-{light,dark}.svg`: símbolo isolado com respiro na própria prancheta.
- `favicon-{light,dark}.svg` e PNGs de 16, 32 e 48 px para cada fundo.
- `app-{24,32,48}-{light,dark}.svg`: ícones nas dimensões nominais.

`light` usa #172335 sobre fundo claro; `dark` usa branco sobre #172335. Todos têm fundo transparente. Azul #3268D6 fica reservado às ações da interface, mantendo a marca sóbria. Não esticar, rotacionar, acrescentar sombras ou reduzir o símbolo abaixo de 16 px. Manter ao redor pelo menos 4/48 da largura do símbolo; nas assinaturas, preservar as proporções fornecidas.

Os PNGs são rasterizados diretamente dos favicons SVG pelo script local com sharp. Os desenhos são vetores próprios; nenhuma imagem raster é incorporada aos SVGs. Para fidelidade tipográfica nas assinaturas, disponibilizar Inter ou Manrope no ambiente de apresentação.
