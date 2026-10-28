# Atlas ClubOS — P1 Multimedia + brand (27 Oct 2026)

## Baseline and ownership
- From upstream LearnHouse tag 1.4.2, SHA `be390299e9f3b60b76f9f691cf0e226788f5b150`.
- `baseline/learnhouse-1.4.2` stays clean. The P1 feature branch is the only writable development line for this increment.
- Do not merge legacy PR #1/#2 into the baseline. Keep original `learnhouse-pilot.atlashub.si` intact.
- Target app domain is **app.club.atlashub.si**, NOT `app.club.atlas.si`. Do not change DNS until the separate P1 runtime has passed internal tests.
- Marketing stays at `club.atlashub.si`.

## Branding scope (implemented in this branch)
- Official Atlas symbol geometry and preexisting Atlas mascot image from `atlashub-digital/atlashub-club`.
- Auth panel branding is opt-in with `NEXT_PUBLIC_ATLAS_CLUBOS_BRAND=true` **at Next.js build time**. Brand no-org copy and org logo fallback changed when the flag is enabled. The rest of LearnHouse stays intact.
- `/registo` aliases the existing `/signup`; native `/login` remains available.
- LEARNHOUSE_SITE_NAME should be set as Atlas ClubOS in dedicated P1 deployment, **not in the reference pilot**.
- This is NOT login unification. The marketing account and native LearnHouse login have separate sessions until an identity bridge is verified.
- Keep original AGPL license, upstream attribution and required network-source notices. Review branding/white-label commercial restrictions before removing vendor credits in public user-facing pages. Replace incorrect vendor legal *contracts* with approved Atlas terms/privacy only after legal review.

## P1 seed content — PRIVATE review only
Title: `Atlas ClubOS P1 — Crie o seu primeiro agente de IA`.
Source video: `https://www.youtube.com/watch?v=rCkYVxOX-dI`. Use LearnHouse native **external_video** endpoint `POST /api/v1/activities/external_video` with type youtube; test embed playback in browser (availability not yet confirmed).

Suggested content:
1. Introduction: TipTap dynamic page, public intro only if approved.
2. YouTube lesson: video above; private activity.
3. Reading: **approved sample** of Empresa Aumentada, PDF activity via `POST /api/v1/activities/documentpdf`. Test visual PDF.js. **Do not publish proprietary full book in public bucket;** full work stays Editions or restricted staff only.
4. Knowledge quiz: native Quiz block within dynamic page or graded assignment; 3-5 questions derived from reviewed material (no invented video transcript). Verify true stored score.
5. Student marks or completes activities; test Trail state before and after refresh, restart, mobile 390px.

Publication placement: canonical public catalog and paid reader remain in **AtlasHub Editions**, while course contains a linked reading activity. Do not make duplicate editorial masters.

## P1 acceptance
- P1 runtime isolated from clean LearnHouse pilot: own docker compose project and **new DB/Redis/media volumes**, HTTPS staging and no DNS switch to app domain without signoff.
- Existing Atlas Club portal stays live and unchanged. Do not redirect `/entrar` and `/participar` until the identity contract is implemented. In future, route `/login` and `/registo` to the app through the approved bridge, not by treating URL redirects as SSO.
- Staff account: able to load video, PDF, quiz and real progress; unauthorised user gets 403 for private contents and media.
- Screenshots of brand logo, mascot, login and 390/1440 layout. CI compile/E2E and precise FAIL/PASS report.
- Verify legal attribution AGPL and privacy/terms destinations before external promotion.

## Roles
- Helena: provision independent runtime, access and DNS only after Go; create the course via authenticated LearnHouse admin and API, test media.
- One engineering writer: build/CI of this branch. No second Codex/Z.AI writer.
