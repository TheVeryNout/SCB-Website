# SCB Website Docs

This repo is the documentation and implementation planning base for rebuilding the public Skate Club Biriciana e.V. website from Wix to Astro SSG.

## Read Order

For a cold start, read in this order:

1. [cold-start.md](/home/nout/REPO/SCB-Website/docs/plans/cold-start.md)
2. [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
3. [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md)
4. [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md)
5. [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
6. [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md)
7. [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)
8. [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
9. [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md)
10. [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md)
11. [status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md)
12. [parallel-agent-environment.md](/home/nout/REPO/SCB-Website/docs/plans/parallel-agent-environment.md)

## Doc Roles

- [cold-start.md](/home/nout/REPO/SCB-Website/docs/plans/cold-start.md): cold-start index, priority framing, locked decisions, and implementation sequence
- [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md): top-level product intent, constraints, priorities, and locked decisions
- [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md): source-site audit, route inventory, source quirks, assets, and historical planning notes
- [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md): final public routes, page scope, and preserve/simplify/drop decisions
- [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md): canonical event/calendar behavior and schema semantics
- [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md): content model and Decap CMS ownership rules
- [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md): risky public facts and confirmation status
- [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md): Astro/Netlify/Decap technical architecture
- [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md): Wix-to-Astro migration workflow, manifest, and QA rules
- [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md): phase-gated delivery plan, checklist discipline, and multi-conversation handoff rules
- [status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md): audited checklist state, open exceptions, and required next-resume starting point
- [parallel-agent-environment.md](/home/nout/REPO/SCB-Website/docs/plans/parallel-agent-environment.md): multi-agent orchestration, concurrency safety, observability, and security guardrails

## Current Direction

Locked baseline:

- Astro SSG
- `bun`
- Netlify-first deployment
- Decap CMS
- Netlify Identity + Git Gateway for Decap auth/backend
- Netlify Forms for launch contact handling
- static-first architecture
- mobile-first public website
- no launch dependency on `SCB-Dash`
- no pricing subsystem

## Current Status

All active planning docs now live under `docs/plans/`.

The documentation stack is split by responsibility so later implementation work does not need to infer architecture or scope from the source audit.

Use [cold-start.md](/home/nout/REPO/SCB-Website/docs/plans/cold-start.md) first before diving into the deeper specs.

Foundation scaffolding is now in place in this repo:

- Astro project bootstrap
- Tailwind 4 baseline
- Bun-managed package/scripts setup
- Decap CMS admin shell at `/admin/`
- Playwright CLI available for live Wix reference capture
- lightweight Wix reference metadata under `docs/plans/wix-reference/`, with heavy local captures kept outside normal git tracking
- automated Wix asset downloader via `bun run capture:wix-assets`
- raw downloaded Wix media archived under `docs/plans/wix-reference/asset-source-archive/`
- Astro-facing staged Wix asset tree under `src/assets/images/wix-staging/` via `bun run stage:wix-assets`

Content collections are now real, Phase 6 migration is signoff-clean, and Phase 7 technical release-candidate hardening has been completed:

- canonical `migration/manifest.json` now exists
- retained news feed inventory has been migrated into the posts collection
- local media gallery entries now exist alongside external video references
- homepage and retained static-page copy have been reconciled against the local evidence pack
- the retained event evidence has been reconciled into the canonical Astro event content without over-trusting the Wix slug or implying unsupported recurrence
- `netlify.toml` now defines the Bun build, `dist` publish directory, baseline headers, canonical-domain redirects, and high-confidence legacy Wix route redirects
- Phase 7 QA passed for build/check/test, phone-width screenshots, contact form shape, downloads, external links, `/admin/`, and the verified event occurrence route
- final launch signoff still needs user review of the public-data conflicts recorded in `public-data-register.md`

The docs are now split into:

- normative specs that define what must be built
- one execution plan that defines the order, gates, and checklists for building it cleanly across multiple conversations
- one audited status checklist that records what has actually been checked and what is still open

Use [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) as the controlling work plan once the core specs have been read.

Use [status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md) immediately after that so the next conversation starts from recorded state instead of inference.

Current phase status from the audited ledger:

- Phases 1 to 7 are cleared as a technical release candidate
- final launch signoff remains blocked on explicit public-fact confirmation, especially canonical YouTube and donation/bank details if fundraising content stays live

## Minimal Resume Prompt

This repo is supposed to support low-friction continuation.

Once the planning stack and `AGENTS.md` are in place, a new conversation should normally only need a short prompt such as:

- `Resume from the current committed state and continue the next slice recorded in docs/plans/status-checklist.md`
- `Resume from the current committed state and resolve the launch-signoff public facts recorded in docs/plans/status-checklist.md`

Do not rely on the user to keep re-pasting the same startup, evidence, asset, or handoff rules if those rules are already documented in the repo.

If a future agent feels the need to repeat stable rule boilerplate in chat, that is a sign the missing rule should be added to the committed docs instead.

## Local CMS Workflow

The CMS is configured for two environments:

- deployed: Decap uses Netlify Identity + Git Gateway against the `master` branch
- local: Decap switches to a local proxy backend at `http://127.0.0.1:8081/api/v1`

Useful commands:

- `bun run dev`: Astro dev server only
- `bun run cms:proxy`: local Decap proxy server only
- `bun run dev:cms`: Astro dev server and Decap proxy together

Local CMS notes:

- open the `/admin/` route on whatever local Astro URL the dev server prints, usually `http://localhost:4321/admin/`
- the proxy server is for local development only and is intentionally unauthenticated
- `local_backend` only activates on localhost, so production still uses Git Gateway
- local CMS publishing writes to your local Git repo and working tree; it does not call Netlify

## Parallel Agent Runtime Pack

A concrete multi-agent runtime pack now exists at `.codex/agents/` with:

- orchestrator and specialized worker agent profiles
- shard/task board template for parallel runs
- explicit merge checkpoints and dependency handling

Use this folder when delegating work in parallel instead of running a single monolithic agent turn.
