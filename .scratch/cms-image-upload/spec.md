# CMS image upload: convert and rename

Status: resolved
Branch: feat/cms-image-upload
Created: 2026-11-05

## Goal

Editors upload phone photos through the CMS. Today Decap stores the original file unchanged: large JPEGs with names like `IMG_2045.JPG` land in git. Uploads should be small WebP files with readable names, without editors doing anything extra.

## Decisions (owner, 2026-11-05)

- Convert in the browser before Decap receives the file: WebP, quality 0.7. A throwaway test showed a hook on the media dialog's file input works with the stock Decap 3.11.0 dialog (516 KB JPEG → 120 KB WebP).
- Longest edge at most 1600 px; smaller images are not enlarged.
- Name: slug of the entry title plus a two-digit number, e.g. `neue-halle-01.webp`; the date (`2026-11-05-01.webp`) when the title is empty. The number continues after the highest one already in the library for that name.
- No batch upload here; it stays in [inbox/08](../inbox/issues/08-gallery-batch-upload-workaround.md).

## Rules

- Only JPEG, PNG and WebP are converted. Other files (GIF, SVG, HEIC, PDF) pass through unchanged.
- EXIF orientation is applied; metadata is dropped.
- A browser that cannot write WebP gets JPEG at quality 0.8 with the same name scheme.
- Existing images are not touched.

## Out of scope

Batch selection, converting existing images, the slow local library listing.

## Tickets

- [01: Convert and rename uploads in the media dialog](issues/01-convert-and-rename-uploads.md)
