# 03: CMS writes bare image filenames that break the build

Category: bug
Status: resolved
Claimed by: EVA-01 Claude Code session
Claimed at: 2026-11-05
Blocked by: None
Created: 2026-11-05

A new post saved through the local CMS (`src/content/posts/neue-halle.md`) got `coverImage: 13cc9c_…~mv2.webp`, a bare filename. Astro resolves it next to the post file, does not find it, and the page fails with `ImageNotFound`. Every existing entry uses `../../assets/images/uploads/<file>`. The image itself exists in `src/assets/images/uploads/`.

Cause not confirmed. The config has `media_folder: "src/assets/images/uploads"`, `media_folder_relative: true`, `public_folder: ""`; the deployed site uses the same settings, so a CMS edit on the live site would likely fail the Netlify build the same way. Still to check: whether it happens only when picking an existing library image, or also on upload; the July CMS-03A test reported correct paths for uploads.

## Findings

- Cause: `media_folder_relative` is only in Decap 3.11.0's config schema and changes nothing, so every pick or upload is saved as `public_folder` + filename; with `public_folder: ""` that is the bare name. Affects the live CMS too.
- Per-collection relative `media_folder`/`public_folder` makes the library empty for new entries. Rejected.
- Fix: `public_folder: "/src/assets/images/uploads"`, `media_folder_relative` removed. Astro resolves root-based paths; existing `../../` paths keep working.

## Checked

Local editor, scripted: picking an existing image and uploading a new one both saved `/src/assets/images/uploads/<file>`; both test posts built and rendered the optimized WebP; the reopened entry's thumbnail loads. The draft `neue-halle.md` got the same root path. Test posts and the test upload were deleted. The image library takes about 20 s to open locally because the proxy sends all images in full.

Not checked: the deployed CMS (thumbnails there load through Git Gateway, not the dev server).
