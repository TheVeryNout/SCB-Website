# Operational Copy And Startup Docs

## Metadata

- Date: 2026-04-13 16:52 CEST
- Agent: Codex GPT-5
- Scope: Operational maintenance after deployment
- Related prior changelog: `docs/changelog/2026-04-13_1558_operational-doc-state-reset.md`

## Pressing Issues

Two operational problems were handled in this session.

First, the deployed German site still showed migrated ASCII transliterations in user-facing copy, such as `fuer`, `ueber`, `oeffentlich`, and `Weissenburg`. This was not an encoding problem. The source content itself contained those ASCII spellings.

Second, even after the previous documentation reset, the repo still encouraged future agents to read the full historical implementation phase stack at startup. That cost unnecessary context during simple post-launch maintenance tasks.

## Analysis

For the German-copy issue, the source scan showed that the problem was spread across:

- Markdown content entries under `src/content`
- Astro route and component literals under `src/pages` and `src/components`
- Decap CMS editor labels and hints in `public/admin/config.yml`

The important constraint was to avoid naive global replacement. Route paths, slugs, source URLs, file paths, and external query URLs needed to remain ASCII-safe. For example, `/ueber-uns/` remains the canonical route even though the visible navigation label is now `Über uns`.

For the startup-doc issue, the latest commit already reframed the site as deployed and operational, but several documents still contradicted that by telling future sessions to start from `cold-start.md`, `execution-plan.md`, and `status-checklist.md`. The fix needed to keep historical phase evidence available without making it the default startup path.

## Changes Made

### German Copy Cleanup

Updated user-facing German copy across content, route literals, component labels, and CMS editor labels.

Examples of normalized text:

- `Uber uns` to `Über uns`
- `Ueber uns` to `Über uns`
- `fuer` to `für`
- `oeffentlich` to `öffentlich`
- `Weissenburg` to `Weißenburg`
- `Rueckblick` to `Rückblick`
- `Naechste Termine` to `Nächste Termine`
- `Zuletzt geprueft` to `Zuletzt geprüft`

Files touched included:

- `public/admin/config.yml`
- `src/components/SiteHeader.astro`
- `src/components/events/EventCtaBlock.astro`
- `src/components/events/EventLocationBlock.astro`
- `src/components/events/EventMonthOverview.astro`
- `src/components/events/EventStatusBadge.astro`
- `src/components/events/UpcomingEventsList.astro`
- `src/content/events/sunday-funday.md`
- `src/content/homepage/home.md`
- `src/content/media/graffiti-workshop-2025.md`
- `src/content/media/rollkind-videos.md`
- `src/content/pages/about.md`
- `src/content/pages/contact.md`
- `src/content/pages/datenschutz.md`
- `src/content/pages/impressum.md`
- `src/content/pages/membership.md`
- `src/content/posts/*.md`
- `src/content/settings/site-settings.md`
- `src/pages/**/*.astro`

### Safety Boundaries

Machine-facing strings were intentionally preserved where changing them would risk routing, source traceability, or external links.

Examples intentionally kept ASCII-safe:

- `/ueber-uns/`
- post slugs such as `spende-von-der-volksbank-franken-sued`
- file paths under `src/assets/images/wix-staging`
- retained Wix `sourceUrl` values
- Google Maps query URLs using `Weissenburg`
- CMS field names and enum values

An intermediate replacement briefly changed the header route to `/über-uns/`; this was caught in diff review and corrected back to `/ueber-uns/` while keeping the visible label `Über uns`.

### Operational Startup Docs

Added a lightweight running file:

- `docs/operational-status.md`

This file now owns normal ongoing status, open operational items, recent operational work, and the handoff rule for future maintenance sessions.

Updated these docs so normal startup no longer requires reading the historical phase stack:

- `README.md`
- `AGENTS.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/website-foundation.md`

The new default startup path is:

1. `README.md`
2. `docs/operational-status.md`
3. directly relevant source files

Historical docs under `docs/plans/` are now explicitly reference-only unless the task touches migration evidence, source parity, public-data confirmation, calendar semantics, CMS schema, redirects, deployment architecture, asset policy, or phase-history auditing.

## Verification

Verification run after the German-copy cleanup:

- `bun test` passed
- `bun run check` passed
- `bun run build` passed

Known non-blocking result:

- `bun run check` still reports only the existing Zod deprecation hints from `src/content/config.ts`

Verification after the documentation cleanup:

- `git diff --check` passed
- README and `docs/operational-status.md` were manually inspected
- follow-up search confirmed that the main default-startup references no longer instruct normal sessions to start from the old phase stack

## Compromises

The old phase docs were not deleted. They remain useful as historical evidence and reference specs, especially for migration and public-data questions.

The repo now has both `docs/changelog/` from prior sessions and `docs/changelogs/` for this wrap-up because `.codex/commands/changelogger.md` explicitly requested `docs/changelogs/`. Existing changelogs were not modified.

## Next Continuation Point

Future operational sessions should start from `docs/operational-status.md` and the specific task at hand.

The remaining open items are:

- review deployed German copy for any missed user-facing ASCII transliterations
- review public-data conflicts in `docs/plans/public-data-register.md` when the user wants to settle YouTube or donation details
- keep `parkausbesserungen` limited unless better source evidence is recovered
