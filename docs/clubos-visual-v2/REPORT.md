# Sprint visual V2 — Atlas ClubOS

## Incremento 1 — Campus

Homepage exclusiva da flag de marca, com saudação contextual, trilha existente (somente autenticado e cursos habilitados), progresso nativo e links para cursos reais. Cursos e percursos têm estado vazio com CTA. Biblioteca, comunidades e playgrounds são entradas de diretório condicionadas às funcionalidades; não afirmam quantidades nem simulam conteúdo. Novidades não são exibidas sem fonte de dados.

Verificação: TypeScript passou após preparar next-env.d.ts local (ignorado pelo Git). Scan de traduções: nenhuma chave literal ausente; `analytics.course_analytics.type_labels.` é prefixo de uma chave dinâmica, não uma chave literal de interface.

Acessibilidade estática: um h1, seções nomeadas, ordem DOM igual à visual, links nativos, progress com nome do curso, foco 3px. Grade 1/2/3 colunas; títulos quebram palavras longas. Texto #172335 e secundário #526174 em branco; contraste calculado no relatório final. Sem evidência de browser, por restrição do brief.

Lint web completo executado diretamente (o script `lint` mascara o exit code): 24 erros existentes em arquivos fora deste incremento. Nenhum erro novo; lint dos dois componentes alterados passou sem avisos após ajustes. Os erros legados não são tratados como aprovação verde do lint global.
