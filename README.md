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
10. [parallel-agent-environment.md](/home/nout/REPO/SCB-Website/docs/plans/parallel-agent-environment.md)

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

Content collections, route implementation, and migration work still remain.

## Parallel Agent Runtime Pack

A concrete multi-agent runtime pack now exists at `.codex/agents/` with:

- orchestrator and specialized worker agent profiles
- shard/task board template for parallel runs
- explicit merge checkpoints and dependency handling

Use this folder when delegating work in parallel instead of running a single monolithic agent turn.
