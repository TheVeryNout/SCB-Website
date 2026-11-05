# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`. GitHub is only a mirror; it carries no issues or labels.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`, with `Branch: feat/<feature-slug>` in its header
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` per folder, never a single combined tickets file
- Open decisions go in `.scratch/<feature-slug>/map.md`
- Extra subfolders (`research/`, `audit/`, `prototypes/`) are allowed
- Standing umbrellas: `.scratch/quick-fixes/` (`Branch: fix/quick-fixes`) and `.scratch/repo-standard/` (`Branch: chore/repo-standard`)
- Loose ideas: `.scratch/inbox/issues/` as `needs-triage` tickets
- Each ticket carries `Status:` and `Blocked by:` (write `None` when nothing blocks it)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading
- Closed tickets stay where they are

## Statuses

The five triage roles are in `triage-labels.md`. Tickets also use:

| Status | Meaning |
| --- | --- |
| `claimed` | A session is working on it; record who and when |
| `resolved` | Done, or the decision is answered |
| `superseded` | Replaced by linked work; keep the reason |

Decision records (wayfinder) also use `open`.

## Old records

Before this tracker, work was tracked in places that are now history (marked `History — not a work queue.`):

- `docs/operational-status.md`: open items and a session log. Its open items became tickets in `.scratch/inbox/issues/`.
- `docs/plans/execution-plan.md`, `docs/plans/status-checklist.md`: phase ledgers for the 2026 build.
- `docs/plans/news-editorial-refactor.md`, `docs/plans/media-cms-overhaul.md`: feature ledgers with their own stage/package status words (`proposed`, `approved`, `in-progress`, `blocked`, `technically-verified`, `user-accepted`, `deferred`). Open packages became inbox tickets.
- `.codex/agents/TASK_BOARD.md`: an unused template. Its values map as `todo` → `needs-triage`, `in_progress` → `claimed`, `blocked` → `Blocked by:`, `review` → `ready-for-human`, `done` → `resolved`.

Do not edit these files to update work state; update the ticket.

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
