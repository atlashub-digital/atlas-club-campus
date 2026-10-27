# LH-CLEAN-01 — Evidências G0 (LearnHouse upstream 1.4.2, isolado)

Data: 2026-10-27 · Owner operações: Helena (ATLAS) · VPS: atlashub (104.207.81.174)

## 1. Versão e SHA
- Upstream `https://github.com/learnhouse/learnhouse`, tag **1.4.2**, commit
  **`be390299e9f3b60b76f9f691cf0e226788f5b150`** (verificado com `git describe --tags --exact-match`).
- Imagem local `atlas/learnhouse:1.4.2-be39029` (1.13 GB), build sem patches Atlas.
- Sem alterações ao Supabase Master, ARO, Genesis, club.atlashub.si, PRs #1/#2.

## 2. Serviços (projeto isolado `atlas-learnhouse-clean`)
| Serviço | Contentor | Estado |
|---|---|---|
| Web+API+Collab (all-in-one upstream) | `lh-clean-app` | Up (healthy) |
| PostgreSQL 16 + pgvector | `lh-clean-db` | Up (healthy) |
| Redis 7 | `lh-clean-redis` | Up (healthy) |

- Migrações: schema completo criado (62 tabelas); `LEARNHOUSE_*` próprios; volumes
  `lh_clean_pgdata` (68 MB), `lh_clean_media`, `lh_clean_redis` — **sem reutilizar
  volumes/config do clubos-staging**.
- Exposição: `127.0.0.1:3010` (+ rota Caddy `lh-clean-app:80`); nada em 80/443 direto.
- Causa-raiz corrigida no arranque: Postgres sem extensão `vector` → trocado para
  `pgvector/pgvector:pg16`; `COLLAB_INTERNAL_KEY` ausente → provisionado (collab deixa de morrer).

## 3. Testes PASS/FAIL
| # | Teste | Resultado |
|---|---|---|
| 1 | Serviços + migrações | **PASS** — 3/3 healthy, 62 tabelas, `/api/v1/health` 200 |
| 2 | Organização/admin/aluno + permissões reais | **PASS** — org `default` (id 1) + `leveacademy`; admin role 1, aluna role 4; aluna tenta criar curso → **403** "User does not have permission to create courses" |
| 3 | Dois cursos independentes publicados | **PASS** — curso A (público, id 1) e curso B (privado, id 2), ambos `published=true` |
| 4 | Aulas com conteúdo de demonstração | **PASS** — 4 capítulos, 4 atividades (`TYPE_DYNAMIC/SUBTYPE_DYNAMIC_PAGE`, `published=true`) |
| 5 | Login do aluno, matrícula, aula, conclusão | **PASS** — `trail_...` + `trailrun` (STATUS_IN_PROGRESS) e `trailstep.complete=true` |
| 6 | Persistência em PostgreSQL | **PASS** — `trailrun`/`trailstep` confirmados por SQL; UI mostra **"Course Progress 50% — 1 of 2 completed"** |
| 7 | Acesso negado a não autorizado | **PASS** — anónimo à aula do curso privado → **403**; anónimo a rota admin → **401/403** |
| 8 | Editor, discussões e colaboração | **PASS** — comunidade + discussão (aluna) + comentário (admin) persistidos; board privado com os 2 utilizadores; servidor collab online e `GET /collab` → **101** (upgrade WebSocket) |
| 9 | Upload e recuperação de ficheiros | **PASS** — upload `/api/v1/media/` (PDF) → recuperação 200 com **SHA256 idêntico**; ficheiro no volume `lh_clean_media` |
| 10 | Reinício + persistência + backup/restauro | **PASS** — `docker compose restart` sem perder nada (contagens 2/2/1/1/1 iguais antes/depois); backup `pg_dump -Fc` + tar da media; restauro em contentor **separado** com contagens idênticas e media com SHA256 idêntico |

## 4. URL / HTTPS
- **Navegável localmente**: `http://lh-pilot.local` e `http://127.0.0.1:3010` (UI upstream:
  lista de cursos, login admin/aluna, página de curso com barra de progresso).
- `learnhouse-pilot.atlashub.si`: **rota Caddy criada** (`/srv/platform/edge/sites/learnhouse-pilot.caddy`,
  HTTP enquanto o DNS não existe). **Bloqueio: registo DNS público pendente do PDG**
  (CNAME/A → 104.207.81.174). Assim que existir, mudo a rota para HTTPS automático.

## 5. Recursos consumidos
- CPU em regime: app ~0,5%, db ~0%, redis ~0,35%
- RAM: app ~492 MiB, db ~58 MiB, redis ~4 MiB (≈ 554 MiB total)
- Disco: imagem 1,13 GB + volumes 68 MB → **≈ 1,2 GB**
- VPS: 124 GB livres · 15,6 GB RAM (uso atual ~32%) → folga para manter as duas instâncias

## 6. Backup / restauro
- `backups/lh_20261027T174941Z.dump` (254.624 B, SHA256 `e068a6ff03e2f0bd…`)
- `backups/media_20261027T174941Z.tgz` (965 B, SHA256 `b4ebb4c5ae14130d…`)
- Restauro provado em contentor separado (`lh-restore-test`, já removido).

## 7. Runbook e rollback
- `RUNBOOK.md` no projeto (arrancar/parar, backup, restauro, rollback, notas de config).

## 8. Pendências / bloqueios
1. **DNS `learnhouse-pilot.atlashub.si`** — ação do PDG (Cloudflare) para HTTPS externo.
2. UI: a página inicial "hub" (`/`) mostra um *error boundary* de hidratação (React #441) em
   certos acessos; as páginas funcionais (`/courses`, `/course/...`, `/login`, dash) renderizam
   corretamente. Reportado como falha concreta, não escondido.
3. Sem SSO/Supabase/ARO (fora do âmbito G0, por decisão).

## 9. Parecer G0
**PASS** — motor LearnHouse ORIGINAL, isolado, com organização, admin, aluna, dois cursos,
aulas, atividades, progresso persistente, comunidade, colaboração, media e restauro,
navegável localmente. Nenhuma ligação a ARO/Master. Pronto para decisão de baseline única
após o DNS e a revisão do ponto 2 acima.
