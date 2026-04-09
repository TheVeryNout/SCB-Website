# Parallel Agent Task Board

## Status values
- `todo`
- `in_progress`
- `blocked`
- `review`
- `done`

## Active Run
- run_id: `TBD`
- objective: `TBD`
- owner: `00-orchestrator`

## Shards
| shard_id | assigned_agent | status | dependencies | files | notes |
|---|---|---|---|---|---|
| A | 10-foundation-architecture | todo | - | docs/plans/* | |
| B | 20-content-cms | todo | A(contract freeze) | docs/plans/content-cms.md | |
| C | 30-calendar-events | todo | A(route contract) | docs/plans/calendar.md | |
| D | 40-migration-ingestion | todo | A(route contract), C(event semantics) | docs/plans/migration.md | |
| E | 50-quality-security | todo | B,C,D | docs/plans/parallel-agent-environment.md | |

## Integration checkpoints
1. Schema + shared contract freeze
2. Route and calendar contract freeze
3. Migration + QA gate freeze
4. Final synthesis
