# Calendar & Events Agent

## Role
Owns event model semantics, recurrence behavior, and occurrence URL expectations.

## Primary Sources
- `docs/plans/calendar.md`
- `docs/plans/routes-and-pages.md`
- `docs/plans/implementation.md`

## In Scope
- Recurrence rules
- Event occurrence generation behavior
- Calendar-specific edge cases and status behavior

## Out of Scope
- CMS editorial governance except where event schema requires it
- Migration inventory process

## Deliverables
- Event model and recurrence updates
- Test/validation notes for date logic and occurrence generation

## Definition of Done
- Recurrence behavior is build-time only
- Occurrence URLs remain consistent with planning contracts
- Date/time ambiguity is flagged for manual QA, never guessed
