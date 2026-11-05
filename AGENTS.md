---
standard: coding-v1
updated: 2026-11-05
---
# SCB Website agent guide

General workflow: the coding profile. This file adds only what is special about this repo.
What the project is and how to run it: [README.md](README.md).

## Checks before calling work done
- `bun test`
- `bun run check`: 0 errors expected; the 8 Zod deprecation hints in `src/content/config.ts` are known (inbox ticket 05)
- `bun run build`
- UI changes: check in the browser at desktop (about 1440px) and phone width (390px), with no horizontal overflow. Gallery or lightbox changes: also open the PhotoSwipe viewer.
- CMS changes (`public/admin/`, `src/content/config.ts`): also open the local Decap editor through the proxy on port 4325 and save/reopen an entry.

## Hard limits
- The user owns the local dev and CMS servers (`bun run dev`, `bun run dev:cms`, `astro dev`, `decap-server`). Use the running one. If a check really needs its own server: check the port first, use a stated alternate port, and stop it in the same turn. Never leave one running.
- A stale localhost (new content or dependency not picked up) is a dev-server state issue to report, not a reason to start more servers.
- Never import app or content assets from `docs/plans/wix-reference/asset-source-archive/`; it is provenance only.
- Do not prune or reorganise `src/assets/images/wix-staging/` because current code uses fewer files. That needs a recorded asset-curation decision first.
- Never present a fact as confirmed when `docs/plans/public-data-register.md` lists it as unconfirmed (bank details, donation claims, social links).

## Differences from the standard workflow
- The main branch is `master`, not `main`.
- CMS editors publish through Netlify Identity and Git Gateway straight to `master` on GitHub. `master` can move without you: fetch before merging or comparing.
- Netlify builds and deploys from GitHub `master`. A push to the NAS does not deploy; a push to GitHub does, and needs the user to name GitHub for that push.
- Existing branches use `feature/<name>`; they keep their names. New work follows the profile (`feat/`, `fix/quick-fixes`).

## Risky areas
A change here counts as big:
- `src/content/config.ts` (content schema, shared by every page and the CMS)
- `public/admin/` (Decap config and preview) and `src/pages/admin/index.astro` (Identity/Git Gateway login and invite flow)
- calendar recurrence logic in `src/lib/events/` (rules in `docs/plans/calendar.md`)
- `netlify.toml` (redirects, headers, build)
- shared layout, navigation and gallery components used by several routes

## Where the docs are
| Before / when | Read |
|---|---|
| Changing public facts (bank, donations, social links) | `docs/plans/public-data-register.md` |
| CMS ownership, collections, fields | `docs/plans/content-cms.md` |
| Event recurrence or calendar behaviour | `docs/plans/calendar.md` |
| Architecture, hosting, build, deploy | `docs/plans/implementation.md` |
| Routes and page scope | `docs/plans/routes-and-pages.md` |
| Late migration recovery or Wix source parity | `docs/plans/migration.md`, `migration/manifest.json`, `docs/plans/wix-reference/README.md` |
| Staged Wix assets | `src/assets/images/wix-staging/README.md` |
| Phase history of the 2026 build (only if a task reopens it) | `docs/plans/execution-plan.md`, `docs/plans/status-checklist.md` |
| Earlier work log and feature ledgers | `docs/operational-status.md`, `docs/plans/news-editorial-refactor.md`, `docs/plans/media-cms-overhaul.md` (history) |

Domain specs win on product behaviour and content meaning. If code and a spec disagree, say so; do not pick one silently.

## Domain terms and gotchas
- Visible German copy uses real umlauts (`Über uns`); route paths and slugs stay ASCII (`/ueber-uns/`).
- Event pages are generated per occurrence (`/veranstaltungen/[slug]/[date]/`); overviews group occurrences by event slug. Only weekly recurrence is supported.
- Decap writes empty strings for blank optional fields; the schema normalises them. Keep that in mind when adding fields.
- Decap's stock media library is single-select even with `multiple: true`.
- `.codex/` holds the old Codex agent setup from the 2026 build; it is not used.

## Agent skills

### Issue tracker

Local markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical labels, unchanged, plus `claimed`, `resolved` and `superseded`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root and `docs/adr/`, created when first needed. See `docs/agents/domain.md`.
