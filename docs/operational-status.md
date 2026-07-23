# SCB Website Operational Status

## Purpose

This is the lightweight running file for ongoing work after the Astro site was deployed and the CMS was confirmed running.

Use it for normal maintenance, content/CMS support, QA fixes, and small follow-up work.

The older phase docs under `docs/plans/` are historical implementation records and reference specs. Do not read them at session start unless the task actually touches migration evidence, source parity, public-data confirmation, calendar semantics, CMS schema, redirects, or a larger architectural change.

## Current Baseline

- Site state: deployed
- CMS state: running
- Date recorded: `2026-07-23`
- Implementation phase state: historical Phases 1 to 7 are complete; no active implementation phase remains open
- Default work mode: operational maintenance from the deployed baseline

## Normal Start For Future Sessions

For most operational tasks, read only:

1. `README.md`
2. this file
3. the directly relevant source files

Only open phase/history docs when the task needs them:

- `docs/plans/public-data-register.md` for risky public facts such as donation/bank details or canonical social links
- `docs/plans/migration.md` and `migration/manifest.json` for late migration recovery or source-parity questions
- `docs/plans/wix-reference/README.md` and `docs/plans/wix-reference/manifest.json` when local Wix evidence is actually needed
- `docs/plans/content-cms.md` for CMS ownership/model changes
- `docs/plans/calendar.md` for event recurrence or calendar behavior changes
- `docs/plans/implementation.md` for architecture, hosting, build, or deployment behavior changes
- `docs/plans/execution-plan.md` and `docs/plans/status-checklist.md` only if someone intentionally reopens or audits historical phase state

## Open Operational Items

- The repository-side CMS authentication has been switched on branch `feature/news-editorial-refactor` from direct GitHub OAuth to individual Netlify Identity accounts through Git Gateway. Production activation is still blocked on authenticated Netlify dashboard work: enable Identity, select invite-only registration, enable Git Gateway, deploy this branch, invite a test editor, and verify invitation acceptance, login, a draft post with an image, publication, and deployment. Until those steps are complete, the deployed CMS remains on its previously deployed authentication code.
- The Stage 5 technical news/CMS QA checkpoint is complete on branch `feature/news-editorial-refactor`, and the user accepted the first focused index/detail visual-polish pass as sufficient for now. The post gallery now has a technically verified PhotoSwipe lightbox with responsive Astro thumbnails, bounded large-view WebP assets, German controls, captions, keyboard navigation, focus restoration, touch/zoom support, and direct-image fallback. User visual acceptance of the gallery remains open. The user-owned Astro dev server predates the newly installed dependency and must be restarted normally before localhost gallery review; it was not restarted or replaced by the agent.
- Public-data review remains open in `docs/plans/public-data-register.md`, especially canonical YouTube and donation/bank details. The refactor retained fundraising and bank claims only as source-parity article content; it did not confirm them as canonical facts.
- `parkausbesserungen` is fully restored from the complete live Wix body and its obsolete migration blocker is cleared in `migration/manifest.json`.
- `bun run check` still reports only non-blocking Zod deprecation hints from `src/content/config.ts`.
- The German-copy cleanup should be reviewed after deployment to catch any remaining user-facing ASCII transliterations.

## Recent Operational Work

- `2026-07-23`: Repository-side Decap authentication was changed from the GitHub backend to `git-gateway` for individual, invite-only Netlify Identity accounts. `@netlify/identity` `1.2.0` now processes invitation and password-recovery callbacks with German password forms before loading the pinned Decap `3.11.0` client; public routes forward Identity token hashes to `/admin/`. The localhost `local_backend` remains login-free and still requires the proxy on port 8081. The content model, blog entries, preview, media paths, and developer Git workflow were not changed. Verification passed with 23 tests, `bun run check` with only the six known Zod hints, a clean 89-page build, generated-output inspection, and local-proxy browser verification. Production setup and a real invited-editor publication test remain open; that is the exact next continuation point.
- `2026-07-23`: The bare new-tab post gallery was replaced with a progressive-enhancement PhotoSwipe 5 viewer in `src/components/PostGallery.astro`. Decap's existing image/alt/caption/order contract remains unchanged. Astro now generates responsive grid thumbnails and a bounded, quality-controlled WebP source up to 2000px for each lightbox slide; the original CMS upload is no longer the default large-view target. The gallery uses an adaptive editorial grid, explicit German labels, image counts, captions, keyboard navigation, zoom/touch controls, and focus restoration for keyboard activation, while optimized image links remain available without JavaScript. PhotoSwipe `5.4.4` was added as a project-local MIT dependency with no install lifecycle hooks or runtime dependencies. Verification passed with 23 tests, `bun run check` with only six known Zod hints, a clean 89-page production build, and production-bundle browser interaction at 1440px and the available narrow 500px Steel viewport with no horizontal overflow. A temporary static server on port 4174 was used because the user-owned dev server had stale Vite dependency cache after installation; the temporary server was stopped in the same turn. The exact next continuation point is user review after normally restarting the existing localhost dev server, followed by any requested gallery visual adjustment. Upload normalization remains a separate future task.
- `2026-07-23`: The first post-QA news visual-polish pass refined `src/pages/neuigkeiten/index.astro`, `src/pages/neuigkeiten/[slug].astro`, and `src/components/PostCover.astro`. The index lead now uses a bounded responsive media crop and a smaller headline, reducing its measured 1440px height from about 978px before the pass to 524px. Article details now use a narrower reading composition, a 72px desktop headline ceiling instead of 92px, and light padded portrait/contained cover presentation instead of a full-width charcoal stage. Browser inspection found no horizontal overflow at the available 1440px and narrow 500px Steel viewports. Verification passed with 23 tests, `bun run check` with only six known Zod hints, and a clean 89-page build. Final visual acceptance remains open; the exact next continuation point is user review of the refreshed news index and `parkausbesserungen` detail page, followed by any specific composition tweaks requested.
- `2026-07-23`: News editorial/CMS refactor Stage 5 completed on branch `feature/news-editorial-refactor`. Existing and new-post Decap editing surfaces were exercised, and the maintained preview was checked against public behavior. QA found that imported staging images were not manageable by Decap and that omitted legacy draft values appeared as drafts in preview. The 36 curated news images now have optimized CMS-owned copies under `src/assets/images/uploads`, news entries reference those copies, retained Wix-staging originals remain intact, and the preview fallback now treats omitted draft values as published. Post-fix CMS inspection confirmed the 2026 cover and five gallery images load as styled blob assets with alt text and no alerts. Generated-output, heading, link, keyboard-focus, alt, file-existence, and true 390px overflow checks passed; four final ignored screenshots were recorded. Verification passed with 23 tests, `bun run check` with only six known Zod hints, and a clean 89-page build after stale Astro caches were cleared. The technical Stage 5 checkpoint is ready to commit, but final visual acceptance remains open per the user's assessment that the current layout still needs further tweaking.
- `2026-07-23`: News editorial/CMS refactor Stage 4 completed on branch `feature/news-editorial-refactor`. All eight migrated posts now use reviewed public copy without internal migration/QA narration, each cover has explicit alt text and an intentional presentation mode, and suitable posts have curated caption-capable galleries instead of indiscriminate asset dumps. The complete `parkausbesserungen` body was restored and its manifest blocker cleared. The explicitly approved `Goodies4Tricks 2026` article was imported from the live Wix source with ten recovered photos and a curated six-image presentation. Source-parity financial claims remain pending in the public-data register rather than being silently confirmed. Verification passed with 23 tests, `bun run check` with only six known Zod hints, a clean build of all nine post routes, generated alt-text inspection, and no internal migration/QA vocabulary in generated news HTML. Stage 5 QA is next.
- `2026-04-13`: News editorial/CMS refactor Stages 1–3 completed on branch `feature/news-editorial-refactor`. The ledger records source comparisons, the approved 2026 import, and the settled editorial contract. The implementation now has backward-compatible post media metadata, draft/future filtering, duplicate-slug validation, German CMS guidance, a registered styled Decap preview, an automatic lead-story/archive index, dedicated article reading layout, responsive cover/gallery components, and contextual image loading. Verification passed with 23 tests, `bun run check` with only six known Zod hints, clean builds, browser preview-registration confirmation, temporary CMS/gallery fixtures, and corrected CDP-emulated 390px screenshots with no local horizontal overflow. One earlier read-only reviewer confirmed the principal groundwork risks but failed at the harness acceptance layer after returning its complete report. Stage 4 content restoration is next.
- `2026-04-13`: Agent workflow guardrail added to `AGENTS.md`: the user owns the local dev/CMS server by default. Agents may run bounded `bun` checks and targeted inspections, but must not leave long-running dev servers active unless explicitly asked. Temporary servers must be inspected, isolated to a stated port, and stopped in the same turn.
- `2026-04-13`: Veranstaltungen CMS/page disclaimer handling was untangled. The overview page now has a CMS-owned `Zusatzinfos` object with an on/off toggle, and each individual event has its own `Zusatzinfos` object with an on/off toggle. The old weather-specific `weatherNote`/`Wetterhinweis` path was removed from source and CMS config, the Sunday Funday note was migrated into `additionalInfo`, and the duplicated month overview/calendar section was removed from `/veranstaltungen/`. Verification passed with `bun test`, `bun run check`, `bun run build`, and generated HTML inspection confirming `Zusatzinfos` renders on both `/veranstaltungen/` and a Sunday Funday detail page while the old weather/month-overview labels are absent.
- `2026-04-13`: Calendar/CMS recurrence handling was fixed after a CMS-saved weekly `Sunday Funday` update did not appear publicly. Root cause: Decap wrote `recurrence.interval` as an empty string and left `daysOfWeek` empty, which made content sync fail before rendering. The event now has an explicit weekly Sunday rule, blank optional CMS values are normalized where relevant, weekly recurrence can derive its weekday from `startDate` when omitted, and CMS recurrence hints explain the fallback. Verification passed with `bun run check`, `bun run build`, `bun test`, and generated HTML inspection confirming `Sunday Funday!` appears on `/` and `/veranstaltungen/` with recurring occurrence pages generated.
- `2026-04-13`: CMS Startseite featured announcement now has an editor-facing on/off toggle (`featuredAnnouncement.enabled`) so the block can be hidden without clearing its content fields. Existing populated announcement content defaults to enabled. Homepage rendering now hides the block when the toggle is off, and content validation accepts empty optional CMS strings for the featured link fields plus shared phone/WhatsApp fields. Verification passed with `bun test`, `bun run check`, and `bun run build`; `bun run check` still showed only the known Zod deprecation hints.
- `2026-04-13`: German-copy cleanup replaced public-facing ASCII transliterations such as `fuer`, `ueber`, `oeffentlich`, and `Weissenburg` with proper German characters across content, route/component copy, and Decap editor labels. Machine-facing route paths, slugs, source URLs, file paths, and external query URLs were intentionally kept ASCII-safe. Verification passed with `bun test`, `bun run check`, and `bun run build`; `bun run check` still showed only the known Zod deprecation hints.
- `2026-04-13`: Startup documentation was reset for post-launch operations. `README.md` and `AGENTS.md` now make `docs/operational-status.md` the normal running file and keep the old phase stack as historical/reference material unless a task explicitly needs migration, evidence, public-data, schema, event, redirect, deployment, or phase-history context. `docs/plans/status-checklist.md` was updated to stop presenting its phase start rule as the default operational start path.

## Handoff Rule

At the end of substantial operational work, update this file with:

- what changed
- what was verified
- any new blocker or review item
- the next concrete continuation point

Update the older phase ledgers only when a task actually changes historical phase state or reopens an implementation/migration gate.
