# Website Foundation Specification

## Purpose

This document is the primary source of truth for the `SCB` website project.

It defines what the website is, what it must do, what it must not become, and which priorities overrule all others.

If any later planning or implementation document conflicts with this file, this file wins unless the user explicitly overrides it.

---

## Core Principle

The Skate Club Biriciana website must be:

- **mobile-first**
- **simple**
- **robust**
- **easy to maintain**
- **easy to edit for non-technical admins**
- **static-first**

This website is a **general public information website for a non-profit**, not a complex app.

---

## Non-Negotiable Rules

### 1. Mobile-first always

Mobile usability is a top-level requirement, not a later polish step.

Every page, component, content type, and editorial workflow must be designed assuming that many visitors will access the site on phones first.

Implications:

- layouts must be readable on narrow screens first
- navigation must work comfortably on mobile
- event information must be immediately scannable on mobile
- blog previews must be compact and easy to scroll
- image/video galleries must not become awkward or overloaded on mobile
- CTAs must remain large and obvious
- no desktop-only assumptions in layout or interaction design

### 2. Simplicity over cleverness

Do not add complexity unless it solves a real user or admin problem.

Implications:

- prefer small, understandable systems over generalized ones
- prefer static rendering over dynamic runtime behavior
- prefer explicit content modeling over hidden automation
- avoid “future-proofing” that makes the launch version harder to maintain

### 3. Non-technical admins must be able to edit it

The website will not be maintained by IT specialists.

Implications:

- content editing must be approachable
- CMS fields must be limited and understandable
- public content must not depend on manual code changes
- documentation should be clear and short where possible
- avoid requiring shell access or developer tooling for ordinary content updates

### 4. Robustness over sophistication

The site should fail in obvious, manageable ways rather than in clever, hidden, brittle ways.

Implications:

- avoid unnecessary runtime integrations
- avoid coupling the website to private internal systems
- validate content strongly at build time
- prefer deterministic build outputs

---

## What The Website Is

The website is the public-facing digital presence of Skate Club Biriciana e.V.

Its job is to help visitors quickly understand:

- who the club is
- what the club does
- what events are happening
- what the latest news is
- how to become a member
- how to contact the club
- where to find media and important downloadable documents

It should feel welcoming, credible, and easy to navigate.

---

## What The Website Is Not

The website is not:

- an internal operations dashboard
- a scheduling application
- a member management system
- a volunteer coordination app
- a custom social network
- a media management platform
- a highly dynamic web app

The website must not absorb the complexity of `SCB-Dash`.

---

## Product Summary

The target product is a lean, maintainable Astro-based website with:

- a homepage
- a simple blog/news system
- a public event calendar
- a simple media gallery
- downloadable PDFs
- contact information and contact form
- a few supporting info pages
- legal pages

This is enough.

The site does **not** need to be super elaborate.

It must simply function well as a reliable public information website.

---

## Audience

### Primary audiences

- people interested in the club locally
- skaters and families looking for events or workshops
- potential members
- community supporters
- people looking for basic contact and organization information

### Secondary audiences

- press or partners looking for basic club information
- existing members looking for general public updates
- visitors checking news or media content

### Editorial audience

- club admins who need to update content through a simple CMS

---

## User Success Criteria

The website is successful if a mobile visitor can quickly:

- understand what the club is
- find upcoming events
- read recent news
- find membership info
- access PDFs
- contact the club
- browse a few photos/videos without friction

The website is successful if an admin can:

- add/edit a blog post
- add/edit a public event
- update important static page content
- change media links or gallery items
- do this without developer intervention in normal cases

---

## Technical Direction

### Chosen stack direction

- Astro SSG
- `bun`
- Netlify-first deployment
- Decap CMS
- content collections
- local-first asset storage

### Technical philosophy

- static-first
- build-time content validation
- minimal client-side JavaScript
- local media/assets where practical
- no unnecessary backend requirements

### Integration principle

Public website systems should stand on their own.

If future integrations are added, they must be optional and non-blocking for normal site operation.

---

## Relationship To SCB-Dash

`SCB-Dash` is an internal dashboard and is not the website’s architectural center.

### Hard rule

The website must not depend on `SCB-Dash` to render public content at launch.

### Allowed future relationship

`SCB-Dash` may later export selected public event data in a controlled one-way flow.

### Disallowed relationship

The website must not become a thin frontend over the dashboard’s internal data model.

Reason:

- wrong product boundary
- unnecessary complexity
- higher maintenance cost
- higher privacy/security risk
- bad fit for non-technical site maintenance

---

## Core Website Features

The final website must include these core feature areas.

### 1. Homepage

The homepage should provide:

- clear club identity
- concise intro
- latest news preview
- upcoming events preview
- membership CTA
- media/gallery teaser
- footer with contact/social/legal links

### 2. News / blog

The site needs a simple blog/news system.

Requirements:

- simple post creation/editing
- post detail pages
- cover image support
- date display
- excerpt/preview support
- category support only if genuinely useful

Avoid:

- overly complex tagging/filtering systems unless clearly needed

### 3. Public event calendar

The event calendar is important, but it must remain simple.

Requirements:

- one-off events
- recurring events
- upcoming event list
- month overview
- event detail pages
- clear mobile presentation
- easy admin editing

Avoid:

- app-style scheduling complexity
- internal staffing/assignment concepts
- drag/drop or dense planner UI

### 4. Media gallery

The media area should be lightweight.

Requirements:

- easy way to show photos and video links
- easy support for YouTube playlist/video links
- simple browsing
- mobile-friendly presentation

Avoid:

- building a full custom media platform

### 5. PDFs / downloads

The website must support downloadable files like:

- membership form
- statutes

Requirements:

- obvious download UI
- clear labels
- local hosting where possible

### 6. Contact

The site needs a straightforward contact page.

Requirements:

- contact form
- fallback contact details
- address/location info
- external map link

Per current preference:

- use a simple map image or location block linking out to Google Maps
- do not embed a live map if it causes avoidable cookie/privacy complexity

### 7. Static information pages

The website needs a few normal content pages such as:

- about
- membership
- legal pages

These pages should be easy to edit and stable.

---

## Information Architecture

The public structure should stay compact and obvious.

Expected top-level navigation:

- Start
- Neuigkeiten
- Uber uns
- Pics n Vids
- Veranstaltungen
- Mitgliedschaft
- Kontakt

Expected legal/footer links:

- Impressum
- Datenschutz

If future simplification is needed, prefer reducing complexity over expanding navigation depth.

---

## Mobile-First UX Requirements

These rules are mandatory for implementation.

### Navigation

- [ ] header must remain usable on small screens
- [ ] mobile navigation must be obvious and low-friction
- [ ] no tiny tap targets
- [ ] no overstuffed menus

### Homepage

- [ ] hero content must fit mobile comfortably
- [ ] news preview must stack cleanly
- [ ] event preview must be scannable without dense cards
- [ ] CTAs must remain readable and tappable

### Blog

- [ ] post list must work as a clean vertical flow
- [ ] metadata must stay readable on small screens
- [ ] inline images must not break layout

### Calendar

- [ ] upcoming events must be the primary mobile experience
- [ ] month view must remain readable on phones
- [ ] event detail pages must prioritize date, time, and location at the top
- [ ] recurring event information must be understandable without clutter

### Media

- [ ] galleries must avoid cramped thumbnail walls on small screens
- [ ] video cards must remain legible and easy to tap

### Contact

- [ ] form fields must be easy to complete on mobile
- [ ] contact info must remain obvious without zooming

### Performance

- [ ] mobile pages must load quickly
- [ ] avoid unnecessary client-side JS
- [ ] optimize images and avoid oversized media payloads

---

## Content and CMS Principles

### CMS goal

The CMS exists to make normal content maintenance easy.

### CMS must allow admins to edit

- homepage content blocks where appropriate
- news posts
- events
- media entries
- selected static page content
- download references

### CMS should avoid exposing

- low-level implementation details
- technical flags that confuse editors
- fields that are not meaningful to public content

### Editorial philosophy

- structured where structure helps
- freeform where freeform is simpler
- minimal field count by default

---

## Design Direction

The site should be more modern and intentional than the current Wix site, but not overly elaborate.

### The design should be

- clean
- welcoming
- club-oriented
- clear on mobile
- visually stronger than Wix
- still easy to maintain

### The design should not be

- overly corporate
- overloaded with effects
- dependent on fragile motion
- visually noisy
- desktop-first

---

## Migration Philosophy

The current Wix site is the content source, not the design source.

### Preserve

- structure
- important content
- important assets
- core routes/concepts
- PDFs
- key organization data

### Do not preserve blindly

- bad layout patterns
- Wix technical quirks
- awkward route naming
- widget complexity that does not belong in the new site

### Migration rule

Migrate meaning and content, not Wix implementation behavior.

---

## Public Data Handling

Any sensitive or uncertain organization data must be treated carefully.

Examples:

- legal contact details
- bank details
- membership pricing
- social links

These should be:

- migrated carefully
- clearly structured
- easy to verify later

---

## Constraints

### Must use

- Astro
- `bun`
- Decap CMS
- Netlify-first assumptions

### Must avoid

- unnecessary SSR
- coupling to private internal systems
- heavy JS-first UI where static rendering is sufficient
- maintenance patterns that require technical expertise for routine updates

---

## Non-Goals For Launch

Do not expand the launch scope with:

- advanced account systems
- custom authentication
- real-time features
- complex search infrastructure
- app-like dashboard features
- internal workflow management
- custom map systems
- elaborate filtering unless clearly needed

---

## Launch Priorities

Priority order should be:

1. solid mobile-first structure
2. clean content architecture
3. reliable event calendar
4. simple blog/news workflow
5. simple media gallery
6. stable contact and membership pages
7. legal/data correctness
8. visual polish

This order matters.

If tradeoffs appear, protect mobile usability and editorial simplicity first.

---

## Acceptance Criteria

The website foundation is satisfied when:

- [ ] the public site is clearly mobile-first
- [ ] the site stays understandable and maintainable
- [ ] admins can update core content through Decap CMS
- [ ] the site functions as a simple public information website
- [ ] blog/news workflow is straightforward
- [ ] event calendar is clear and easy to manage
- [ ] galleries remain lightweight
- [ ] downloadable PDFs are easy to access
- [ ] the site does not depend on `SCB-Dash`
- [ ] the site avoids unnecessary complexity

---

## Companion Documents

This file should sit at the top of the website documentation stack.

Recommended companion docs:

- `HANDOVER.md`
  Migration memory, source audit, Wix findings, unresolved source details

- `calendar.md`
  Detailed implementation plan for the self-built public event system

- `content-cms.md`
  Content model and Decap collections

- `migration.md`
  Wix migration workflow, manifest rules, QA checklist

- `implementation.md`
  Astro architecture, routes, build strategy, deployment details

- `editor-guide.md`
  Short practical instructions for non-technical content editors

---

## Decision Summary

The website should be treated as:

- a simple, mobile-first, public information site
- easy to edit by non-technical admins
- static-first and robust
- separate from the internal dashboard

That is the center of the entire project.
