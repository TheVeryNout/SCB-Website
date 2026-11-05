History — not a work queue.

# Media CMS Overhaul Ledger

## Purpose

This document owns the bounded overhaul of the `Pics n Vids` Decap CMS workflow and its relationship to `Neuigkeiten` galleries.

It exists to prevent implementation drift, preserve decisions across sessions, and keep editor usability—not internal storage mechanics—as the governing acceptance standard.

Normal running status remains in `docs/operational-status.md`. Durable CMS/content semantics remain in `docs/plans/content-cms.md`. This ledger owns the overhaul until the user accepts the completed workflow.

## Working State

- Branch: `feature/media-page-refresh`
- Baseline: local `HEAD` was `2345da3` when the ledger was opened; CMS-02 began from clean `e4bba38`
- Current accepted checkpoint: `feat: complete accepted interim gallery CMS UX` (task-scoped local commit; see Git history for the immutable revision)
- Started: `2026-07-28`
- Mode: operational maintenance; no historical implementation phase is reopened
- Current publication state: clean local branch seven commits ahead of `nas/feature/media-page-refresh` after the task-scoped CMS-03A acceptance commit; not published
- Writer policy: one writer only in the active worktree
- Review policy: advisory subagents, if separately disclosed and approved, are read-only and use fresh context unless inherited session history is materially required
- Decision authority: the parent agent verifies evidence and owns synthesis; product decisions requiring preference or approval remain with the user
- Completion policy: technical verification cannot be reported as user acceptance

## Locked Objective

A non-technical club colleague must be able to create and publish either a standalone photo gallery or a Neuigkeiten post with photos from a batch of ordinary JPEG files, and may deliberately feature that post gallery on `Pics n Vids`, without understanding:

- Git or repository paths
- WebP conversion
- command-line tools
- machine slugs or cross-collection keys
- gallery ownership architecture
- Astro or Decap implementation details

Technical work that does not advance or protect this editor journey cannot substitute for core completion.

### Approved interim boundary

On `2026-07-28`, the user approved deferring custom Decap batch-widget development. The immediate target is an acceptable, clearly labelled stock-Decap gallery workflow that adds images one at a time while preserving the structured `{ image, alt, caption }[]` contract. This interim workflow may be accepted on its own terms but must not be described as batch upload.

A later, separately approved package may design a repository-owned batch workaround that prepares assets and structured gallery data for Decap to reopen. That future design must address accessible descriptions, safe content merging, publication ownership, and the fact that a local script does not itself provide a deployed non-technical CMS upload journey.

## Target Editor Journeys

### Journey A — Standalone Pics n Vids gallery

1. Open `Pics n Vids` and choose `Fotogalerien`.
2. Create a new photo gallery.
3. Enter a visible title and, optionally, a short description and publication date.
4. Select or drag multiple ordinary JPEG, PNG, or WebP files in one action.
5. See all selected images as thumbnails with clear upload/conversion progress and per-file errors.
6. Reorder the images visually.
7. Add a required accessible image description beside each thumbnail.
8. Add an optional public caption only when desired.
9. Save and publish without manually copying a slug or preparing files outside the CMS.
10. Reopen the entry and find the same image order, descriptions, captions, and publication state.

### Journey B — Neuigkeiten post with an optionally featured gallery

1. Create or edit a Neuigkeiten post.
2. Add its photos through the same batch-gallery interaction.
3. Choose whether to enable a clearly labelled control equivalent to `Diese Bilder auch unter „Pics n Vids“ anzeigen`.
4. Save and publish the post without creating a second media record or copying an identifier.
5. When enabled, the published post gallery also appears on `/pics-n-vids/` using the post's title, date, image order, alternative text, and captions.
6. When disabled, the gallery appears only in the post.
7. Draft, future-dated, or otherwise non-public posts do not appear on `/pics-n-vids/`.
8. Editing the post-owned gallery updates both public surfaces because no duplicate gallery metadata exists.

### Public aggregation rule

`/pics-n-vids/` combines:

- standalone Pics n Vids galleries; and
- public Neuigkeiten galleries whose editor-facing inclusion control is enabled.

The page derives and sorts both sources without exposing their internal ownership distinction to editors. A Neuigkeiten gallery remains owned by its post; a standalone gallery remains owned by the standalone gallery collection.

The normal workflow must not expose a separate thumbnail unless the public design gains a verified need for one.

## Core Principles

1. **Editor outcome governs architecture.** Repository hygiene, deduplication, and delivery optimization are supporting constraints.
2. **One visible purpose per field.** Every CMS field must have a documented editor purpose and an observable public or operational effect.
3. **No raw implementation identifiers.** Editors do not manually copy slugs or foreign keys between collections.
4. **No developer preprocessing requirement.** The Sharp converter may remain a migration/maintenance tool but is not the routine editorial path.
5. **Natural ownership with one coherent interaction.** A Neuigkeiten gallery belongs to its post and a standalone gallery belongs to the standalone gallery collection; both use the same batch interaction and neither exposes ownership mechanics or copied identifiers.
6. **Accessibility remains first-class.** Alternative text is required, but its entry UI must remain practical for batches.
7. **Technical and user acceptance are distinct.** Tests, builds, save/reload checks, and schema validation do not prove non-technical usability.
8. **No silent pivots.** New product, architecture, vendor, cost, or ownership decisions stop the active work package until resolved.
9. **No premature closure.** This ledger remains active until deployment verification and user acceptance; it may not be deleted merely because implementation builds.

## Verified Baseline

The `2026-07-28` read-only audit verified:

- `public/admin/config.yml` exposes one mixed `Pics n Vids` collection containing `youtube`, `photo-gallery`, and `featured-media` types.
- The same editor form exposes YouTube URL, thumbnail, free-text linked Neuigkeiten slug, local gallery, summary, and date regardless of selected type.
- `thumbnailImage` remains in schema, CMS, documentation, and two content records but is not used by the current `/pics-n-vids/` renderer.
- `postSlug` is a plain string field. Editors must understand and copy a Neuigkeiten machine slug.
- A photo gallery must contain exactly one source: `postSlug` or a local structured gallery. Supplying both or neither fails validation.
- `Goodies 4 Tricks 2025` uses `postSlug`; `Goodies 4 Tricks 2024` and `Graffiti-Workshop 2025` use local galleries.
- There is no automatic rule that publishes every Neuigkeiten gallery under `Pics n Vids`; the media collection is an explicit inclusion index.
- The current structured list UI creates one nested record per image with image, required alt text, and optional caption.
- The Sharp converter is technically useful but requires a local command, review directory, manifest review, and copying selected outputs into the repository upload folder.
- The deleted temporary ingest plan required proof that a non-developer could complete a practical batch workflow and that the process was short enough for routine use.
- Final operational evidence recorded only Decap save/reload preservation for referenced and standalone structured galleries; it did not record a successful practical multi-file upload or non-technical editor test.
- Decap's standard list/image widgets do not by themselves provide the required batch-gallery experience. A custom widget or external media-library integration requires a bounded decision and proof.

## Salvage / Remove / Rewrite Inventory

### Preserve

- `src/components/PostGallery.astro` and the public PhotoSwipe interaction
- existing gallery assets, reviewed alternative text, captions, and established ordering
- the structured `{ image, alt, caption }[]` gallery data contract unless a prototype proves a necessary change
- Astro responsive public image generation
- the Sharp converter and focused tests as migration/maintenance tooling
- validation for required alternative text, non-empty galleries, and resolvable public content
- the complete 14-image Goodies 2025 source ordering
- useful `/pics-n-vids/` layout and styling that survives the content-model change

### Remove from the normal editor surface

- unused `Thumbnail`
- free-text `Verknüpfter Neuigkeiten-Slug`
- WebP preparation instructions
- type-irrelevant fields displayed together
- `featured-media` unless a concrete public use is documented and approved
- required manual slug entry where Decap can safely derive an identifier

### Approved ownership model and remaining implementation decisions

- a Neuigkeiten gallery is canonically owned by its post and may be included on `Pics n Vids` through one clear editor-facing toggle
- a standalone Pics n Vids gallery is canonically owned by the standalone gallery collection
- `/pics-n-vids/` aggregates both sources without a separate media record or copied slug for post galleries
- separation of video/playlist settings from photo galleries
- immediate stock-Decap labels, defaults, grouping, ordering guidance, and optional-caption disclosure
- later batch-workaround design and automatic image preparation path
- later error, duplicate-name, ordering, retry, accessibility-entry, and publication behavior

## Work Packages

### Status vocabulary

Use only:

- `proposed`
- `approved`
- `in-progress`
- `blocked`
- `technically-verified`
- `user-accepted`
- `deferred`

### Package summary

| ID | Work package | Status | Required outcome |
| --- | --- | --- | --- |
| CMS-00 | Baseline and control ledger | `technically-verified` | Preserve the current baseline and lock scope, principles, gates, and evidence requirements |
| CMS-01 | Editor journey and content-model decision | `user-accepted` | User approves one coherent ownership and navigation model before implementation |
| CMS-02 | Immediate CMS cleanup | `technically-verified` | Dead and developer-facing controls are removed without breaking retained public galleries |
| CMS-03A | Interim stock-gallery UX groundwork | `user-accepted` | Both gallery locations provide the clearest practical one-image-at-a-time Decap workflow without implying batch support |
| CMS-03 | Batch-workaround design and proof | `deferred` | A later bounded design tests a repository-owned batch preparation path without pretending it is native Decap batch upload |
| CMS-04 | Batch-workaround production integration | `deferred` | Only an approved CMS-03 design may define production preparation, errors, persistence, and publication behavior |
| CMS-05 | Existing-content migration | `proposed` | Existing galleries retain assets, order, accessibility text, captions, and public rendering under the approved model |
| CMS-06 | Non-technical usability acceptance | `proposed` | A representative non-technical editor completes the workflow without developer intervention |
| CMS-07 | Publication and deployed verification | `proposed` | Approved work is committed, intentionally published, and verified in the deployed CMS/site |

### CMS-00 — Baseline and control ledger

Scope:

- create and review this ledger
- record verified current behavior and publication state
- establish work packages, gates, decision handling, and orchestration rules
- point `docs/operational-status.md` at the active overhaul

Non-goals:

- source or CMS implementation changes
- new dependencies
- subagent execution without separately disclosed parameters and approval
- commits, merges, or publication

Acceptance:

- the objective and editor journey are explicit
- salvage/remove/rewrite boundaries are explicit
- later work can identify one active package without reconstructing chat history
- technical verification and user acceptance cannot be conflated

### CMS-01 — Editor journey and content-model decision

Approved model:

- Neuigkeiten posts continue to own their own galleries.
- A Neuigkeiten editor can opt a post gallery into `Pics n Vids` through one clearly labelled boolean control.
- The opt-in creates no second media record and requires no slug, relation lookup, or duplicate image metadata.
- Only public, eligible posts with non-empty galleries may appear on `/pics-n-vids/`.
- Standalone galleries are created directly under a dedicated Pics n Vids photo-gallery collection.
- `/pics-n-vids/` aggregates opted-in post galleries and standalone galleries, then sorts them by publication date.
- Both ownership paths use the same structured gallery data and must expose the same editor interaction; the approved interim interaction is one image at a time, while batch preparation is deferred.

Rejected alternatives:

- **Pics n Vids owns every gallery and posts select one:** rejected because ordinary blog authoring would require a second record and cross-collection selection.
- **Dedicated central gallery collection referenced by both surfaces:** rejected for the same routine-authoring friction and unnecessary indirection.
- **Free-text `postSlug` media records:** rejected because they expose machine identifiers and require duplicate editorial steps.
- **Automatically publish every post gallery:** rejected because editors need an explicit choice about media-page inclusion.

Settled or deferred for later packages:

- video management is a singleton playlist setting
- custom Decap widget development is deferred rather than assumed viable
- automatic batch preparation, progress, error, accessibility-entry, and retry behavior belong to deferred CMS-03 design

Exit gate:

- ownership and inclusion model: `user-accepted` on `2026-07-28`
- both editor journeys and public aggregation behavior are explicit
- no writer must invent ownership semantics during CMS-02 or CMS-03

### CMS-02 — Immediate CMS cleanup

Approved and technically verified ownership-cleanup scope:

- remove the unused thumbnail field and stale data
- remove `featured-media` unless approved with a concrete public behavior
- separate playlist/video controls from standalone photo-gallery controls
- remove the free-text post-slug editor field and its separate media-entry requirement
- add a clear Neuigkeiten control equivalent to `Diese Bilder auch unter „Pics n Vids“ anzeigen`
- aggregate eligible opted-in post galleries with standalone galleries in code
- remove editor-facing WebP/CLI instructions
- derive routine slugs where safe
- use concise German labels, help text, defaults, and grouping
- retain existing public gallery output during migration

Exit gate:

- every remaining field has a documented purpose
- a new editor can identify how to create a gallery without understanding the schema
- retained public galleries build and render
- no batch-upload completion is claimed yet

Technical evidence recorded on `2026-07-28`:

- the mixed media collection became a dedicated standalone `Pics n Vids` gallery collection plus one file-backed `Videos` playlist setting
- `thumbnailImage`, `featured-media`, free-text `postSlug`, the redundant Goodies 2025 media record, mixed irrelevant controls, and editor-facing WebP preparation hints were removed
- Neuigkeiten gained `showGalleryOnMediaPage`; Goodies 2025 is opted in and remains the sole owner of its complete 14-image gallery
- post and standalone gallery filenames are derived from visible titles; all ten existing post filename/frontmatter-slug pairs were verified equal before optional-slug fallback was introduced, preserving current URLs
- `/pics-n-vids/` now aggregates eligible opted-in public post galleries with standalone galleries and sorts descending by publication date with a deterministic key tie-breaker
- the two standalone records moved under `src/content/media/galleries/` with corrected relative asset paths; no source assets were deleted
- PyYAML parsed all CMS collections; focused media/post tests passed; the full 39-test suite passed; `bun run check` passed with only eight known Zod deprecation hints; a 90-page build passed
- generated output contained the unchanged playlist ID, three galleries in descending date order, three initialized PhotoSwipe galleries, and 14 Goodies 2025 items on the Neuigkeiten detail route
- the fresh-context validator found that playlist summary/date controls had no public effect; those controls and stale values were removed rather than given invented behavior
- this is technical verification only; no CMS-02 user acceptance or CMS-03 batch-upload completion is claimed

### CMS-03A — Interim stock-gallery UX groundwork

Approved immediate scope:

- retain Decap's structured list of `{ image, alt, caption }` records for both Neuigkeiten and standalone galleries
- make the gallery purpose and one-image-at-a-time interaction explicit in concise German
- provide a clear singular add-image label
- keep one image per record and disable misleading nested multi-selection where supported
- keep required alternative text adjacent to its image and describe its accessibility purpose plainly
- keep the optional caption visibly secondary
- make ordering, removal, and save/reopen behavior understandable without repository knowledge
- verify both editor paths locally with representative records

Non-goals:

- custom Decap widgets or undocumented Decap APIs
- batch selection or batch-upload claims
- browser conversion
- importer/script development
- dependencies, commits, or publication without separate authorization

Exit gate:

- a new editor can identify how to add, describe, order, remove, save, and reopen gallery images
- Neuigkeiten and standalone galleries expose the same understandable interaction
- existing gallery data remains unchanged and public rendering still validates
- the user may accept the interim workflow while CMS-03 remains deferred

Technical evidence recorded on `2026-07-28`:

- both gallery fields are labelled `Galeriebilder`, use the singular add label `Bild`, collapse existing entries to their alternative-text summaries, and explicitly explain one-at-a-time addition plus drag ordering
- each expanded record presents `Foto auswählen`, required `Bildbeschreibung`, and secondary `Sichtbare Bildunterschrift` controls with plain German purpose text; direct-URL insertion is removed from gallery image records
- Neuigkeiten and standalone galleries use the same stock Decap configuration and retain the existing `{ image, alt, caption }[]` content shape
- the user-installed project-local `@playwright/test` `1.62.0` CLI successfully used system Chromium rather than Steel for local CMS verification
- disposable Playwright scenarios created representative standalone and Neuigkeiten records, added real JPEG uploads, entered alternative text and captions, reordered a standalone image by drag handle, published through the local proxy, reopened both entries, and verified persisted paths and metadata; the final two-scenario run passed
- all disposable entries, uploaded assets, Playwright specs, screenshots/results, and earlier Steel probe fixtures were removed; real content remained unchanged
- PyYAML configuration assertions passed; all 39 Bun tests passed; `bun run check` passed with only eight known Zod deprecation hints; the 90-page production build passed
- after checking both backend and frontend, the user accepted this package as complete on `2026-07-28`, pending any later concrete scrutiny; it does not provide or claim batch upload

### CMS-03 — Batch-workaround design and proof

Status: deferred until separately reopened by the user.

Preferred later candidate:

- a repository-owned batch importer that reuses the existing Sharp preparation engine, accepts an image directory or archive, writes safe publication assets, and produces or merges the structured `{ image, alt, caption }[]` data that Decap can reopen

Design questions that must be resolved before implementation:

- how editors provide required accessible image descriptions without filename-derived or empty placeholders
- whether the tool is developer-operated, locally wrapped for non-technical use, or exposed through another approved interface
- how it selects the target Neuigkeiten or standalone entry without unsafe identifiers
- safe duplicate-name, ordering, partial-failure, retry, and rollback behavior
- who owns Git commits/publication and how deployed editors receive the result
- whether the workaround remains acceptable once its operational handoffs are counted

Evidence already established:

- Decap `3.11.0` with the default media library rendered `media_library.config.multiple: true` and explicit `allow_multiple: true` with a native file input whose `multiple` property remained `false`
- forcing ten valid JPEG files through one change event admitted only the first file
- repeated one-at-a-time selection produced a list of paths that survived CMS save/reload
- configuration alone therefore does not provide the locked batch journey

Reopening rule for custom widgets or external media services:

Compare a custom widget, maintained third-party widget, Uploadcare/Cloudinary-style service, or broader architecture only if the later importer design exposes a concrete blocker or the user intentionally reopens native batch upload. Do not conduct a broad ecosystem survey speculatively.

Exit gate:

- the design demonstrates a representative batch entering stable structured gallery data
- required accessibility input and publication ownership are explicit
- production scope and unresolved risks are explicit
- no script or prototype is called a native Decap batch workflow

### CMS-04 — Batch-workaround production integration

Status: deferred. Its exact scope must be rewritten from an approved CMS-03 design before implementation; the requirements below remain provisional safeguards rather than active authorization.

Required capabilities:

- ordinary JPEG/PNG/WebP input
- orientation handling
- agreed resize/format policy applied automatically
- progress and per-file failure feedback
- safe duplicate-name behavior
- stable image order
- inline alternative text
- optional captions behind a secondary control
- recovery from partial failure
- successful Git Gateway/local CMS persistence
- compatibility with Astro image loading and public gallery rendering

Exit gate:

- representative 10–20 image batches complete without command-line intervention
- only intended publication assets and content changes are produced
- save/reload and failed-upload recovery are verified
- focused tests plus `bun test`, `bun run check`, and `bun run build` pass except explicitly documented pre-existing warnings

### CMS-05 — Existing-content migration

Required preservation:

- gallery title and description
- publication date where retained
- image selection and order
- alternative text and captions
- complete Goodies 2025 fourteen-image ordering
- its post-owned gallery appearing on both the Neuigkeiten detail and `/pics-n-vids/` through the approved inclusion control
- standalone gallery ownership for galleries without posts
- public PhotoSwipe behavior

Exit gate:

- no cryptic cross-collection editor field remains
- all retained galleries render under the approved ownership model
- no asset or metadata loss is found
- migration mapping is recorded before obsolete fields are removed

### CMS-06 — Non-technical usability acceptance

Required scenarios:

A representative non-technical editor must be able to complete both paths.

Standalone path:

1. create a standalone Pics n Vids gallery from scratch
2. select 10–20 ordinary JPEGs in one action
3. understand upload/preparation progress
4. reorder multiple images
5. add image descriptions
6. save and publish
7. reopen and understand the saved gallery

Neuigkeiten path:

1. create or edit a Neuigkeiten post
2. batch-add post photos through the same understandable interaction
3. enable the clear `Pics n Vids` inclusion control
4. publish without creating another gallery record or copying an identifier
5. verify the gallery appears in both the post and `/pics-n-vids/`
6. disable the control and verify the gallery remains in the post but leaves `/pics-n-vids/`

Evidence:

- observed completion or explicit user-provided result
- friction, confusion, errors, and required intervention recorded
- any failed acceptance item returns the owning package to `in-progress` or `blocked`

Exit gate:

- the user accepts the workflow as adequate for colleagues
- technical verification alone cannot close this package

### CMS-07 — Publication and deployed verification

Scope:

- final task-scoped review
- explicit commit and publication authorization
- deployed CMS and public route verification
- final operational handoff

Exit gate:

- approved commits are synchronized only to explicitly authorized targets
- deployed batch creation and public gallery rendering are spot-checked
- residual exceptions are recorded
- this ledger is retained as a completed reference rather than deleted

## Orchestration Contract

Subagents are optional contributors, not the source of truth. Every execution requires the global disclosure and approval gate.

Recommended roles after approval:

1. **Fresh-context UX reviewer, read-only**
   - checks the target journey, labels, visible controls, error recovery, and non-technical comprehension
2. **Fresh-context content-model reviewer, read-only**
   - checks ownership, duplication, migration safety, and whether identifiers leak into the UI
3. **Fresh-context Decap feasibility reviewer or researcher, read-only**
   - checks official APIs and bounded implementation risks for the selected widget direction
4. **One writer**
   - implements only the active approved package in the shared worktree
5. **Fresh-context validators, read-only**
   - inspect the actual diff against the active package's acceptance criteria

Rules:

- no parallel writers in the active worktree
- no child may expand product scope or choose a vendor
- child output is evidence to verify, not authority
- reviewers receive this ledger, directly relevant files, and the actual diff; they do not depend on chat summaries
- default maximum is two review/fix rounds per package; a third requires a concrete unresolved blocker and renewed disclosure
- optional polish does not keep a package open unless it affects a locked acceptance criterion
- any product, architecture, cost, account, or publication decision returns to the user

## Per-Package Operating Cycle

1. Read this ledger and identify exactly one active package.
2. Confirm its approved scope, dependencies, and stop conditions.
3. Quote the mutation authorization before writing.
4. Use one writer.
5. Run focused validation.
6. Obtain fresh review when the package risk warrants it and execution has been approved.
7. Parent verifies findings against source evidence.
8. Apply only in-scope corrections.
9. Record changed files, commands, results, exceptions, and next continuation point here and in `docs/operational-status.md` when materially relevant.
10. Mark `technically-verified` only when technical gates pass.
11. Mark `user-accepted` only from explicit user acceptance or the recorded CMS-06 test.
12. Commit or publish only under separate explicit authorization.

## Decision Log

### D-001 — Persistent repository ledger

- Decision: use this committed ledger rather than conversation memory as the overhaul control surface
- Status: approved by the user on `2026-07-28`
- Reason: prior work closed technical tasks without demonstrating the core non-technical editor workflow
- Reopen only if: the repository establishes a stronger canonical issue system that preserves the same gates and evidence

### D-002 — Subagents are bounded reviewers around one writer

- Decision: use advisory/review subagents only after exact execution disclosure and approval; keep one writer in the active worktree
- Status: approved as an operating direction; no run parameters or executions are approved yet
- Reason: independent review can expose drift, while multiple writers would increase inconsistency and worktree risk
- Reopen only if: an intentionally isolated worktree workflow is proposed and separately approved

### D-003 — No broad media-widget survey initially

- Decision: do not start a custom Decap widget or broad external-service survey; the stock configuration probe has already established that native batch selection is unavailable in the current default media library
- Status: superseded by D-005 on `2026-07-28`
- Reason: the custom interaction is substantial feature development and is not justified for the accepted interim workflow
- Reopen only if: a later importer design exposes a concrete blocker or the user intentionally reopens native batch upload

### D-004 — Natural gallery ownership with explicit Neuigkeiten inclusion

- Decision: Neuigkeiten posts own their galleries and expose one `Pics n Vids` inclusion toggle; standalone galleries remain owned by a dedicated Pics n Vids gallery collection; the public media page aggregates both
- Status: approved by the user on `2026-07-28`
- Reason: this preserves the ordinary blog-post workflow, supports intentional media-page featuring, avoids duplicate metadata, and removes copied slugs or relation hunting
- Reopen only if: implementation evidence proves that Decap cannot preserve this interaction without materially worse editor friction

### D-005 — Accept interim stock UX and defer batch-workaround design

- Decision: improve and assess the stock structured-list gallery workflow first; defer custom-widget development and later design a repository-owned batch workaround around Decap's persisted data shape
- Status: approved by the user on `2026-07-28`
- Reason: the configuration probe ruled out native one-action batch selection, while a custom Decap upload interaction would be a substantial maintained feature in its own right
- Constraint: the interim workflow must be labelled and accepted as one-image-at-a-time; a script cannot be presented as a deployed non-technical CMS journey unless an approved interface genuinely provides that outcome
- Reopen only if: the interim workflow is unacceptable or later batch-workaround requirements justify another architecture

## Findings Ledger

| ID | Finding | State | Evidence / disposition |
| --- | --- | --- | --- |
| F-001 | `thumbnailImage` is exposed but unused by the current public renderer | `verified` | Repository-wide reference scan on `2026-07-28` |
| F-002 | `postSlug` exposes a machine relationship as a free-text editor task | `verified` | `public/admin/config.yml` and supplied CMS screenshot |
| F-003 | the mixed media form exposes irrelevant fields without conditional guidance | `verified` | `public/admin/config.yml` |
| F-004 | the requested practical batch uploader was not delivered | `verified` | Current config plus the deleted plan's unmet non-technical/batch exit evidence |
| F-005 | the Sharp converter and public gallery implementation remain technically salvageable | `verified` | Converter, tests, `PostGallery.astro`, and current content audit |
| F-006 | Decap's stock list/image UI is insufficient for the original native batch target journey | `verified` | Current rendered CMS UI and official Decap widget behavior reviewed on `2026-07-28`; the user approved a narrower interim UX target |
| F-007 | `multiple: true` does not enable one-action batch upload in the current default media library | `verified` | Disposable local Decap `3.11.0` probe: file input remained single-select, a forced ten-JPEG change admitted one asset, and iterative selections persisted as a path list through save/reload; all fixtures were removed |

## Evidence Requirements

Every completed package must record:

- files changed
- state-changing commands run
- focused and full validation results
- screenshots or browser observations where UI is involved
- unresolved warnings and failures
- publication state
- exact next continuation point

A package may not cite an earlier agent summary as sole proof when the underlying file, diff, command, screenshot, or browser state is available.

## Current Gate

- Completed control package: `CMS-00` is `technically-verified`
- Completed decision package: `CMS-01` is `user-accepted`
- Completed cleanup package: `CMS-02` is `technically-verified`, not user-accepted
- Completed interim package: `CMS-03A` is `user-accepted`
- Deferred package: `CMS-03` owns later batch-workaround design; no script, custom widget, dependency, vendor, or batch implementation is authorized
- Downstream `CMS-04` is deferred and must be rescoped from an approved CMS-03 design before implementation
- Subagent execution: no further subagent work is authorized
- Exact next continuation point: no immediate media package is active; retain CMS-03 batch-workaround design and CMS-04 integration as deferred until the user explicitly reopens them or later concrete scrutiny exposes CMS-03A friction

## Change Log

- `2026-07-28`: Created the overhaul ledger after the user approved a persistent repository control system. Recorded the verified baseline, locked editor journey, salvage/remove/rewrite inventory, numbered work packages, acceptance gates, decision and findings ledgers, single-writer orchestration rules, and the distinction between technical verification and user acceptance. No CMS implementation, dependency, content, image, Git, or deployment state was changed.
- `2026-07-28`: Clarified and user-approved both editor journeys. Neuigkeiten posts retain canonical ownership of their galleries and gain one explicit `Pics n Vids` inclusion control; standalone galleries remain owned by a dedicated Pics n Vids gallery collection; `/pics-n-vids/` aggregates both without copied slugs, relation hunting, duplicate media records, or duplicate gallery metadata. Marked CMS-00 technically verified and CMS-01 user-accepted. No implementation or publication state changed.
- `2026-07-28`: Implemented and technically verified CMS-02 after the user approved one fresh-context read-only pre-reviewer, one parent writer, and one fresh-context read-only validator at medium thinking. Separated standalone galleries from the playlist singleton, added the Neuigkeiten inclusion control, replaced `postSlug` index records with direct public-post aggregation, removed dead/developer-facing fields and hints, derived safe filenames from visible titles while preserving existing post URLs, retained all three public galleries and the playlist, and passed the recorded focused/full checks and generated-output inspection. The validator identified unused playlist summary/date controls; those controls and stale values were removed before closure. CMS-02 is not user-accepted.
- `2026-07-28`: Ran and fully cleaned a disposable local Decap `3.11.0` configuration probe. `media_library.config.multiple: true`, with and without explicit `allow_multiple: true`, retained a single-select native file input; forcing ten valid JPEG files through one event admitted only the first, while repeated individual selections produced a path list that survived save/reload. The user then approved CMS-03A as bounded stock-gallery UX groundwork and deferred CMS-03 batch-workaround design. The preferred later direction is a repository-owned importer reusing the Sharp engine, subject to explicit accessibility, target-entry, failure-recovery, operational-ownership, and publication decisions. No probe fixtures remain, and no CMS implementation, dependency, commit, or publication was authorized by this decision update.
- `2026-07-28`: Implemented and technically verified CMS-03A. Both gallery-owning editor paths now use the same concise one-image-at-a-time Decap list UX with singular add wording, alternative-text summaries, explicit drag-order guidance, plain required image-description help, secondary public-caption help, and no direct-URL control inside gallery image records. After Steel proved unacceptably slow and its session timed out, the user installed `@playwright/test` `1.62.0`; its CLI with system Chromium proved suitable and replaced Steel for the remaining CMS QA. A final disposable two-scenario Playwright run passed real JPEG add, description, caption, standalone drag reorder, local publish, persisted file/frontmatter inspection, and reload for both standalone and Neuigkeiten entries. All fixtures and test artifacts were removed. PyYAML assertions, 39 Bun tests, Astro check with eight known Zod hints, and a 90-page build passed. After checking both backend and frontend, the user accepted CMS-03A as complete pending later scrutiny and authorized its task-scoped commit. CMS-03 batch-workaround design remains deferred and publication remains unauthorized.
