# HELENA — Runbook de Infraestrutura e homologação
**Responsabilidade exclusiva de operações privilegiadas**; Codex não precisa de root VPS.

1. Inventariar qual VPS oferece recursos livres e medir CPU/RAM/disco/IOPS, imagens e volumes, Caddy, DNS/registrar, rede Docker, backups e monitorização.
2. Definir staging isolado com hostname, DNS/TLS e cookies não compartilhados com prod. Propor `staging.app.club.atlashub.si` somente após verificar DNS. Domínio final `app.club.atlashub.si` fica reservado até gates verdes.
3. Criar deploy controlado a partir de GitHub Actions/runner ou procedimento reproduzível usando tags/digests fixados, sem `latest` automático. Validação manual antes de promover imagens.
4. Preservar Caddy atual como proxy frontal. LearnHouse CLI gera Compose/reverse proxy para ambiente isolado: adaptar somente após confirmar portas e sem competir por 80/443.
5. Postgres LH e Redis LH dedicados, volumes/usuário próprios, ACL e backup/restauro DB + media testado; expor publicamente só UI HTTPS e os endpoints mínimos proxyados. Segredos em store seguro/ambiente, nunca em Markdown/PR/Chat.
6. Master Supabase: sem migrações LearnHouse, sem alterações auth.users; Bridge com privilégios mínimos e migração idempotente em schema `club` apenas após diff/testes.
7. ARO: confirmar oferta Student R$190 autodeclarada e Standard R$490 no catálogo canónico e runtime; consumos only via API autorizada; webhook e reconciliação com entitlement Active.
8. G0 release técnico: verificar frontend, API, colaboração, db, redis, upload, E2E, rollback, restore e CPU/RAM real. Não declarar staging pronto por `docker ps`.
9. G1 SSO/identidade: credenciais de teste segregadas, tokens curtos, logout/revocação; não expor cookies, secrets ou PII.
10. Só após critérios G0–G6 e aprovação executiva: atualizar DNS/route final e abrir produção.

**Relatório:** host escolhido sem IPs/segredos públicos, RAM/CPU/storage livres, redes, deploy SHA, ambientes, health checks, uptime, teste restore, limites/risco e blockers.
