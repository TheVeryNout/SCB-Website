# 2026-04-10 1850 phase 6 migration batch

## Scope

This changelog records the first substantive Phase 6 migration session completed in this conversation.

It covers:

- creation of the canonical migration manifest
- retained news feed backfill into real post entries
- local media gallery migration from retained evidence and staged assets
- targeted cleanup of avoidable Wix production links
- route and ledger updates that keep Phase 6 active but move part of the checklist forward

## Why this work was needed

- Phase 6 was active but the repo still had no `migration/manifest.json`
- the retained local `blog-feed.xml` listed more posts than the Astro content collection actually contained
- the media collection could represent local curated galleries but the route still only behaved like a video-link surface
- some migrated content still pointed users back to Wix even where a local route already existed

## What changed

### Migration tracking

- added `migration/manifest.json`

The repo now has a canonical Phase 6 migration tracker that records touched pages posts media items PDFs local assets open QA notes and explicit source contradictions.

### News migration

- added `src/content/posts/graffiti-workshop-ein-voller-erfolg.md`
- added `src/content/posts/spende-von-der-volksbank-franken-sued.md`
- added `src/content/posts/der-contest-in-der-zeitung.md`
- added `src/content/posts/goodies-4-tricks-event-trotz-regen-ein-erfolg.md`
- added `src/content/posts/der-skate-club-in-der-zeitung.md`
- added `src/content/posts/parkausbesserungen.md`
- updated `src/content/posts/spendenaufruf-der-scb-baut-ne-halle.md`
- updated `src/content/posts/goodies-4-tricks-2025.md`

The posts collection now covers the full retained feed inventory with preserved publication dates source URLs and local cover images from the staged asset tree.

Important migration rule preserved in code and manifest:

- `spende-von-der-volksbank-franken-sued` keeps the source-slug naming by explicit user instruction even though the visible retained title names VR Bayern Mitte
- `parkausbesserungen` was migrated conservatively because the retained evidence after the first complete sentence is truncated

### Homepage and media migration

- updated `src/content/homepage/home.md`
- added `src/content/media/graffiti-workshop-2025.md`
- added `src/content/media/goodies-4-tricks-2024.md`
- updated `src/pages/pics-n-vids.astro`

The homepage featured announcement now uses tighter source-parity fundraising copy.

The media collection now contains:

- one external video destination entry
- two local photo-gallery entries backed by retained post evidence and staged local images

The media route now separates video links from photo galleries instead of treating every media entry like an outbound video card.

### Avoidable Wix dependency cleanup

- updated `src/content/pages/impressum.md`

The migrated legal content no longer points readers back to the Wix `/kontakt` route when the local `/kontakt/` route already exists.

### Project docs

- updated `README.md`
- updated `docs/plans/execution-plan.md`
- updated `docs/plans/status-checklist.md`

The repo documentation now reflects that:

- `migration/manifest.json` exists
- Phase 6 has started materially
- news migration is no longer the main Phase 6 backlog
- homepage static-page parity and event migration still keep Phase 6 open

## Verification

Verified in this session with:

- `bun run check`
- `bun run build`

Manual phone-width verification was also run with Bun preview plus Playwright Chromium screenshots for:

- `/`
- `/neuigkeiten/`
- `/neuigkeiten/graffiti-workshop-ein-voller-erfolg/`
- `/pics-n-vids/`

Notes:

- Astro check still reports only the existing non-blocking Zod deprecation hints from `src/content/config.ts`
- the verification screenshots were generated locally for this session and the committed source of truth remains the status ledger

## Result

- Phase 6 now has a real canonical manifest instead of an implied future workspace
- the retained Wix news backlog has been migrated into canonical Astro content
- local curated media galleries are now represented in the real media collection and route
- one avoidable Wix production dependency was removed from migrated content
- Phase 6 remains open because homepage parity static-page parity and fuller event migration still need completion and QA

## Changed files

- `README.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `migration/manifest.json`
- `src/content/homepage/home.md`
- `src/content/media/goodies-4-tricks-2024.md`
- `src/content/media/graffiti-workshop-2025.md`
- `src/content/pages/impressum.md`
- `src/content/posts/der-contest-in-der-zeitung.md`
- `src/content/posts/der-skate-club-in-der-zeitung.md`
- `src/content/posts/goodies-4-tricks-2025.md`
- `src/content/posts/goodies-4-tricks-event-trotz-regen-ein-erfolg.md`
- `src/content/posts/graffiti-workshop-ein-voller-erfolg.md`
- `src/content/posts/parkausbesserungen.md`
- `src/content/posts/spende-von-der-volksbank-franken-sued.md`
- `src/content/posts/spendenaufruf-der-scb-baut-ne-halle.md`
- `src/pages/pics-n-vids.astro`
