# Sprint visual V2 — Atlas ClubOS

## Incremento 1 — Campus

Homepage exclusiva da flag de marca, com saudação contextual, trilha existente (somente autenticado e cursos habilitados), progresso nativo e links para cursos reais. Cursos e percursos têm estado vazio com CTA. Biblioteca, comunidades e playgrounds são entradas de diretório condicionadas às funcionalidades; não afirmam quantidades nem simulam conteúdo. Novidades não são exibidas sem fonte de dados.

Verificação: TypeScript passou após preparar next-env.d.ts local (ignorado pelo Git). Scan de traduções: nenhuma chave literal ausente; `analytics.course_analytics.type_labels.` é prefixo de uma chave dinâmica, não uma chave literal de interface.

Acessibilidade estática: um h1, seções nomeadas, ordem DOM igual à visual, links nativos, progress com nome do curso, foco 3px. Grade 1/2/3 colunas; títulos quebram palavras longas. Texto #172335 e secundário #526174 em branco; contraste calculado no relatório final. Sem evidência de browser, por restrição do brief.

Lint web completo executado diretamente (o script `lint` mascara o exit code): 24 erros existentes em arquivos fora deste incremento. Nenhum erro novo; lint dos dois componentes alterados passou sem avisos após ajustes. Os erros legados não são tratados como aprovação verde do lint global.

## Incremento 2 — Capas

CourseCover reutilizável com título real e desenho geométrico em CSS, sem assets novos de marca. Imagem existente tem prioridade. Card em homepage/catálogo/admin, hero de fallback no curso e miniatura no admin. Não altera vídeo promocional nem upload/edição. TypeScript passou; lint dos arquivos alterados: zero erros, quatro avisos preexistentes. Testes rápidos de 404/inscrições: 4 passaram.

Contrastes calculados pela luminância relativa WCAG: #172335/branco 15,81:1; #526174/branco 6,32:1; branco/#3268d6 5,14:1; #172335/#edf0f4 (capa) 13,83:1; #526174/#f5f6f8 5,85:1. Todos excedem 4,5:1. Capa decorativa não repete o nome acessível do link.

## Incremento 3 — Navegação e erros

A 1440px, navegação de seções em linha própria, sem competir com marca/pesquisa/perfil. A 390/768px, menu expansível existente com pesquisa e fechamento por Escape; links de itens adicionais configurados também são preservados. Estados ativos incluem descendentes. Breadcrumbs têm nome, página atual e rolagem horizontal em espaços estreitos. Pesquisa mantém o componente/serviço existente. 404 com marca existente e PT-BR; erros genéricos e erro de raiz com textos PT-BR por categoria, preservando classificação e ações.

Removido CSS antigo da homepage. Nenhum seletor `[class*=]` ou `!important` nas superfícies Atlas. Regras globais legadas encontradas no editor/boards/tipografia árabe não foram removidas: atendem mecânicas específicas fora do rebrand, e a remoção exigiria validação funcional própria.

Acessibilidade estática: links de menu com mínimo de 44px, breadcrumb rolável e foco interno; 404 com h1 e CTA nomeado. Erros mantêm retry/reset/logout existentes. Os layouts por largura foram revisados no código; sobreposição real, busca e foco em execução dependem da revisão visual da Helena. TypeScript passou; 4 testes de 404/inscrições passaram.

Lint dos arquivos do incremento 3: zero erros, seis avisos legados. O lint web completo mantém os 24 erros preexistentes. Nenhuma alteração de permissões, contratos ou rotas de API.
