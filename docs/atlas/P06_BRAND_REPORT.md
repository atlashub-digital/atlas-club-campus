# P0.6 — Atlas Club UI and email branding

Branch: `feat/atlas-brand-minimal`. Implements the PDG decision of 2026-10-29 and supersedes the attribution/email decisions in `BRAND_MINIMAL_REPORT.md`.

## Changes

- Removed the organization footer attribution and all four rendered GitHub attribution links (two shared one URL constant). Organization footer now reads `© {year} Atlas Club · AtlasHub`; current logos remain intact.
- Removed the Atlas source/license watermark and the shared license URL constant. Privacy draft links remain.
- Updated UI copyright in all 22 locales, footer defaults, accessible logo text and generated organization script labels. Import dialogs, authentication branding, user management and playground already used Atlas Club in their visible text.
- Updated transactional email copy in all 20 email locales and nudge copy in all 20 nudge locales, sender defaults (including configuration), accessible logo text, account/login/invitation fallbacks, and web welcome/billing email copy. Preserved organization white-label behavior and technical identifiers.
- Eliminated 170 occurrences of the previous brand in production/configuration (includes removed copy and comments); updated 34 occurrences in test expectations/comments. Added a regression assertion covering every email translation value.

## Validation

- Full API service suite: 3,631 passed, 19 skipped, 52 warnings in 426.34 seconds (`PYTHONPATH=apps/api/src apps/api/.venv/bin/pytest apps/api/src/tests/services -q`).

- Web tests: 476 passed, 0 failed.
- Login/profile security tests: 47 passed.
- Strict lint on changed TS/TSX files: passed (0 errors, 7 warnings).
- Full-project strict lint: 24 pre-existing errors and 887 warnings, all errors in unchanged files. Existing CI treats full-project lint as report-only; changed-file lint is the strict gate. No lint configuration or workflow changes.
- `git diff --check`: passed.

## Preserved exceptions

No visible `LearnHouse` text remains under `apps/web/app`, `apps/web/components` or the UI locale bundles. `apps/web/src` does not exist.

The remaining 75 matching lines in app/components are code identifiers/imports/types (player, spinner, import dialog, email template and logo helpers), source comments, and three non-displayed Unsplash `utm_source` values. Exact audit inventory:

```text
apps/web/app/embed/[orgslug]/course/[courseuuid]/activity/[activityid]/EmbedActivityClient.tsx:124:  const showLearnHouseLogo = searchParams.get('showlearnhouselogo') !== 'false'
apps/web/app/embed/[orgslug]/course/[courseuuid]/activity/[activityid]/EmbedActivityClient.tsx:193:        {showLearnHouseLogo && <PoweredByBadge activityUrl={getActivityUrl()} />}
apps/web/app/embed/[orgslug]/course/[courseuuid]/activity/[activityid]/EmbedActivityClient.tsx:263:      {showLearnHouseLogo && ready && <PoweredByBadge activityUrl={getActivityUrl()} />}
apps/web/components/Dashboard/Onboarding/OnboardingBar.tsx:665:                                  {/* Teach the world: LearnHouse University link */}
apps/web/components/Objects/Menus/OrgMenu.tsx:173:                    <LearnHouseLogo />
apps/web/components/Objects/Menus/OrgMenu.tsx:574:const LearnHouseLogo = () => {
apps/web/components/Objects/Media/MediaViewer.tsx:15:const LearnHousePlayer = dynamic(
apps/web/components/Objects/Media/MediaViewer.tsx:16:  () => import('@components/Objects/Activities/Video/LearnHousePlayer'),
apps/web/components/Objects/Media/MediaViewer.tsx:156:        <LearnHousePlayer src={fileUrl} />
apps/web/app/auth/layout.tsx:14:    // OrgProvider; the page renders generic LearnHouse branding.
apps/web/components/Objects/Loaders/LearnHouseSpinner.tsx:3:type LearnHouseSpinnerProps = {
apps/web/components/Objects/Loaders/LearnHouseSpinner.tsx:8:function LearnHouseSpinner({ size = 44, className = '' }: LearnHouseSpinnerProps) {
apps/web/components/Objects/Loaders/LearnHouseSpinner.tsx:23:export default LearnHouseSpinner
apps/web/components/Playground/PlaygroundEditor.tsx:60:const EditorLearnHouseLogo = () => {
apps/web/components/Playground/PlaygroundEditor.tsx:288:          <EditorLearnHouseLogo />
apps/web/components/Dashboard/Pages/Users/UserAnalytics/UserDossierModal.tsx:7:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Dashboard/Pages/Users/UserAnalytics/UserDossierModal.tsx:23:          <div className="py-20 flex justify-center"><LearnHouseSpinner /></div>
apps/web/components/Objects/Editor/Editor.tsx:476:                  <EditorLearnHouseLogo />
apps/web/components/Objects/Editor/Editor.tsx:716:const EditorLearnHouseLogo = () => {
apps/web/components/Emails/LearnHouseEmail.tsx:38:export interface LearnHouseEmailProps {
apps/web/components/Emails/LearnHouseEmail.tsx:52:export function LearnHouseEmail({
apps/web/components/Emails/LearnHouseEmail.tsx:61:}: LearnHouseEmailProps) {
apps/web/components/Emails/LearnHouseEmail.tsx:146:export default LearnHouseEmail
apps/web/components/Auth/AuthBrandingPanel.tsx:32:  const UNSPLASH_UTM = '?utm_source=LearnHouse&utm_medium=referral'
apps/web/components/Auth/AuthBrandingPanel.tsx:35:  // Check if org has enterprise plan - hide LearnHouse branding for enterprise users
apps/web/components/Auth/AuthBrandingPanel.tsx:43:  // Atlas presentation is opt-in per build; other LearnHouse tenants remain unchanged.
apps/web/components/Auth/AuthBrandingPanel.tsx:146:          {/* Top bar with LearnHouse lrn.svg logo - hidden for enterprise users
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/BrandingVignettes.tsx:22: * Every vignette is a hand-drawn miniature of a real LearnHouse surface,
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/BrandingVignettes.tsx:170:  showLearnHouseMark?: boolean
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/BrandingVignettes.tsx:184:  showLearnHouseMark = true,
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/BrandingVignettes.tsx:205:          {showLearnHouseMark && (
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/BrandingVignettes.tsx:391:/** Your organization's card on the LearnHouse explore listing. */
apps/web/components/Objects/Editor/Extensions/Video/VideoBlockComponent.tsx:18:import LearnHousePlayer from '@components/Objects/Activities/Video/LearnHousePlayer'
apps/web/components/Objects/Editor/Extensions/Video/VideoBlockComponent.tsx:318:                <LearnHousePlayer {...playerProps} />
apps/web/components/Objects/Editor/Extensions/Video/VideoBlockComponent.tsx:341:              <LearnHousePlayer
apps/web/components/Objects/Editor/Extensions/Video/VideoBlockComponent.tsx:482:                  <LearnHousePlayer {...playerProps} />
apps/web/components/Objects/Editor/Extensions/Video/VideoBlockComponent.tsx:508:              <LearnHousePlayer
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/AuthBrandingTab.tsx:33:  // Enterprise orgs do not show the LearnHouse mark on the sign-in panel.
apps/web/components/Dashboard/Pages/Org/OrgEditBranding/AuthBrandingTab.tsx:215:          showLearnHouseMark={!isEnterprise}
apps/web/components/Auth/AuthMobileHeader.tsx:24:  const UNSPLASH_UTM = '?utm_source=LearnHouse&utm_medium=referral'
apps/web/components/Objects/Editor/Extensions/H5P/H5PBlockComponent.tsx:367:        else's host and carries no LearnHouse credentials of any kind.
apps/web/components/Dashboard/Pages/Users/UserAnalytics/UsersComparisonTable.tsx:10:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Dashboard/Pages/Users/UserAnalytics/UsersComparisonTable.tsx:26:    return <div className="py-16 flex justify-center"><LearnHouseSpinner /></div>
apps/web/components/Objects/Editor/Extensions/H5P/H5PBlock.ts:9: vendoring it into LearnHouse would put the whole application under the AGPL.
apps/web/components/Dashboard/Pages/Org/OrgEditAutomations/OrgEditAutomations.tsx:345:  // Zapier hero card stays hidden until the LearnHouse Zapier app is live
apps/web/components/Dashboard/Pages/Org/OrgEditAutomations/OrgEditAutomations.tsx:351:        {/* ── Zapier hero card (hidden until the LearnHouse Zapier app is live) ────────────────────── */}
apps/web/components/Dashboard/Pages/Org/OrgEditAutomations/OrgEditAutomations.tsx:1034:// Zapier-managed webhooks are read-only from LearnHouse's side; the Zap itself
apps/web/components/Objects/Modals/Course/Import/index.ts:2:export { default as LearnHouseCourseImport } from './LearnHouseCourseImport'
apps/web/components/Objects/Modals/Course/Import/ImportTypeSelector.tsx:51:        {/* LearnHouse Import Option */}
apps/web/components/Objects/Modals/Course/Import/LearnHouseCourseImport.tsx:41:interface LearnHouseCourseImportProps {
apps/web/components/Objects/Modals/Course/Import/LearnHouseCourseImport.tsx:47:function LearnHouseCourseImport({
apps/web/components/Objects/Modals/Course/Import/LearnHouseCourseImport.tsx:51:}: LearnHouseCourseImportProps) {
apps/web/components/Objects/Modals/Course/Import/LearnHouseCourseImport.tsx:652:export default LearnHouseCourseImport
apps/web/components/Dashboard/Pages/Users/OrgUsers/OrgUsers.tsx:5:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Dashboard/Pages/Users/OrgUsers/OrgUsers.tsx:507:                    <LearnHouseSpinner size={28} />
apps/web/components/Objects/Editor/Extensions/Image/ImageBlockComponent.tsx:18:const UNSPLASH_UTM = '?utm_source=LearnHouse&utm_medium=referral'
apps/web/components/Objects/Modals/Dash/OrgUserGroups/ManageUsers.tsx:6:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Objects/Modals/Dash/OrgUserGroups/ManageUsers.tsx:326:              <LearnHouseSpinner size={24} />
apps/web/components/Objects/Activities/Video/LearnHousePlayer.tsx:47:interface LearnHousePlayerProps {
apps/web/components/Objects/Activities/Video/LearnHousePlayer.tsx:205:/** Icon-only LearnHouse mark, top-right; fades in and out with the controls. */
apps/web/components/Objects/Activities/Video/LearnHousePlayer.tsx:227:const LearnHousePlayer: React.FC<LearnHousePlayerProps> = ({
apps/web/components/Objects/Activities/Video/LearnHousePlayer.tsx:506:export default LearnHousePlayer
apps/web/components/Objects/Activities/Video/Video.tsx:8:import LearnHousePlayer, { type PlayerNavItem } from './LearnHousePlayer'
apps/web/components/Objects/Activities/Video/Video.tsx:184:                    <LearnHousePlayer
apps/web/components/Objects/Activities/Video/player.css:1:/* LearnHouse tweaks on the packaged skin. Its own rules use :where(), so a
apps/web/app/orgs/[orgslug]/dash/users/analytics/[userId]/page.tsx:9:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/app/orgs/[orgslug]/dash/users/analytics/[userId]/page.tsx:65:        {isLoading && <div className="py-24 flex justify-center"><LearnHouseSpinner /></div>}
apps/web/components/Objects/Modals/Activities/Edit/EditDocumentActivityModal.tsx:3:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Objects/Modals/Activities/Edit/EditDocumentActivityModal.tsx:105:            <LearnHouseSpinner size={18} className="[&>div]:border-t-white" />
apps/web/components/Objects/Modals/Activities/Edit/EditScormActivityModal.tsx:4:import LearnHouseSpinner from '@components/Objects/Loaders/LearnHouseSpinner'
apps/web/components/Objects/Modals/Activities/Edit/EditScormActivityModal.tsx:99:            <LearnHouseSpinner size={18} className="[&>div]:border-t-white" />
apps/web/app/orgs/[orgslug]/dash/courses/client.tsx:8:import { ImportTypeSelector, LearnHouseCourseImport } from '@components/Objects/Modals/Course/Import'
apps/web/app/orgs/[orgslug]/dash/courses/client.tsx:273:          <LearnHouseCourseImport
apps/web/components/Dashboard/Menus/DashMobileMenu.tsx:96:          {/* LearnHouse logo, links to home */}
apps/web/app/orgs/[orgslug]/dash/assignments/[assignmentuuid]/_components/Modals/GenerateTasksAIModal.tsx:29:// LearnHouse design language (neutral palette, nice-shadow, rounded-lg,
```

The remaining `github.com` matches are two Markdown URL input examples, a URL conversion comment, and the unrelated `emgithub.com` embed guide. No repository/attribution links remain in app/components.

Existing technical email addresses/domains, environment keys, API keys, translation keys, function names, assets and license files are preserved. Security sanitizer defaults outside email are preserved; email call sites provide Atlas-specific fallbacks. No changes to main, PR #14, workflows, Dockerfiles, permissions or RBAC.
