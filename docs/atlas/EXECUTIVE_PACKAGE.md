# ATLAS CLUBOS — GO V2 | Pacote de execução
**Data:** 23/10/2026 · **Âmbito:** Atlas ClubOS/Campus · **Estado:** autorização de engenharia; nada aqui prova instalação ou go-live.

Este pacote consolida as decisões aprovadas, o Blueprint V1 e o aditamento V1.1, elevando a missão para **personalização visual total e entrega de plataforma real** a partir do LearnHouse. O Genesis é apenas o primeiro programa; a arquitetura deve servir uma instituição com múltiplas academias, programas, conteúdos partilhados, turmas e membros.

## Ordem de leitura
1. `docs/BLUEPRINT_V2_EXECUTIVO.md` — arquitetura e contratos canónicos.
2. `AGENTS.md` — regras concisas de engenharia Codex (copiar para a raiz do novo repositório).
3. `prompts/CODEX_01_BOOTSTRAP_AND_PILOT.md` — primeira missão executável.
4. `prompts/CODEX_02_FULL_ATLAS_DESIGN.md` — implementação da personalização visual integral.
5. `docs/GATES_ACCEPTANCE.md` — critérios de evidência.
6. `operations/HELENA_INFRA_HANDOFF.md` — responsabilidades de infraestrutura e rollout.
7. `contracts/IDENTITY_ACCESS_AND_ARO.md` — contratos de identidade, acesso e pagamentos.
8. `docs/DESIGN_SYSTEM_BRIEF.md` — direção visual e rotas.
9. `docs/WORK_SETUP.md` — ambientes Codex Cloud e Work.
10. `docs/BLUEPRINT_V1_REFERENCIA.md` — contexto histórico; **V2 prevalece em caso de conflito**.

## Divisão de responsabilidade
- `atlashub-digital/atlashub-club`: landing/portal atual (preservar).
- `atlashub-digital/atlas-club-campus`: repositório **novo**, a provisionar na organização; fork técnico/mirror fiel do upstream LearnHouse, versão/tag/commit fixado, com upstream remoto preservado.
- `atlashub-digital/atlashub-finance`: ARO canónico, não refatorar.
- Supabase Master: autoridade de identidade; LearnHouse tem DB própria isolada.
- Engenheiro principal: Codex Cloud. Helena: operações privilegiadas. Work: coordenação e QA documental.

## Ações que este pacote NÃO executa
Não cria o repositório novo, não instala VPS, não altera DNS, não ativa pagamentos, não executa migrations. Tudo isso exige evidência de execução e gates.

## Referências visuais
`assets/visual_refs/CLUB_ATLAS_REFERENCIA_0*.png`: três artes de referência disponibilizadas no projeto, destinadas à reconstrução visual no Atlas ClubOS. Não são especificações de implementação nem prova de licença sobre fotografias de terceiros; validar direitos e identidade antes de divulgação.

## Criação do repositório
Ver `operations/BOOTSTRAP_REPO.md`. Em 23/10/2026, o repositório Campus ainda não existe; nesta conversa foi criado apenas PR documental no portal existente.
