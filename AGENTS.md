# SCB Website Agent Contract

This repository has already suffered from phase drift, silent assumptions, and weak handoff discipline.

This file exists to stop that from happening again.

The site is now deployed and the CMS is running. Treat implementation phases as historical unless a task explicitly reopens migration, evidence, architecture, or phase-state work.

If this file conflicts with domain specs, the domain specs win on product behavior and content semantics. This file wins on agent workflow, tracking discipline, and handoff behavior.

## Scope

This contract applies to any agent working on the SCB Astro website in this repository.

It is especially important for:

- fresh conversations
- resumed work after a previous session
- operational maintenance and content/CMS support
- any work that touches source evidence, migration, public facts, content, or assets

---

## Source Of Truth Map

Use these files for these responsibilities:

- `docs/operational-status.md`
  - current lightweight running status
  - open operational follow-ups
  - normal next-continuation point
- `docs/plans/execution-plan.md`
  - historical implementation phase ledger
  - old phase order, checklists, and exit gates
  - use only if a task intentionally reopens or audits phase state
- `docs/plans/status-checklist.md`
  - historical audited phase state
  - historical exceptions and process drift notes
  - use only when phase history matters
- domain/reference specs
  - `docs/plans/content-cms.md`
  - `docs/plans/implementation.md`
  - `docs/plans/routes-and-pages.md`
  - `docs/plans/calendar.md`
  - `docs/plans/migration.md`
  - `docs/plans/public-data-register.md`
- local source-evidence metadata
  - `docs/plans/wix-reference/README.md`
  - `docs/plans/wix-reference/manifest.json`
- implementation-facing staged assets
  - `src/assets/images/wix-staging/README.md`
  - `src/assets/images/wix-staging/manifest.json`

Do not invent alternative control documents when these already exist.

---

## Session Start Protocol

For normal deployed-site maintenance, do this in order:

1. read `README.md` if repo orientation is needed
2. read `docs/operational-status.md`
3. inspect the directly relevant source files
4. load only the domain/reference docs required for the task

Do not read `docs/plans/cold-start.md`, `docs/plans/execution-plan.md`, or `docs/plans/status-checklist.md` by default during operational work. Those files are implementation-history references now.

Open the historical phase docs only when:

- a task explicitly asks about phase state or prior implementation history
- a task touches migration/source evidence or route/source parity
- a task changes public-data confirmation status
- a task changes CMS/content schema, event semantics, redirects, deployment architecture, or asset-curation policy
- a contradiction appears that cannot be resolved from `README.md`, `docs/operational-status.md`, and the directly relevant source files

At the start of substantial operational work, state only:

- that the site is in operational maintenance mode
- whether any known operational blocker from `docs/operational-status.md` affects the task
- which specific docs, if any, had to be opened beyond the normal operational start

### Prompt Minimization Rule

Stable continuation workflow belongs in committed repo docs, not in repeated user prompts.

Use this rule:

- if a rule is repo-stable and likely to matter across more than one conversation, it should live in `AGENTS.md`, `docs/operational-status.md`, or another appropriate committed doc
- do not require the user to keep pasting the same startup, evidence, asset, or handoff rules once the repo docs already encode them
- future continuation prompts should be short and task-specific by default
- a continuation prompt should normally only need:
  - resume from current committed state
  - the specific operational task to continue
  - any intentional override to the normal repo rules
- if an agent finds itself needing to restate a stable rule list in chat more than once, that is a documentation failure and the rule should be promoted into committed docs during the same session

Minimal prompt target:

- a new conversation should usually be able to start from a short prompt such as `Resume from the current committed state and handle the next operational follow-up recorded in docs/operational-status.md`

The purpose of the docs is to reduce prompt friction, not move that burden onto the user.

---

## Historical Phase Rules

These apply only when a task explicitly reopens implementation history or phase state:

1. Do not silently reinterpret historical phase completion.
2. Do not treat repo artifacts as proof that a historical phase changed if the historical ledgers do not say so.
3. If a user intentionally reopens or overrides historical phase state, record that override in the relevant committed tracking file during the same session.
4. Do not mark a reopened phase complete only because implementation exists. Use the historical checklist and exit gate.

---

## Contradiction Handling

If you find tension between:

- the user’s current instruction
- `execution-plan.md`
- `status-checklist.md`
- a domain spec

then do not silently resolve it unless the answer is obvious and low risk.

Use this rule:

- operational-state contradictions must be surfaced
- historical phase-state contradictions must be surfaced only when phase history is actually in scope
- product semantics contradictions must be resolved from the docs if possible
- if a contradiction cannot be resolved locally without risk, ask one concise question

Never bury a state assumption in implementation or in a later summary.

---

## Evidence Handling

Use proportional judgment.

Do:

- treat strong local evidence as sufficient when it is actually sufficient
- use alternate local evidence when one artifact is low-quality or unusable
- record meaningful anomalies in the relevant metadata or notes

Do not:

- turn one low-value missing artifact into a fake phase blocker when better local evidence already exists
- overstate the certainty of inferred public facts
- treat a weak source as confirmed truth if `public-data-register.md` says otherwise

If an artifact gap matters, explain why it matters.
If it does not materially affect the work, record it proportionally and move on.

---

## Asset Rules

These folders have different roles. Do not blur them.

### `docs/plans/wix-reference/`

Role:

- local reference/evidence pack metadata

Git policy:

- lightweight metadata and indexes may be tracked
- heavy screenshots, HTML captures, PDFs, downloads, and raw archives may remain ignored

Use:

- local evidence lookup
- manifest/index review
- anomaly notes

### `docs/plans/wix-reference/asset-source-archive/`

Role:

- provenance and raw recovery only

Rule:

- never import app/content assets directly from this folder

### `src/assets/images/wix-staging/`

Role:

- implementation-facing staging workspace during migration and route build-out

Rules:

- files here may be used directly while migration or post-launch content support is in progress
- do not prune or reinterpret this folder only because the current code references a smaller subset
- current references are not a valid proxy for future need until an explicit asset-curation decision is recorded
- only make final asset-curation decisions after the relevant routes/content migration are complete and the decision is explicitly recorded

Do not confuse:

- source evidence
- raw provenance
- implementation staging
- final curated asset structure

They are related, but they are not the same thing.

---

## Implementation Discipline

When making implementation decisions:

1. prefer existing source patterns and the relevant maintained docs over improvisation
2. keep shared public facts in content/settings when the docs say they belong there
3. keep the repo buildable unless an explicit blocker makes that impossible
4. validate substantial changes with the relevant checks
5. do not call partial implementation “done” if the relevant route, content, migration, or QA concern is still open

Do not use current implementation shape as retroactive proof that the plan must have intended it.

### Dev Server Ownership

The user maintains the local dev/CMS server by default.

Agents may run bounded checks such as:

- `bun test`
- `bun run check`
- `bun run build`
- targeted `curl` or HTML inspections against an already-running server

Agents must not start additional long-running dev servers unless the user explicitly asks or the task cannot be verified otherwise.

If a temporary dev server is truly necessary:

- first inspect existing listeners/processes for the relevant port
- prefer using the user's existing server if it is current
- start the temporary server on a clearly stated alternate port
- stop it in the same turn immediately after verification
- do not leave any `bun run dev`, `bun run dev:cms`, `astro dev`, or `decap-server` process running from the agent session unless the user explicitly asks for it

Avoid getting the workspace tangled in multiple running servers. If localhost appears stale, surface that as a dev-server state issue instead of repeatedly starting new servers.

---

## Mandatory Session-End Updates

After every substantial session, update committed state, not just chat.

Required:

1. update `docs/operational-status.md`
   - what was audited
   - what changed
   - open exceptions
   - whether continuation is blocked or allowed
2. update `docs/plans/execution-plan.md` if:
   - historical phase checklist state changed
   - execution wording needs clarification
   - a historical handoff requirement needs sharpening
3. update the relevant domain spec if implementation clarified a real product rule
4. update migration tracking if migration artifacts were touched
5. leave verification results in committed docs when they materially affect future work

Do not leave critical process state only in a final chat message.

---

## Required Handoff Content

At the end of a substantial session, the final answer must include:

- current operational mode
- what changed
- what was verified
- any blocker or contradiction discovered
- the exact next continuation point

When the user asks for a report/handoff, write it in past tense.
Do not default to imperative git-commit style when the user asked for a reference record.

---

## Review Standard

When reviewing status or prior work:

- distinguish verified technical facts from assumptions
- distinguish process failures from implementation failures
- do not overclaim confidence
- do not recommend destructive cleanup from incomplete evidence

If current-state observations are only snapshots, label them as snapshots.
Do not inflate them into policy.

---

## Default Operating Posture

The user should not have to babysit operational tracking, checklist state, or handoff integrity.

Your job is to:

- read the lightweight operational docs first
- keep historical phase docs out of the normal startup path
- record the real state in committed files
- keep scope and evidence boundaries clear
- avoid making the user re-audit your assumptions in a later conversation
