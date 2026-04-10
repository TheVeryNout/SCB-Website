# SCB Website Agent Contract

This repository has already suffered from phase drift, silent assumptions, and weak handoff discipline.

This file exists to stop that from happening again.

Follow it together with the planning docs. If this file conflicts with the domain specs, the domain specs win on product behavior and content semantics. This file wins on agent workflow, tracking discipline, and handoff behavior.

## Scope

This contract applies to any agent working on the SCB Astro rebuild in this repository.

It is especially important for:

- fresh conversations
- resumed implementation after a previous session
- any work that touches phases, source evidence, migration, content, or assets

---

## Source Of Truth Map

Use these files for these responsibilities:

- `docs/plans/execution-plan.md`
  - controlling execution contract
  - phase order
  - phase checklists
  - exit gates
  - conversation handoff checklist
- `docs/plans/status-checklist.md`
  - audited current state
  - open exceptions
  - process drift notes
  - next-resume warnings
- phase/domain specs
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

Before substantial work, do this in order:

1. read `README.md` if cold-start context is needed
2. read `docs/plans/cold-start.md`
3. read `docs/plans/execution-plan.md`
   - `Current Verified Repo Snapshot`
   - `Progress Snapshot`
   - the checklist for the active phase
   - `Conversation Handoff Checklist`
4. read `docs/plans/status-checklist.md`
5. load only the phase-specific docs required for the current task
6. if source evidence is needed, read local reference metadata before reopening live source

At the start of the session, explicitly determine and state:

- active phase
- whether all earlier phases are actually cleared
- whether any earlier-phase exception remains open
- whether the requested work is blocked by a phase gate

If that is not clear from committed files, do not silently assume completion.

### Prompt Minimization Rule

Stable continuation workflow belongs in committed repo docs, not in repeated user prompts.

Use this rule:

- if a rule is repo-stable and likely to matter across more than one conversation, it should live in `AGENTS.md`, `execution-plan.md`, `status-checklist.md`, or another appropriate committed doc
- do not require the user to keep pasting the same startup, evidence, asset, or handoff rules once the repo docs already encode them
- future continuation prompts should be short and task-specific by default
- a continuation prompt should normally only need:
  - resume from current committed state
  - the specific task or route slice to continue
  - any intentional override to the normal repo rules
- if an agent finds itself needing to restate a stable rule list in chat more than once, that is a documentation failure and the rule should be promoted into committed docs during the same session

Minimal prompt target:

- a new conversation should usually be able to start from a short prompt such as `Resume from the current committed state and continue the next route slice recorded in status-checklist.md`

The purpose of the planning stack is to reduce prompt friction, not move that burden onto the user.

---

## Non-Negotiable Phase Rules

1. Do not silently skip an unchecked earlier phase.
2. Do not treat repo artifacts as proof that a phase is complete if `execution-plan.md` and `status-checklist.md` do not say so.
3. If a user instruction appears to jump ahead of the phase gates, flag the contradiction explicitly before proceeding.
4. If the user intentionally overrides the normal sequence, record that override in a committed tracking file during the same session.
5. Do not mark a phase complete only because some implementation exists. Use the checklist and exit gate.

---

## Contradiction Handling

If you find tension between:

- the user’s current instruction
- `execution-plan.md`
- `status-checklist.md`
- a domain spec

then do not silently resolve it unless the answer is obvious and low risk.

Use this rule:

- sequencing and phase-state contradictions must be surfaced
- product semantics contradictions must be resolved from the docs if possible
- if a contradiction cannot be resolved locally without risk, ask one concise question

Never bury a phase-jump assumption in implementation or in a later summary.

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

- files here may be used directly while migration is in progress
- do not prune or reinterpret this folder only because the current code references a smaller subset
- current references are not a valid proxy for future need while migration is incomplete
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

1. prefer the planning docs over improvisation
2. keep shared public facts in content/settings when the docs say they belong there
3. keep the repo buildable unless an explicit blocker makes that impossible
4. validate substantial changes with the relevant checks
5. do not call partial implementation “done” if the route layer, migration layer, or QA gate is still open

Do not use current implementation shape as retroactive proof that the plan must have intended it.

---

## Mandatory Session-End Updates

After every substantial session, update committed state, not just chat.

Required:

1. update `docs/plans/status-checklist.md`
   - what was audited
   - what changed
   - open exceptions
   - whether continuation is blocked or allowed
2. update `docs/plans/execution-plan.md` if:
   - checklist state changed
   - execution wording needs clarification
   - a handoff requirement needs sharpening
3. update the relevant domain spec if implementation clarified a real product rule
4. update migration tracking if migration artifacts were touched
5. leave verification results in committed docs when they materially affect future work

Do not leave critical process state only in a final chat message.

---

## Required Handoff Content

At the end of a substantial session, the final answer must include:

- active phase
- whether earlier phases are cleared, partially cleared, or still open
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

The user should not have to babysit phase tracking, checklist state, or handoff integrity.

Your job is to:

- read the controlling docs
- detect phase drift early
- record the real state in committed files
- keep scope and evidence boundaries clear
- avoid making the user re-audit your assumptions in a later conversation
