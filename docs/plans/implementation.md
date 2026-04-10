# Website Implementation Specification

## Purpose

This document is the canonical technical implementation contract for the public `SCB` website.

Use it to decide:

- project structure
- Astro content and route wiring
- asset handling
- Netlify and Decap assumptions
- redirect and build rules

If this document conflicts with [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md), this document wins unless [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md), `routes-and-pages.md`, `content-cms.md`, or the user says otherwise.

---

## Locked Technical Baseline

These decisions are already locked:

- Astro SSG
- `bun`
- Netlify-first deployment
- Decap CMS
- static-first architecture
- local asset migration where practical
- no launch runtime dependency on `SCB-Dash`

Do not reopen them in later conversations unless the user explicitly changes them.

---

## Boundaries

This document defines:

- repository structure for the website app
- route-to-content mapping
- asset storage conventions
- render/build constraints
- redirects and hosting assumptions

This document does not define:

- product intent
- page purpose
- public fact confirmation
- migration workflow
- calendar recurrence semantics

Those belong in:

- [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
- `routes-and-pages.md`
- `public-data-register.md`
- `migration.md`
- [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)

---

## Repository Structure

Use this project structure once implementation begins:

```text
/
  public/
    admin/
    media/
      pdfs/
      legacy/
  src/
    assets/
      images/
        site/
        homepage/
        pages/
        posts/
        events/
        media/
    components/
    content/
      config.ts
      homepage/
      pages/
      posts/
      events/
      media/
      settings/
    layouts/
    lib/
    pages/
      index.astro
      neuigkeiten/
      ueber-uns.astro
      pics-n-vids.astro
      veranstaltungen/
      mitgliedschaft.astro
      kontakt/
        index.astro
        danke.astro
      impressum.astro
      datenschutz.astro
```

### Structure rules

- CMS-managed structured content lives in `src/content/`
- image assets intended for Astro image handling live in `src/assets/images/`
- PDFs and unprocessed downloadable files live in `public/media/pdfs/`
- migrated legacy files that need raw public serving may live in `public/media/legacy/`

Do not mix editable content into `src/data/` if it belongs in a content collection.

---

## Route To Content Mapping

Use this mapping:

- `/` -> homepage singleton plus derived news/event previews
- `/neuigkeiten/` -> posts collection index
- `/neuigkeiten/[slug]/` -> one post entry
- `/ueber-uns/` -> `pages/about`
- `/pics-n-vids/` -> media collection index page
- `/veranstaltungen/` -> derived events index from events collection
- `/veranstaltungen/[slug]/[date]/` -> generated event occurrence page from events collection
- `/mitgliedschaft/` -> `pages/membership`
- `/kontakt/` -> `pages/contact` plus shared contact data from settings
- `/kontakt/danke/` -> code-owned static thank-you page for successful form submissions
- `/impressum/` -> `pages/impressum`
- `/datenschutz/` -> `pages/datenschutz`

Do not hardcode shared public facts directly into components if they already exist in settings content.

---

## Rendering Rules

### Static rendering

Default to full static generation.

Do not introduce SSR for launch unless the user explicitly changes direction.

### Client-side JavaScript

Use client-side JavaScript only where there is clear user-facing value.

Allowed likely uses:

- mobile navigation toggle
- lightweight calendar month interaction if needed
- optional gallery/lightbox interaction

Do not use client-side code for:

- primary content rendering
- news listing
- event recurrence calculation
- map rendering

### Calendar build behavior

Calendar recurrence expansion and occurrence derivation happen at build time.

Calendar semantics defer to [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md).

---

## Asset Handling Rules

### Images

Use `src/assets/images/` for:

- hero images
- editorial page images
- post cover images
- event images
- curated media thumbnails

Reason:

- Astro image optimization
- predictable imports
- mobile-friendly delivery

### PDFs And Raw Files

Use `public/media/pdfs/` for:

- membership form PDF
- statutes PDF
- any future downloadable forms or documents

Reason:

- these files need stable public URLs
- they do not benefit from Astro image processing

### Migration source preservation

Keep source URLs and raw asset provenance in migration artifacts, not in production component code.

### Hotlinking rule

Do not hotlink Wix-hosted production assets in the final site.

---

## Astro Content Rules

### Collections

Create collections for:

- homepage
- pages
- posts
- events
- media
- settings

### Validation

Fail the build on invalid required content fields.

Examples:

- missing post title or slug
- missing required page singleton
- invalid event data per `calendar.md`
- missing required shared settings fields

### Derived content

Derived homepage previews must come from:

- latest posts from posts collection
- upcoming occurrences from events collection

Do not create duplicate CMS-managed preview entries for content that already exists elsewhere.

---

## Decap CMS Integration Rules

### Mount point

Assume Decap CMS is mounted at:

- `/admin/`

### Workflow bias

Default to the simplest workable repo-backed publishing flow.

Unless the user later asks for a review-heavy editorial process, prefer a straightforward publish flow over Git-complex editorial workflow features.

### Backend and auth

Lock launch CMS auth/backend to:

- Netlify Identity + Git Gateway

Reason:

- lowest-friction launch path for non-technical editors
- aligns with Netlify-first deployment
- avoids requiring every editor to manage direct GitHub repo permissions

### Local development backend

For local CMS development, use a local Decap proxy backend instead of the hosted Git Gateway.

Implementation rule:

- production continues to use Netlify Identity + Git Gateway
- localhost development may switch to a Decap local backend proxy for repo-backed editing without Netlify auth
- the local proxy is a development-only tool and must not be treated as a public or deployed service

Reason:

- allows local `/admin/` editing and save-flow testing
- keeps the deployed backend/auth model unchanged
- avoids coupling normal local implementation work to live Netlify services

### Preview requirements

Custom preview templates are optional for launch.

Do not block launch on preview infrastructure.

### CMS and site boundary

The public website must build and run without requiring a live CMS service at runtime.

Decap is an editorial tool, not a runtime dependency.

---

## Hosting And Deployment Rules

### Hosting assumption

Assume Netlify-first deployment.

### Build output

Generate a static Astro build compatible with Netlify static hosting.

### Environment dependency rule

Keep required environment variables minimal.

Do not create launch-critical secrets unless required by the chosen contact form backend.

### Contact form rule

Use Netlify Forms for the launch contact form.

Implementation requirements:

- use a plain HTML form that Netlify can process without custom server code
- no SSR, serverless function, or third-party form SaaS for launch
- required launch fields are `name`, `email`, and `message`, with optional `subject`
- include Netlify form naming and a low-friction honeypot field
- successful submissions redirect to `/kontakt/danke/`
- fallback email/contact details remain visible on `/kontakt/` even if form handling fails later

---

## Redirect Rules

### Required redirect intentions

Plan redirects for:

- legacy membership route -> `/mitgliedschaft/`
- legacy post URLs -> `/neuigkeiten/[slug]/`

### Event redirect caution

Do not add blanket event detail redirects from Wix event routes until each mapping is verified.

Reason:

- Wix event slug/date mismatches are already documented

### Redirect source of truth

Redirect mappings must be generated from the migration manifest or explicitly curated.

Do not guess.

---

## SEO And Metadata Baseline

### All pages

Provide:

- unique title
- meta description
- canonical URL when available
- Open Graph basics

### Posts

Use:

- post title
- excerpt
- cover image when present

### Events

Use:

- event title plus date
- summary
- event image when present
- structured data per `calendar.md`

### Legal pages

Keep SEO simple and factual.

---

## Testing And Verification Responsibilities

### Build-level checks

Implementation must include or support checks for:

- content schema validity
- route generation success
- missing required singletons
- broken internal content references

### Manual verification areas

Manual QA remains required for:

- migrated factual public data
- event date correctness
- redirect correctness
- mobile layout
- asset parity

Detailed migration QA belongs in `migration.md`.

---

## Non-Goals For Implementation

Do not add at launch:

- SSR
- live map embeds by default
- complex client-side search
- runtime `SCB-Dash` integration
- external CMS runtime dependency
- heavyweight gallery or calendar frameworks without proven need

---

## Acceptance Rule

This document is satisfied only when:

- repository structure and asset conventions are explicit
- every public route has a defined content source
- Decap and Netlify assumptions are clear
- redirects are governed by explicit rules
- later implementation work can proceed without making new architecture decisions
