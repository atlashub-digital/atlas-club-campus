# CODEX CLOUD — MISSÃO 02: FULL ATLAS CLUBOS REDESIGN
**Pré-requisito:** G0 motor funcional e rota de Identity Bridge aprovada; usar branch nova e não alterar contratos backend sem ADR.

Personalizar 100% da experiência visual LearnHouse que entra no escopo de lançamento Atlas ClubOS. A inspiração é Club Atlas premium já validado; converter estilo em tokens, componentes reutilizáveis e experiências desktop/mobile. Alcance: home, menu, academy catalogue, programa/cohort, course player, editor/authoring, assignments, discussions, boards, membro/perfil, admin, notifications, empty/loading/errors. Fazer navegação Atlas institucional multiprograma — Genesis não define a arquitetura.

Regras: backend LearnHouse preferencialmente upstream, alterações listadas no PATCH_LOG; nenhum checkout nativo, nenhum segundo login, nenhum aspecto de marca LearnHouse residual exceto créditos/licença requeridos; sem apagar atribuição legal. Preservar as funcionalidades de aula/edição/progresso/colaboração e regressão. CI e E2E com screenshots 390/1440 e QA visual por rota, acessibilidade e desempenho. Propor sub-PRs pequenos de design tokens → shell → ensino → colaboração/admin, sem branch compartilhada.

Não declarar pronto porque a home ficou bonita. Concluir somente quando UI/rotas críticas mantiverem funcionalidade real em staging e passarem os gates G4/G6.
