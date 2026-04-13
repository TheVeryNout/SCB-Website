# 2026-04-13 phase 7 release candidate

## Scope

This changelog records the Phase 7 QA, redirects, and deployment-hardening pass.

It covers:

- build/check/test verification
- phone-width Chromium screenshots
- contact form, downloads, external links, and `/admin/` checks
- baseline keyboard/accessibility hardening
- Netlify build/deploy configuration
- high-confidence legacy redirects from retained Wix source evidence
- final launch-signoff blockers that remain public-data decisions, not implementation gaps

## What changed

### Deployment config

- added `netlify.toml`

The config sets:

- `bun run build`
- `dist` publish directory
- Node `22`
- Bun `1.3.5`
- baseline security headers
- canonical-domain redirects to `https://skateclubbiriciana.de`
- high-confidence legacy redirects for the retained Wix membership route and known retained Wix post routes

The only event-detail redirect maps the retained Wix `Sunday Funday` event URL to `/veranstaltungen/sunday-funday/2025-11-30/`, because the local evidence pack verifies the visible occurrence date.

No broad event wildcard redirect was added.

### Accessibility baseline

- updated `src/styles/global.css`

A global `:focus-visible` outline now gives keyboard users a clear focus indicator across links, buttons, form controls, and the mobile navigation summary.

## Verification

Verified in this session with:

- `bun test`
- `bun run check`
- `bun run build`
- local preview HTTP checks for launch routes, `/admin/`, and localized PDFs
- Playwright Chromium phone-width screenshots at `390x844` for `/`, `/veranstaltungen/`, `/veranstaltungen/sunday-funday/2025-11-30/`, `/kontakt/`, and `/admin/`
- rendered HTML checks for contact-form Netlify attributes and image alt coverage
- external link checks for Instagram, YouTube, and Google Maps
- public-data cross-check against `docs/plans/public-data-register.md`

Notes:

- `bun run check` still reports only the known non-blocking Zod deprecation hints from `src/content/config.ts`
- the Decap CMS admin shell renders locally, and deployed editing still depends on Netlify Identity and Git Gateway being enabled in the Netlify project

## Result

- Phase 7 is complete as a technical release-candidate pass
- the site is deploy-configured and reviewable
- final launch signoff remains blocked until the user resolves or explicitly accepts the public-data conflicts recorded in `public-data-register.md`
