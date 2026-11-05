# German copy review on the deployed site

Status: resolved
Blocked by: None
Created: 2026-11-05
Source: [docs/operational-status.md](../../../docs/operational-status.md), Open Operational Items

After the 2026-04 cleanup of ASCII transliterations (`fuer`, `ueber`, …), review the deployed site for any that remain in user-facing copy. Route paths and slugs stay ASCII on purpose.

## Answer

No leftover transliterations found on 2026-11-05. Scanned the visible text of all 104 built pages for `ae`/`oe`/`ue` and `ss`-for-`ß` spellings, plus `alt`/`title`/`aria-label`/meta text and the CMS labels in `public/admin/` and `src/pages/admin/index.astro`. Every hit is correct German (Zuschauer, Neueste, freuen, blaue, schlussendlich, Umsatzsteuer, …) or a code key/font name. Nothing changed.
