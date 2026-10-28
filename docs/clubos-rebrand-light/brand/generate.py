"""Gera os SVGs autorais e o comparativo. Execute a partir de qualquer pasta.
PNG: node docs/clubos-rebrand-light/brand/render-favicons.cjs [rota]
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[3]
PUBLIC = ROOT / 'apps/web/public/atlas/brand'
DOCS = Path(__file__).resolve().parent
ROUTES = {
 '01-portico': ('Pórtico', 'M8 40V16L24 6l16 10v24H29V23H19v17H8Z', 'Uma entrada para o conhecimento compartilhado.', 'A silhueta arquitetônica preserva o desenho em uso: cobertura angular, dois pilares e vão central. A abertura é o elemento de reconhecimento, sem detalhes decorativos.', 'Grade de 48 unidades; eixo em 24; largura de 32; vão de 10; pilares de 11. O topo em 6 e a base em 40 compensam o peso visual.', 'Marca institucional, navegação do campus e ambientes em que estabilidade e acolhimento são prioritários.'),
 '02-vinculo': ('Vínculo', 'M8 8h18v8H16v16h10v8H8V8Zm32 0v32H28v-8h4V16h-4V8h12ZM20 20h8v8h-8Z', 'O espaço comum nasce do encontro.', 'Dois colchetes se voltam para um núcleo compartilhado. Os intervalos de respiro mantêm as partes reconhecíveis: comunidade como aproximação, com autonomia individual.', 'Grade de 48 unidades; limites em 8 e 40; hastes de 8; núcleo de 8 × 8; intervalos de 4. A assimetria entre os braços cria um encaixe próprio.', 'Comunidades, encontros, programas de mentoria e experiências de colaboração.'),
 '03-trilha': ('Trilha', 'M8 40V26h12V14h12V8h8v14H28v12H16v6H8Z', 'Cada conquista abre o próximo trecho.', 'Uma faixa contínua sobe por três patamares. O vazio entre os degraus revela o percurso e diferencia a marca de uma seta ou de um gráfico de barras.', 'Grade de 48 unidades; faixa de 8; avanços de 12; extremos em 8 e 40. Cantos retos e terminais planos preservam a leitura em tamanhos pequenos.', 'Trilhas de aprendizagem, evolução de competências e comunicação de jornadas.'),
}

def svg(key, kind, theme, size=None):
    name, path, *_ = ROUTES[key]
    ink = '#172335' if theme == 'light' else '#FFFFFF'
    w,h = (290,48) if kind == 'horizontal' else (240,112) if kind == 'vertical' else (size or 48,size or 48)
    vb = f'0 0 {w} {h}' if kind in ('horizontal','vertical') else '0 0 48 48'
    transform = ' transform="translate(96 0)"' if kind == 'vertical' else ''
    text = ''
    if kind in ('horizontal','vertical'):
        pos = 'x="62" y="33"' if kind == 'horizontal' else 'x="120" y="88" text-anchor="middle"'
        text = f'<text {pos} font-family="Inter, Manrope, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="-0.6" fill="{ink}">Atlas ClubOS</text>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}" role="img" aria-label="Atlas ClubOS — {name}"><path{transform} d="{path}" fill="{ink}"/>{text}</svg>'


def generate(key):
    folder = PUBLIC / key
    folder.mkdir(parents=True, exist_ok=True)
    for theme in ('light','dark'):
        for kind in ('horizontal','vertical','symbol','favicon'):
            (folder / f'{kind}-{theme}.svg').write_text(svg(key,kind,theme), encoding='utf-8')
        for size in (24,32,48):
            (folder / f'app-{size}-{theme}.svg').write_text(svg(key,'app',theme,size), encoding='utf-8')
    name, _, concept, geometry, grid, usage = ROUTES[key]
    (DOCS / f'{key}.md').write_text(f'''# {name} — Atlas ClubOS

**Conceito.** {concept} {geometry}

**Geometria.** {grid}

**Melhor aplicação.** {usage}

## Uso e arquivos

Arquivos em `apps/web/public/atlas/brand/{key}/`:
- `horizontal-{{light,dark}}.svg` e `vertical-{{light,dark}}.svg`: assinaturas com texto editável em Inter/Manrope (Arial como fallback).
- `symbol-{{light,dark}}.svg`: símbolo isolado com respiro na própria prancheta.
- `favicon-{{light,dark}}.svg` e PNGs de 16, 32 e 48 px para cada fundo.
- `app-{{24,32,48}}-{{light,dark}}.svg`: ícones nas dimensões nominais.

`light` usa #172335 sobre fundo claro; `dark` usa branco sobre #172335. Todos têm fundo transparente. Azul #3268D6 fica reservado às ações da interface, mantendo a marca sóbria. Não esticar, rotacionar, acrescentar sombras ou reduzir o símbolo abaixo de 16 px. Manter ao redor pelo menos 4/48 da largura do símbolo; nas assinaturas, preservar as proporções fornecidas.

Os PNGs são rasterizados diretamente dos favicons SVG pelo script local com sharp. Os desenhos são vetores próprios; nenhuma imagem raster é incorporada aos SVGs. Para fidelidade tipográfica nas assinaturas, disponibilizar Inter ou Manrope no ambiente de apresentação.
''', encoding='utf-8')

if __name__ == '__main__':
    for key in sys.argv[1:] or ROUTES:
        generate(key)
