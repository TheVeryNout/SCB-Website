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

- `2026-04-13`

Audited scope:

- bootstrap state
- Phase 1 source freeze and capture integrity
- Phase 2 content model and CMS spine integrity
- Phase 3 event engine integrity
- Phase 4 shared UI foundation completion
- the initial Phase 5 homepage-and-events route slice
- the second Phase 5 singleton-route slice for `/ueber-uns/`, `/mitgliedschaft/`, `/kontakt/`, and `/kontakt/danke/`
- the legal-route follow-up for `/impressum/` and `/datenschutz/` from the retained local HTML/PDF evidence pack
- the final Phase 5 collection-route slice for `/neuigkeiten/`, `/neuigkeiten/[slug]/`, and `/pics-n-vids/`
- the first substantive Phase 6 migration batch for retained-news backfill, local media galleries, the canonical migration manifest, and avoidable Wix dependency cleanup
- the Phase 6 closeout audit for homepage/static-page source parity, manifest status normalization, and event-evidence reconciliation
- the Phase 7 release-candidate pass for build/check/test, phone-width QA, baseline accessibility, forms/downloads/external links, event route behavior, Netlify config, high-confidence redirects, `/admin/`, and public-data signoff blockers
- the post-release-candidate design correction pass that replaced the generic rounded/pill prototype language with a Wix-reference-aligned visual system using the retained local screenshots and staged Wix assets
- the first live-deploy CMS Identity handoff issue where Netlify invite/reset links landed on public routes instead of completing the `/admin/` password flow

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
- [x] Phase 5 is cleared as complete in this audit

Checklist status:

- [x] `/`
- [x] `/neuigkeiten/`
- [x] `/neuigkeiten/[slug]/`
- [x] `/ueber-uns/`
- [x] `/pics-n-vids/`
- [x] `/veranstaltungen/`
- [x] `/veranstaltungen/[slug]/[date]/`
- [x] `/mitgliedschaft/`
- [x] `/kontakt/`
- [x] `/kontakt/danke/`
- [x] `/impressum/`
- [x] `/datenschutz/`
- [x] latest-news and upcoming-events previews are wired from canonical collections, not duplicate CMS entries
- [x] shared contact and social data usage is now wired from `settings` across the implemented route set where those repeated facts appear
- [x] legal and membership downloads now live on their owning pages instead of a separate top-level IA

Audit notes:

- `/veranstaltungen/` now renders from the build-time event engine with a bounded upcoming horizon and a static month overview, instead of leaving the event cards pointed at dead URLs.
- `/veranstaltungen/[slug]/[date]/` now builds real occurrence pages with status, summary, location, optional body content, and related upcoming occurrences from the same recurring series.
- The homepage was refactored onto the new shared primitives during this audit so Phase 4 is not represented only by unused abstractions.
- `/ueber-uns/` now renders from `pages/about` with the shared hero/page-intro shell, a goals block, a structured board list, and the statutes PDF on its owning page.
- `/mitgliedschaft/` now renders from `pages/membership` with benefits, application instructions, notes, and the official membership-form PDF on the canonical route.
- `/kontakt/` now uses a plain Netlify Forms HTML form with honeypot and thank-you redirect, while sourcing repeated email/phone/WhatsApp/social facts from `settings` and location-specific content from `pages/contact`.
- `/kontakt/danke/` now exists as the static post-submit utility page required by the launch contact flow.
- Mobile-width verification was run locally via `bun run preview -- --host 127.0.0.1 --port 4322` and Playwright Chromium screenshots at `390x844` for `/ueber-uns/`, `/mitgliedschaft/`, and `/kontakt/`.
- Verification passed with `bun test`, `bun run check`, and `bun run build`.
- `/impressum/` now renders from `pages/impressum` on the shared legal-page shell instead of leaving the route absent while the content already existed in the collection.
- `/datenschutz/` now renders from `pages/datenschutz`, and the previous placeholder body was replaced with the retained local Wix HTML content rather than reopening the live source.
- The legal text migration used the existing `docs/plans/wix-reference/html/*.html` and `pdf/*.pdf` evidence already recorded in the manifest, which keeps this step inside the local-evidence boundary.
- Mobile-width verification was also run for `/impressum/` and `/datenschutz/` via `bun run preview`; Astro bound to `127.0.0.1:4323` because `4322` was already occupied, and Playwright Chromium screenshots were captured at `390x844`.
- `/neuigkeiten/` now renders the posts collection as a simple reverse-chronological index with cover images, dates, excerpts, and links into the canonical post routes instead of leaving the homepage news teaser disconnected from a real archive.
- `/neuigkeiten/[slug]/` now renders individual post bodies from Astro content entries with cover imagery and related-post links, which completes the launch news/blog route layer without adding search or taxonomy overhead.
- `/pics-n-vids/` now renders the media collection as lightweight linked media cards, preserving visible video destinations without introducing a heavyweight embed/gallery system.
- The homepage latest-news cards now link directly to `/neuigkeiten/[slug]/`, so the Phase 5 route layer is connected end-to-end instead of only existing as standalone pages.
- Mobile-width verification was also run for `/neuigkeiten/`, `/neuigkeiten/spendenaufruf-der-scb-baut-ne-halle/`, and `/pics-n-vids/` via `bun run preview`; Astro again bound to `127.0.0.1:4323`, and Playwright Chromium screenshots were captured at `390x844`.
- Verification passed again with `bun test`, `bun run check`, and `bun run build` after the final route slice.

---

## Phase 6 Audit

Overall status:

- [x] Phase 6 implementation has started in the repo
- [x] Phase 6 is signoff-clean in this audit

Checklist status:

- [x] homepage copy and featured sections are fully migrated
- [x] static-page content is fully migrated
- [x] news posts and dates are migrated from retained local evidence
- [x] event entries are fully migrated and reconciled against retained evidence
- [x] media references and curated thumbnails are migrated from retained local evidence
- [x] localized PDFs are present and tracked through the migration manifest
- [x] local images worth preserving are in active use through migrated posts and media entries
- [x] avoidable Wix-hosted production dependencies touched in this batch were removed
- [x] `migration/manifest.json` exists and records touched migration items
- [x] unresolved contradictions are recorded instead of guessed

Audit notes:

- `migration/manifest.json` now exists as the canonical Phase 6 tracker and records retained-evidence routes, posts, event/media items, localized PDFs, and open QA notes.
- The posts collection now covers the full retained `blog-feed.xml` inventory: the six missing entries were migrated with preserved publication dates, local cover images, and source URLs from the retained evidence pack.
- The retained post slug/title mismatch for `spende-von-der-volksbank-franken-sued` is now explicit in the manifest. Per user instruction, the Astro slug preserves the source URL naming while the visible title follows the retained post content.
- `parkausbesserungen` was migrated conservatively from the retained feed sentence only. The manifest now marks that record `blocked` because the retained evidence after the first complete sentence is truncated and was not guessed.
- `/pics-n-vids/` now separates external video links from local photo-gallery entries, and two curated gallery entries were added from retained local post evidence plus staged local images.
- The migrated `impressum` content no longer points users back to the Wix `/kontakt` route; it now references the local `/kontakt/` route instead of keeping that avoidable production dependency.
- Verification passed with `bun run check`, `bun run build`, and Playwright Chromium phone-width screenshots at `390x844` for `/`, `/neuigkeiten/`, `/neuigkeiten/graffiti-workshop-ein-voller-erfolg/`, and `/pics-n-vids/` served from `bun run preview -- --host 127.0.0.1 --port 4322`.
- The homepage hero, featured announcement, and teaser copy were reconciled against the retained home HTML instead of staying as implementation-summary text.
- `/ueber-uns/` and `/mitgliedschaft/` now use body and supporting copy that are materially closer to the retained Wix wording instead of earlier summary paraphrases.
- The retained contact page exposes very little copy beyond the form and approach headings, so the Astro contact page now remains a conservative local restatement anchored by the retained location/form evidence rather than invented marketing copy.
- The retained `/veranstaltungen/` index shows `Keine Veranstaltungen` across the captured April 2026 month view, so `Sunday Funday` was reconciled to the single retained detail occurrence on `2025-11-30` instead of being treated as an evidence-backed weekly recurring series.
- The hidden seed-only event placeholder was removed from the public content collection so the Phase 6 event set reflects real migrated evidence rather than a migration-era scaffold.
- The occurrence route keeps a 12-month past horizon for static path generation, so the single verified `Sunday Funday` detail page still builds at `/veranstaltungen/sunday-funday/2025-11-30/` even though the current events index remains empty.
- Manifest records were normalized from the prior blanket `qa-pending` state to concrete `migrated` or `blocked` statuses, which satisfies the Phase 6 tracking gate without pretending Phase 7 QA is already complete.

---

## Phase 7 Audit

Overall status:

- [x] Phase 7 implementation exists in the repo
- [x] Phase 7 is complete as a technical release-candidate pass
- [ ] final launch signoff is not complete until the unresolved public-data conflicts are reviewed by the user

Checklist status:

- [x] `bun test` passed
- [x] `bun run check` passed with only the already-known Zod deprecation hints in `src/content/config.ts`
- [x] `bun run build` passed and generated 20 static pages
- [x] phone-width Chromium screenshots were captured at `390x844` for `/`, `/veranstaltungen/`, `/veranstaltungen/sunday-funday/2025-11-30/`, `/kontakt/`, and `/admin/`
- [x] baseline accessibility was checked for one `h1` per public static page, image `alt` attributes, contact-form labels, and a global `:focus-visible` outline
- [x] contact form static shape was verified with `data-netlify`, `netlify-honeypot`, hidden `form-name`, required fields, and `/kontakt/danke/` action
- [x] internal launch routes, `/admin/`, and localized PDFs returned HTTP 200 from local preview
- [x] external Instagram, YouTube, and Google Maps links returned HTTP 200 during the local link check
- [x] event index and the verified `Sunday Funday` occurrence route were checked after the Phase 6 event reconciliation
- [x] `netlify.toml` now defines the Bun build, `dist` publish directory, baseline headers, canonical-domain redirects, and retained-evidence legacy redirects
- [x] no blind event-detail wildcard redirect was added
- [x] `/admin/` is present and `public/admin/config.yml` still uses Netlify Identity/Git Gateway through `backend.name: git-gateway` on `master`, with local proxy config limited to localhost
- [x] risky public facts were cross-checked against `public-data-register.md`

Audit notes:

- The only event-detail redirect added is from `/events/sunday-funday-2025-04-06-13-00` to `/veranstaltungen/sunday-funday/2025-11-30/`, because the retained local evidence verifies the visible `2025-11-30` occurrence date and explicitly warns not to trust the Wix slug date.
- Legacy redirects were added for the retained membership source route and each known retained Wix `/post/...` URL; no broad post or event catch-all redirect was added.
- `netlify.toml` also canonicalizes `http://skateclubbiriciana.de/*`, `http://www.skateclubbiriciana.de/*`, and `https://www.skateclubbiriciana.de/*` to `https://skateclubbiriciana.de/:splat`.
- The public-data register still marks the canonical YouTube destination as a conflict and donation/bank details as pending. These are launch-signoff blockers if the site is published as final public truth, but they no longer block the technical deploy configuration.
- `parkausbesserungen` remains blocked only for fuller content recovery; the current route builds and the truncated-evidence limitation is recorded in the migration manifest.
- During first Netlify setup, Identity invite/reset links were observed landing on public routes or `/admin/` without completing the CMS password flow. The public layout now loads the official Netlify Identity widget globally so invite/reset/confirmation tokens can be processed on the route where Netlify sends them, then redirects to `/admin/` after successful login. `/admin/` still pauses Decap loading when an Identity token is present so the Netlify Identity widget can complete the invite/reset flow first, and it lets the widget's own token router select the invite/recovery screen instead of forcing the generic login modal.
- The content schema now tolerates YAML-parsed Date objects for date/date-time fields and normalizes them back to strings. This protects CMS-saved unquoted ISO dates from breaking Astro content validation.
- Verification for the Identity token and date-schema hardening passed with `bun test`, `bun run check`, and `bun run build`; `bun run check` still reports only the known Zod deprecation hints.

---

## Findings To Carry Forward

0. The previous Phase 4 visual-direction note was too generous. The technical release candidate was buildable, but its cream-gradient, pill-navigation, and generic rounded-card design did not respect the retained Wix reference. A post-RC design correction pass replaced the global visual system with the source-observed charcoal/asphalt texture, muted yellow panels, squared navigation/buttons, SCB crest, and the retained Wix homepage hero asset.
   Verification for this correction passed with `bun run check`, `bun run build`, `bun test`, and Playwright Chromium screenshots for `/` at desktop and phone widths plus `/ueber-uns/` and `/kontakt/` at desktop width.
1. The control-state drift across Phases 1 to 4 has now been normalized in the committed tracking docs. Future work must continue from the updated progress snapshot with Phase 7 technically complete, instead of re-inferring phase status from repo artifacts.
2. Wix event slug dates remain source evidence only. They are not route truth, redirect truth, or migration truth without visible-content verification.
3. `src/assets/images/wix-staging/` is a large tracked staging workspace at about `43M`, but current code references are not a valid basis for pruning it yet. Many staged assets may still be needed for later route build-out and migration work. Any cleanup there must wait for explicit asset curation after the relevant implementation phases are complete.
4. Stable resume rules are now explicitly owned by `AGENTS.md`, `README.md`, and the execution-plan handoff section. Future continuation prompts should be short and task-specific unless they intentionally override the repo-owned workflow.
5. Playwright mobile presets currently default to WebKit, but the local verification environment only has Chromium installed. For phone-width QA in this repo state, use Playwright with explicit Chromium viewport sizing unless WebKit is intentionally installed again.
6. The `datenschutz` content no longer needs to be treated as a missing-route blocker. The retained local HTML/PDF evidence was sufficient to populate the canonical page entry without reopening Wix.
7. Phase 5 no longer has a route backlog. Future work should not reopen route implementation unless migration evidence or QA reveals a concrete bug.
8. The retained events index does not justify treating `Sunday Funday` as an open-ended recurring series. Until better local evidence exists, the canonical event content should stay anchored to the single verified `2025-11-30` occurrence.
9. `migration/manifest.json` is now the canonical Phase 6 migration tracker. Future migration or late content recovery work should update it directly instead of leaving route/content state only in `status-checklist.md`.
10. The retained `spende-von-der-volksbank-franken-sued` evidence contains a real source contradiction between visible title/body text and source URL slug. That mismatch is preserved intentionally and should not be normalized away in later cleanup.
11. `/pics-n-vids/` now supports both external video destinations and local photo-gallery entries, so later media migration can keep using the canonical `media` collection instead of inventing a separate gallery surface.
12. The retained contact source provides only minimal route copy, so future copy polish on `/kontakt/` should be treated as a product-writing choice or new evidence-backed change, not retroactively claimed as existing source text.
13. `netlify.toml` is now the deployment and redirect source of truth for the release candidate. Do not add wildcard event redirects unless future evidence verifies the target occurrence dates.
14. Final launch signoff still needs user review of public-data conflicts, especially canonical YouTube and current donation/bank details if fundraising content remains live.

---

## Continuation Status

- continuation is allowed
- active implementation phase: none; Phase 7 is complete as a technical release-candidate pass
- exact next continuation point: publish the Identity token redirect fix to the active Netlify deploy branch, retry the Netlify Identity invite/reset link, then continue visual QA from the post-RC design correction and resolve final launch-signoff public facts
- open exceptions: final launch signoff remains blocked by unresolved public-data review; `parkausbesserungen` remains a blocked manifest record on truncated retained evidence; Astro check still reports only non-blocking Zod deprecation hints from `src/content/config.ts`
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
