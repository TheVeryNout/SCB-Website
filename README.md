# SCB Website

Public Astro website for Skate Club Biriciana e.V.

The rebuild from Wix is complete. The site is deployed, and the Decap CMS is running. Treat this repository as an operational website codebase by default, not as an active phase-gated implementation project.

## Start Here

Agents: start with [AGENTS.md](AGENTS.md). Open work is tracked as tickets under `.scratch/` (see [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)); unsorted items are in `.scratch/inbox/issues/`.

For normal maintenance, content/CMS support, QA fixes, or small follow-up work, read the relevant ticket and the directly relevant source files.

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
- Decap CMS with invite-only Netlify Identity accounts and Git Gateway
- Contact form by email: a Netlify Function sends messages through the club mailbox (`docs/plans/implementation.md`)
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

- public-data review remains open in `docs/plans/public-data-register.md` (ticket `.scratch/inbox/issues/03-public-data-review.md`)
- `parkausbesserungen` is fully restored from the recovered live Wix body; `migration/manifest.json` records the cleared blocker
- `bun run check` passes with 0 errors, warnings and hints
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

- deployed: editors use individual, invite-only Netlify Identity email/password accounts; Git Gateway commits their changes to the connected repository's `master` branch
- local: Decap switches to a local proxy backend at `http://127.0.0.1:4335/api/v1`

Deployed setup requirements:

- enable Netlify Identity for the site
- set Identity registration to **Invite only**
- enable Git Gateway and leave its Roles restriction empty unless an editor role policy is introduced deliberately
- invite each editor from the Netlify Identity user-management screen
- invitation and password-recovery links are routed to `/admin/`, where the current Identity callback handler provides the German password form

Account distinction:

- a Netlify team/platform account manages deployments and settings; signing into that dashboard with Google does not create or verify a CMS editor account
- a CMS editor is a separate, site-scoped Netlify Identity user and logs into `/admin/` with the email address and password established through the invitation flow
- editors should not reuse or enter their Google account password as the CMS password
- if an old Identity user is stuck as unverified, resend its invitation when available; otherwise remove that stale Identity record and invite the address again before any editorial work is tied to it

Local notes:

- open `/admin/` on the local Astro URL, usually `http://localhost:4321/admin/`
- run `bun run dev:cms`, or run `bun run cms:proxy` alongside an existing Astro server; both commands start the local CMS proxy on port `4335`, and Astro alone is insufficient for local CMS access
- the proxy server is for local development only and is intentionally unauthenticated
- `local_backend` only activates on localhost when the proxy is reachable; production continues to publish through Identity and Git Gateway
- local CMS publishing writes to the local Git working tree; it does not call Netlify

## Legacy Reference

The old phase docs are retained because they still explain how the site was built, what evidence was used, and which source contradictions were intentionally preserved. They should not drive normal startup anymore.

[docs/operational-status.md](/home/nout/REPO/SCB-Website/docs/operational-status.md) was the running file until 2026-11-05; it is now history. Ongoing work lives in `.scratch/` tickets.
