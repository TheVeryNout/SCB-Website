# 2026-04-13 13:01 CEST - Wix Design Correction Pass

Agent: Codex GPT-5

## Pressing Issue

The site had reached a technical release-candidate state, but the visual implementation did not respect the retained Wix reference. The prototype used a cream gradient background, pill navigation, rounded CTA buttons, soft generic cards, and a placeholder SCB mark. The user correctly flagged this as visually far from the Wix source and specifically called out the pill/card look as unacceptable.

The work in this session was a design correction, not a content-model or routing change.

## Reference And Status Review

Before editing, the session checked:

- the latest Git commit, `0e0e184 chore: wrap SCB website release candidate`
- `docs/plans/cold-start.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/wix-reference/README.md`
- `docs/plans/wix-reference/manifest.json`
- `src/assets/images/wix-staging/README.md`
- `src/assets/images/wix-staging/manifest.json`
- retained Wix screenshots, especially `home-full.png` and `ueber-uns-full.png`
- staged Wix image assets under `src/assets/images/wix-staging/`

The audited phase state remained:

- Phases 1 to 7 are complete as a technical release candidate.
- Final launch signoff is still blocked on public-data confirmation.
- This design pass was not blocked by an earlier phase gate, but it did supersede the earlier Phase 4 claim that the visual direction was already satisfactory.

## Design Findings

The retained Wix screenshots show a clear visual language:

- dark charcoal site chrome
- asphalt/noise texture backgrounds
- muted yellow content fields
- rust active navigation color
- squared buttons and panels
- condensed display typography
- the real SCB crest
- a full-width homepage hero using the skeleton skater image
- simple rectangular white post teasers inside yellow sections

The implementation before this pass used a generic modern SaaS visual language instead:

- cream and white gradient background
- pill-shaped nav and buttons
- rounded cards and nested soft surfaces
- generic `SCB` mark
- homepage hero split into text and a separate image/card column

## Implementation

### Global Visual System

Updated `src/styles/global.css` to introduce Wix-reference-aligned tokens:

- `--scb-asphalt`
- `--scb-charcoal`
- `--scb-yellow`
- `--scb-yellow-soft`
- `--scb-rust`
- `--scb-texture`

The global body background now uses the locally staged asphalt texture:

- `src/assets/images/wix-staging/shared/site/dfbc4d_5415700252604e53b99070fb0076183d~mv2.jpg`

Added shared utility classes:

- `.scb-display` for condensed display-style headings
- `.scb-section`
- `.scb-section-dark`
- `.scb-section-texture`

### Shared Components

Updated shared components so downstream routes inherit the corrected design:

- `SiteHeader.astro`
  - replaced placeholder `SCB` pill logo with the real SCB crest
  - switched nav to charcoal background, yellow links, rust active state
  - removed pill-shaped nav treatments

- `SiteFooter.astro`
  - added the real crest
  - switched to a yellow footer block with simple centered contact/social links

- `LinkButton.astro`
  - removed rounded pill styling
  - changed buttons to square bordered blocks
  - aligned solid, outline, and subtle variants with charcoal/yellow reference colors

- `SurfaceCard.astro`
  - removed rounded card treatment and backdrop blur
  - changed surfaces to rectangular yellow, pale yellow, or charcoal panels

- `PageIntro.astro`
  - changed page intros to condensed uppercase title treatment with underline-style eyebrow

- `EditorialImage.astro`
  - removed rounded image frame
  - switched to square image boundaries
  - changed images to eager loading so Playwright visual QA does not capture empty lazy placeholders near the top of pages

### Homepage

Reworked `src/pages/index.astro` around the retained Wix homepage composition:

- full-width photo hero using:
  - `src/assets/images/wix-staging/homepage/site/dfbc4d_d22c6e8ff3f54d19a657aa5fcc53cd91~mv2.png`
- centered yellow `SKATE CLUB BIRICIANA e.V.` display title
- translucent white feature announcement block over the hero
- dark textured follow-up band
- yellow news and CTA panels
- local post cover images inside homepage news teasers
- SCB crest reused in the media CTA

### Route-Wide Cleanup

Applied a mechanical route cleanup to remove the most visible remaining `rounded-*` classes from Astro route/component templates. Route sections now use the yellow section background where they previously inherited the old cream body background.

Files touched by this cleanup include:

- `src/pages/datenschutz.astro`
- `src/pages/impressum.astro`
- `src/pages/kontakt/index.astro`
- `src/pages/mitgliedschaft.astro`
- `src/pages/neuigkeiten/index.astro`
- `src/pages/neuigkeiten/[slug].astro`
- `src/pages/pics-n-vids.astro`
- `src/pages/ueber-uns.astro`
- `src/pages/veranstaltungen/index.astro`
- `src/pages/veranstaltungen/[slug]/[date].astro`
- event UI components under `src/components/events/`

## Verification

Passed:

- `bun run check`
- `bun run build`
- `bun test`
- `git diff --check`

Playwright Chromium screenshots were captured for:

- `/` at desktop width
- `/` at phone width
- `/ueber-uns/` at desktop width
- `/kontakt/` at desktop width

The screenshots confirmed the major design direction changed from generic cream/pills/cards to a closer Wix-derived system. The work should still be treated as a first correction pass, not a finished visual polish pass.

## Compromises And Remaining Work

This pass intentionally avoided manually inspecting every downloaded image because the asset archive is broad and generically named. Instead, it used:

- the asset staging manifest
- known route groupings under `src/assets/images/wix-staging/`
- retained screenshots
- selected direct image checks for the crest, asphalt texture, and homepage hero

Remaining design work:

- compare each implemented route against its retained Wix screenshot
- tune mobile hero scale and vertical rhythm
- decide whether route pages such as `/ueber-uns/` should more closely reproduce the Wix dark-top/yellow-body section split
- refine typography beyond system fallbacks if a local or safe webfont decision is made
- audit all remaining slate/amber utility classes and replace them where they still fight the Wix palette
- perform a route-by-route visual QA pass before calling the design correction fully reviewed

## Backend Or Data Changes

None.

No database, schema, event logic, CMS model, Netlify config, redirect rule, or content semantics changed in this pass.

## Important References

- `AGENTS.md`
- `README.md`
- `docs/plans/cold-start.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/wix-reference/README.md`
- `docs/plans/wix-reference/manifest.json`
- `src/assets/images/wix-staging/README.md`
- `src/assets/images/wix-staging/manifest.json`
- retained screenshots under `docs/plans/wix-reference/screenshots/`
