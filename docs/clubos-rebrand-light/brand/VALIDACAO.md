# Validação da entrega

- 42 SVGs do kit (14 por rota): XML bem formado, viewBox presente, sem imagens raster, scripts ou foreignObject. O SVG adicional de capa preexistente também passou na verificação.
- 18 PNGs: assinatura PNG válida e dimensões 16/32/48 confirmadas para cada rota e fundo.
- Comparativo: três artigos e três frames de 390px; SVGs inline e CSS embutido, sem JavaScript ou recursos externos.
- `git diff --check` sem erros.
- Nenhum browser ou Playwright executado, conforme briefing. A avaliação visual em browser e as capturas ficam para o harness da Helena.
- Nenhuma alteração em componentes, header ou favicon ativo. Pórtico continua em uso.

Reprodução: `python3 docs/clubos-rebrand-light/brand/generate.py` seguido de
`node docs/clubos-rebrand-light/brand/render-favicons.cjs` na raiz.
Os PNGs são derivados apenas dos símbolos; as assinaturas mantêm texto editável.
