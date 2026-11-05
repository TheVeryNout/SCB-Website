# 01: Convert and rename uploads in the media dialog

Category: enhancement
Status: resolved
Blocked by: None
Created: 2026-11-05
Claimed by: EVA-01 Claude Code session
Claimed at: 2026-11-05

Implement the spec's rules as a capture-phase `change` hook in `public/admin/preview.js`.

## Acceptance

- [x] A JPEG uploaded in a post titled "Neue Halle" is saved as `neue-halle-01.webp`, at most 1600 px on the long edge.
- [x] A second upload in the same post becomes `neue-halle-02.webp`.
- [x] Empty title: date-based name.
- [x] GIF/SVG/PDF pass through unchanged.
- [x] Saved post builds and renders the image.

## Current state

Done in `public/admin/preview.js`. Existing names come from the media listings the CMS fetches (local proxy `getMedia`, Git Gateway contents/tree responses) plus names created in the session; Decap's library grid is virtualised, so the page never shows all files. Before any listing has arrived, a four-character random suffix is added to avoid a clash.

## Checked

Local editor, scripted: a 15 MB 5304×7952 JPEG in a post titled "Neue Halle Test" was saved as `neue-halle-test-01.webp`, 1067×1600, 387 KB; a second upload got `-02` with no replace dialog; empty title gave `2026-11-05-01.webp`; an SVG kept its name; the saved post built and rendered the image. Test files removed. `bun test` 39/39, `astro check` clean.

Not checked: the deployed CMS (Git Gateway listing format is handled but untested), Safari and Firefox, the JPEG fallback path.
