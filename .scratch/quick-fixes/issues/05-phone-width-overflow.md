# 05: Pages scroll sideways at phone width

Category: bug
Status: resolved
Blocked by: None
Created: 2026-11-05

Found in the live spot check (inbox/09) at 390 px; earlier checks used 500 px.

- `/` overflows by 88 px: the "Neuigkeiten" card header in `src/pages/index.astro` is a non-wrapping flex row (`flex items-center justify-between`), so the `text-5xl` heading pushes the "Alle Beiträge" button and the card out.
- `/veranstaltungen/` overflows by 65 px (and `/mitgliedschaft/` by 28 px, found while rechecking): the page title from `PageIntro` (`text-[clamp(2.75rem,5vw,4.5rem)]`) contains a word too long for 358 px at 2.75 rem. `PageIntro` is shared, so other pages with long title words can do the same.

Fix: the news header row wraps (`flex-wrap`); `PageIntro` titles use a minimum size of 2.25 rem, `hyphens-auto` and `overflow-wrap:anywhere`.
Checked: all 11 routes plus one post, 0 px overflow at 390 and 1440 px; `bun run check` and `bun run build` pass.
Not checked: real phone fonts. This machine falls back to a wide font, so "WIEDERKEHRENDE" still breaks mid-word here; a phone with a condensed font or German hyphenation should break it cleaner.
