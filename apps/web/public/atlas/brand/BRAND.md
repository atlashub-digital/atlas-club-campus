# Atlas ClubOS — três rotas

A marca é opt-in: `NEXT_PUBLIC_ATLAS_CLUBOS_BRAND=true`. A rota 01 está implementada. Os símbolos são desenhos vetoriais próprios, sem imagens geradas. As assinaturas usam Inter, com Arial como fallback; o texto dos SVGs continua editável (a aparência depende da fonte instalada).

1. **Pórtico** (`01-portico`): arco angular com uma abertura central. Representa entrada no conhecimento e um espaço comum, com proporções arquitetônicas e leitura compacta. Escolhida pela silhueta simples em tamanhos pequenos.
2. **Vínculo** (`02-vinculo`): dois encaixes ortogonais envolvem um núcleo comum. Representa troca entre membros e construção coletiva, preservando autonomia e respiro entre as partes.
3. **Trilha** (`03-trilha`): uma faixa contínua sobe por três patamares. Representa percurso, avanço e autonomia; mais dinâmica e editorial.

Cada pasta contém assinatura horizontal, vertical, símbolo, favicon e ícones SVG dimensionados em 24/32/48 px. Todas as variantes têm versões `light` (tinta escura para fundo claro) e `dark` (branca para fundo escuro). Fundos transparentes. Não usar a versão branca em fundo claro.

Base branca #FFFFFF; canvas #F5F6F8; linhas #E3E7EC; texto #172335; secundário #526174 (ajustado para contraste); ação #3268D6. Grid de 8 px, raios de 12 px e foco de 3 px. O azul identifica ação e foco. Não usar painéis azuis nem wallpapers. A licença e o copyright do upstream continuam preservados no repositório e acessíveis na interface.

## Sprint de desenvolvimento das rotas

Kits completos atualizados em cada pasta: SVGs de assinatura horizontal/vertical,
símbolo, favicon e app 24/32/48; favicons PNG 16/32/48 em claro/escuro.
Vínculo agora organiza dois encaixes em torno de um núcleo comum; Trilha usa uma
faixa contínua em patamares ascendentes. O Pórtico preserva a geometria da UI.

Comparativo autocontido: `docs/clubos-rebrand-light/brand/comparacao.html`.
Racionais detalhados e scripts reproduzíveis estão na mesma pasta.
Execute `python3 docs/clubos-rebrand-light/brand/generate.py` e depois
`node docs/clubos-rebrand-light/brand/render-favicons.cjs` a partir da raiz.
A geração utiliza apenas Python padrão e sharp já instalado no app web.
