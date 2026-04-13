# SCB Website Operational Status

## Purpose

This is the lightweight running file for ongoing work after the Astro site was deployed and the CMS was confirmed running.

Use it for normal maintenance, content/CMS support, QA fixes, and small follow-up work.

The older phase docs under `docs/plans/` are historical implementation records and reference specs. Do not read them at session start unless the task actually touches migration evidence, source parity, public-data confirmation, calendar semantics, CMS schema, redirects, or a larger architectural change.

## Current Baseline

- Site state: deployed
- CMS state: running
- Date recorded: `2026-04-13`
- Implementation phase state: historical Phases 1 to 7 are complete; no active implementation phase remains open
- Default work mode: operational maintenance from the deployed baseline

## Normal Start For Future Sessions

For most operational tasks, read only:

1. `README.md`
2. this file
3. the directly relevant source files

Only open phase/history docs when the task needs them:

- `docs/plans/public-data-register.md` for risky public facts such as donation/bank details or canonical social links
- `docs/plans/migration.md` and `migration/manifest.json` for late migration recovery or source-parity questions
- `docs/plans/wix-reference/README.md` and `docs/plans/wix-reference/manifest.json` when local Wix evidence is actually needed
- `docs/plans/content-cms.md` for CMS ownership/model changes
- `docs/plans/calendar.md` for event recurrence or calendar behavior changes
- `docs/plans/implementation.md` for architecture, hosting, build, or deployment behavior changes
- `docs/plans/execution-plan.md` and `docs/plans/status-checklist.md` only if someone intentionally reopens or audits historical phase state

## Open Operational Items

- Public-data review remains open in `docs/plans/public-data-register.md`, especially canonical YouTube and donation/bank details if fundraising content stays live.
- `parkausbesserungen` remains limited by truncated retained evidence in `migration/manifest.json`.
- `bun run check` still reports only non-blocking Zod deprecation hints from `src/content/config.ts`.
- The German-copy cleanup should be reviewed after deployment to catch any remaining user-facing ASCII transliterations.

## Recent Operational Work

- `2026-04-13`: German-copy cleanup replaced public-facing ASCII transliterations such as `fuer`, `ueber`, `oeffentlich`, and `Weissenburg` with proper German characters across content, route/component copy, and Decap editor labels. Machine-facing route paths, slugs, source URLs, file paths, and external query URLs were intentionally kept ASCII-safe. Verification passed with `bun test`, `bun run check`, and `bun run build`; `bun run check` still showed only the known Zod deprecation hints.
- `2026-04-13`: Startup documentation was reset for post-launch operations. `README.md` and `AGENTS.md` now make `docs/operational-status.md` the normal running file and keep the old phase stack as historical/reference material unless a task explicitly needs migration, evidence, public-data, schema, event, redirect, deployment, or phase-history context. `docs/plans/status-checklist.md` was updated to stop presenting its phase start rule as the default operational start path.

## Handoff Rule

At the end of substantial operational work, update this file with:

- what changed
- what was verified
- any new blocker or review item
- the next concrete continuation point

Update the older phase ledgers only when a task actually changes historical phase state or reopens an implementation/migration gate.
