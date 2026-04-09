# Website Calendar Implementation Plan

## Purpose

This document is the canonical plan for the public-facing event calendar in the `SCB` website repo.

It is written to support implementation across multiple independent conversations without re-deciding the architecture each time.

Primary rule: **simplicity over cleverness**.

The public website calendar must be:

- robust
- understandable by non-technical admins
- static-first
- easy to edit through Decap CMS
- independent from the private `SCB-Dash` system by default

The website and `SCB-Dash` remain separate systems and separate repos.

---

## Final Product Decision

### Chosen direction

- Build a **self-owned calendar system inside the website repo**
- Use **Astro SSG** and **Decap CMS**
- Use a **simple event content model**
- Build a **custom month grid + upcoming list** instead of adopting a large calendar library
- Keep `SCB-Dash` out of the critical path for launch
- Leave room for a future one-way import/export bridge from `SCB-Dash` to the website

### Explicit non-goals

- No drag-and-drop calendar UI
- No live scheduling app behavior on the public site
- No direct public access to the `SCB-Dash` database
- No shared runtime between website and dashboard
- No combined monorepo unless future requirements materially change
- No dependency on heavy app-style calendar suites for launch

---

## Why This Approach

### Why not use a feature-rich calendar component

Large calendar components are optimized for scheduling apps, not simple public sites.

Typical problems:

- too much JavaScript for a mostly static site
- styling friction
- unnecessary features like drag/drop, resource views, week planners, and live interactions
- higher maintenance burden
- more brittle than a focused custom implementation

### Why a self-built calendar is the right fit

- public site needs are small and well-defined
- event editing must stay understandable for non-technical admins
- custom UI can match the content model exactly
- Astro can pre-render everything at build time
- failure modes stay simple and visible

---

## Public Calendar Requirements

The website calendar must support:

- one-off events
- recurring events
- event detail pages
- a clean upcoming events list
- a month view for overview/browsing
- clear location and time display
- cancellations
- optional notes like weather dependence
- optional images
- optional registration link or external CTA

The website calendar does **not** need to support:

- volunteer/member assignments
- internal planning notes
- inventory/resource allocation
- internal-only sections like `indoor`, `outdoor`, `org`
- authenticated editing inside the website itself

---

## Architecture Overview

### Source of truth

The website repo is the source of truth for all **public** event content.

Event editing happens in Decap CMS and writes into the website repo.

### Separation from SCB-Dash

`SCB-Dash` remains an internal operational tool.

It is allowed to become a future source for selected public events, but only through a narrow export/import contract.

It is **not** allowed to become a hidden runtime dependency for the public site launch.

### Rendering strategy

- Astro SSG builds all event pages statically
- recurrence expansion happens at build time
- month views are generated from normalized event instances
- no SSR for the calendar unless a future requirement forces it

---

## Canonical Event Model

Use a single website event content type with a model designed for public communication, not internal scheduling.

### Required fields

- `title`
- `slug`
- `status`
- `visibility`
- `startDate`
- `startTime`
- `endDate`
- `endTime`
- `timezone`
- `locationName`
- `summary`

### Optional fields

- `body`
- `address`
- `mapUrl`
- `heroImage`
- `gallery`
- `ctaLabel`
- `ctaUrl`
- `registrationUrl`
- `costLabel`
- `audience`
- `equipmentInfo`
- `weatherNote`
- `instagramUrl`
- `source`
- `sourceId`
- `lastVerifiedAt`

### Controlled fields

- `status`: `scheduled | cancelled | postponed | tentative`
- `visibility`: `public | hidden`
- `source`: `website | imported-dash | migrated-wix`

### Recurrence block

Every event must include either:

- `recurrence.type = none`

or

- a recurrence object with explicit rules

Recurrence shape:

- `type`: `none | daily | weekly | monthly`
- `interval`: integer, default `1`
- `daysOfWeek`: array of weekday keys for weekly recurrence
- `dayOfMonth`: integer for monthly recurrence where needed
- `until`: last allowed date
- `count`: optional max occurrence count
- `exclusions`: array of excluded dates
- `inclusions`: array of manually added dates

### Admin notes policy

Do **not** add internal admin-only notes to the public event schema unless they are clearly isolated and never rendered.

Default recommendation:

- omit admin notes entirely from the website event model

Reason:

- fewer hidden fields
- lower leak risk
- simpler editorial workflow

---

## Storage Strategy

### Content path

Store event entries in:

- `src/content/events/`

Recommended format:

- one Markdown or MDX file per logical event series or one-off event

### Asset path

Store event images under the shared Astro image tree at:

- `src/assets/images/events/`

Use `public/media/` only for PDFs and unprocessed raw files.

---

## Recurrence Strategy

### Chosen rule

Store the recurrence rule once in content, then expand it into concrete public event instances during the Astro build.

### Why this is the best balance

- admins edit one event definition
- website visitors see concrete dated instances
- no duplication of dozens of repeated CMS entries
- no runtime dependency

### Supported recurrence for launch

- none
- weekly
- monthly

### Daily recurrence

Support in schema, but treat as lower priority unless a real public use case exists.

Reason:

- public nonprofit site is unlikely to need daily public events
- weekly recurring events like `Sunday Funday` are the main real use case

### Expansion window

Expand recurring events only inside a fixed public horizon.

Default:

- from 3 months in the past
- to 18 months in the future

Reason:

- enough for archives and upcoming display
- avoids infinite generation
- build output stays predictable

### Recurrence edge-case rules

- if `until` is present, do not generate beyond it
- if `count` is present, stop after count instances
- if both `until` and `count` exist, stop at the earliest boundary
- exclusions remove generated instances
- inclusions add instances even if they do not match the rule
- cancelled individual dates should be represented through exclusions plus optional replacement one-off entry if needed

### Monthly recurrence simplification

Support one of these two launch-safe patterns:

- same date every month
- same weekday occurrence every month only if explicitly needed later

Default:

- implement same-date monthly recurrence first

---

## Event Identity and URLs

### Logical event vs occurrence

Distinguish:

- logical event definition
- concrete public occurrence

Logical event owns the base content.

Occurrence is a generated instance with a concrete date.

### URL strategy

Use stable event detail URLs based on slug plus occurrence date.

Recommended pattern:

- `/veranstaltungen/[slug]/[yyyy-mm-dd]/`

Reason:

- recurring events produce multiple concrete occurrences
- URLs stay unique
- avoids Wix-style slug/date mismatches

### Canonical display rule

- upcoming list links to occurrence pages
- month grid links to occurrence pages
- if a one-off event has one occurrence only, it still uses the occurrence URL pattern for consistency

---

## Frontend Feature Set

### Required views

- `Upcoming Events` section
- `All Events` page
- `Month Grid` view
- occurrence detail page
- optional homepage event preview block

### Upcoming Events behavior

- sort by start datetime ascending
- show only `public` and non-hidden occurrences
- optionally hide past events by default
- allow small limit for homepage, larger limit for events page

### Month Grid behavior

- month navigation
- event count per day
- click/tap day to reveal day events
- mobile-friendly stacked presentation
- no drag/drop
- no week/day scheduler views for launch

### Event detail behavior

- display title
- display date and time clearly in German
- display cancellation/postponement state prominently
- display summary first
- display CTA or registration link if present
- display location information
- display weather note if present
- display long-form body if present
- show related upcoming occurrences for the same recurring event if useful

### Homepage integration

- show next 3 to 5 upcoming public events
- if no upcoming events, show a friendly fallback message
- optionally pin one recurring highlight like `Sunday Funday`

---

## Components To Build

### Data and logic

- [ ] `src/content/config.ts` event schema
- [ ] event normalization utility
- [ ] recurrence expansion utility
- [ ] event filtering utility
- [ ] event grouping utility for month/day views
- [ ] German date/time formatting utility
- [ ] event status helper

### UI components

- [ ] `UpcomingEventsList`
- [ ] `UpcomingEventCard`
- [ ] `CalendarMonthGrid`
- [ ] `CalendarDayCell`
- [ ] `CalendarDayEventList`
- [ ] `CalendarMonthNav`
- [ ] `EventOccurrenceHero`
- [ ] `EventMeta`
- [ ] `EventStatusBadge`
- [ ] `EventLocationBlock`
- [ ] `EventCtaBlock`
- [ ] `EventEmptyState`
- [ ] `RecurringSeriesHint`

### Routes/pages

- [ ] `/veranstaltungen/`
- [ ] `/veranstaltungen/[slug]/[date]/`
- [ ] homepage preview integration

---

## Decap CMS Plan

### Editorial principle

The CMS must expose plain-language fields, not technical implementation jargon.

### CMS collection

Create a dedicated `events` collection.

Admins should be able to edit:

- title
- summary
- full description
- start and end info
- recurrence
- location
- cancellation state
- CTA link
- hero image

### CMS UX rules

- keep labels in German if that matches admin comfort
- keep recurrence controls shallow
- avoid exposing fields that are only useful to developers
- use sensible defaults
- use hints/help text liberally

### Recommended CMS field groups

- basic info
- timing
- recurrence
- location
- display options
- CTA/external links
- media

### CMS simplifications

- recurrence type defaults to `none`
- timezone defaults to `Europe/Berlin`
- visibility defaults to `public`
- status defaults to `scheduled`

### CMS validation expectations

- title required
- summary required
- start required
- if end is omitted, allow same-day fallback only if explicitly supported
- recurrence fields only shown when recurrence is enabled

---

## Public/Private Boundary With SCB-Dash

### Current rule

The website must not read directly from `SCB-Dash` at runtime.

### Future-compatible sync rule

If sync is added later, it must be:

- one-way
- explicit
- whitelist-based
- public-data-only

### Future export contract from SCB-Dash

If implemented later, `SCB-Dash` should export a dedicated public event payload, not raw schedule rows.

That payload should include only:

- public title
- public summary
- public description
- public start/end
- public recurrence
- public location
- public status
- public image or image reference
- public CTA

It must exclude:

- member assignments
- internal notes
- internal sections
- contacts
- inventory references
- operational metadata not intended for the public

### Website import rules for future sync

- imported events must be marked `source: imported-dash`
- import must be manual or CI-triggered, not hidden magic
- imported content must land in a predictable local file or data artifact
- website build must succeed even if dashboard sync is unavailable

### Launch decision

- do not build sync in phase 1

---

## Data Normalization Rules

### Datetime rules

- treat all public event times as `Europe/Berlin`
- store date and time separately in content if that is easiest for Decap
- normalize into a single internal datetime object during build

### Missing end time

Default recommendation:

- require end time for launch

Reason:

- keeps display logic simple
- avoids ambiguity for visitors

### Location rules

Public location fields should be human-readable.

Use:

- `locationName` for display
- `address` for detail pages if available
- `mapUrl` for external maps link

Do not try to build an interactive map component.

Per user preference, use:

- simple static image or location block that links externally to Google Maps

### Status rules

- `scheduled`: normal rendering
- `cancelled`: keep visible, clearly marked
- `postponed`: keep visible with explanatory copy
- `tentative`: visible with caution label
- `hidden`: never rendered publicly

---

## Calendar Display Logic

### Inclusion rules

An occurrence is shown publicly only when:

- parent event visibility is `public`
- occurrence date is inside build horizon
- event is not explicitly hidden

### Sorting rules

- sort by start datetime ascending
- secondary sort by title

### Past event handling

Recommended launch behavior:

- homepage shows only upcoming events
- events page can show upcoming first and optionally a small archive section
- occurrence detail pages remain accessible for past events if generated inside the horizon

### Empty state rules

If no upcoming events exist:

- show a calm fallback message
- optionally link to Instagram for latest spontaneous updates

This is especially relevant for weather-sensitive skate sessions.

---

## Styling and UX Direction

### Design principle

The calendar should feel like part of a simple club website, not enterprise scheduling software.

### UX rules

- make upcoming events the primary experience
- month grid is secondary
- avoid over-dense interfaces
- use obvious labels for recurring events
- use strong date hierarchy
- prioritize readability on mobile

### Accessibility rules

- keyboard-navigable month navigation
- semantic headings
- clear focus states
- color should not be the only status signal
- cancellation labels must be text, not just color

---

## SEO and Metadata

### Events index

- unique page title
- descriptive meta description
- clear German route name

### Occurrence detail pages

- unique titles with event date
- metadata derived from summary
- Open Graph image if available

### Structured data

Recommended:

- add `Event` schema markup on occurrence detail pages

Fields to populate where possible:

- name
- startDate
- endDate
- eventStatus
- eventAttendanceMode if relevant later
- location
- description
- image

---

## Robustness Rules

### The build must fail fast on invalid event content

Reject at build time:

- missing required title
- invalid date
- invalid time
- end before start
- unsupported recurrence configuration

### The build must not fail because of optional content

Gracefully handle:

- missing hero image
- missing address
- missing CTA
- missing body

### The site must not depend on external APIs to render the calendar

No launch dependency on:

- Google Calendar
- SCB-Dash API
- remote CMS
- live calendar widgets

---

## Implementation Sequence

### Phase 1: schema and content pipeline

- [ ] create event content collection
- [ ] define schema with safe defaults
- [ ] create recurrence expansion helper
- [ ] create occurrence normalization helper
- [ ] create date formatting helpers
- [ ] create sample event content including one recurring example

### Phase 2: event queries and derived views

- [ ] build helper to fetch all logical events
- [ ] derive concrete occurrences
- [ ] derive upcoming list
- [ ] derive month-grouped data
- [ ] derive per-slug related occurrences

### Phase 3: UI components

- [ ] build upcoming event card/list
- [ ] build month navigation
- [ ] build month grid
- [ ] build day event list
- [ ] build detail metadata blocks
- [ ] build status badges and recurrence labels

### Phase 4: routes

- [ ] implement `/veranstaltungen/`
- [ ] implement occurrence detail pages
- [ ] connect homepage preview
- [ ] add empty states and fallbacks

### Phase 5: Decap CMS

- [ ] create `events` collection config
- [ ] write editor-friendly field labels/help
- [ ] test recurring and one-off event editing
- [ ] ensure media selection works simply

### Phase 6: content migration

- [ ] migrate current Wix events manually and carefully
- [ ] verify every migrated date against actual known intent
- [ ] specifically validate recurring `Sunday Funday` behavior
- [ ] resolve Wix slug/date mismatches manually

### Phase 7: polish

- [ ] structured data
- [ ] a11y pass
- [ ] German copy pass
- [ ] mobile layout pass
- [ ] graceful no-events fallback

---

## Testing Plan

### Unit-level logic tests

- [ ] one-off event normalization
- [ ] weekly recurrence expansion
- [ ] monthly recurrence expansion
- [ ] recurrence `until` cutoff
- [ ] recurrence `count` cutoff
- [ ] exclusions remove occurrences
- [ ] inclusions add occurrences
- [ ] cancelled event status handling
- [ ] upcoming event sorting
- [ ] month grouping

### Content validation tests

- [ ] invalid date rejected
- [ ] invalid time rejected
- [ ] end before start rejected
- [ ] missing required title rejected
- [ ] invalid recurrence config rejected

### Rendering tests

- [ ] upcoming list renders correctly
- [ ] month grid renders days with multiple events
- [ ] occurrence detail page renders metadata correctly
- [ ] cancellation badge appears correctly
- [ ] recurring label appears correctly
- [ ] empty state appears when no upcoming events exist

### Manual QA scenarios

- [ ] recurring weekly `Sunday Funday`
- [ ] one-off workshop event
- [ ] cancelled event
- [ ] postponed event
- [ ] event with external registration link
- [ ] event without image
- [ ] event without long body copy
- [ ] mobile month view
- [ ] homepage preview with 0, 1, and multiple upcoming events

---

## Migration Guidance From Wix

### Critical rule

Do not trust Wix event slugs as canonical date truth.

The Wix audit already identified slug/date mismatches.

### Migration method

- inventory all current public events
- manually verify date and time from visible page content
- encode recurring patterns cleanly in the new schema
- replace duplicated Wix artifacts with one logical recurring entry where appropriate

### For Sunday Funday

Preferred modeling:

- one recurring weekly event definition
- explicit summary including weather dependence
- optional exclusions for exceptions

Do not import every Wix instance blindly if they are routing artifacts rather than true independent events.

---

## Documentation Requirements

When implementation begins, keep this file updated if any decision changes.

Also create short supporting docs if useful:

- migration notes for imported events
- recurrence helper notes
- CMS editor guide for admins

But this file remains the main decision document.

---

## Acceptance Criteria

The calendar implementation is done when all of the following are true:

- [ ] admins can create and edit one-off public events in Decap CMS
- [ ] admins can create and edit recurring weekly events in Decap CMS
- [ ] website renders upcoming events statically
- [ ] website renders a month overview statically
- [ ] each occurrence has a stable detail page
- [ ] cancelled and postponed events render clearly
- [ ] no runtime dependency on `SCB-Dash`
- [ ] no heavy third-party calendar suite is required
- [ ] mobile experience is readable and usable
- [ ] event content survives across builds and deployments without manual code changes

---

## Explicit Defaults To Use Unless Overridden

- use website-owned public event content
- keep repos separate
- no runtime sync from `SCB-Dash`
- custom calendar UI
- static Astro rendering
- Decap CMS `events` collection
- occurrence URLs include date
- weekly recurrence supported for launch
- `Europe/Berlin` timezone
- end time required
- public map links only, no embedded live map
- homepage shows upcoming events only

---

## Known Future Enhancements

These are allowed later, but not required for launch:

- one-way import from `SCB-Dash`
- ICS export
- Google Calendar export
- richer archive browsing
- recurring exception UI improvements in CMS
- event tags/categories
- featured-event pinning logic
- automated reminders or feeds

---

## Implementation Warning List

- Do not accidentally leak `SCB-Dash` member assignments into public content.
- Do not model website events around internal `section` concepts unless the public website truly needs them.
- Do not introduce SSR just to solve recurrence.
- Do not use a large calendar library unless a specific unmet requirement proves the custom UI insufficient.
- Do not trust migrated Wix recurring detail routes without manual validation.
- Do not make the event system harder to edit than the value it provides.

---

## Next Recommended Execution Step

When moving from planning into implementation, start here:

- [ ] scaffold Astro project structure
- [ ] create `src/content/events/` schema
- [ ] add 2 sample events:
- [ ] one recurring `Sunday Funday`
- [ ] one one-off special event
- [ ] implement recurrence expansion helper
- [ ] render a simple upcoming events list before building the full month grid

This order keeps the core data model stable before UI complexity increases.
