# 06: Unsaved CMS images show as broken thumbnails

Category: bug
Status: resolved
Blocked by: None
Created: 2026-11-05

A photo added in the CMS (stock picker or the batch button) showed as a broken image in the editor and preview until the entry was saved. After saving it was fine.

Cause: Decap treats any path that starts with `/` as a finished URL and never looks it up in its store of unsaved uploads. The root path `/src/assets/images/uploads/...` from quick-fixes/03 starts with `/`; the same path without the slash resolves.

Fix: `public_folder` has no leading slash, so the editor holds `src/assets/...`; `public/admin/preview.js` (`convertImagePathsOnSaveAndLoad`, a Decap value serializer for image fields) adds the slash when saving and removes it when loading. Files keep the root paths Astro resolves. Paths that do not start with `src/assets/` (the old `../../assets/...` ones) pass through unchanged.

Checked (local proxy, Playwright): a stock cover and three batch photos show before saving; the saved post has `/src/assets/images/uploads/...` for all four; reopening shows them; an old post with relative paths still shows all images; `bun run build` accepts the saved post.

Also looked at, no change:
- Media library "takes about 20 s": could not reproduce, it opens in under a second with 53 files (13 MB). Earlier waits were a cold proxy.
- The event `heroImage` of `sunday-funday` (in `wix-staging`, outside the media folder) shows broken in the editor; it was already like that and renders fine on the site.

Not checked: Git Gateway (live CMS).
