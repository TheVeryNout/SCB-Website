# SCB Website Cold Start

## Purpose

This document is the cold-start index for the `SCB` website planning stack.

Read this first when entering the repo fresh.

Its job is to make the stack implementation-safe without forcing a new reader to rediscover priority, scope, or locked decisions by triangulating multiple long docs.

This file is an overview and routing document.

It does not replace the canonical owner docs.

It also does not replace the execution checklist stack; use [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) once the normative specs below are loaded.

---

## Project In One Sentence

Build a small, robust, mobile-first public website for Skate Club Biriciana e.V. with Astro, Decap CMS, and a website-owned static event calendar.

---

## Core Priorities

These are the three implementation priorities and should dominate decision-making:

1. solid and robust Astro setup
2. accessible, easy-to-maintain CMS
3. public event calendar

Everything else is secondary unless it directly affects those three pillars.

Examples of secondary concerns:

- canonical social-link cleanup
- donation-detail emphasis
- gallery/video polish
- legal-text refreshes
- non-critical copy disputes

Secondary concerns must not bloat the stack or reopen architecture decisions.

---

## What This Website Is

The website is:

- a public information site
- a simple content site
- a simple editing surface for non-technical admins
- a public event calendar
- a home for news, static pages, media references, downloads, and contact info

The website is not:

- a pricing system
- a complex media platform
- an internal operations tool
- a member management system
- a thin runtime frontend over private infrastructure

Important clarification:

- there is no pricing implementation to build
- there is no pricing schema to design
- there is no membership pricing subsystem in scope
- any fee information, if ever shown on the site, is plain text in page content and/or the downloadable PDF

---

## Locked Decisions

These are already decided and should not be reopened unless the user explicitly changes them:

- Astro SSG
- `bun`
- Netlify-first deployment
- Decap CMS
- Decap auth/backend via Netlify Identity + Git Gateway
- Netlify Forms for the launch contact form
- static-first architecture
- no SSR for launch
- no launch dependency on `SCB-Dash`
- website-owned public event data
- event support for one-off, weekly recurring, and monthly recurring events
- occurrence URLs at `/veranstaltungen/[slug]/[yyyy-mm-dd]/`
- source-parity use of the current Wix site for low-priority text and links unless later replaced

---

## Implementation Order

Do the work in this order:

1. normalize and trust-lock the planning docs
2. scaffold the Astro project foundation
3. implement Decap CMS and shared content model
4. implement the event content pipeline and recurrence logic
5. implement event routes and calendar UI
6. implement remaining page routes and low-complexity content surfaces
7. migrate content and assets with manifest-backed QA

Do not invert this order by polishing media or low-priority copy before the Astro/CMS/calendar core exists.

---

## Current Stack Roles

Use the docs in this order after finishing this file:

1. [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
   Product intent, boundaries, locked constraints
2. [wix-audit.md](/home/nout/REPO/SCB-Website/docs/plans/wix-audit.md)
   Source-site observations, assets, route inventory, source quirks
3. [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md)
   Final route set and page contracts
4. [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
   Canonical event model and recurrence behavior
5. [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md)
   CMS ownership boundaries and content collections
6. [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)
   High-risk public facts and confirmation status
7. [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
   Technical structure, hosting, route wiring, asset conventions
8. [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md)
   Migration workflow, manifest, QA rules
9. [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md)
   Phase order, execution gates, checklists, multi-conversation progress control
10. [parallel-agent-environment.md](/home/nout/REPO/SCB-Website/docs/plans/parallel-agent-environment.md)
   Optional parallel-work guardrails once the execution plan is stable

---

## Fast Resume Path

For a brand-new conversation that is resuming implementation rather than redefining scope:

1. read [execution-plan.md](/home/nout/REPO/SCB-Website/docs/plans/execution-plan.md) sections `Current Verified Repo Snapshot`, `Progress Snapshot`, and the checklist for the active phase
2. if Wix/source evidence is needed, read [wix-reference/README.md](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/README.md) and [wix-reference/manifest.json](/home/nout/REPO/SCB-Website/docs/plans/wix-reference/manifest.json)
3. load the phase-specific docs listed in `Phase-Specific Reading Mode`
4. only reopen the rest of the stack when a decision crosses into another domain

This keeps cold starts cheaper without weakening the spec stack.

---

## Current Ready/Not-Ready State

Ready now:

- stack choice
- hosting assumptions
- CMS choice
- contact-form approach
- route set
- event-calendar direction
- migration process shape
- implementation-safe bootstrap
- Playwright-based live Wix reference workflow

Needs to stay explicit during implementation:

- keep content scope small
- keep CMS simple for non-technical editors
- keep event logic build-time only
- keep low-priority content details from hijacking core implementation work

Launch-signoff details that do not block foundation work:

- exact social-link canonicality
- legal/contact reconfirmation
- donation-detail emphasis

---

## Guardrails

Do not accidentally reintroduce these mistakes:

- inventing a pricing model or pricing-specific CMS structure
- overcomplicating Decap workflow
- introducing SSR just to solve simple content problems
- introducing heavy calendar or gallery frameworks without proven need
- turning source-parity content disputes into architecture blockers
- prioritizing YouTube/media polish over Astro/CMS/calendar fundamentals

---

## Acceptance Rule For A Cold Start

This file is doing its job only if a new implementer can answer all of the following immediately:

- what the website is
- what it is not
- which decisions are locked
- what matters most
- what can be safely ignored for now
- which doc to read next for each decision domain
- which doc controls the phase checklist and progress state
