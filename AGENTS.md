# AGENTS.md — ATLAS CLUBOS

Project: Atlas ClubOS. Original product on LearnHouse upstream. Read `docs/BLUEPRINT_V2_EXECUTIVO.md`, `docs/GATES_ACCEPTANCE.md`, `contracts/IDENTITY_ACCESS_AND_ARO.md` and the issue you are implementing before writing code.

## Non-negotiable
- Atlas ClubOS serves multiple academies/programs/cohorts, not Genesis-only logic.
- Public portal is separate repository `atlashub-digital/atlashub-club`; no changes unless an explicit portal task.
- Preserve LearnHouse backend, API contract and upstream update path by default. Fully customize frontend UX/brand using Atlas design tokens. Every upstream patch must be listed in `docs/UPSTREAM_PATCHES.md` with reason, tests and rebase risk.
- Supabase Master Auth user UUID is canonical identity. Never create a second independent user lifecycle. Do not write directly to Master auth.users or run LH migrations in Master.
- One organization in LH Community initially; Atlas academies/programs are logical divisions. Verify actual cohort/content/progress isolation rather than assuming.
- LearnHouse keeps separate Postgres & Redis; no new server or public ports without Helena approval. Only staging for first pilot.
- ARO is the sole payment authority. Free is zero-cost, Genesis Student R$190 by self-declaration, Standard R$490; price/entitlement server authoritative. Manual refund via service desk; handle externally completed REFUNDED/CHARGEBACK events and revoked rights, never implement automatic refund initiation.
- Keep Atlas Media and Discord/WhatsApp as integrations; never duplicate payment, media, or auth providers.
- AGPL-3.0 obligations and Enterprise/pro features are not bypassable; record license implications, prove feasibility. If an essential capability is Enterprise-only, stop that path and issue ADR and alternatives; no feature-flag trickery.
- One writer per branch. Git fetch and confirm remote HEAD; no force-push; no direct production merge/deploy by coding agent.
- Protect privacy: RLS, authorization server-side, masked test users, no PII in screenshots/logs; minors need separate guardian compliance.
- No API claims based only on README: tests with pinned version and actual responses are mandatory.

## Workflow
1. Scope one issue and one branch (`feat/clubos-...`); assess upstream code first.
2. Plan an independently testable vertical slice, not a speculative architecture rewrite.
3. Implement with tests for success, cross-user access denial, unauthorized course, logout/revocation, retry/idempotency.
4. Run lint, typecheck, unit, integration/E2E, browser screenshots mobile & desktop.
5. Report SHA, URL, tests, changes, migration, evidence, outstanding blockers, rollback.
6. Only Helena changes VPS production or shared infra after approval.

## Style
PT-BR in user-visible UI. Atlas Club premium dark/navy, gold, electric blue; accessible, responsive, elegant. Never show dead buttons or pretend simulation is live.
