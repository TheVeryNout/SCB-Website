# Content And CMS Specification

## Purpose

This document is the canonical content-model and Decap CMS contract for the public `SCB` website.

Use it to decide:

- which content collections exist
- which content is editable in CMS
- which fields are structured vs freeform
- which content belongs in shared settings vs individual pages

If this document conflicts with [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md), this document wins unless [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md) or the user says otherwise.

---

## Boundaries

This document defines:

- canonical content units
- CMS-editable vs code-owned boundaries
- field-level modeling rules
- Decap collection responsibilities

This document does not define:

- Astro component structure
- build pipeline behavior
- migration workflow
- calendar recurrence behavior
- public legal/data confirmation status

Those belong in:

- `implementation.md`
- `migration.md`
- `calendar.md`
- `public-data-register.md`

---

## Core Editorial Rules

### Rule 1: make routine edits easy

Editors must be able to update routine public content without touching code.

### Rule 2: do not expose developer-only controls

Do not expose fields that only exist for implementation convenience.

### Rule 3: structure only where it reduces mistakes

Use structured fields for:

- dates
- links
- repeated cards
- board members
- shared contact/social data

Use rich text for:

- long page body copy
- legal text
- post bodies

### Rule 4: avoid duplicate truth

If a fact appears in multiple places, it should have one canonical content owner.

Examples:

- contact details belong in shared site settings, not copied into multiple pages
- social links belong in shared site settings

### Rule 5: event semantics defer to `calendar.md`

This document creates the `events` collection, but event field semantics, recurrence, occurrence URLs, and status behavior are governed by [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md).

---

## Canonical Content Units

Launch content is divided into these content units:

1. shared site settings
2. homepage singleton
3. static page singletons
4. news posts collection
5. events collection
6. media collection

### Shared site settings

Purpose:

- hold public facts reused across the site

Must include:

- organization name
- short site-wide description
- contact email
- contact phone if published
- WhatsApp if published
- postal/legal address
- social links
- donation details if published
- footer text/link data

Shared site settings are the implementation source for repeated facts.

`public-data-register.md` remains the confirmation source for whether those facts are safe to publish.

### Homepage singleton

Purpose:

- hold homepage-specific editorial content that changes more often than code

Must include:

- hero title
- hero intro
- hero image
- optional featured announcement block
- membership CTA copy
- media teaser copy

The homepage must not store duplicated event instances or duplicated news content.

News and event previews are derived from their own collections.

### Static page singletons

Create dedicated singletons for:

- `about`
- `membership`
- `contact`
- `impressum`
- `datenschutz`

Each page owns its page-specific copy only.

Shared facts must be pulled from shared site settings where applicable.

### News posts collection

Purpose:

- publish club updates and announcements

### Events collection

Purpose:

- publish public event definitions for the website calendar

All event-model rules defer to [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md).

### Media collection

Purpose:

- manage public media entries shown on the media page

Media entries may represent:

- YouTube video links
- photo gallery entries
- mixed editorial media cards

---

## CMS Editable Vs Code Owned

### Editable in CMS

- news posts
- events
- homepage copy blocks
- about page content
- membership page content
- contact page intro/location content
- legal page bodies
- media entries
- shared public contact/social/donation data

### Code owned

- route definitions
- component behavior
- calendar recurrence engine
- derived news/event preview logic
- redirects
- build-time validation rules
- styling tokens and layout implementation

### Guardrail

If a field exists only so the implementation can render a component, it should usually stay code-owned or be derived automatically.

---

## Canonical Collections

Use these logical collections.

Exact Astro file paths are defined in `implementation.md`.

### `site-settings`

Type:

- singleton

Responsibilities:

- shared public organization data
- footer/social/contact data
- donation details

Required fields:

- `organizationName`
- `siteDescription`
- `contactEmail`
- `postalAddress`
- `socialLinks`

Optional fields:

- `contactPhone`
- `whatsApp`
- `donationDetails`
- `footerNote`

### `homepage`

Type:

- singleton

Required fields:

- `title`
- `heroTitle`
- `heroIntro`

Optional fields:

- `heroImage`
- `featuredAnnouncement`
- `membershipCtaTitle`
- `membershipCtaText`
- `membershipCtaLabel`
- `mediaTeaserTitle`
- `mediaTeaserText`

`featuredAnnouncement` includes an editor-facing `enabled` toggle so the homepage block can be hidden without deleting its title, body, or link fields. Existing or omitted toggle values default to enabled for backward-compatible content.

### `pages`

Type:

- singleton entries per page

Required entries:

- `about`
- `membership`
- `contact`
- `events`
- `impressum`
- `datenschutz`

#### `about`

Required fields:

- `title`
- `intro`
- `body`
- `goals`
- `boardMembers`
- `statutesPdf`

#### `events`

Required fields:

- `title`
- `intro`

Optional fields:

- `eyebrow`
- `listTitle`
- `listIntro`
- `additionalInfo`

`additionalInfo` must be editor-facing as `Zusatzinfos` and include an on/off toggle so the box can be hidden without deleting its text.

Optional fields:

- `heroImage`

`boardMembers` must be structured entries with:

- `name`
- `role`
- `image` optional

#### `membership`

Required fields:

- `title`
- `intro`
- `benefits`
- `applicationInstructions`
- `membershipFormPdf`

Optional fields:

- `heroImage`
- `notes`

Fee information, if ever shown on this page, is ordinary page content and/or PDF-linked content.

Do not create a dedicated pricing model or shared pricing schema for launch.

#### `contact`

Required fields:

- `title`
- `intro`
- `locationName`
- `mapUrl`

Optional fields:

- `addressOverride`
- `mapImage`
- `locationNotes`

The contact page body must not duplicate the canonical contact email/phone/social facts in freeform copy.

#### `impressum`

Required fields:

- `title`
- `body`

#### `datenschutz`

Required fields:

- `title`
- `body`

### `posts`

Type:

- repeatable collection

Required fields:

- `title`
- `publishedAt`
- `excerpt`
- `body`

Optional/backward-compatible fields:

- `slug`
- `draft`
- `coverImage`
- `coverAlt`
- `coverCaption`
- `coverMode`
- `gallery`
- `category`
- `updatedAt`
- `sourceUrl`

News publication and media rules:

- newly created CMS posts default to draft
- existing posts without a `draft` field remain published for backward compatibility
- drafts and future-dated posts are excluded from public indexes, related lists, and static detail routes
- Decap derives new post filenames from the title and does not expose a machine slug to editors
- existing frontmatter slugs remain supported; when absent, the stable content filename supplies the public slug
- all migrated filename/slug pairs were verified equal before this fallback was enabled; duplicate resolved slugs fail validation/build
- `showGalleryOnMediaPage` is one editor-facing boolean; only eligible public posts with non-empty galleries are aggregated onto `/pics-n-vids/`
- cover presentation is controlled by `wide | portrait | contained`
- a maintained cover must have editor-authored alternative text; all restored news covers satisfy this rule
- gallery entries are structured as image, required alternative text, and optional caption
- gallery order in CMS is public display order
- the public gallery viewer is code-owned progressive enhancement: Decap continues to own only image selection, alternative text, caption, and ordering
- the gallery list is the stock Decap list plus one code-owned button (`gallery-batch` in `public/admin/preview.js`) that adds several photos at once; each photo is converted, named and persisted like a single upload and starts with an empty required description
- image paths: the editor holds `src/assets/...` and `public/admin/preview.js` writes `/src/assets/...` into the content file (and strips it again on load), because Decap cannot show an unsaved upload under a path that starts with `/`
- gallery thumbnails and bounded large-view WebP assets are derived by Astro at build time; the CMS upload remains the rebuildable source asset rather than the default browser-delivered lightbox file
- curated post media must live under the configured CMS media folder (`src/assets/images/uploads`) so existing entries, media selection, and previews use the same manageable assets; retained Wix-staging originals remain provenance rather than CMS inputs
- `sourceUrl` is internal provenance and is not rendered as article body copy
- support at most one optional public category field
- do not build a large taxonomy system

### `events`

Type:

- repeatable collection

Required rule:

- model fields, recurrence, and validation must match [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)

This document must not redefine those semantics.

The CMS label for the event-level optional info box is `Zusatzinfos`. It includes an on/off toggle and is intentionally not weather-specific.

### `media`

CMS surfaces:

- `Pics n Vids`: repeatable standalone photo galleries under `src/content/media/galleries/`
- `Videos`: one file-backed YouTube playlist setting at `src/content/media/skateclub-biriciana-videos.md`

Standalone gallery fields:

- required: `title`, hidden `type: photo-gallery`, non-empty structured `gallery`
- optional: `summary`, `publishedAt`
- Decap derives the content filename from the visible title; no slug field is exposed

Playlist fields:

- required: hidden `title`, hidden `type: youtube`, `youtubeUrl`
- no unused playlist metadata is exposed; the public playlist title and supporting copy remain code-owned

Photo-gallery ownership rules:

- standalone gallery records own only their own image selection, order, alternative text, and captions
- Neuigkeiten posts own their own galleries and opt into `/pics-n-vids/` through `showGalleryOnMediaPage`; no second media record or cross-collection identifier exists
- `/pics-n-vids/` combines standalone galleries with eligible opted-in public post galleries and sorts them by descending publication date with a deterministic key tie-breaker
- draft, future-dated, opted-out, empty-gallery posts are excluded before aggregation
- standalone gallery items use the same structured `image`, required `alt`, and optional `caption` model as post galleries
- the obsolete `thumbnailImage`, `postSlug`, and `featured-media` fields/types are not part of the maintained model

Launch rule:

- media entries should stay editorial and simple
- do not model them like a full DAM or video platform

---

## Field Modeling Rules

### Links

All public links must be stored as dedicated link fields, not buried in prose when avoidable.

Examples:

- social URLs
- map URL
- registration URL
- YouTube URL
- PDF references

### Images

Images must be selected through file/image fields, not pasted as raw paths in freeform markdown.

The repository-owned `bun run images:prepare` converter remains migration and developer-maintenance tooling with a `2560px` maximum edge, WebP quality `80`, and fixed effort `5`; it is not a routine editor prerequisite and is not mentioned in CMS forms. Retained raw Wix evidence and `src/assets/images/wix-staging/` remain preservation inputs outside any deletion policy. The technically verified CMS-03A interim workflow uses the same structured `{ image, alt, caption }[]` list for Neuigkeiten and standalone galleries, adds images one at a time, requires a plain-language image description, keeps the public caption optional, and exposes stock Decap ordering and persistence without claiming batch support. Multi-file preparation is deferred to CMS-03/CMS-04 in `media-cms-overhaul.md`, where a later repository-owned workaround may be designed separately.

### Dates

Dates must be structured fields, not manually typed inside labels where CMS edits are expected.

### Repeated people/items

Use structured lists for:

- board members
- goals
- footer/social items if edited in CMS

### Legal text

Keep legal text as rich text/body content.

Do not over-structure it.

---

## Decap UX Rules

### Labels

Use editor-facing labels in German where that improves editor comfort.

### Help text

Add concise help text for fields that are easy to misuse:

- social links
- map link
- featured announcement
- optional category

### Defaults

Use safe defaults:

- optional featured block objects may keep their content while exposing an on/off toggle; existing populated featured announcement content defaults to on
- new news posts default to draft; omitted draft values on migrated posts default to published
- future-dated news posts remain hidden until their publication timestamp
- optional media/gallery fields empty by default
- event defaults per `calendar.md`
- blank optional CMS fields should normalize to omitted/default values where Decap writes empty strings

### Preview complexity

The news collection has a maintained Decap preview because styled long-form authoring is a core editorial requirement. It must represent article hierarchy, cover presentation, body typography, and gallery order closely enough to catch authoring mistakes. Preview defaults must match public behavior: an existing entry without `draft` is shown as published, while a newly created CMS entry keeps its explicit default of `draft: true`.

Do not add custom preview widgets to other collections unless a field is unusable without one. A misleading or unmaintained preview is worse than an explicitly disabled preview.

### Editorial workflow complexity

Favor the simplest workable Decap setup.

Do not introduce CMS complexity that assumes editors understand Git branching or app-style workflows.

---

## Duplicate-Truth Prevention Rules

To avoid future data drift:

- repeated contact details live in `site-settings`
- social links live in `site-settings`
- board member list lives in `pages.about`
- legal text bodies live only in their own legal page entries
- event data lives only in `events`
- news data lives only in `posts`

If a page needs the same fact in two places, render it from one shared source.

---

## Source Of Truth Mapping

- Product constraints: [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
- Page scope: `routes-and-pages.md`
- Calendar semantics: [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
- Public fact confirmation: `public-data-register.md`
- Wix source evidence: [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md)

---

## Acceptance Rule

This document is satisfied only when:

- every launch content type has a clear owner
- CMS-editable vs code-owned boundaries are explicit
- shared public facts have one canonical content owner
- event collection existence is defined here without contradicting `calendar.md`
- later agents do not need to invent a new content model from `wix-audit.md`
