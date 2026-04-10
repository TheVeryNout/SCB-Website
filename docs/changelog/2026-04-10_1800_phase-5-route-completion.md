# 2026-04-10 1800 phase 5 route completion

## Scope

This changelog records the previously undocumented work completed in this session to finish Phase 5 route implementation and close the remaining launch-route backlog.

It covers:

- singleton route completion for about membership contact and contact thank-you
- legal route completion for impressum and datenschutz
- final collection route completion for news index news detail and media
- route-ledger updates that move the repo from Phase 5 active to Phase 6 active

## Why this work was needed

- Phase 5 was still open even though the shared shell content model event engine and legal source evidence were already sufficient
- the public site still lacked a complete launch route set
- homepage news previews were not yet connected to real post routes
- datenschutz had been left as a placeholder even though the retained local HTML and PDF evidence already contained the full source text

## What changed

### Singleton routes

- added `src/pages/ueber-uns.astro`
- added `src/pages/mitgliedschaft.astro`
- added `src/pages/kontakt/index.astro`
- added `src/pages/kontakt/danke.astro`

These routes now render from canonical page singletons and shared settings instead of placeholder or missing route state.

### Legal routes

- added `src/pages/impressum.astro`
- added `src/pages/datenschutz.astro`
- replaced placeholder legal content in `src/content/pages/impressum.md`
- replaced placeholder legal content in `src/content/pages/datenschutz.md`

The legal pages now render from canonical content entries populated from the retained local Wix HTML and PDF evidence rather than reopening live Wix or leaving the routes absent.

### News and media routes

- added `src/pages/neuigkeiten/index.astro`
- added `src/pages/neuigkeiten/[slug].astro`
- added `src/pages/pics-n-vids.astro`
- updated `src/pages/index.astro` so homepage latest-news cards link to real post routes

The site now has a complete launch news and media route layer:

- reverse chronological news index
- static post detail pages from Astro content
- lightweight media page from the media collection

### Control docs

- updated `docs/plans/execution-plan.md`
- updated `docs/plans/status-checklist.md`
- updated `README.md`

The repo docs now reflect the actual current state:

- Phase 5 complete
- Phase 6 active
- no remaining Phase 5 route backlog

## Verification

Verified in this session with:

- `bun test`
- `bun run check`
- `bun run build`

Manual mobile-width verification was also run with Bun preview plus Playwright Chromium screenshots for:

- `/ueber-uns/`
- `/mitgliedschaft/`
- `/kontakt/`
- `/impressum/`
- `/datenschutz/`
- `/neuigkeiten/`
- `/neuigkeiten/spendenaufruf-der-scb-baut-ne-halle/`
- `/pics-n-vids/`

Notes:

- Playwright mobile presets currently default to WebKit but the local environment had Chromium available, so explicit Chromium viewport checks were used
- preview bound to `127.0.0.1:4323` when `4322` was already occupied and that behavior is now recorded in the ledger

## Result

- every launch route required by Phase 5 now exists and builds
- the route layer is connected end to end instead of leaving homepage previews and nav targets pointing at missing pages
- the repo is ready to continue with Phase 6 content and asset migration instead of reopening route implementation

## Changed files

- `README.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `src/content/pages/impressum.md`
- `src/content/pages/datenschutz.md`
- `src/pages/index.astro`
- `src/pages/ueber-uns.astro`
- `src/pages/mitgliedschaft.astro`
- `src/pages/kontakt/index.astro`
- `src/pages/kontakt/danke.astro`
- `src/pages/impressum.astro`
- `src/pages/datenschutz.astro`
- `src/pages/neuigkeiten/index.astro`
- `src/pages/neuigkeiten/[slug].astro`
- `src/pages/pics-n-vids.astro`
