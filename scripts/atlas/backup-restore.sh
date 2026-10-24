#!/usr/bin/env bash
set -euo pipefail
# Disposable development/CI only. No production DB names or URLs are accepted.
compose=(docker compose -f .atlas/dev/docker-compose.yml --env-file .atlas/dev/.env)
mkdir -p .atlas/evidence
# Quiesce the disposable app; collab flushes pending writes on shutdown.
"${compose[@]}" stop -t 30 learnhouse-app
"${compose[@]}" exec -T db pg_dump -U learnhouse -d learnhouse -Fc > .atlas/evidence/campus.dump
"${compose[@]}" exec -T db createdb -U learnhouse atlas_restore_check
trap '"${compose[@]}" exec -T db dropdb -U learnhouse --if-exists atlas_restore_check' EXIT
"${compose[@]}" exec -T db pg_restore -U learnhouse -d atlas_restore_check --exit-on-error < .atlas/evidence/campus.dump
for table in course activity trailrun trailstep discussion board; do
  live=$("${compose[@]}" exec -T db psql -U learnhouse -d learnhouse -Atc "SELECT count(*) FROM $table")
  restored=$("${compose[@]}" exec -T db psql -U learnhouse -d atlas_restore_check -Atc "SELECT count(*) FROM $table")
  test "$live" = "$restored"
  live_hash=$("${compose[@]}" exec -T db psql -U learnhouse -d learnhouse -Atc "SELECT md5(coalesce(string_agg(row_to_json(t)::text, '' ORDER BY id), '')) FROM $table t")
  restored_hash=$("${compose[@]}" exec -T db psql -U learnhouse -d atlas_restore_check -Atc "SELECT md5(coalesce(string_agg(row_to_json(t)::text, '' ORDER BY id), '')) FROM $table t")
  test "$live_hash" = "$restored_hash"
  echo "$table: $live rows and content checksum restored" >> .atlas/evidence/restore.txt
done
echo "PASS: PostgreSQL dump restored into separate disposable database"
