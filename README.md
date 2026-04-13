# SCB Website

Public Astro website for Skate Club Biriciana e.V.

The rebuild from Wix is complete. The site is deployed, and the Decap CMS is running. Treat this repository as an operational website codebase by default, not as an active phase-gated implementation project.

## Start Here

For normal maintenance, content/CMS support, QA fixes, or small follow-up work, read:

1. [docs/operational-status.md](/home/nout/REPO/SCB-Website/docs/operational-status.md)
2. the directly relevant source files

Do not read the old phase stack at session start unless the task actually needs it.

Use the older planning docs only as reference:

- [docs/plans/public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md): risky public facts such as donation/bank details or canonical social links
- [docs/plans/content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md): CMS/content ownership and schema changes
- [docs/plans/calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md): event recurrence and calendar behavior
- [docs/plans/implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md): architecture, hosting, build, and deployment details
- [docs/plans/migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md) and [migration/manifest.json](/home/nout/REPO/SCB-Website/migration/manifest.json): late migration recovery or source-parity questions
- [docs/plans/wix-reference/README.md](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/README.md): local Wix evidence pack metadata
- [docs/plans/execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) and [docs/plans/status-checklist.md](/home/nout/REPO/SCB-Website/docs/plans/status-checklist.md): historical implementation phase ledgers only

## Current Baseline

- Astro SSG
- Bun
- Netlify deployment
- Decap CMS with GitHub backend via Netlify OAuth
- Netlify Forms contact flow
- Static-first public site
- No launch dependency on `SCB-Dash`
- No pricing subsystem

Implemented public routes:

- `/`
- `/neuigkeiten/`
- `/neuigkeiten/[slug]/`
- `/ueber-uns/`
- `/pics-n-vids/`
- `/veranstaltungen/`
- `/veranstaltungen/[slug]/[date]/`
- `/mitgliedschaft/`
- `/kontakt/`
- `/kontakt/danke/`
- `/impressum/`
- `/datenschutz/`
- `/admin/`

Current operational notes:

- public-data review remains open in `docs/plans/public-data-register.md`
- `parkausbesserungen` remains limited by truncated retained evidence in `migration/manifest.json`
- `bun run check` currently passes with only known non-blocking Zod deprecation hints
- route paths and slugs intentionally stay ASCII-safe, for example `/ueber-uns/`, even when visible German copy uses `Über uns`

## Commands

Install dependencies:

```bash
bun install
```

Run the site locally:

```bash
bun run dev
```

Run the local CMS proxy:

```bash
bun run cms:proxy
```

Run Astro and the CMS proxy together:

```bash
bun run dev:cms
```

Verify changes:

```bash
bun test
bun run check
bun run build
```

## Local CMS Workflow

The CMS is configured for two environments:

- deployed: Decap uses the GitHub backend against `TheVeryNout/SCB-Website` on the `master` branch
- local: Decap switches to a local proxy backend at `http://127.0.0.1:8081/api/v1`

Local notes:

- open `/admin/` on the local Astro URL, usually `http://localhost:4321/admin/`
- the proxy server is for local development only and is intentionally unauthenticated
- `local_backend` only activates on localhost, so production still uses GitHub OAuth-backed repo publishing
- local CMS publishing writes to the local Git working tree; it does not call Netlify

## Legacy Reference

The old phase docs are retained because they still explain how the site was built, what evidence was used, and which source contradictions were intentionally preserved. They should not drive normal startup anymore.

Use [docs/operational-status.md](/home/nout/REPO/SCB-Website/docs/operational-status.md) as the running file for ongoing work.
