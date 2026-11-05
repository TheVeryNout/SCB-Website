# Gallery batch upload

Status: resolved
Branch: feat/gallery-batch-upload
Created: 2026-11-05

## Goal

An editor adds many photos to a gallery in one step instead of one by one. Applies to the three gallery lists: news posts, events and Pics n Vids galleries.

## Decisions

- Built into the CMS as a code-owned button, not a developer tool. Reason: coworkers publish through the deployed CMS and cannot run a script. This replaces the importer idea in the history ledger (`docs/plans/media-cms-overhaul.md`, CMS-03/04).
- The button "Mehrere Bilder auf einmal hinzufügen" sits above the stock Decap gallery list; the stock list (drag order, collapse, single "Bild hinzufügen") is unchanged.
- Each photo goes through the existing upload hook (`convertAndRenameUploads` in `public/admin/preview.js`): WebP, max 1600 px, named `<post title>-NN.webp`. No second conversion path.
- Each photo is saved through Decap's own media action and appended as `{ image, alt: "", caption: "" }`.
- The description (`alt`) starts empty. It is already a required field, so Decap blocks saving until every image has one. No placeholder text.
- A photo that fails is reported by name; the others still go in. Unreadable files and exact duplicates (same content) are skipped and named.

## Known limits

- Photos added but not yet saved show as broken thumbnails in the editor and preview. The stock single-image picker does the same (root-based `public_folder`, see quick-fixes/03). After saving they display.
- Only JPEG, PNG and WebP can be chosen.
- Checked on the local proxy only. Not checked on Git Gateway (live); added to inbox/01.
- No progress bar beyond the status line "Bild n von m wird hochgeladen".

## Tickets

- [01: Batch add button for gallery lists](issues/01-batch-add-button.md)
