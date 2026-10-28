# Atlas ClubOS P1 — Evidências de fecho (28/10/2026)

Instância **isolada** de homologação: `atlas-clubos-p1` · `https://clubos-p1.atlashub.si`
Baseline: LearnHouse upstream **1.4.2** (`be390299e9f3b60b76f9f691cf0e226788f5b150`), sem EE, sem patches dos PRs antigos.

## 1. Versão, CI e deploy
| Item | Valor |
|---|---|
| Commit | `a9bc0177741714698af92b21e47eff5b95517c78` (branch `feat/clubos-p1-multimedia-brand`) |
| CI | **GREEN** — next-lint, typecheck, unit (PR #4) |
| Imagem | `atlas/clubos-p1:a9bc0177` · digest `sha256:04cfbbf76f13e1738c33d974e991bac73ab5024ca22a56f8ab205d185fe49917` |
| Build | `--build-arg NEXT_PUBLIC_ATLAS_CLUBOS_BRAND=true --build-arg LEARNHOUSE_PUBLIC=false` |
| Rollback | imagens `atlas/clubos-p1:9441f8f9` e `:afd1e423` retidas + `.env.rollback` |

Correções de engenharia aplicadas nesta linha (todas commitadas):
1. `Dockerfile` — aceitar `NEXT_PUBLIC_ATLAS_CLUBOS_BRAND` como build arg (sem isto a flag era ignorada em silêncio).
2. `proxy.ts` — `/registo` como alias real de `/signup` (antes: 404, o middleware reescrevia para a org).
3. `proxy.ts` — excluir `/atlas/` do rewrite de tenancy (correção da Direção, `a9bc0177`).

## 2. Assets de marca — HTTP 200 e visíveis
| Asset | Estado |
|---|---|
| `/atlas/atlas-clubos-mark.svg` | **200** · 1.131 B · `image/svg+xml` |
| `/atlas/atlas-avatar.webp` | **200** · 124.464 B · `image/webp` |

No browser (1440 e 390), `/login` e `/registo` carregam as duas imagens com dimensões reais
(mark 144×144, avatar 720×681). Painel de marca mostra o símbolo Atlas, **“Atlas ClubOS”** e o avatar.

## 3. Curso e as cinco experiências (browser real)
Curso: **Atlas ClubOS P1 — Crie o seu primeiro agente de IA** (1 capítulo, 4 atividades).

| # | Experiência | Prova |
|---|---|---|
| 1 | Página de texto (TipTap) | Renderiza “Bem-vindo ao seu primeiro agente de IA” + “Ideia central” |
| 2 | Vídeo YouTube externo | `iframe youtube.com/embed/rCkYVxOX-dI`, `autoplay=0` (sem autoplay indesejado) |
| 3 | PDF (amostra Editions) | Visualizador nativo: **200**, 155.301 B, `application/pdf`, SHA256 idêntico ao original |
| 4 | Quiz nativo (4 tarefas `QUIZ`) | Corrigido no servidor: **Graded 75,00%**, 300/400 pts, tarefas 100/100/100/0 |
| 5 | Progresso | **100% · 4 de 4** · `trailrun = STATUS_COMPLETED` · nota persistida |

Amostra: capa + índice + abertura do capítulo 07 de *Empresa Aumentada* (6 de 694 páginas).
O livro integral **não** foi copiado para diretórios públicos nem publicado.

## 4. Controlo de acesso (decisão da Direção)
Catálogo e metadados públicos; **conteúdo restrito a contas autorizadas**.

| Alvo | Anónimo | Conta autorizada |
|---|---|---|
| `content` da atividade texto | **vazio (2 B)** | 1.313 B (texto completo) |
| `content` da atividade vídeo | **vazio (2 B)** | 139 B (URI YouTube) |
| `content` da atividade PDF | **vazio (2 B)** | 134 B (ficheiro) |
| Tarefas do quiz | **401** | 4 tarefas |
| Ficheiro PDF (`/content/...`) | **403** | 200, SHA256 idêntico |
| Chaves de resposta no payload do aluno | — | **ausentes** |

## 5. Persistência, backup e restauro
- **Reinício** (`compose stop/start`, sem remover volumes): estado idêntico antes/depois —
  2 users · 1 curso · 4 atividades · 4 tarefas · 4 passos concluídos · nota 300.
- **Backup**: `p1_20261028T001403Z.dump` (SHA256 `18bccd68766e6bb6…`) +
  `p1media_20261028T001403Z.tgz` (SHA256 `e3b1a8294c7324dc…`) com `SHA256SUMS.txt`.
- **Restauro não destrutivo**: BD restaurada em contentor descartável (2 users / 1 curso / 4 tarefas / nota 300)
  e media extraída para **volume separado** com SHA256 idêntico. Volume original intacto.
  (O ensaio nunca escreve sobre `atlas-clubos-p1_p1_media`.)

## 6. Avisos legais
- `LICENSE` **AGPL-3.0** intacto no repositório; marca upstream e selo “Made with LearnHouse” preservados.
- Rodapé legal mantém “© LearnHouse, Inc.” e links de termos/privacidade (a substituir apenas após revisão jurídica).
- Marca comercial apresentada: **Atlas ClubOS**.

## 7. Recursos
CPU em regime ≈ 0,6% · RAM ≈ 432 MiB · disco ≈ 1,2 GB (imagem) + 67 MB (BD) + 188 KB (media).

## 8. Não feito (por decisão)
- Sem promoção para `app.club.atlashub.si` e sem alterações de DNS do domínio final.
- Sem ligação a Atlas Master/ARO/pagamentos; sem SSO (o `/registo` é alias, não integração de identidade).
- Piloto `learnhouse-pilot.atlashub.si` e portal `club.atlashub.si` **intocados**.
