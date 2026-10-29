# RELEASE CANDIDATE — Atlas ClubOS (PR #15)

SHA candidata: **dc7f462e** (`feat/atlas-brand-minimal` → PR #15)
Imagem: `atlas/clubos-uiv:dc7f462e` · ID `564ca45acb08` · digest `sha256:564ca45acb082687a9745ce08446ced2ff08d922fb7e25121e7ceb5b045b7c9e`
CI no SHA: Web Lint, Web Tests, API Lint, API Tests, Build linux/amd64+arm64, Service images (api/web/collab) — **todos SUCCESS** (29/10).

## 1. Portão de entrada (verificar antes de tudo)
- CI no SHA alvo: Web Lint, Web Tests, API Lint, API Tests (`test`), Build linux/amd64+arm64, Service images (api/web/collab) — TODOS SUCCESS.
- Run de referência: `gh run list --branch feat/atlas-brand-minimal`.

## 2. Build da imagem local (GHCR inacessível a partir do VPS)
```
cd /root/atlas-club-campus && git checkout dc7f462e
docker build --build-arg NEXT_PUBLIC_ATLAS_CLUBOS_BRAND=true \
  -f Dockerfile -t atlas/clubos-uiv:dc7f462e .   # background, ~10-15 min
```
Nota: a flag de marca é assada no build (--build-arg); env runtime não substitui.

## 3. Backup pré-promoção (obrigatório, executar ANTES do swap)
```
docker exec uiv-db pg_dump -U clubos -d clubos | gzip > /srv/atlas/backups/clubos-preview-$(date +%F-%H%M).sql.gz
docker run --rm -v clubos-uiv_dbdata:/data -v /srv/atlas/backups:/b alpine tar czf /b/clubos-dbdata-$(date +%F-%H%M).tgz -C /data .
# registar digest da imagem anterior em uso:
docker inspect uiv-app --format '{{index .RepoTags 0}}' >> /srv/atlas/backups/uiv-image-history.log
```

## 4. Promoção da preview (após GO)
```
sed -i 's/UIV_IMAGE_TAG=.*/UIV_IMAGE_TAG=dc7f462e/' /srv/atlas/clubos-uiv/.env
docker compose --project-directory /srv/atlas/clubos-uiv up -d app
```
Smoke (repetir o 1º pedido se der error boundary de arranque):
- `curl -s -o /dev/null -w '%{http_code}' https://uiv-preview.atlashub.si/` → 200
- `docker ps | grep uiv-app` → imagem `atlas/clubos-uiv:dc7f462e`, Up
- magic-link request (admin@clubos.atlashub.si) → e-mail em Resend com `last_event=sent/delivered` e header `Reply-To: contact@atlashub.si`

## 5. Homologação autenticada (P0.2, só preview)
Browser, 1 sessão, larguras 390/768/1440, capturas sequenciais nomeadas.
Jornadas: login Admin + Convidado; curso P1 (permissões, PDF 200/403, vídeo/fallback, quiz 75%, progresso).

## 6. Rollback (qualquer fase)
```
sed -i 's/UIV_IMAGE_TAG=.*/UIV_IMAGE_TAG=a3514234/' /srv/atlas/clubos-uiv/.env
docker compose --project-directory /srv/atlas/clubos-uiv up -d app
# se a BD foi corrompida: docker exec -i uiv-db psql -U clubos -d clubos < dump.sql (após drop/recreate)
```
Imagem anterior: `atlas/clubos-uiv:a3514234` (a796109d7cd7, confirmada em execução 21h+).

## 7. Produção (app.club.atlashub.si)
BLOQUEADA sem GO final do PDG. Mesmo procedimento, aplicado à stack de produção, com backup próprio e janela acordada.

## Suspenso (FORA do sprint)
PR #14, temas Light/Dark, restantes redesigns.
