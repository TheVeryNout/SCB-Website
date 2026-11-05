# 01: Onboard to coding-v1

Status: resolved
Blocked by: None
Spec: [Repo standard](../spec.md)
Created: 2026-11-05
Claimed by: EVA-01 Claude Code session
Claimed at: 2026-11-05

## Decisions

- Onboarding, not alignment: the repo had no ticket system.
- `feature/media-page-refresh` merged into `master` first (owner's call), so its doc edits land before the standard work.
- `docs/operational-status.md` becomes history; its open items became inbox tickets 01–09. The visual reviews are grouped in one ticket (06); triage may split them.
- History markers on the phase ledgers, feature ledgers, both changelog folders, the Codex task board and the status file. Current domain specs (calendar, content-cms, routes-and-pages, public-data-register, implementation, migration, website-foundation) stay unmarked.
- `master` stays the main branch: Git Gateway and Netlify depend on it.
- `.codex/` stays; it holds no copies of shared skills.
- Existing branches keep `feature/` names; new work uses the profile's names.

## Current state

Onboarding complete on `chore/repo-standard`; AGENTS.md carries `standard: coding-v1`. Owner approved the full change list on 2026-11-05.

Checked: `bun test` 39/39, `bun run check` 0 errors (8 known Zod hints), `bun run build` 104 pages, all on the merged `master` before the doc work; `git diff --check`; Markdown links in all new and changed files resolve. Path mentions that do not resolve are only in unchanged history bodies, plus `docs/adr` and `.scratch/media-cms-overhaul` (created when needed).

Not checked: Netlify's deploy source (taken from README and PR #2), and how an agent behaves with the new AGENTS.md in a real session.

## Next step

None. Merged into `master` (`05769af`) and pushed to the NAS on 2026-11-05; GitHub publication is not part of this ticket.
