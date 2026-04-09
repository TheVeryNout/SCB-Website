# SCB Website Docs

This repo is the documentation and implementation planning base for rebuilding the public Skate Club Biriciana e.V. website from Wix to Astro SSG.

## Read Order

For a cold start, read in this order:

1. [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md)
2. [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md)
3. [routes-and-pages.md](/home/nout/REPO/SCB/routes-and-pages.md)
4. [content-cms.md](/home/nout/REPO/SCB/content-cms.md)
5. [calendar.md](/home/nout/REPO/SCB/calendar.md)
6. [public-data-register.md](/home/nout/REPO/SCB/public-data-register.md)
7. [implementation.md](/home/nout/REPO/SCB/implementation.md)
8. [migration.md](/home/nout/REPO/SCB/migration.md)

## Doc Roles

- [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md): top-level product intent, constraints, priorities, and locked decisions
- [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md): source-site audit, route inventory, source quirks, assets, and historical planning notes
- [routes-and-pages.md](/home/nout/REPO/SCB/routes-and-pages.md): final public routes, page scope, and preserve/simplify/drop decisions
- [content-cms.md](/home/nout/REPO/SCB/content-cms.md): content model and Decap CMS ownership rules
- [calendar.md](/home/nout/REPO/SCB/calendar.md): canonical event/calendar behavior and schema semantics
- [public-data-register.md](/home/nout/REPO/SCB/public-data-register.md): risky public facts and confirmation status
- [implementation.md](/home/nout/REPO/SCB/implementation.md): Astro/Netlify/Decap technical architecture
- [migration.md](/home/nout/REPO/SCB/migration.md): Wix-to-Astro migration workflow, manifest, and QA rules

## Current Direction

Locked baseline:

- Astro SSG
- `bun`
- Netlify-first deployment
- Decap CMS
- static-first architecture
- mobile-first public website
- no launch dependency on `SCB-Dash`

## Current Status

The documentation stack is now split by responsibility so later implementation work does not need to infer architecture or scope from the source audit.

Implementation scaffolding has not been started in this repo yet.
