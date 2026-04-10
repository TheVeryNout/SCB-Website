# Wix Asset Staging

This folder is an Astro-facing staging tree built from the downloaded Wix asset pack.

## Purpose

- group flat Wix media files by likely page/domain ownership
- give later implementation work stable local folders to pull from
- preserve the original downloaded pack separately under `docs/plans/wix-reference/asset-source-archive/`

## Working Rule

- treat this folder as the implementation-facing staging workspace during migration and page build-out
- files here may be used directly by the site while migration is still in progress
- do not prune this folder only because the current code references a smaller subset at one point in time
- decide any later asset curation only after the relevant routes, posts, media entries, and migration scope are actually complete

## Layout

- `shared/site/`: common site chrome, icons, and assets used across many pages
- `homepage/site/`: homepage-focused assets
- `pages/`: static-page assets grouped by page slug
- `posts/`: per-post asset groups
- `events/`: event index/detail asset groups
- `media/gallery/`: gallery/media-page assets
- `misc/`: anything not confidently bucketed

## Counts

- `events/sunday-funday`: 1
- `homepage/site`: 7
- `pages/about`: 5
- `posts/der-contest-in-der-zeitung`: 2
- `posts/der-skate-club-in-der-zeitung`: 2
- `posts/goodies-4-tricks-2025`: 13
- `posts/goodies-4-tricks-event-trotz-regen-ein-erfolg`: 23
- `posts/graffiti-workshop-ein-voller-erfolg`: 20
- `posts/parkausbesserungen`: 1
- `posts/spende-von-der-volksbank-franken-s%C3%BCd`: 1
- `posts/spendenaufruf-der-scb-baut-ne-halle`: 8
- `shared/site`: 6

## Regeneration

Regenerate this staging tree with:

```bash
bun run stage:wix-assets
```

The source of truth remains `docs/plans/wix-reference/asset-source-archive/manifest.json`.
