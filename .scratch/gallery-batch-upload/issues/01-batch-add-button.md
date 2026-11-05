# 01: Batch add button for gallery lists

Category: enhancement
Status: resolved
Blocked by: None
Created: 2026-11-05

Spec: [../spec.md](../spec.md). Code: `registerGalleryBatchWidget` in `public/admin/preview.js`; the three `gallery` fields in `public/admin/config.yml` use `widget: "gallery-batch"`.

Checked (local proxy, Playwright):
- Posts, events and Pics n Vids galleries show the button.
- 3 JPEGs: became `<title>-01..03.webp` and three gallery entries; saved with descriptions, the post file has the right paths. A second batch on the saved post continued at 04 and 05; reopening loaded all images.
- 15 different 4000x3000 photos (1.4 MB each) plus one exact duplicate and one corrupt file, in a Pics n Vids gallery: 15 added in about 3 s, names 01 to 15 in order, largest file 205 KB, saved, `bun run build` includes all 15 on `/pics-n-vids/`.
- The corrupt file is skipped and named in the status line. Without that, it broke the build ("no image metadata").
- An exact duplicate is skipped and named. Without that, Decap keeps one file per content hash and the second entry points at nothing.
- Saving with empty descriptions is blocked ("einige zwingend erforderliche Felder sind nicht ausgefüllt"); nothing was written.
- `bun test` (39), `bun run check` (0/0/0) and `bun run build` pass.

Not checked: Git Gateway (live CMS; goes into inbox/01), HEIC photos, real phone photos and phone screens, a file that decodes but fails conversion, the same photo added in two separate batch clicks before saving (covered by the duplicate rule, not run). Skipped duplicates are listed under their converted names, not the original file names.
