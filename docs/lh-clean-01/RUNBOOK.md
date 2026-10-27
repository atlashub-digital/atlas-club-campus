# LH-CLEAN-01 — Runbook (LearnHouse upstream 1.4.2 isolado)

**Instância:** `atlas-learnhouse-clean` · `/srv/atlas/learnhouse-clean`
**Imagem:** `atlas/learnhouse:1.4.2-be39029` (upstream `be390299e9f3b60b76f9f691cf0e226788f5b150`, tag 1.4.2)
**Domínio previsto:** `learnhouse-pilot.atlashub.si` (DNS pendente do PDG) · Caddy: `/srv/platform/edge/sites/learnhouse-pilot.caddy`

## Arrancar / parar
    cd /srv/atlas/learnhouse-clean && docker compose up -d
    docker compose stop          # preserva volumes
    docker compose down          # remove contentores, PRESERVA volumes

## Acesso
- Local (host): http://127.0.0.1:3010  e  http://lh-pilot.local (hosts entry + Caddy)
- Contas de teste: admin-homolog@levelab.org / aluna-homolog@levelab.org (org `default`; 2.ª org `leveacademy` vazia)

## Backup (diário recomendado)
    cd /srv/atlas/learnhouse-clean/backups
    TS=$(date -u +%Y%m%dT%H%M%SZ)
    docker exec lh-clean-db pg_dump -U learnhouse -d learnhouse -Fc -f /tmp/lh_$TS.dump
    docker cp lh-clean-db:/tmp/lh_$TS.dump ./lh_$TS.dump
    docker run --rm -v atlas-learnhouse-clean_lh_clean_media:/m -v $PWD:/b alpine tar czf /b/media_$TS.tgz -C /m .
    sha256sum lh_$TS.dump media_$TS.tgz

## Restauro (testado em ambiente separado)
    docker run -d --name restore -e POSTGRES_PASSWORD=tmp -e POSTGRES_USER=learnhouse -e POSTGRES_DB=learnhouse pgvector/pgvector:pg16
    docker cp lh_$TS.dump restore:/tmp/r.dump
    docker exec restore pg_restore -U learnhouse -d learnhouse --no-owner --no-privileges /tmp/r.dump
    docker run --rm -v atlas-learnhouse-clean_lh_clean_media:/m -v $PWD:/b alpine sh -c 'rm -rf /m/* && tar xzf /b/media_$TS.tgz -C /m'

## Rollback
    cd /srv/atlas/learnhouse-clean && docker compose down   # stack fora, volumes intactos
    rm /srv/platform/edge/sites/learnhouse-pilot.caddy && docker restart platform-caddy
    # remoção total (destrutivo, só com ordem explícita):
    # docker compose down -v && docker volume rm atlas-learnhouse-clean_lh_clean_{pgdata,redis,media}

## Notas
- `COLLAB_INTERNAL_KEY` é obrigatório (sem ele o collab morre e /collab devolve 502).
- Postgres é `pgvector/pgvector:pg16` (o upstream exige a extensão vector; sem ela o arranque falha).
- `NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL` tem de ser alcançável DENTRO do contentor E pelo browser: usar o hostname servido pelo Caddy + `extra_hosts: host-gateway`.
