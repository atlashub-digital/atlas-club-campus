# CODEX CLOUD — MISSÃO EXECUTIVA 01: ATLAS CLUBOS BOOTSTRAP + LIVE PILOT

**Objetivo:** começar já a engenharia e entregar LearnHouse 100% funcional em staging, pronto para full redesign Atlas. Este pedido é para implementar e testar, não só estudar ou gerar blueprint.

1. Lê `README.md`, `AGENTS.md`, `docs/BLUEPRINT_V2_EXECUTIVO.md`, `docs/GATES_ACCEPTANCE.md`, `contracts/IDENTITY_ACCESS_AND_ARO.md`, `operations/HELENA_INFRA_HANDOFF.md`.
2. Criar/reutilizar repo `atlashub-digital/atlas-club-campus` sob AtlasHub: verificar existência primeiro, pedir/prover permissão GitHub para criação se necessária. Basear no upstream `learnhouse/learnhouse`, preservar LICENSE, NOTICE e git history quando legal/tecnicamente adequado; remote `upstream`; selecionar release estável e fixar tag/SHA/digests. **Nunca importar como ficheiros soltos apagando atribuição.**
3. Branch `feat/clubos-bootstrap` (único writer). Lançar dependências e testes isolados de desenvolvimento no Codex, com `apps/web/api/collab/cli`, PostgreSQL e Redis. Usar procedimentos oficiais, comandos/requisitos validados contra o commit fixado, sem `@latest` em produção.
4. Para deploy staging VPS, gerar um runbook para Helena, com recursos/volumes/portas/backup/restore, Caddy reverse proxy e DNS/TLS, sem executar operações privilegiadas ou abrir portas públicas. Staging só após Helena configurar. Não alterar Master/ARO.
5. Seed: uma organização Atlas, Academy IA (Genesis 01 e 02), Academy Creators (Creators A), Free, 2+ usuários e 1 admin; cursos, vídeos/documentos, atividades, assignment, discussão e quadro, com conteúdo demonstrativo. Testar partilha de recursos e segregação de progresso.
6. QA real no browser: login local LH para provar engine, criar aula via UI, consumir conteúdo, marcar progresso, publicar discussão, check backups/restore; casos negativos cross-user. **Isto é G0 apenas**, não declarar SSO Atlas funcional.
7. Investigar ESSENCIAL: OSS vs Pro/Enterprise de SSO, headless token e multi-org. Selecionar estratégia de ponte de autenticação LEGAL e suportada; produzir ADR com prova real, testes e custos. Não contornar flags/licenças com RE.
8. Começar em paralelo setup de design system Atlas, sem confundir visual protótipo com produto funcional. Não bloquear a entrega G0 por estética.
9. CI e PR completos, com screenshots 390/1440px, SHA, endereços verificados, testes, logs sanitizados, lista de serviços e evidência de restore; bloquear merge se qualquer invariante falhar.

**DONE da missão 01:** repo/PR + motor LearnHouse navegável com persistência e QA; instalação no staging VPS pela Helena se disponível; ADR de SSO/Pro/Enterprise; plano de personalização com alcance 100%. Se infraestrutura não estiver autorizada, terminar o ambiente de desenvolvimento e entregar handoff exato, indicando o staging como pendente, sem inventar URL operacional.

**PRIORIDADE COMERCIAL PARALELA:** portal `atlashub-club` Genesis E2E → ARO; não mexer nele nesta branch.
