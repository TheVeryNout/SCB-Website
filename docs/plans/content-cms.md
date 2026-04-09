# Content And CMS Specification

## Purpose

This document is the canonical content-model and Decap CMS contract for the public `SCB` website.

Use it to decide:

- which content collections exist
- which content is editable in CMS
- which fields are structured vs freeform
- which content belongs in shared settings vs individual pages

If this document conflicts with [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md), this document wins unless [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md) or the user says otherwise.

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
- pricing summaries
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
- membership pricing summary belongs in shared site settings, not duplicated in page body prose

### Rule 5: event semantics defer to `calendar.md`

This document creates the `events` collection, but event field semantics, recurrence, occurrence URLs, and status behavior are governed by [calendar.md](/home/nout/REPO/SCB/calendar.md).

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
- membership pricing summary
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

All event-model rules defer to [calendar.md](/home/nout/REPO/SCB/calendar.md).

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
- shared public contact/social/donation/membership summary data

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
- membership pricing summary
- donation details

Required fields:

- `organizationName`
- `siteDescription`
- `contactEmail`
- `postalAddress`
- `socialLinks`
- `membershipPricingSummary`

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

### `pages`

Type:

- singleton entries per page

Required entries:

- `about`
- `membership`
- `contact`
- `impressum`
- `datenschutz`

#### `about`

Required fields:

- `title`
- `intro`
- `body`
- `goals`
- `boardMembers`

Optional fields:

- `heroImage`
- `statutesPdf`

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

Pricing summary must render from `site-settings.membershipPricingSummary`, not from duplicated freeform prose.

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
- `slug`
- `publishedAt`
- `excerpt`
- `body`

Optional fields:

- `coverImage`
- `gallery`
- `category`
- `updatedAt`
- `sourceUrl`

Launch rule:

- support at most one optional public category field
- do not build a large taxonomy system

### `events`

Type:

- repeatable collection

Required rule:

- model fields, recurrence, and validation must match [calendar.md](/home/nout/REPO/SCB/calendar.md)

This document must not redefine those semantics.

### `media`

Type:

- repeatable collection

Required fields:

- `title`
- `slug`
- `type`

Optional fields by type:

- `youtubeUrl`
- `thumbnailImage`
- `gallery`
- `summary`
- `publishedAt`

Controlled values:

- `type`: `youtube | photo-gallery | featured-media`

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

### Dates

Dates must be structured fields, not manually typed inside labels where CMS edits are expected.

### Repeated people/items

Use structured lists for:

- board members
- goals
- membership pricing rows
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
- pricing rows
- featured announcement
- optional category

### Defaults

Use safe defaults:

- optional featured blocks off by default
- optional media/gallery fields empty by default
- event defaults per `calendar.md`

### Preview complexity

Do not require custom preview widgets for launch unless a field is unusable without one.

### Editorial workflow complexity

Favor the simplest workable Decap setup.

Do not introduce CMS complexity that assumes editors understand Git branching or app-style workflows.

---

## Duplicate-Truth Prevention Rules

To avoid future data drift:

- membership pricing summary lives in `site-settings`
- repeated contact details live in `site-settings`
- social links live in `site-settings`
- board member list lives in `pages.about`
- legal text bodies live only in their own legal page entries
- event data lives only in `events`
- news data lives only in `posts`

If a page needs the same fact in two places, render it from one shared source.

---

## Source Of Truth Mapping

- Product constraints: [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md)
- Page scope: `routes-and-pages.md`
- Calendar semantics: [calendar.md](/home/nout/REPO/SCB/calendar.md)
- Public fact confirmation: `public-data-register.md`
- Wix source evidence: [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md)

---

## Acceptance Rule

This document is satisfied only when:

- every launch content type has a clear owner
- CMS-editable vs code-owned boundaries are explicit
- shared public facts have one canonical content owner
- event collection existence is defined here without contradicting `calendar.md`
- later agents do not need to invent a new content model from `wix-audit.md`
