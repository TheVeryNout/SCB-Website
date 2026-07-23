# News Editorial Refactor Ledger

## Purpose

This document owns the bounded refactor of the public `Neuigkeiten` experience and its Decap CMS authoring workflow.

It records:

- verified differences between the retained/current Wix posts and the Astro versions
- the agreed editorial and CMS framework
- staged implementation work
- post-by-post restoration state
- visual and technical acceptance evidence
- decisions that require user confirmation

Normal site operations remain owned by `docs/operational-status.md`. Public-fact confirmation remains owned by `docs/plans/public-data-register.md`. Broader CMS rules remain owned by `docs/plans/content-cms.md`.

## Working State

- Branch: `feature/news-editorial-refactor`
- Started from local `master` at `9db4cf8`
- Started: `2026-04-13`
- Mode: operational maintenance; no historical implementation phase has been reopened
- Writer policy: the parent agent is the only writer in the active worktree
- Advisory policy: one fresh-context, read-only visual/editorial reviewer may challenge the plan; its output is evidence, not authority

## Approved Scope

Included:

- `/neuigkeiten/` index presentation
- `/neuigkeiten/[slug]/` article presentation
- news-post Astro content schema
- Decap `posts` authoring fields and preview experience
- responsive article typography, cover treatment, and galleries
- restoration of verifiable Wix article content and media
- removal of migration/QA prose from public article bodies
- desktop/mobile screenshot comparison
- news-specific documentation and operational handoff

Not included without a later explicit expansion:

- replacing Decap CMS
- redesigning unrelated routes
- changing the global site identity or navigation
- inventing missing source content
- silently confirming legal, financial, contact, or social facts
- publishing commits to GitHub

## Verified Baseline

### Current implementation

- `src/pages/neuigkeiten/index.astro` renders every post as the same two-column `SurfaceCard` and adds artificial `Beitrag N` badges.
- `src/pages/neuigkeiten/[slug].astro` wraps article header, cover, and body in one bordered yellow `SurfaceCard`.
- `src/components/RichText.astro` is only a wrapper; article hierarchy depends on global `.rich-text` styling.
- `public/admin/config.yml` already offers a Markdown body, cover image, category, gallery, dates, and source URL.
- CMS preview is disabled for posts.
- The post `gallery` field is validated by `src/content/config.ts` but is not rendered by the article route.
- Gallery entries contain only an image path, with no dedicated alt text or caption.
- `EditorialImage.astro` always uses `object-cover`; editors cannot select a portrait, wide, or contained presentation.
- The local news index contains eight posts. Several bodies are short migration summaries rather than faithful editorial articles.

### Wix comparison

Comparison completed for:

- Wix and local news indexes
- all eight local post source URLs
- the current Wix-only `Goodies4Tricks 2026` article
- Wix and local `Goodies 4 Tricks 2025` article pages as the primary long-form visual reference
- supplied localhost `Parkausbesserungen` screenshot

Source inspection result:

- Seven of the eight local post URLs currently expose readable article bodies on Wix.
- `spendenaufruf-der-scb-baut-ne-halle` currently returns the Wix shell without readable article content, so its retained `2026-04-10` HTML/PDF evidence remains the source reference.
- `parkausbesserungen` is now fully readable on the live Wix page. Its earlier retained-evidence truncation is no longer a content-recovery blocker.
- The current Wix-only 2026 post is fully readable but its media has not been staged locally.

Verified differences:

- Wix `Goodies 4 Tricks 2025` contains a long multi-paragraph event report; the local version reduces it to three summary paragraphs.
- Local article bodies publicly expose internal phrases such as `retained local evidence`, `Astro-Migration`, `source-observed`, and `qa-pending`.
- Wix uses a distinct editorial header, visual opening, and flowing article body. The local route presents the whole article as a generic UI card.
- The local index explicitly describes itself as deliberately plain and adds numbered post badges, reinforcing a prototype appearance.
- Wix currently shows a newer `Goodies4Tricks 2026 - Erstklassig abgeräumt!` post that is absent locally. Importing it is a separate editorial decision within this refactor, not an automatic migration.
- The live Wix articles confirm that most local bodies are abbreviated evidence summaries rather than source-parity articles. Long-form examples include 13 paragraphs for `Goodies 4 Tricks 2025` and 15 paragraphs for the 2024 rain event before sponsor/sign-off copy.
- The live `Parkausbesserungen` source contains four complete public paragraphs plus its portrait image, allowing its local migration blocker to be resolved during Stage 4.
- The newspaper posts require a contained document-image treatment: their staged assets include portrait page scans rather than ordinary photographic covers.

## Local Visual Evidence

Full-page 1440 × 1000 captures were recorded under the existing ignored Wix-reference area:

- `docs/plans/wix-reference/screenshots/news-editorial-refactor/wix-news-index.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/wix-goodies-4-tricks-2025.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-news-index.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-goodies-4-tricks-2025.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/wix-news-index-phone.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/wix-goodies-4-tricks-2025-phone.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-news-index-phone.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-goodies-4-tricks-2025-phone.png`

The original Chromium CLI phone captures were later found to use Chromium's 500px minimum layout viewport and crop the image to 390px. They were superseded during Stage 3 with CDP device emulation. The corrected local captures report `innerWidth`, `clientWidth`, and `scrollWidth` of 390px with no horizontal overflow. Wix reports a 980px inner layout against a 390px client viewport, confirming that its narrow presentation is itself not a responsive implementation target.

Stage 3 comparison captures:

- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-stage3-news-index.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-stage3-goodies-4-tricks-2025.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-stage3-news-index-phone.png`
- `docs/plans/wix-reference/screenshots/news-editorial-refactor/local-stage3-goodies-4-tricks-2025-phone.png`

These captures are intentionally not tracked by Git, following the repository policy for heavy Wix-reference captures.

## Content Inventory

Status vocabulary for this ledger:

- `full-source-available`: current Wix/local evidence provides enough public article copy for faithful restoration
- `partial-source`: only part of the original article is verified
- `summary-import`: local body is a migration summary and requires restoration/rewrite from verified source
- `sensitive-review`: public facts require the public-data register to remain authoritative
- `visual-media`: multiple staged images exist and should be evaluated for cover/gallery use

| Local post | Local body | Staged post assets | Groundwork status | Required follow-up |
| --- | ---: | ---: | --- | --- |
| `goodies-4-tricks-2025` | 9 paragraphs | 13 | restored, curated cover plus 6 gallery images | Stage 4 complete |
| `graffiti-workshop-ein-voller-erfolg` | 3 paragraphs | 20 plus current homepage asset | restored, curated cover plus 6 gallery images | Stage 4 complete |
| `goodies-4-tricks-event-trotz-regen-ein-erfolg` | 15 paragraphs | 23 | restored, curated cover plus 5 gallery images | Stage 4 complete |
| `spendenaufruf-der-scb-baut-ne-halle` | 14 body blocks | 8 | retained source restored, curated cover plus 3 gallery images, sensitive-review | Stage 4 complete; bank facts remain pending in public-data register |
| `der-contest-in-der-zeitung` | intro, quoted article, local related link | 2 | restored, contained cover plus 1 document image | Stage 4 complete |
| `der-skate-club-in-der-zeitung` | 3 paragraphs | 2 | restored, contained cover plus 1 document image | Stage 4 complete |
| `spende-von-der-volksbank-franken-sued` | 4 paragraphs | 1 | restored, title/slug contradiction preserved, sensitive-review | Stage 4 complete; financial facts remain source-parity claims |
| `parkausbesserungen` | 4 paragraphs | 1 | restored, portrait cover | Stage 4 complete; obsolete migration blocker cleared |
| `goodies4tricks-2026-erstklassig-abgeraeumt` | 14 body blocks | 10 recovered | imported, curated cover plus 5 gallery images | Stage 4 complete |

Asset counts are file counts in each `src/assets/images/wix-staging/posts/<slug>/` directory. They are not yet a gallery-curation decision.

## Editorial Framework Decision

### Keep the current platform

Astro Content Collections and Decap CMS remain appropriate. This refactor improves the model and presentation; it does not replace the CMS.

### Authoring model

Use Markdown as the primary article body. Add structure only where it prevents errors or enables presentation that Markdown alone cannot reliably express.

Required model capabilities:

- title, slug, publication date, excerpt, category, cover, body
- explicit cover alt text
- optional cover caption
- controlled cover presentation suitable for wide, portrait, or contained source media
- gallery entries with image, alt text, and optional caption
- backward-compatible handling of existing post files during migration

Candidate capabilities requiring implementation-time judgment:

- optional article lead separate from excerpt
- featured/latest control for index hierarchy

Publication contract for Stage 2:

- Add an explicit `draft` boolean. Existing posts without the field remain published for compatibility; newly created CMS posts default to draft.
- Draft posts are excluded from public indexes, previews, related lists, and static detail routes.
- Future-dated posts remain hidden from those same public surfaces until their publication timestamp.
- Duplicate slugs fail validation/build deterministically.
- Published slugs are treated as immutable. The CMS must warn editors not to change them after publication; automated slug redirects are outside this bounded refactor.
- Normalize blank optional values written by Decap, including category, updated date, source URL, optional images, and gallery values.

Do not introduce a general-purpose block/page builder unless Markdown plus first-class cover/gallery media proves insufficient.

### Public versus internal metadata

Public body content must not contain migration status, retained-evidence commentary, source-confidence notes, or QA terms.

Internal provenance may remain in:

- `sourceUrl`
- this ledger
- `migration/manifest.json`
- Wix-reference notes/metadata

### Article presentation

The detail route should provide:

1. restrained return/breadcrumb navigation
2. a distinct editorial header
3. date/category metadata subordinate to the title
4. a responsive hero treatment appropriate to source aspect ratio
5. a narrower readable body column
6. deliberate heading, paragraph, list, link, quote, and inline-image typography
7. a responsive captioned gallery when present
8. related articles outside the article body

The article must not be presented as one generic UI card.

### Index presentation

The index should provide:

- a strong page heading without prototype-explaining copy
- the newest publicly eligible post as the automatic lead story; no separate featured override
- consistent editorial image ratios
- a compact secondary story grid/list
- quiet date/category metadata
- no artificial `Beitrag N` labels
- an intentional empty state
- no pagination for the current collection; add pagination before the public archive exceeds 12 posts
- only the lead/LCP cover loaded eagerly; off-screen covers and galleries loaded lazily
- complete keyboard-accessible card/link behavior without nested interactive elements

## Staged Roadmap

### Stage 1 — Groundwork and design contract

- [x] Create the dedicated implementation branch.
- [x] Create this ledger.
- [x] Record current template/CMS deficiencies.
- [x] Capture matching Wix/local desktop references.
- [x] Create the initial post and staged-asset inventory.
- [x] Incorporate the independent read-only reviewer findings.
- [x] Complete source inspection for every Wix post that remains reachable.
- [x] Capture representative phone-width Wix/local references.
- [x] Include the Wix 2026 post and its media in Stage 4, per explicit user approval.
- [x] Decide draft, future-date, duplicate-slug, and slug-change behavior.
- [x] Freeze schema and layout acceptance criteria before Stage 2 mutation.

Exit gate:

- the target authoring model, visual hierarchy, post restoration status, and unresolved user decisions are explicit enough that implementation does not require invention

### Stage 2 — CMS and content model

- [x] Extend the Astro post schema with approved media metadata.
- [x] Update Decap post fields with German labels and misuse-resistant hints.
- [x] Preserve compatibility while existing posts are migrated.
- [x] Normalize blank optional values produced by Decap.
- [x] Implement and test the approved draft/future-date and slug policies.
- [x] Implement a maintained post preview for hierarchy, cover, body, and gallery.
- [x] Add focused publication/slug tests and validate a temporary CMS-shaped blank-optionals fixture.

Exit gate:

- an editor can author the approved article forms, including accessible covers and galleries, without editing code

### Stage 3 — Editorial presentation

- [x] Refactor the news index hierarchy.
- [x] Refactor the article detail hierarchy.
- [x] Implement article-specific rich-text typography.
- [x] Implement responsive cover modes and gallery rendering.
- [x] Make image loading priority contextual rather than globally eager.
- [x] Add an intentional empty state and document the archive/pagination threshold.
- [x] Preserve existing global visual identity without redesigning unrelated routes.
- [x] Capture and inspect desktop and true 390px phone implementation screenshots.

Exit gate:

- index and detail pages meet the visual, responsive, and accessibility criteria with representative short, long, portrait-image, and gallery articles

### Stage 4 — Content restoration

- [x] Restore full verified public copy where source evidence is available.
- [x] Remove all public migration/QA narration.
- [x] Curate cover/gallery media rather than importing every staged file blindly.
- [x] Add accurate alt text and captions.
- [x] Restore `parkausbesserungen` from the now-readable complete live source and clear its obsolete migration blocker.
- [x] Keep financial/public-fact uncertainty in the canonical internal registers.
- [x] Import the explicitly approved 2026 Wix post and its media.

Exit gate:

- every local post has a reviewed public body and media presentation; no internal process language is visible

### Stage 5 — QA and operational handoff

- [ ] Exercise local Decap editing for an existing and a new representative post.
- [ ] Verify generated index/detail pages and image output.
- [ ] Perform keyboard, semantics, image-alt, heading-order, and phone-width checks.
- [ ] Run `bun test`.
- [ ] Run `bun run check`.
- [ ] Run `bun run build`.
- [ ] Record final screenshots and residual exceptions.
- [ ] Update `docs/plans/content-cms.md` with durable product rules clarified by implementation.
- [ ] Update `docs/operational-status.md` with final state and continuation point.

Exit gate:

- the CMS workflow, public rendering, responsive presentation, and repository checks are verified and documented

## Acceptance Criteria

### Editorial quality

- Long articles read as editorial pages rather than oversized cards.
- Short posts remain intentional and do not look broken or padded.
- Portrait, landscape, and document-like images have controlled treatments.
- The index clearly distinguishes the lead story from supporting stories.
- Public copy contains no internal migration or QA vocabulary.

### CMS usability

- Editors can create and update a post without touching code.
- Required image alt text is explicit in the CMS.
- Gallery ordering, alt text, and optional captions are editable.
- Existing content remains readable during schema migration.
- A CMS-shaped post with every optional field blank validates and builds.
- Draft, future-date, duplicate-slug, and slug-change behavior is documented and tested.
- Preview is either representative and maintained or explicitly deferred with a recorded reason; a misleading preview is not acceptable.

### Accessibility and responsive behavior

- One logical `h1` per page and ordered article headings.
- Meaningful images have alt text; decorative images use empty alt text deliberately.
- Links and controls remain keyboard-visible and semantically valid.
- Reading measure and type scale remain comfortable at desktop and phone widths.
- Galleries do not create horizontal overflow or unusable tap targets.

### Verification

- `bun test`, `bun run check`, and `bun run build` pass, except any pre-existing explicitly documented non-blocking warning.
- Generated HTML inspection confirms gallery, metadata, article headings, and related links.
- Before/after desktop and phone-width screenshots are recorded locally.

## Open Decisions

All implementation-policy decisions are resolved:

- The newest eligible post becomes the lead automatically; no `featured` field is added.
- A representative Decap post preview is required for completion because styled authoring is a core goal. If direct style sharing proves technically fragile, implementation must stop and document evidence rather than silently ship a misleading preview.
- Newspaper scans use a contained, caption-capable figure/gallery treatment. No JavaScript lightbox is required initially; the full image may open directly.
- Drafts use an explicit boolean, new CMS posts default to draft, existing omitted values remain published, and future-dated posts stay hidden until publication.
- Published slugs are immutable by policy, duplicate slugs fail deterministically, and automatic redirect management is deferred.

No open decisions remain for Stages 1–2.

The user explicitly approved importing `Goodies4Tricks 2026 - Erstklassig abgeräumt!` and its media during Stage 4. New product or scope choices discovered in later stages must still be surfaced rather than inferred.

## Change Log

- `2026-04-13`: Created branch and ledger; recorded verified Wix/local comparison, initial content/media inventory, framework direction, staged roadmap, and acceptance criteria. Desktop reference screenshots were captured in the ignored Wix-reference area.
- `2026-04-13`: Incorporated the independent read-only review. Added publication-policy, optional-value normalization, image-loading, empty-state, slug-policy, CMS-fixture, and accessibility acceptance requirements. The reviewer run failed at the harness acceptance layer after returning a complete report; no replacement run was launched.
- `2026-04-13`: Completed live source inspection for all eight local posts plus the current Wix-only 2026 post. Captured and visually inspected matching 390 × 844 phone references. The live source now provides the complete `parkausbesserungen` body, removing its earlier recovery blocker. Resolved lead-story, preview, document-image, draft, future-date, duplicate-slug, and slug-mutation policies.
- `2026-04-13`: User explicitly included the Wix-only 2026 post and media in Stage 4, closing Stage 1. Stage 2 then added backward-compatible post draft/cover/gallery metadata, blank optional-value normalization, public filtering for drafts and future timestamps, deterministic duplicate-slug validation, German Decap guidance, and a registered styled post preview. Verification passed with 23 tests, `astro check` with only the six known Zod hints, a full build, browser confirmation that Decap registered the post preview stylesheet/template, and a temporary CMS-shaped blank-optionals fixture that built without generating its future route.
- `2026-04-13`: Stage 3 replaced the uniform prototype cards with an automatic lead story and quieter archive grid, moved detail pages to a dedicated editorial header/reading surface, added article typography, responsive cover modes, ordered captioned galleries, an empty state, and contextual eager/lazy image loading. Desktop and corrected CDP-emulated 390px screenshots were inspected; local pages report no horizontal overflow. A temporary post fixture verified cover metadata, headings, blockquote/list typography, gallery order, alt text, captions, and lazy loading in generated HTML. The clean build was restored after removing the fixture.
- `2026-07-23`: Stage 4 restored reviewed public copy for all eight migrated posts, removed migration/QA narration, supplied explicit cover/gallery alt text and captions, and curated media according to each article form. Newspaper scans now use contained covers, `parkausbesserungen` has its complete live-source body and no migration blocker, and fundraising/bank claims remain source-parity facts governed by `public-data-register.md`. The explicitly approved `Goodies4Tricks 2026` post was imported from its live Wix source with ten recovered Tobias Uschold photos, six of which are used as cover/gallery media. Verification passed with 23 tests, `astro check` with only six known Zod hints, a clean build of all nine post routes, generated-alt inspection, and a scan confirming no internal migration/QA vocabulary under `dist/neuigkeiten/`. Stage 5 QA and operational handoff are next.
