History — not a work queue.

# 2026-04-13 1558 Operational Doc State Reset

Agent: Codex GPT-5

## Pressing Issue

The user reported that the current deployed site is running well and that the CMS is running.

The control docs still contained several release-candidate and launch-signoff phrases that could cause a future agent to resume as if implementation phases were still active. That conflicted with the real operational state and risked reintroducing the same phase-drift problem the repo contract was designed to prevent.

## Analysis

I started from the repo contract and startup docs:

- `AGENTS.md`
- `README.md`
- `docs/plans/cold-start.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/public-data-register.md`

The docs already showed that Phases 1 to 7 were cleared, but the wording was inconsistent:

- some sections still called the site a technical release candidate
- the status ledger still listed a CMS deployment handoff as the next continuation point
- public-data conflicts were described as launch-signoff blockers
- old resume examples still pointed at route-slice or launch-signoff work
- asset-staging text still assumed incomplete migration

The right fix was docs-only: preserve the historical phase evidence, but make the current state explicit as deployed and operational.

## Changes Made

### `README.md`

Updated the repo description from a rebuild planning base to an implementation and operational reference base.

Changed the current status section to record:

- site is deployed
- CMS is running
- Phases 1 to 7 are cleared
- active implementation phase is none
- default future work is operational maintenance, CMS and content support, QA fixes, or targeted follow-up

Replaced the stale launch-signoff resume prompt with an operational follow-up prompt.

### `AGENTS.md`

Adjusted the agent contract wording so it applies to ongoing SCB Astro website work, not only the rebuild.

Updated the minimal prompt example away from route-slice continuation.

Clarified the `wix-staging` asset rule so staged assets are not pruned until an explicit asset-curation decision is recorded, instead of tying the rule only to incomplete migration.

### `docs/plans/cold-start.md`

Added an operational state block near the top:

- deployed site
- CMS running
- Phases 1 to 7 cleared
- active implementation phase none
- future work starts from deployed baseline unless a later audit reopens a phase

Also changed resume language from resuming implementation to resuming work.

### `docs/plans/execution-plan.md`

Reframed the file as a canonical delivery plan and historical phase ledger.

Added an operational state note saying the numbered implementation phases are no longer active work.

Updated the verified snapshot and progress snapshot to record that the site is deployed and CMS is running by user report on `2026-04-13`.

Reclassified public-data conflicts as content-governance review items rather than active implementation blockers.

Updated the minimal resume prompt to point at operational follow-up.

### `docs/plans/status-checklist.md`

Added the user-reported deployed and CMS-running state to the audited scope.

Updated Phase 7 status:

- Phase 7 complete
- active implementation phase none
- unresolved public-data conflicts remain review items

Replaced the stale next continuation point about publishing the CMS backend switch and testing `/admin/` login, since the user reported the CMS is running.

New continuation point is to handle the next explicit operational follow-up, CMS or content support task, QA correction, or new feature from the deployed baseline.

### `docs/plans/public-data-register.md`

Changed launch-signoff language to publication and content-governance language.

Kept the unresolved YouTube and donation or bank details visible, but clarified that these are not evidence that an implementation phase remains open.

## Reasoning

The goal was not to erase the phase plan. The phase plan remains useful as historical evidence and as a guardrail against future drift.

The important correction was to stop the docs from implying that future agents should continue building phases that are already complete. The repo should now guide future sessions into operational mode by default.

Public-data issues were not marked confirmed. They remain explicit review items because the user did not verify those facts in this session. The distinction is now clear:

- implementation phases are complete
- deployed site and CMS are operational by user report
- uncertain public facts still must not be silently normalized into canonical claims

## Verification

Ran a targeted stale-language scan over:

- `README.md`
- `AGENTS.md`
- `docs/plans/cold-start.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/public-data-register.md`

Confirmed the stale route-slice and CMS handoff phrases were removed from the active resume path.

Ran:

```bash
git diff --check
```

Result:

- passed with no whitespace errors

No build or test run was performed because this was a documentation-only state correction.

## Backend Changes

None.

## Frontend Changes

None.

## Architecture Changes

No application architecture changed.

The documentation architecture changed in one important way: the phase plan is now explicitly historical and operational, not a signal that implementation is still underway.

## Reference Documents

- `AGENTS.md`
- `README.md`
- `docs/plans/cold-start.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`
- `docs/plans/public-data-register.md`
- `docs/changelog/2026-04-13_1541_cms-auth-backend-switch.md`
