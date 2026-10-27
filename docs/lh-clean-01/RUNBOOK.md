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

## Restauro — REGRAS DE SEGURANÇA (nunca tocar no volume original)
**O restauro de teste corre SEMPRE num volume separado.** Nunca executar `rm -rf` nem
`tar x` sobre `atlas-learnhouse-clean_lh_clean_media`, nem `pg_restore` sobre a base viva.

### Ensaio de restauro (não destrutivo) — forma provada
    cd /srv/atlas/learnhouse-clean/backups
    # 1) BD num contentor descartável (não mexe na base viva)
    docker run -d --name lh-restore-test -e POSTGRES_PASSWORD=tmp \
      -e POSTGRES_USER=learnhouse -e POSTGRES_DB=learnhouse pgvector/pgvector:pg16
    docker cp lh_<TS>.dump lh-restore-test:/tmp/r.dump
    docker exec lh-restore-test pg_restore -U learnhouse -d learnhouse --no-owner --no-privileges /tmp/r.dump
    docker exec lh-restore-test psql -U learnhouse -d learnhouse -tAc "SELECT count(*) FROM \"user\";"
    docker rm -f lh-restore-test        # descartar

    # 2) media num VOLUME NOVO e separado (o original fica intacto)
    docker volume create lh_media_restore_test
    docker run --rm -v atlas-learnhouse-clean_lh_clean_media:/src:ro \
      -v lh_media_restore_test:/dst -v $PWD:/b alpine \
      sh -c 'tar xzf /b/media_<TS>.tgz -C /dst'
    # comparar hashes src (read-only) vs dst; depois: docker volume rm lh_media_restore_test

### Restauro REAL (só com ordem explícita do PDG, com a stack parada)
    docker compose stop app
    docker exec lh-clean-db pg_restore -U learnhouse -d learnhouse --clean --if-exists --no-owner /tmp/r.dump
    docker compose start app
> Antes de qualquer restauro real: tirar um backup fresco do estado atual.


## Edge (Caddy) — armadilha crítica de media
O `reverse_proxy` do Caddy injeta `Accept-Encoding: gzip` no upstream. O
`SelectiveGZipMiddleware` do LearnHouse rebenta respostas de ficheiro
(`FileResponse` → HTTP 500) quando o pedido traz gzip. Sintoma: **todo o media devolve
500 no browser**, mas 200 se pedido com curl sem Accept-Encoding. Correção aplicada em
`/srv/platform/edge/sites/learnhouse-pilot.caddy`:
    reverse_proxy lh-clean-app:80 {
        header_up Accept-Encoding identity
        transport http { compression off }
    }
O Caddy continua a comprimir do lado do cliente (`encode zstd gzip`).

## Identidade
- Site: **Atlas Club — LearnHouse Pilot** · org 1 = `Atlas Club — LearnHouse Pilot` (slug `default`)
- Org 2 (ensaio de isolamento): `Atlas Club — Laboratório` (slug `leveacademy`)
- Contas de piloto: `admin@atlashub.si` (admin) · `aluno@atlashub.si` (aluna)
- Matrícula pública **fechada** (`members.signup_mode = inviteOnly`) — acesso só por convite.

## Estado dos backups
    /srv/atlas/learnhouse-clean/backups/   (lh_<TS>.dump + media_<TS>.tgz + SHA256SUMS.txt)
Ensaio de restauro NÃO destrutivo: contentor descartável + volume separado (nunca toca nos originais).

## Rollback
    cd /srv/atlas/learnhouse-clean && docker compose down   # stack fora, volumes intactos
    rm /srv/platform/edge/sites/learnhouse-pilot.caddy && docker restart platform-caddy
    # remoção total (destrutivo, só com ordem explícita):
    # docker compose down -v && docker volume rm atlas-learnhouse-clean_lh_clean_{pgdata,redis,media}

## Notas
- `COLLAB_INTERNAL_KEY` é obrigatório (sem ele o collab morre e /collab devolve 502).
- Postgres é `pgvector/pgvector:pg16` (o upstream exige a extensão vector; sem ela o arranque falha).
- `NEXT_PUBLIC_LEARNHOUSE_BACKEND_URL` tem de ser alcançável DENTRO do contentor E pelo browser: usar o hostname servido pelo Caddy + `extra_hosts: host-gateway`.
