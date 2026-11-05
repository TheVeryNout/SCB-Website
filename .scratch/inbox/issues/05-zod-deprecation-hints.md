# Zod deprecation hints in content config

Status: superseded
Superseded by: [quick-fixes/04](../../quick-fixes/issues/04-zod-deprecations.md)
Blocked by: None
Created: 2026-11-05
Source: [docs/operational-status.md](../../../docs/operational-status.md), Open Operational Items

`bun run check` reports 8 non-blocking Zod deprecation hints, all in `src/content/config.ts`: 5× `ZodIssueCode` (lines 253–306) and the chained `z.string().url()`, `.datetime()` and `.email()` (lines 21, 79, 320). Checked 2026-11-05 on `master` after the media-page-refresh merge.
