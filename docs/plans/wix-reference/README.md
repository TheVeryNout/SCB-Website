# Wix Reference Pack

## Purpose

This folder is the local reference pack for the current public Wix source site.

Use it to avoid reopening the live Wix site during every later implementation or QA conversation.

This folder is for reference evidence and cold-start recovery.

It is not the final migration workspace.

Lightweight control files in this folder may be kept in git.

Heavy captured artifacts under `screenshots/`, `html/`, `pdf/`, `downloads/`, and raw archive assets under `asset-source-archive/original/` are local working evidence and may remain ignored.

---

## Capture Baseline

- capture date: `2026-04-10`
- source base URL: `https://briareos.wixsite.com/skateclubbiriciana`
- page capture tool: Playwright CLI
- raw page source capture: `curl`
- viewport used for Playwright screenshots and PDFs: `1440x900`
- locale/timezone used for Playwright captures: `de-DE`, `Europe/Berlin`

---

## Folder Layout

- `screenshots/`: full-page Playwright screenshots for launch routes and representative detail pages
- `pdf/`: Playwright PDFs for legal and long-form reference pages
- `html/`: raw HTML captures for grep-able local inspection
- `feeds/`: source feeds such as `blog-feed.xml`
- `downloads/`: source PDFs currently linked from Wix
- `asset-source-archive/`: directly downloaded Wix media assets preserved as raw source archive
- `../../src/assets/images/wix-staging/`: Astro-facing staged copies grouped by likely page/domain ownership
- `notes/`: extracted links and local observations
- `manifest.json`: route and artifact index for this pack

---

## Route Coverage

Captured route set:

- homepage source: `/`
- news index source: `/neuigkeiten`
- representative news post: `/post/spendenaufruf-der-scb-baut-ne-halle`
- representative news post: `/post/goodies-4-tricks-2025`
- about source: `/ueber-uns`
- media source: `/pics-n-vids`
- events index source: `/veranstaltungen`
- representative event detail: `/events/sunday-funday-2025-04-06-13-00`
- legacy membership source: `/copy-of-veranstaltungen`
- contact source: `/kontakt`
- legal source: `/impressum`
- legal source: `/datenschutz` via HTML and PDF capture

Additional captured source artifacts:

- `blog-feed.xml`
- statutes PDF source
- membership form PDF source
- raw HTML captures for all currently published feed posts used for asset discovery

---

## How To Use It

In a fresh implementation conversation:

1. read [manifest.json](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/manifest.json)
2. use `html/` for grep-able raw source inspection
3. use `screenshots/` and `pdf/` when visual layout or rendered content matters
4. use `feeds/blog-feed.xml` for post inventory
5. use `downloads/` for source PDF preservation
6. use [asset-source-archive/README.md](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/asset-source-archive/README.md) and [asset-source-archive/manifest.json](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/asset-source-archive/manifest.json) only for provenance and raw recovery
7. use [wix-staging/README.md](/home/nout/REPO/SCB-Website/src/assets/images/wix-staging/README.md) and [wix-staging/manifest.json](/home/nout/REPO/SCB-Website/src/assets/images/wix-staging/manifest.json) for implementation-facing local assets

Git policy:

- treat `README.md`, `manifest.json`, `notes/`, `feeds/blog-feed.xml`, and asset-archive metadata as the lightweight committed index
- treat screenshots, HTML captures, PDFs, downloads, and raw archive assets as local-only heavy evidence unless there is a deliberate reason to version them
- if a later conversation needs a heavy artifact that is not present locally, regenerate it or reopen the live Wix source only for that missing item

The asset pack can be refreshed with:

```bash
bun run capture:wix-assets
```

The Astro-facing staging tree can be rebuilt with:

```bash
bun run stage:wix-assets
```

Only reopen the live Wix site when:

- a needed route is missing from this pack
- the source site may have changed since `2026-04-10`
- an interaction-specific detail is not recoverable from the local evidence

---

## Known Limits

- screenshots may include the Wix cookie banner, so use `html/` and `pdf/` when the lower page area matters
- raw HTML is source HTML, not a cleaned semantic extraction
- screenshots remain representative for detail pages, but `html/` now includes all currently published feed post pages for broader asset discovery
- event coverage is still representative rather than exhaustive for every Wix event instance
- the `datenschutz` screenshot was intentionally removed after capture because it was unusable; use the HTML and PDF artifacts for that page instead

For notable anomalies already observed, see [known-anomalies.md](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/notes/known-anomalies.md).
