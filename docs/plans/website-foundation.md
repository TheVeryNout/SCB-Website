# Website Foundation Specification

## Purpose

This document is the primary source of truth for the `SCB` website project.

It defines:

- what the website is
- what the website is not
- which constraints outrank all others
- which source material is authoritative for migration
- which implementation decisions are already locked

If a later planning or implementation document conflicts with this file, this file wins unless the user explicitly overrides it.

---

## Read This First

This project is a rebuild of the current public Skate Club Biriciana website into a simpler, more robust Astro site.

This foundation document is intentionally short on source-site detail. The detailed audit of the existing website lives in [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md).

Cold-start rule:

- read this file first to understand product intent and constraints
- read [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md) second to understand the current Wix site, route inventory, migrated content scope, assets, and unresolved source-data quirks

---

## Project Context

### What is being rebuilt

The project is the public website of **Skate Club Biriciana e.V.**, a skateboard non-profit.

The current live/public source site is a Wix website documented in [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md).

Canonical source URLs already identified:

- public/custom domain: `https://skateclubbiriciana.de`
- direct Wix source used during audit: `https://briareos.wixsite.com/skateclubbiriciana`

### Why a rebuild exists

The current Wix site is the source of public content and information architecture, but not the target implementation model and not the target design quality.

The rebuild exists to produce a site that is:

- easier to maintain
- more robust
- better on mobile
- easier to edit through a simple CMS
- cleaner architecturally than the Wix source

### What `SCB-Dash` is

`SCB-Dash` is a separate private/internal dashboard project for club operations.

It is **not** the website.

It is **not** the source of truth for the public website launch.

It matters only as a possible future system boundary, mainly around event data export. It should not shape the website architecture beyond the rule that the public website must stay independent from it.

---

## Core Product Statement

The `SCB` website is a **mobile-first public information website** for a non-profit.

It is not a complex application.

Its job is to help visitors quickly find:

- who the club is
- what the club does
- current news
- upcoming events
- membership information
- contact information
- media and downloadable documents

That is the product.

---

## Non-Negotiable Priorities

These priorities outrank visual flourishes, extra features, and speculative integrations.

### 1. Mobile-first

Mobile is the primary layout target, not a fallback.

Every page and component must be designed from the phone view outward.

### 2. Simplicity

The site must stay small in scope and understandable in structure.

If two solutions both work, choose the simpler one.

### 3. Robustness

The website must keep functioning without depending on fragile live integrations or app-like behavior.

### 4. Easy editing for non-technical admins

Normal content updates must be possible through the CMS without developer intervention.

### 5. Static-first architecture

Prefer build-time content and rendering over runtime systems unless there is a real requirement that cannot be met otherwise.

---

## What The Website Is

The website is:

- a public-facing club website
- a source of general information
- a place to publish updates/news
- a place to publish public events
- a place to show simple media content
- a place to provide downloads and contact information

---

## What The Website Is Not

The website is not:

- an internal dashboard
- an operations tool
- a member management system
- a volunteer assignment system
- a scheduling application
- a social platform
- a complex media platform
- a thin frontend over private club infrastructure

This project must not drift into those categories.

---

## Source-Of-Truth Boundaries

### This file

This file defines:

- product intent
- implementation boundaries
- priority order
- locked constraints

### `wix-audit.md`

[wix-audit.md](/home/nout/REPO/SCB/wix-audit.md) defines:

- the detailed audit of the current Wix site
- route inventory
- asset inventory
- content/system inventory
- known source inconsistencies
- earlier planning decisions already collected

### The current Wix site

The current Wix site is the **content and structure reference**, not the target technical model and not the target design fidelity.

This means:

- preserve content categories and important public information
- preserve key route concepts and page purpose
- preserve assets and downloads where needed
- do not recreate Wix widget behavior just because Wix had it

---

## Locked Technical Decisions

The following decisions are already made and should not be reopened unless the user changes them explicitly:

- Astro SSG
- `bun`
- Netlify-first deployment assumptions
- Decap CMS
- Git-backed content workflow
- static-first architecture
- local asset migration where practical
- privacy-aware treatment of embeds and maps

---

## Relationship To `SCB-Dash`

`SCB-Dash` is explicitly outside the website’s launch-critical architecture.

### Hard rules

- the public website must not require `SCB-Dash` at runtime
- the public website must not inherit the dashboard’s internal data model
- the public website must not be blocked by dashboard availability

### Allowed future relationship

Later, `SCB-Dash` may export selected public event data in a narrow one-way flow if the user wants that.

That future possibility does not justify increasing launch complexity now.

---

## Product Scope

### Required website feature areas

The launch site must include:

- homepage
- simple blog/news system
- public event calendar
- simple media gallery
- downloadable PDFs
- contact page
- additional information pages
- legal pages

### Explicit simplification rule

The site does **not** need to be super elaborate.

The right target is a reliable, polished, easy-to-edit information site.

---

## Audience

### Public visitors

Primary visitors include:

- local skaters
- families
- potential members
- supporters
- people looking for contact or club information

### Editors

Editors are club admins and maintainers who are not expected to be IT specialists.

The website must be structured around their editing needs as much as around visitor-facing presentation.

---

## Content and Page Scope

### Homepage

The homepage must communicate:

- club identity
- short introduction
- latest news preview
- upcoming events preview
- membership call to action
- media/gallery teaser
- footer links

### News / blog

The site needs a simple post system with:

- index page
- post detail pages
- dates
- previews/excerpts
- cover images where useful

Keep taxonomy simple. Do not build a large tagging/filtering system without a real need.

### Event calendar

The site needs a public event system with:

- one-off events
- recurring events
- upcoming list
- month overview
- event detail pages

This must remain an editorial/public calendar, not an operations scheduler.

### Media

The site needs a lightweight media area that can show:

- photos
- video links
- YouTube links or playlists where appropriate

It should remain simple and easy to update.

### Downloads

The site must support downloadable files such as:

- membership form PDF
- statutes PDF

### Contact

The contact page must include:

- contact form
- fallback contact details
- location/address information
- external map link

Current preference:

- use a simple image or location block linking externally to Google Maps
- avoid an embedded live map if it creates avoidable privacy/cookie complexity

### Static information pages

The site also needs stable public pages such as:

- about
- membership
- impressum
- datenschutz

---

## Information Architecture

The public structure should stay compact and close to the current known site structure documented in [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md).

Current expected top-level navigation:

- Start
- Neuigkeiten
- Uber uns
- Pics n Vids
- Veranstaltungen
- Mitgliedschaft
- Kontakt

Current expected legal/footer links:

- Impressum
- Datenschutz

Simplify only when simplification helps usability or removes Wix-specific awkwardness. Do not add extra navigation depth without a clear reason.

---

## Mobile-First Implementation Rules

These are implementation rules, not subjective design aspirations.

### Layout and navigation

- design page layouts from narrow viewport upward
- ensure primary navigation is fully usable without hover interactions
- keep tap targets comfortably usable on touch devices
- avoid layouts that require side-by-side desktop assumptions to make sense

### Homepage

- stack homepage content in a clear vertical reading order on mobile
- show news and event previews in a format that remains scannable on phones
- keep primary CTAs visible without relying on complex hero treatments

### Blog

- render post cards and lists as readable vertical flows on mobile
- keep metadata compact and readable
- ensure inline media does not overflow or dominate the screen

### Calendar

- treat the upcoming events list as the primary mobile event experience
- keep month-view interaction lightweight
- ensure date, time, status, and location appear near the top of event detail pages

### Media

- avoid dense thumbnail walls that become unusable on phones
- keep video entries tappable and readable without precision clicking

### Contact

- keep the form straightforward on touch devices
- present fallback contact information in plain readable blocks

### Performance

- minimize client-side JavaScript
- optimize images for mobile delivery
- avoid heavy interactive libraries unless they solve a real problem

---

## CMS Principles

The CMS exists to support routine editing by non-technical admins.

### CMS must allow editing of

- news posts
- events
- selected homepage content blocks
- selected static page content
- media entries or media references
- downloadable file references

### CMS must avoid exposing

- technical implementation flags that editors do not understand
- internal/private-only data
- fields that are only useful for developers

### Editorial modeling rule

Use structured fields where structure meaningfully reduces mistakes.

Use freeform content where adding more structure would only make editing harder.

---

## Design Direction

The design target is:

- cleaner than the current Wix site
- more intentional than the current Wix site
- still simple
- still easy to maintain
- clearly usable on mobile

The target is **not** maximal visual complexity.

The site should look better than Wix without becoming harder to maintain than Wix.

---

## Migration Philosophy

### Migration reference

The current Wix site documented in [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md) is the migration reference.

### What should be preserved

- page purpose
- major information architecture
- important public content
- downloadable files
- public assets worth keeping
- organization information

### What should not be preserved blindly

- awkward Wix route naming
- Wix widget behavior
- source-site implementation quirks
- layout weaknesses
- platform-generated noise

### Migration rule

Migrate public meaning and content, not Wix implementation details.

### Integrity rule

If source data in Wix is contradictory or suspicious, preserve the uncertainty in documentation and treat it as a manual QA item rather than silently guessing.

---

## Public Data Handling

Some public data on the current site is important and may require confirmation before final publication.

Examples already identified in [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md) include:

- legal contact data
- bank/donation data
- membership pricing
- social links
- event dates affected by Wix recurrence quirks

Rule:

- structure this data cleanly
- migrate it carefully
- document mismatches
- do not silently normalize uncertain facts

---

## Constraints

### Must use

- Astro
- `bun`
- Decap CMS
- Netlify-first deployment assumptions

### Must avoid

- unnecessary SSR
- hard runtime dependency on private systems
- heavy JS-first solutions where static rendering is sufficient
- maintenance patterns that require developer intervention for ordinary content updates

---

## Non-Goals For Launch

Do not expand launch scope with:

- custom authentication
- real-time features
- advanced internal workflows
- app-style dashboard functionality
- complex search infrastructure
- custom map systems
- heavyweight calendar or gallery platforms

---

## Priority Order

When tradeoffs appear, choose in this order:

1. mobile usability
2. editorial simplicity
3. robustness
4. correctness of migrated public information
5. clarity of content structure
6. visual polish
7. optional enhancements

This order is binding for implementation decisions.

---

## Foundation Compliance Gates

This document should be considered satisfied only if the implementation and supporting docs meet all of the following:

- the project is explicitly documented as a rebuild of the current Wix public website
- [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md) is treated as the detailed source audit for migration
- the site is implemented as a mobile-first public information website, not as an app-like dashboard
- the launch architecture does not require `SCB-Dash`
- routine editing of news, events, and selected static content is possible through Decap CMS
- the event system remains a public/editorial calendar rather than an internal scheduling system
- the site includes homepage, news, events, media, downloads, contact, and legal/info pages
- the map/location treatment defaults to an external-link approach rather than an embedded live map
- the implementation avoids unnecessary complexity that would make routine maintenance harder for non-technical admins

---

## Companion Documents

This file sits at the top of the website documentation stack.

Recommended companion docs:

- [wix-audit.md](/home/nout/REPO/SCB/wix-audit.md)
  Detailed Wix audit, content inventory, asset inventory, unresolved source issues, previous planning memory

- [calendar.md](/home/nout/REPO/SCB/calendar.md)
  Detailed public calendar plan

- `content-cms.md`
  Content model and Decap collection definitions

- `migration.md`
  Wix-to-Astro migration workflow and QA rules

- `implementation.md`
  Astro architecture, routes, build strategy, and deployment details

- `editor-guide.md`
  Practical instructions for non-technical editors

---

## Decision Summary

This project should always be treated as:

- a rebuild of the current Wix public website
- a simple public information site for a non-profit
- mobile-first
- easy to edit
- static-first
- separate from internal/private dashboard concerns

That is the center of the entire project.
