# SCB Website Status Checklist

## Purpose

This file is the audited state ledger for the website rebuild.

Use it together with [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md):

- `execution-plan.md` is the normative phase controller
- this file records what was actually checked, what is still open, and what must block the next phase

No phase may be treated as complete unless:

- the relevant checklist items in [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) are updated
- this file records the audit result and any remaining exceptions

If a later phase has work in the repo while an earlier phase is still unchecked here, stop and flag it instead of silently proceeding.

---

## Audit Snapshot

Last audit date:

- `2026-04-10`

Audited scope:

- bootstrap state
- Phase 1 source freeze and capture integrity
- Phase 2 content model and CMS spine integrity
- Phase 3 event engine integrity
- Phase 4 shared UI foundation completion
- the initial Phase 5 homepage-and-events route slice

---

## Bootstrap

- [x] `bun.lock` exists
- [x] `bun run check` passed during this audit
- [x] `bun run build` passed during this audit
- [x] Playwright CLI is available
- [x] `/admin/` shell is present in the repo
- [x] `public/admin/config.yml` targets `master`

---

## Phase 1 Audit

Overall status:

- [x] Phase 1 is cleared as complete in this audit

Checklist status:

- [x] `docs/plans/wix-reference/manifest.json` exists
- [x] a local Wix reference workspace exists under `docs/plans/wix-reference/`
- [x] screenshots exist for `/`
- [x] screenshots exist for `/ueber-uns/`
- [x] screenshots exist for `/pics-n-vids/`
- [x] screenshots exist for `/veranstaltungen/`
- [x] a screenshot exists for one representative event detail page
- [x] screenshots exist for `/copy-of-veranstaltungen`
- [x] screenshots exist for `/kontakt/`
- [x] screenshots exist for `/impressum/`
- [x] retained local evidence exists for `/datenschutz/` via HTML/PDF fallback
- [x] screenshots exist for the news index and at least two representative news posts
- [x] PDFs exist for long-form or legal pages where useful
- [x] unusable screenshot exceptions can be covered by recorded alternate local evidence
- [x] `blog-feed.xml` is captured locally
- [x] Wix-linked PDFs are inventoried locally
- [x] staged local image assets exist under `src/assets/images/wix-staging/`
- [x] route targets are recorded in the manifest
- [x] manifest-level risk/contradiction tracking is fully aligned with the execution-plan checklist
- [x] risky public facts are tracked in [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)

Audit notes:

- The `datenschutz` screenshot remains intentionally absent from the retained pack, but the HTML/PDF fallback is recorded in the local manifest and now counts as the route evidence for that page.
- The local reference manifest now records the `Sunday Funday` Wix slug/date mismatch directly at the evidence layer, so the contradiction is preserved where later migration and redirect work will look for it.
- The earlier Phase 1 sequencing drift has been normalized in the tracked execution docs during this audit.

---

## Phase 2 Audit

Overall status:

- [x] Phase 2 implementation exists in the repo
- [x] Phase 2 is signoff-clean in this audit

Checklist status:

- [x] Astro collections exist for `homepage`, `pages`, `posts`, `events`, `media`, and `settings`
- [x] field validation is encoded in `src/content/config.ts`
- [x] shared repeated facts are sourced from `settings`
- [x] required singleton entries exist for homepage and launch static pages
- [x] minimal seed entries exist for posts, events, and media
- [x] the bootstrap-only Decap collection was replaced
- [x] editor-facing labels are understandable for non-technical admins
- [x] build failure on missing required singleton content was previously probed
- [x] the local `/admin/` config exposes launch-critical content types

Audit notes:

- The implementation is buildable and the content/CMS spine is real.
- The earlier `pages/about.statutesPdf` doc/runtime mismatch was reconciled in this audit by aligning the content spec with the implemented validation and route requirements.
- The earlier Phase 2 sequencing drift is now recorded in the control docs instead of being left implicit.

---

## Phase 3 Audit

Overall status:

- [x] Phase 3 implementation exists in the repo
- [x] Phase 3 is signoff-clean in this audit

Checklist status:

- [x] the event schema supports one-off, weekly recurring, and same-date monthly recurring launch behavior
- [x] occurrence URLs are generated at `/veranstaltungen/[slug]/[yyyy-mm-dd]/`
- [x] upcoming occurrences are derived at build time
- [x] grouped month helpers exist without runtime dependency
- [x] recurrence edge cases are covered by focused tests
- [x] Berlin timezone and German date-format assumptions are verified by tests
- [x] Wix slug/date mismatches now surface as explicit migration QA findings instead of canonical data

Audit notes:

- The event engine now exposes occurrence route-param generation and direct occurrence lookup helpers for the upcoming route layer.
- The Wix `Sunday Funday` source mismatch is now covered both in the local evidence manifest and in event-engine tests, so later migration work does not need to rediscover the rule.
- The homepage event preview was extracted into reusable `UpcomingEventsList` and `UpcomingEventCard` components before the broader shared UI pass, and those event primitives now feed both the events index and the occurrence detail route.
- Verification passed with `bun test`, `bun run check`, and `bun run build`.

---

## Phase 4 Audit

Overall status:

- [x] Phase 4 implementation exists in the repo
- [x] Phase 4 is cleared as complete in this audit

Checklist status:

- [x] global tokens and layout rhythm were finalized in the shared stylesheet
- [x] shared header, footer, navigation, and container patterns exist and are in active use
- [x] reusable page-intro, rich-text, CTA, card, and image patterns exist and are in active use
- [x] client-side JavaScript remained limited to clearly useful interaction
- [x] mobile-first layouts were confirmed before desktop refinement
- [x] the visual direction is intentionally cleaner than the Wix source without copying Wix chrome

Audit notes:

- The shared layer now includes `PageIntro`, `RichText`, `LinkButton`, `SurfaceCard`, and `EditorialImage`, plus reusable event status/meta/location/CTA blocks.
- The shared header now uses a mobile-first collapsed navigation pattern without adding client-side runtime code.
- Mobile-width verification was run locally via `bun run preview -- --host 127.0.0.1 --port 4322` and Playwright screenshots at `375x812` for `/`, `/veranstaltungen/`, and `/veranstaltungen/sunday-funday/2026-04-12/`.

---

## Phase 5 Audit

Overall status:

- [x] Phase 5 implementation has started in the repo
- [ ] Phase 5 is not complete in this audit

Checklist status:

- [x] `/`
- [ ] `/neuigkeiten/`
- [ ] `/neuigkeiten/[slug]/`
- [ ] `/ueber-uns/`
- [ ] `/pics-n-vids/`
- [x] `/veranstaltungen/`
- [x] `/veranstaltungen/[slug]/[date]/`
- [ ] `/mitgliedschaft/`
- [ ] `/kontakt/`
- [ ] `/kontakt/danke/`
- [ ] `/impressum/`
- [ ] `/datenschutz/`
- [x] latest-news and upcoming-events previews are wired from canonical collections, not duplicate CMS entries
- [ ] shared contact and social data usage is not fully audited across the remaining route set yet
- [ ] legal and membership downloads still need their owning routes before this item can clear

Audit notes:

- `/veranstaltungen/` now renders from the build-time event engine with a bounded upcoming horizon and a static month overview, instead of leaving the event cards pointed at dead URLs.
- `/veranstaltungen/[slug]/[date]/` now builds real occurrence pages with status, summary, location, optional body content, and related upcoming occurrences from the same recurring series.
- The homepage was refactored onto the new shared primitives during this audit so Phase 4 is not represented only by unused abstractions.

---

## Findings To Carry Forward

1. The control-state drift across Phases 1 to 4 has now been normalized in the committed tracking docs. Future work must continue from the updated progress snapshot with Phase 5 active, instead of re-inferring phase status from repo artifacts.
2. Wix event slug dates remain source evidence only. They are not route truth, redirect truth, or migration truth without visible-content verification.
3. `src/assets/images/wix-staging/` is a large tracked staging workspace at about `43M`, but current code references are not a valid basis for pruning it yet. Many staged assets may still be needed for later route build-out and migration work. Any cleanup there must wait for explicit asset curation after the relevant implementation phases are complete.
4. Stable resume rules are now explicitly owned by `AGENTS.md`, `README.md`, and the execution-plan handoff section. Future continuation prompts should be short and task-specific unless they intentionally override the repo-owned workflow.

---

## Continuation Status

- continuation is allowed
- active phase for the next resume should be Phase 5 route implementation
- exact next continuation point: use the new shared page primitives to implement the remaining singleton-backed routes first, starting with `/ueber-uns/`, `/mitgliedschaft/`, and `/kontakt/`, before moving on to the news/media/legal route set
- open exceptions: Phase 5 to Phase 7 remain incomplete, and Astro check still reports only non-blocking Zod deprecation hints from `src/content/config.ts`
- prompt rule for the next resume: a short prompt should be sufficient because the stable startup and handoff rules now live in committed docs

---

## Next Conversation Start Rule

Start with:

1. [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) `Progress Snapshot`, active-phase checklist, and `Conversation Handoff Checklist`
2. this file
3. the relevant phase specs

Before implementing anything new:

- restate whether the earlier phases are actually cleared
- list any open checklist exceptions
- use the `Continuation Status` section above as the default resume point unless a newer audit replaces it
