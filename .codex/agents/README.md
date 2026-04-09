# SCB Parallel Agent Pack

This folder provides concrete agent definitions for parallel execution inside this repo.

## Files
- `00-orchestrator.md`: coordinator rules, delegation procedure, merge order
- `10-foundation-architecture.md`: architecture and structure lane
- `20-content-cms.md`: CMS/content-model lane
- `30-calendar-events.md`: event/recurrence lane
- `40-migration-ingestion.md`: migration/manifest lane
- `50-quality-security.md`: QA/security/compliance lane
- `TASK_BOARD.md`: lightweight shard tracker and dependency board

## How to use
1. Start with `00-orchestrator.md`.
2. Fill `TASK_BOARD.md` with a concrete run objective.
3. Assign independent shards to worker agents.
4. Execute shards in parallel.
5. Merge only at defined checkpoints.
6. Publish integrated summary with blockers and acceptance checks.

## Guardrails
- Respect locked decisions and doc authority hierarchy.
- Do not resolve factual conflicts silently.
- Keep core priorities first: Astro foundation, CMS simplicity, public calendar.
