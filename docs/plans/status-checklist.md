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

- [ ] Phase 1 is not cleared as complete in this audit

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
- [ ] a screenshot exists for `/datenschutz/`
- [x] screenshots exist for the news index and at least two representative news posts
- [x] PDFs exist for long-form or legal pages where useful
- [x] unusable screenshot exceptions can be covered by recorded alternate local evidence
- [x] `blog-feed.xml` is captured locally
- [x] Wix-linked PDFs are inventoried locally
- [x] staged local image assets exist under `src/assets/images/wix-staging/`
- [x] route targets are recorded in the manifest
- [ ] manifest-level risk/contradiction tracking is fully aligned with the execution-plan checklist
- [x] risky public facts are tracked in [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)

Audit notes:

- One low-value launch-route screenshot is missing from the retained pack, but alternate local evidence exists and the gap is not operationally important for current implementation work.
- The reference pack had become stale after that deletion. The pack docs and manifest were corrected in this audit.
- The reference pack had also been hidden from normal `git status` by a broad ignore rule. That was tightened in this audit so lightweight metadata is visible to version control state while heavy local capture artifacts remain ignored.
- Phase 1 work appears to have been carried out substantially before the Phase 2 implementation session, but the controlling progress checklist in [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) was never marked and the jump was not flagged.
- That means the repository had Phase 1 artifacts, but the execution control state did not prove Phase 1 complete.

Blocking point:

- Treat Phase 1 as materially usable for continued implementation. The real remaining issue is process-state drift, not the missing screenshot.

---

## Phase 2 Audit

Overall status:

- [x] Phase 2 implementation exists in the repo
- [ ] Phase 2 is not signoff-clean in this audit

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
- Phase 2 was started while Phase 1 was still unchecked in the controlling execution state. That sequencing failure was process drift, not proof that the code is invalid.

---

## Findings To Carry Forward

1. The controlling checklist already existed in [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md). It was not updated before later-phase work continued.
2. Because Phase 1 was unchecked there, any move into Phase 2 should have been explicitly flagged instead of inferred from repo artifacts.
3. The reference pack can contain useful evidence and still fail the execution-control requirement if its checklist state is not recorded.
4. Future resume work must start by reading this file and the execution-plan progress/checklist sections together.
5. `src/assets/images/wix-staging/` is a large tracked staging workspace at about `43M`, but current code references are not a valid basis for pruning it yet. Many staged assets may still be needed for later route build-out and migration work. Any cleanup there must wait for explicit asset curation after the relevant implementation phases are complete.

---

## Next Conversation Start Rule

Start with:

1. [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) `Progress Snapshot`, active-phase checklist, and `Conversation Handoff Checklist`
2. this file
3. the relevant phase specs

Before implementing anything new:

- restate whether the earlier phases are actually cleared
- list any open checklist exceptions
- refuse to treat a later phase as unblocked if an earlier phase is still unchecked without an explicit recorded reason
