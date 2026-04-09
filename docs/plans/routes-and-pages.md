# Routes And Pages Specification

## Purpose

This document is the canonical route and page-scope contract for the public `SCB` website.

Use it to decide:

- which public routes exist at launch
- which routes appear in primary navigation
- what each page must contain
- which Wix behaviors are preserved, simplified, or dropped

If this document conflicts with [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md), this document wins unless [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md) or the user says otherwise.

---

## Boundaries

This document defines:

- final public route set
- page purpose
- required page sections
- preserve vs simplify vs drop decisions
- legacy route cleanup intent

This document does not define:

- Astro file structure
- Decap field schemas
- migration workflow
- contact form backend implementation
- detailed calendar recurrence logic

Those belong in:

- `implementation.md`
- `content-cms.md`
- `migration.md`
- `calendar.md`

---

## Global Information Architecture

### Primary navigation at launch

Use this top-level navigation order:

1. `Start` -> `/`
2. `Neuigkeiten` -> `/neuigkeiten/`
3. `Uber uns` -> `/ueber-uns/`
4. `Pics n Vids` -> `/pics-n-vids/`
5. `Veranstaltungen` -> `/veranstaltungen/`
6. `Mitgliedschaft` -> `/mitgliedschaft/`
7. `Kontakt` -> `/kontakt/`

### Footer links at launch

Use these persistent footer links:

- `Impressum` -> `/impressum/`
- `Datenschutz` -> `/datenschutz/`
- Instagram
- confirmed YouTube link only if [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md) marks a canonical destination safe to publish
- email/contact reference

### Launch route set

The public site must ship with these routes:

- `/`
- `/neuigkeiten/`
- `/neuigkeiten/[slug]/`
- `/ueber-uns/`
- `/pics-n-vids/`
- `/veranstaltungen/`
- `/veranstaltungen/[slug]/[date]/`
- `/mitgliedschaft/`
- `/kontakt/`
- `/kontakt/danke/`
- `/impressum/`
- `/datenschutz/`

### Routes that do not need dedicated launch pages

Do not create these unless a real later need appears:

- standalone `/downloads/`
- standalone `/spenden/`
- standalone `/verein/`
- app-style filtered archives

Downloads, donation details, and secondary references should live inside the relevant pages, not as extra top-level IA.

---

## Route Cleanup Rules

### Membership route cleanup

The final public route for membership is:

- `/mitgliedschaft/`

The Wix source route:

- `/copy-of-veranstaltungen`

is a source artifact and must not be preserved as a canonical public route.

### Blog route cleanup

The final public route pattern for posts is:

- `/neuigkeiten/[slug]/`

Do not preserve the Wix `/post/...` route shape as the main public route.

### Event route cleanup

The final public route pattern for event occurrences is:

- `/veranstaltungen/[slug]/[yyyy-mm-dd]/`

Do not preserve Wix event detail route semantics.

### Legacy redirect rule

When technically practical, add redirects from known legacy Wix-like routes to the new canonical routes.

Do not add blind wildcard redirects for event detail pages until date mappings are verified in migration QA.

---

## Page Contracts

### Homepage

Route:

- `/`

Purpose:

- establish club identity quickly on mobile
- give visitors the shortest path to news, events, membership, media, and contact

Required sections:

- hero or intro block with club name and short welcome copy
- latest news preview
- upcoming events preview
- membership CTA
- media teaser
- footer links

Allowed optional sections:

- one featured announcement or fundraising block
- one skatepark photo preview block

Preserve:

- homepage role as the main overview page
- short welcome/introduction
- presence of a recurring event highlight if still relevant
- presence of visual club imagery

Simplify:

- homepage slideshow may become a simple static teaser gallery
- recurring `Sunday Funday` should be represented by real event data or a derived event highlight, not hardcoded decorative copy

Drop:

- Wix widget chrome
- unnecessary duplicate CTAs
- any layout dependency on desktop hero compositions

### News Index

Route:

- `/neuigkeiten/`

Purpose:

- show published news posts in reverse chronological order

Required sections:

- page title and short intro
- post list
- post card metadata with date
- excerpt or preview text

Preserve:

- news/blog function
- dates
- excerpts
- cover images where available

Simplify:

- keep taxonomy minimal
- use a simple reverse-chronological list as the default
- paginate only if content volume makes a single page unwieldy

Drop at launch:

- on-site search
- multi-filter UI
- large category system

Reason:

- current content volume does not justify the added editorial and technical overhead

### News Detail

Route:

- `/neuigkeiten/[slug]/`

Purpose:

- publish individual long-form updates with images

Required sections:

- title
- publish date
- body content
- inline images or gallery when present

Preserve:

- long-form post content
- inline imagery
- important factual public information

Simplify:

- optional author display only if useful
- reading-time display is optional, not required

Drop at launch:

- Wix share widgets
- platform-style social action chrome

### About

Route:

- `/ueber-uns/`

Purpose:

- explain the club, its goals, and who is responsible

Required sections:

- club intro/story
- goals or mission block
- board/member responsibility block
- statutes PDF link

Preserve:

- organizational story
- goals list
- board information
- statutes download

Simplify:

- board presentation should be a clean mobile-friendly grid or list
- no decorative gallery behavior is required

### Media

Route:

- `/pics-n-vids/`

Purpose:

- provide a simple public media area for photos and video links

Required sections:

- page title and short intro
- video list or gallery
- optional photo gallery or image block

Preserve:

- media/video function
- visible video titles
- source-audited video destinations without inventing a global channel CTA

Simplify:

- present videos as linked cards or lightweight embeds only if privacy treatment allows
- photos can be a curated gallery, not a complex media platform

Drop at launch:

- Wix share UI
- heavyweight embedded gallery/player systems

### Events Index

Route:

- `/veranstaltungen/`

Purpose:

- provide the public calendar entry point

Required sections:

- page title and short intro
- upcoming events list
- month overview

Optional sections:

- one short note about weather-sensitive events
- one simple CTA to membership if it materially helps visitors

Preserve:

- public event discovery
- recurring and one-off events

Simplify:

- upcoming list is the primary experience on mobile
- month view is secondary

Drop at launch:

- Wix widget behavior
- repeated marketing blocks that distract from event discovery

Calendar-specific behavior is defined in [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md).

### Event Detail

Route:

- `/veranstaltungen/[slug]/[date]/`

Purpose:

- show one concrete public event occurrence

Required sections:

- title
- date and time
- status
- summary
- location block
- body content when present

Optional sections:

- hero image
- registration or CTA link
- weather note
- related upcoming occurrences

Preserve:

- core public event information

Simplify:

- no app-like scheduling controls
- no hidden operational metadata

### Membership

Route:

- `/mitgliedschaft/`

Purpose:

- explain why membership matters and provide the official membership form download

Required sections:

- short intro
- benefits or reasons to join
- membership PDF download
- application instructions
- optional plain-text fee note only if the user later wants fee copy visible on the page

Preserve:

- membership explanation
- membership application PDF
- instructions for digital or postal submission

If fee information appears on the page, preserve it as ordinary content only.

Simplify:

- official downloadable form remains the authoritative application artifact
- do not design a pricing-specific UI or data model for launch

Drop at launch:

- any attempt to rebuild the PDF as a full web application form
- any pricing-specific content system, schema, or calculator

### Contact

Route:

- `/kontakt/`

Purpose:

- give visitors a reliable way to contact the club and find the skatepark/location

Required sections:

- contact intro
- contact form
- fallback contact details
- location block
- external map link

Form field rule:

- required launch fields are `name`, `email`, and `message`
- one additional short text field may be used for `subject` if retained during migration

Preserve:

- existence of a working contact form
- fallback contact details
- location guidance

Simplify:

- do not embed a live map by default
- use a simple location block or static image linking out to Google Maps

Contact backend is defined in [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md) and must not be re-decided here.

### Contact Thank You

Route:

- `/kontakt/danke/`

Purpose:

- confirm successful contact form submission without adding app-like behavior

Required sections:

- short confirmation message
- link back to `/kontakt/`
- fallback contact email or homepage link

Simplify:

- keep this as a static utility page only

### Impressum

Route:

- `/impressum/`

Purpose:

- publish the current legal notice

Required sections:

- legal body content

Preserve:

- current legal text and public legal data unless the user explicitly updates it

Simplify:

- simple legal page layout only

### Datenschutz

Route:

- `/datenschutz/`

Purpose:

- publish the current privacy policy text

Required sections:

- privacy text body

Preserve:

- current source text as-is for migration unless the user explicitly replaces it

Simplify:

- simple legal page layout only

---

## Launch Feature Decisions By Area

### News

Launch with:

- post index
- post detail pages
- reverse-chronological ordering

Do not launch with:

- on-site search
- complex categories
- filter UI beyond a single optional category label

### Media

Launch with:

- simple video cards or lightweight embeds
- optional photo gallery

Do not launch with:

- platform-style share widgets
- custom video player infrastructure

### Events

Launch with:

- upcoming list
- month overview
- occurrence detail pages

Do not launch with:

- registration system
- drag/drop calendar
- live sync from `SCB-Dash`

### Contact

Launch with:

- simple contact form
- fallback contact info
- external map link

Do not launch with:

- live map embed by default
- complex conditional form flows

---

## Content Source Rules Per Page

- Public page purpose and broad structure come from the current Wix site as documented in [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md).
- Product constraints come from [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md).
- Calendar-specific rendering and modeling come from [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md).
- Risky public facts must be checked against `public-data-register.md` before being treated as final.

---

## Acceptance Rule

This document is satisfied only when:

- every launch-critical public route is explicitly listed here
- every listed route has a clear page purpose
- every listed route has required sections
- every major Wix behavior has an explicit preserve/simplify/drop decision
- no later agent needs to infer route scope from `wix-audit.md` alone
