# SCB Website Execution Plan

## Purpose

This document is the canonical delivery plan for constructing the public `SCB` Astro website from the current bootstrap and planning stack.

Use it to decide:

- what to do first
- what must be finished before the next phase starts
- what to track after each conversation
- how to keep one long implementation run from drifting off spec

If this document conflicts with the domain specs, the domain specs win on product, routing, content, and behavior. This document wins on sequencing, checkpoints, and progress tracking.

---

## Required Inputs

Do not use this plan in isolation.

Load these docs first:

1. [cold-start.md](/home/nout/REPO/SCB-Website/docs/plans/cold-start.md)
2. [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
3. [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md)
4. [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md)
5. [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
6. [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md)
7. [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)
8. [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
9. [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md)

Then use this file as the active work controller.

---

## Current Verified Repo Snapshot

As of `2026-04-10`, the repository baseline has been verified to this level:

- `bun` is installed and the repo declares `bun@1.3.5`
- `bun run check` passes
- `bun run build` passes
- Playwright CLI is installed and Chromium has been installed for local capture work
- real Astro content collections and Decap launch collections exist for homepage, pages, posts, events, media, and settings
- the build-time event engine exists, including recurrence expansion, occurrence route-param helpers, and homepage upcoming-event derivation
- the shared site shell now includes reusable page-intro, rich-text, CTA, card, image, and event metadata/status patterns, with mobile-width verification recorded in the status ledger
- current implemented public routes are `/`, `/veranstaltungen/`, `/veranstaltungen/[slug]/[date]/`, and `/admin/`
- lightweight Wix reference metadata exists under `docs/plans/wix-reference/`, while heavy capture artifacts may remain local-only
- a raw downloaded Wix asset archive exists under `docs/plans/wix-reference/asset-source-archive/`

Known not-yet-done items:

- `migration/` workspace has not been created yet
- `migration/manifest.json` does not exist yet
- several launch routes still do not exist yet, including the news, singleton content, media, and legal route set outside the homepage/events slice
- `netlify.toml` has not been created yet

Use this snapshot to avoid re-auditing the bootstrap from scratch in a later conversation.

---

## Phase-Specific Reading Mode

For a truly fresh conversation, do not keep all long docs equally active once the baseline is understood.

Recommended loading pattern:

- always load [cold-start.md](/home/nout/REPO/SCB-Website/docs/plans/cold-start.md) and this file first
- then load the docs for the active phase most deeply
- refer back to the rest only when a decision crosses domains

Phase focus map:

- Phase 1 source capture: [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md), [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md), [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)
- local source evidence for any phase: [wix-reference/README.md](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/README.md), [wix-reference/manifest.json](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/manifest.json)
- Phase 2 content and CMS: [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md), [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md), [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md)
- Phase 3 event engine: [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md), [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md), [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md)
- Phase 4 shared UI: [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md), [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md), [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
- Phase 5 routes: [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md), [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md), [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
- Phase 6 migration: [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md), [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md), [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md), [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md) for event work
- Phase 7 QA and deploy hardening: [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md), [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md), [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)

This is the intended context-saving mode for multi-conversation implementation.

---

## Best Workflow

The cleanest path is not unrestricted parallel work.

The cleanest path is one orchestrated run with hard gates:

1. verify bootstrap and freeze the working rules
2. capture the live Wix source with Playwright CLI and open the migration workspace
3. implement the editable content model and Decap CMS around the locked route set
4. implement the event engine and occurrence generation before calendar UI polish
5. build the shared site shell and route templates against the real content contracts
6. migrate content, assets, and downloads into the finished structures
7. run QA, redirects, and deployment hardening last

Do not invert this by migrating lots of content into structures that do not exist yet.

Do not spend time polishing media or decorative layout before the CMS, event engine, and route contracts are real.

---

## Progress Snapshot

Update these first when resuming work:

- [x] bootstrap verified
- [x] Phase 1 complete
- [x] Phase 2 complete
- [x] Phase 3 complete
- [x] Phase 4 complete
- [ ] Phase 5 complete
- [ ] Phase 6 complete
- [ ] Phase 7 complete

Unchecked earlier phases are blockers.

Do not treat a later phase as implicitly cleared just because related repo artifacts already exist.

Cross-check this section against [status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md) before resuming work.

---

## Bootstrap Verification Checklist

Run this before starting or resuming substantial implementation work:

- [x] `bun install`
- [x] `bun run check`
- [x] `bun run build`
- [x] `bunx playwright --version`
- [x] if Playwright screenshot or PDF capture fails because the browser is missing, run `bunx playwright install chromium`
- [x] verify `/admin/` renders locally
- [x] verify `public/admin/config.yml` still targets the intended deployment branch
- [x] verify `bun.lock` is present and committed

If any item above fails, fix it before feature work continues.

---

## Phase 1: Source Freeze And Capture

### Goal

Create a stable evidence base from the current Wix site so implementation decisions do not drift away from the live reference.

### Required outputs

- populated `docs/plans/wix-reference/` pre-capture pack or `migration/` working tree
- initial `docs/plans/wix-reference/manifest.json` or `migration/manifest.json`
- Playwright capture set for the launch routes
- route inventory and public-fact risks recorded

### Example commands

```bash
bunx playwright screenshot https://briareos.wixsite.com/skateclubbiriciana docs/plans/wix-reference/screenshots/home-full.png
bunx playwright screenshot https://briareos.wixsite.com/skateclubbiriciana/veranstaltungen docs/plans/wix-reference/screenshots/veranstaltungen-full.png
bunx playwright pdf https://briareos.wixsite.com/skateclubbiriciana/impressum docs/plans/wix-reference/pdf/impressum.pdf
```

### Checklist

- [x] create `docs/plans/wix-reference/manifest.json` or `migration/manifest.json`
- [x] create the chosen reference workspace structure
- [x] retain local evidence for all launch routes, using Playwright screenshots where usable and recorded HTML/PDF fallback evidence where a screenshot was unusable:
- [x] `/`
- [x] `/ueber-uns/`
- [x] `/pics-n-vids/`
- [x] `/veranstaltungen/`
- [x] one representative event detail page
- [x] `/copy-of-veranstaltungen`
- [x] `/kontakt/`
- [x] `/impressum/`
- [x] `/datenschutz/` via retained HTML/PDF fallback documented in the manifest
- [x] the news index and at least two representative news posts
- [x] capture Playwright PDFs for long-form or legal pages when a screenshot is not enough
- [x] if a needed launch-route screenshot is unusable or blocked, record the exception and keep alternate local evidence such as HTML and/or PDF
- [x] capture `blog-feed.xml`
- [x] inventory Wix-linked PDFs and public asset URLs
- [x] record route targets, risks, and unresolved contradictions in the manifest
- [x] cross-check risky public facts against [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)

### Exit gate

Do not start broad content migration or final copy decisions until every launch route has reference evidence.

---

## Phase 2: Content Model And CMS Spine

### Goal

Make the editable content system real before page implementation depends on ad hoc placeholder data.

### Required outputs

- `src/content/config.ts`
- real Astro collections
- real Decap collections
- minimum seed content that lets the site build from the final data model

### Checklist

- [x] implement Astro content collections for `homepage`, `pages`, `posts`, `events`, `media`, and `settings`
- [x] encode field validation from the planning stack
- [x] model shared site-wide facts in `settings` instead of hardcoding them in components
- [x] create required singleton entries for homepage and static pages
- [x] create minimal seed entries for posts, events, and media
- [x] replace the bootstrap-only Decap collection in `public/admin/config.yml`
- [x] keep editor labels and grouping understandable for non-technical admins
- [x] verify `bun run build` fails on missing required singleton content
- [x] verify `/admin/` can edit all launch-critical content types locally

### Exit gate

Do not build the full page surface area against mock objects once the real content model exists.

---

## Phase 3: Event Engine

### Goal

Implement the public event system as build-time data logic before calendar UI and migration get complicated.

### Required outputs

- event schema aligned with [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
- recurrence expansion utilities
- occurrence-route generation
- build-safe upcoming-occurrence helpers

### Checklist

- [x] implement the event schema exactly around one-off, weekly recurring, and monthly recurring support
- [x] generate occurrence URLs at `/veranstaltungen/[slug]/[yyyy-mm-dd]/`
- [x] derive upcoming occurrences at build time
- [x] build month-view or grouped-list helpers without runtime dependency
- [x] cover recurrence edge cases with focused fixtures or tests
- [x] verify timezone and date formatting assumptions
- [x] verify Wix slug/date mismatches are treated as migration QA issues, not silently trusted data

### Exit gate

Do not hand-build event detail pages or hardcode recurring events into page copy once the engine exists.

---

## Phase 4: Shared UI Foundation

### Goal

Build the reusable layout and component layer once the data contracts are stable.

### Required outputs

- final site shell
- shared typography, spacing, and color rules
- reusable section and card primitives
- responsive navigation and footer

### Checklist

- [x] finalize global tokens and layout rhythm
- [x] implement shared header, footer, navigation, and container patterns
- [x] implement reusable page-intro, rich-text, CTA, card, and image patterns
- [x] keep client-side JavaScript limited to clearly useful interaction
- [x] confirm mobile-first layouts before desktop refinement
- [x] keep the visual direction intentional and cleaner than the Wix source without copying Wix chrome

### Exit gate

Do not create route-specific one-off UI that duplicates a reusable pattern unless there is a real need.

---

## Phase 5: Route Implementation

### Goal

Implement the entire public route set against the real content model and shared UI primitives.

### Required outputs

- every launch route rendered
- correct data wiring for previews, lists, and detail pages
- contact thank-you flow in place

### Checklist

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
- [x] wire latest-news and upcoming-events previews from collections, not duplicate CMS entries
- [ ] keep shared contact and social data sourced from settings where appropriate
- [ ] keep legal and membership downloads on their owning pages instead of adding extra top-level IA

### Exit gate

Do not call the route layer complete until every launch route builds from the canonical content sources.

---

## Phase 6: Content And Asset Migration

### Goal

Move real content, images, PDFs, and media references into the final site structures with evidence-backed QA.

### Required outputs

- content entries populated from the source site
- localized assets
- updated manifest statuses
- reduced dependence on Wix-hosted files

### Checklist

- [ ] migrate homepage copy and featured sections
- [ ] migrate static-page content
- [ ] migrate news posts and dates
- [ ] migrate event entries carefully, merging Wix recurrence artifacts where appropriate
- [ ] migrate media references and curated thumbnails
- [ ] download and localize PDFs
- [ ] download and localize images worth preserving
- [ ] remove avoidable Wix-hosted production dependencies
- [ ] update manifest records to `migrated` or `blocked`
- [ ] record unresolved contradictions instead of guessing

### Exit gate

Do not ship migrated content that has no recorded source evidence or unresolved-risk note.

---

## Phase 7: QA, Redirects, And Deployment Hardening

### Goal

Turn the built site into a deployable, reviewable release candidate.

### Required outputs

- passing build and verification commands
- redirect plan
- Netlify deployment configuration
- signoff-ready launch checklist

### Checklist

- [ ] run `bun run check`
- [ ] run `bun run build`
- [ ] verify responsive behavior on phone-width pages
- [ ] verify keyboard navigation and baseline accessibility
- [ ] verify forms, thank-you flow, downloads, and external links
- [ ] verify event occurrence pages and index pages against source evidence
- [ ] create and verify Netlify config needed for deploy, forms, and redirects
- [ ] add legacy redirects only where mapping confidence is high
- [ ] verify no guessed event-detail redirect is published without evidence
- [ ] verify `/admin/` assumptions for deployed Netlify Identity and Git Gateway
- [ ] cross-check risky public facts one last time against [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)

### Exit gate

Do not call the site launch-ready while deployment assumptions still live only in planning prose.

---

## Safe Parallelization Windows

Parallel work is useful only after the contracts are stable.

Safe windows:

- after Phase 1: migration inventory and UI exploration can run in parallel
- after Phase 2: page-template work can split from content-entry population
- after Phase 3: event UI can split from non-event page implementation
- after Phase 5: content migration, redirect mapping, and QA prep can run in parallel

Unsafe windows:

- changing schemas while content migration is underway
- changing event URL rules while redirects are being written
- changing shared settings ownership after pages start hardcoding those fields

When in doubt, serialize the work instead of creating merge churn.

---

## Conversation Handoff Checklist

Update this state after every substantial work session:

- [ ] update [status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md) with the audited current state and any exceptions
- [ ] mark completed phase checklist items in this file
- [ ] update `migration/manifest.json` statuses for anything touched
- [ ] update the relevant spec doc if a real implementation decision sharpened it
- [ ] note blockers, assumptions, and deferred items in a committed doc, not only in chat
- [ ] leave the repo in a buildable state unless a blocker makes that impossible
- [ ] if stable startup or continuation rules had to be repeated in chat, promote them into committed docs so the next conversation can resume from a short prompt

This checklist is the main defense against context drift.

### Minimal Resume Prompt Rule

The default goal is that a future conversation can resume from a short prompt, not a pasted wall of rules.

Expected pattern:

- the repo docs own stable workflow rules
- the prompt only needs to identify the current continuation slice or any override

Good prompt shape:

- `Resume from the current committed state and continue the next route slice recorded in status-checklist.md`
- `Resume from the current committed state and implement /ueber-uns/ and /mitgliedschaft/ next`

Bad prompt shape:

- restating the same phase-tracking, evidence, asset, and handoff rules that the repo docs already encode

If a short prompt is not enough, fix the docs rather than expecting the user to carry the missing process state manually.

---

## Definition Of Done

The website effort is only done when all of the following are true:

- [ ] every launch route in [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md) exists
- [ ] content is driven by the canonical Astro collections and Decap config
- [ ] the public event calendar is generated from the build-time event engine
- [ ] migrated source content and assets are tracked through the manifest
- [ ] the build passes cleanly
- [ ] deployment configuration is in place
- [ ] outstanding risky public facts are either confirmed or explicitly flagged

If any item above is false, the work is not finished.
