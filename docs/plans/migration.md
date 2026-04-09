# Wix To Astro Migration Specification

## Purpose

This document is the canonical migration workflow and QA contract for moving the current Wix public site into the Astro rebuild.

Use it to decide:

- how source material is captured
- how migration artifacts are stored
- how transformed content is produced
- how unresolved source issues are tracked
- how migration QA and signoff work

If this document conflicts with [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md), this document wins on process unless [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md) or the user says otherwise.

---

## Boundaries

This document defines:

- migration workflow
- manifest requirements
- raw vs transformed artifact handling
- per-content-type QA rules

This document does not define:

- product scope
- final page purpose
- implementation architecture
- calendar recurrence semantics
- final factual truth

Those belong in:

- [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md)
- `routes-and-pages.md`
- `implementation.md`
- [calendar.md](/home/nout/REPO/SCB/calendar.md)
- `public-data-register.md`

---

## Migration Principles

### Principle 1: inventory first

Do not begin content transformation until the public route and asset inventory is frozen.

### Principle 2: keep evidence

Preserve raw source captures separately from transformed Astro content.

### Principle 3: migrate meaning, not Wix behavior

Wix widgets are data sources, not UI contracts.

### Principle 4: do not silently resolve uncertainty

If the source is contradictory, record the contradiction and treat it as QA work.

### Principle 5: no final hotlinking

Final production content must not depend on Wix-hosted assets where local copies are practical.

---

## Migration Working Structure

Use this working structure when migration begins:

```text
/migration/
  manifest.json
  notes/
  raw/
    pages/
    posts/
    events/
    feeds/
    assets/
    pdfs/
  normalized/
    pages/
    posts/
    events/
    media/
```

### Directory meanings

- `raw/`: untouched source captures
- `normalized/`: extracted human-usable intermediate data
- `manifest.json`: canonical migration inventory and QA tracker
- `notes/`: human notes for unresolved issues that do not fit cleanly in the manifest

Do not store raw capture evidence only inside ad hoc terminal logs.

---

## Manifest Requirements

Use one canonical manifest at:

- `migration/manifest.json`

Each manifest record must track:

- `sourceUrl`
- `sourceType`
- `targetRoute`
- `targetContentPath`
- `localAssetPaths`
- `status`
- `needsManualQa`
- `publicDataRisk`
- `notes`

### Allowed `sourceType` values

- `page`
- `post-index`
- `post`
- `event-index`
- `event`
- `media`
- `pdf`
- `asset`
- `legal`

### Allowed `status` values

- `inventoried`
- `captured`
- `normalized`
- `migrated`
- `qa-pending`
- `approved`
- `blocked`

### Allowed `publicDataRisk` values

- `none`
- `legal`
- `financial`
- `membership`
- `social-link`
- `event-date`

---

## Migration Workflow

### Phase 1: freeze source inventory

1. inventory all public routes from the Wix source
2. inventory known feed URLs, PDFs, and major assets
3. create initial manifest entries
4. mark obvious manual QA risks

### Phase 2: raw capture

Capture and store:

- route HTML or equivalent source capture
- blog feed XML
- direct PDFs
- direct asset URLs
- event detail captures

Do not transform during this step.

### Phase 3: normalization

Extract into human-usable intermediate artifacts:

- cleaned page text
- post metadata
- post body content
- event notes with verified visible date/time
- media item lists
- asset mapping lists

### Phase 4: local asset migration

Download and localize:

- images
- PDFs
- icons
- other public files worth preserving

Record final local destinations in the manifest.

### Phase 5: content transformation

Create Astro-ready content entries in the canonical content collections.

### Phase 6: route and redirect mapping

Map each migrated source item to its final route.

Add redirect records only when mapping confidence is high.

### Phase 7: QA and signoff

Perform per-type QA, resolve blockers, and update manifest statuses.

---

## Source-Specific Rules

### Static pages

Source:

- Wix page routes

Capture:

- raw HTML
- extracted text
- direct asset references

Transform into:

- page singleton content
- shared settings updates where repeated facts belong there

### News index and posts

Source:

- blog feed XML
- individual post pages

Capture:

- feed metadata for inventory
- post detail pages for full body and media

Transform into:

- `posts` collection entries

Rules:

- preserve publication dates
- preserve important factual text
- drop Wix share widget behavior

### Events

Source:

- events page
- event detail pages

Critical rule:

- never trust the Wix event slug as canonical date truth

Capture:

- source route
- visible date/time text
- visible location
- summary/body text

Transform into:

- clean logical event entries in the website event model

Rules:

- recurring route artifacts must be consolidated where appropriate
- every migrated event needs manual date/time verification
- `Sunday Funday` should usually become one recurring definition with exclusions as needed

### Membership PDF and statutes PDF

Source:

- direct PDF URLs from Wix

Rules:

- download local copies
- preserve source URLs in the manifest
- treat pricing content inside PDFs as high-risk factual content

### Media

Source:

- media page
- direct asset/video URLs

Rules:

- preserve visible titles
- preserve canonical external destinations
- do not recreate Wix media chrome

### Legal pages

Source:

- `impressum`
- `datenschutz`

Rules:

- migrate source text conservatively
- do not silently rewrite legal text
- flag legal/contact facts in the public data register

---

## Manual QA Rules

### Required QA for all migrated items

Check:

- target route exists
- core text is present
- key assets render
- no Wix-hosted production dependency remains where local copy should exist

### Required QA for risky data

Check against `public-data-register.md`:

- legal/contact data
- social links
- donation details
- membership pricing
- event dates

### Required QA for events

Check:

- visible source date/time vs migrated event date/time
- recurring logic matches source intent
- location is readable
- status is not silently invented

### Required QA for membership content

Check:

- pricing summary does not silently merge conflicting source values
- membership PDF link works
- instructions remain intact

### Required QA for redirects

Check:

- known legacy route redirects land on the correct target
- no guessed event redirect is published without evidence

---

## Blocker Rules

Mark a manifest item `blocked` when:

- source data is contradictory and affects public correctness
- required content is missing and cannot be safely inferred
- financial or legal data conflict is unresolved
- a route mapping is uncertain

When blocked:

- keep the note explicit
- do not silently guess
- raise the blocker to the user at the right time

---

## Signoff Rules

An item is `approved` only when:

- it has been migrated
- manual QA is complete
- risky public facts are either confirmed or explicitly accepted as source-parity pending values

Final launch signoff requires:

- no unresolved `conflict` values in public-critical data without user acceptance
- no `blocked` launch-critical routes
- no event-date mappings based only on Wix slug assumptions

---

## Source Of Truth Mapping During Migration

- Product constraints: [website-foundation.md](/home/nout/REPO/SCB/website-foundation.md)
- Page scope: `routes-and-pages.md`
- Content model: `content-cms.md`
- Calendar logic: [calendar.md](/home/nout/REPO/SCB/calendar.md)
- Public fact risk status: `public-data-register.md`
- Source evidence and audit notes: [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md)

---

## Acceptance Rule

This document is satisfied only when:

- raw and transformed migration artifacts have distinct homes
- the manifest schema is explicit
- every content type has a migration rule
- manual QA requirements are explicit
- later agents can migrate content without improvising the process
