# Pórtico — Atlas ClubOS

**Conceito.** Uma entrada para o conhecimento compartilhado. A silhueta arquitetônica preserva o desenho em uso: cobertura angular, dois pilares e vão central. A abertura é o elemento de reconhecimento, sem detalhes decorativos.

**Geometria.** Grade de 48 unidades; eixo em 24; largura de 32; vão de 10; pilares de 11. O topo em 6 e a base em 40 compensam o peso visual.

**Melhor aplicação.** Marca institucional, navegação do campus e ambientes em que estabilidade e acolhimento são prioritários.

## Uso e arquivos

Arquivos em `apps/web/public/atlas/brand/01-portico/`:
- `horizontal-{light,dark}.svg` e `vertical-{light,dark}.svg`: assinaturas com texto editável em Inter/Manrope (Arial como fallback).
- `symbol-{light,dark}.svg`: símbolo isolado com respiro na própria prancheta.
- `favicon-{light,dark}.svg` e PNGs de 16, 32 e 48 px para cada fundo.
- `app-{24,32,48}-{light,dark}.svg`: ícones nas dimensões nominais.

`light` usa #172335 sobre fundo claro; `dark` usa branco sobre #172335. Todos têm fundo transparente. Azul #3268D6 fica reservado às ações da interface, mantendo a marca sóbria. Não esticar, rotacionar, acrescentar sombras ou reduzir o símbolo abaixo de 16 px. Manter ao redor pelo menos 4/48 da largura do símbolo; nas assinaturas, preservar as proporções fornecidas.

Os PNGs são rasterizados diretamente dos favicons SVG pelo script local com sharp. Os desenhos são vetores próprios; nenhuma imagem raster é incorporada aos SVGs. Para fidelidade tipográfica nas assinaturas, disponibilizar Inter ou Manrope no ambiente de apresentação.
