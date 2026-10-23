# PLANS.md — Atlas ClubOS | Estado e roadmap vivo
**23/10/2026.** Este documento é a base para o Codex atualizar progressos por PR. Nenhuma tarefa abaixo está concluída por simples criação de documentação.

## W0: Foundation LearnHouse (G0)
- [ ] Criar repo Campus AtlasHub (sem interferir com portal).
- [ ] Fixar upstream tag/SHA e anotar licenciamento/Enterprise.
- [ ] Provisionar dependências isoladas de desenvolvimento, Web/API/Collab/DB/Redis.
- [ ] Criar dados seed: Free/Genesis 01+02/Criadores A, recursos privados/comuns, admin e 2+ learners.
- [ ] Validar LMS/UI/editor/atividade/discussão/progresso, negativo multiusuário.
- [ ] Helena provisiona VPS staging, DNS/TLS, Caddy proxy, volumes, backup e restore.

## W1: Identity (G1)
- [ ] ADR OSS/Enterprise/headless, custos e responsabilidades.
- [ ] Provar autoridade Supabase Master UUID e bridge provisionamento idempotente.
- [ ] Logout, suspensão, revogação e mudança de e-mail com E2E.

## W2: Institutional model (G2)
- [ ] Academias lógicas; Programa, Turma e matrícula multiprograma.
- [ ] Um usuário com 2 programas e progresso isolado por contexto.
- [ ] Admin cria cursos e turmas sem código exclusivo de Genesis.

## W3: ARO (G3)
- [ ] Portal Club Free E2E e checkout Hosted PIX Student 190/Standard 490.
- [ ] ARO order/entitlement ativo → matrícula LH; fail/expired/retry/dedupe.
- [ ] Refund exclusivamente manual via atendimento; externos refletidos em acesso.

## W4: Design Atlas 100% (G4)
- [ ] Tokens e shell Atlas, validação visual 390/1440.
- [ ] Catálogo/Academias/Programa/Turma/Player/Editor completos.
- [ ] Discussões, perfil e admin personalizados com acessibilidade.

## W5: Club Extensions (G5)
- [ ] Eventos/ateliers, gamificação, projetos, moderação e comunidade Atlas.
- [ ] Mentor Atlas somente com acesso e conteúdo autorizado.
- [ ] Backup/restore, upgrades upstream, perf/observabilidade.

## W6: Launch (G6)
- [ ] Aceitação Free, Student, Standard, mentor/admin, cross-user deny.
- [ ] Atualizar Clara, landing, termos, emails, campanhas, monitorização.
- [ ] Helena + Direção autorizam cutover para app.club.atlashub.si.

## Updates por missão
Preencher depois de cada PR: `Data | PR/Branch/SHA | Gate | Verificado | Bloqueador | Próximo passo | Owner`.
