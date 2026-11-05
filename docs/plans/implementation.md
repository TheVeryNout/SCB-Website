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

Allowed uses:

- mobile navigation toggle
- lightweight calendar month interaction if needed
- the post-gallery PhotoSwipe lightbox, loaded only on pages that render a gallery and progressively enhanced from direct optimized-image links

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

CMS-managed post and standalone-gallery media lives under `src/assets/images/uploads/`. Decap commits the selected asset and its content reference to the repository; its standard image widget does not transform uploads before commit. New temporary JPEG/PNG/WebP inputs therefore use the repository-owned `bun run images:prepare` step with a `2560px` maximum edge, WebP quality `80`, and fixed effort `5`. Review the generated manifest and images, then copy only selected WebP publication assets into `uploads`; retain each new source input until conversion and content validation succeed. Raw Wix evidence and every file under `src/assets/images/wix-staging/` remain preserved outside this workflow's deletion scope.

Astro still owns public delivery derivatives at build time. Post galleries generate responsive thumbnail widths and a quality-controlled WebP lightbox source capped at 2000px on the source width, while retaining the direct optimized-image link as the no-JavaScript fallback.

Reason:

- Astro image optimization
- predictable imports
- mobile-friendly delivery
- CMS source assets remain rebuildable without serving unbounded originals as the default gallery view

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

The deployed CMS uses:

- individual, invite-only Netlify Identity email/password accounts
- Decap's `git-gateway` backend on the `master` branch

Reason:

- editors do not need GitHub accounts or repository permissions
- each coworker can be invited or removed independently
- Git Gateway preserves the existing repository-backed publishing and Netlify rebuild flow
- the developer's normal local Git workflow remains unchanged

Operational requirements:

- Netlify Identity is enabled and registration is set to **Invite only**
- Git Gateway is enabled for the site's connected repository
- each editor is invited separately from Netlify's Identity user management
- the public layout forwards Identity invitation/recovery hashes to `/admin/`
- `/admin/` uses `@netlify/identity` to accept invitations and password recovery, then loads Decap; ordinary CMS login remains Decap's email/password Git Gateway form
- no GitHub OAuth provider or direct repository permission is required for CMS editors

Git Gateway is currently a Netlify Beta service. This is an accepted operational dependency and should be revisited if Netlify changes its support status.

### Local development backend

For local CMS development, use a local Decap proxy backend instead of hosted GitHub OAuth.

Implementation rule:

- production uses the Decap `git-gateway` backend with Netlify Identity
- localhost development may switch to a Decap local backend proxy for repo-backed editing without Netlify auth
- the local proxy is a development-only tool and must not be treated as a public or deployed service

Reason:

- allows local `/admin/` editing and save-flow testing
- keeps local implementation work independent from hosted OAuth sessions
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

The only launch-critical secret is the mailbox password for the contact form (see the contact form rule).

### Contact form rule

The contact form sends its messages by email through a Netlify Function and the club's own mail server. Netlify Forms is not used: its email notifications only reach team members of the Netlify account, and the owner will not upgrade the plan. Decision record: `.scratch/contact-mail/spec.md`.

Implementation requirements:

- the form posts to `/api/contact`; the function validates the input and sends one mail over SMTP (`nodemailer`) from the club mailbox to the recipient address, with the visitor as Reply-To
- required fields are `name`, `email`, and `message`, with optional `subject`; a hidden honeypot field `bot-field` sends nothing when filled
- mail settings live only in Netlify environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (optional, default on), `SMTP_USER` (also the sender), `SMTP_PASS` (secret), `CONTACT_TO`; never in the repo
- successful submissions end on `/kontakt/danke/`; a failed send or invalid input shows an error note on `/kontakt/` (with JavaScript the typed text stays; without it the note shows through the URL fragment and the text is lost)
- fallback email/contact details remain visible on `/kontakt/` even if sending fails
- the function logic lives in `src/lib/contact/handle-contact.ts` and is tested with a fake mail sender; `netlify/functions/contact.ts` only connects it to `nodemailer`

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
