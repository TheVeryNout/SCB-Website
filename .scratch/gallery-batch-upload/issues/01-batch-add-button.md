# 01: Batch add button for gallery lists

Category: enhancement
Status: resolved
Blocked by: None
Created: 2026-11-05

Spec: [../spec.md](../spec.md). Code: `registerGalleryBatchWidget` in `public/admin/preview.js`; the three `gallery` fields in `public/admin/config.yml` use `widget: "gallery-batch"`.

Checked (local proxy, Playwright):
- Posts, events and Pics n Vids galleries show the button.
- 3 JPEGs: became `<title>-01..03.webp` and three gallery entries; saved with descriptions, the post file has the right paths. A second batch on the saved post continued at 04 and 05; reopening loaded all images.
- 15 different 4000x3000 photos (1.4 MB each) plus one exact duplicate and one corrupt file, in a Pics n Vids gallery: 16 entries and 16 files on disk, none missing, names in order, largest file 205 KB, `bun run build` includes all 16 on `/pics-n-vids/`. The conversion takes about 3 s.
- The corrupt file is skipped and named in the status line. Without that, it broke the build ("no image metadata").
- An exact duplicate is encoded again at a slightly lower quality so it becomes its own file. Without that, Decap keeps one file per content hash and the second entry pointed at nothing (found when the first test used 5 source photos 3 times). This is done in the upload hook, so it also covers the stock single-image picker.
- While a batch runs the button is disabled and shows "Fotos werden vorbereitet …" / "Bild n von m"; a description typed mid-batch is kept.
- After a batch the stock "Bild hinzufügen" still adds an item and keeps the other descriptions.
- Saving with empty descriptions is blocked ("einige zwingend erforderliche Felder sind nicht ausgefüllt"); nothing was written.
- `bun test` (39), `bun run check` (0/0/0) and `bun run build` pass.
- Independent review (fresh-eyes) found: a duplicate guard that missed photos added another way, a stale list overwriting edits made mid-batch, no guard against a second click, a possible name clash on non-converted files, leaking hidden inputs. All fixed and retested as above.

Not checked: Git Gateway (live CMS; a 20 to 30 photo batch goes into inbox/01, because one save sends all files in one request), HEIC photos, real phone photos and phone screens, a file that decodes but fails conversion, collapsed/expanded state of batch-added items after reordering or removing items with the stock buttons (the reviewer expects cosmetic oddities), deleting an added item and re-adding the same photo.
