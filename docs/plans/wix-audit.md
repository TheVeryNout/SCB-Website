# Wix Source Audit: Skate Club Biriciana e.V. Astro Rebuild

## Purpose
This document captures the current audited understanding of the public Wix source site for the Skate Club Biriciana e.V. website rebuild.

## Scope Note
This file is the Wix/source-site audit and historical planning record.

It remains authoritative for:

- observed Wix routes and content
- observed assets and source URLs
- source inconsistencies and manual QA items
- historical planning context already captured

It is not the primary normative source for current architecture, page scope, CMS modeling, or migration process once newer companion docs exist.

When they exist, prefer these newer docs for active decisions:

- [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
- `routes-and-pages.md`
- `content-cms.md`
- `implementation.md`
- `migration.md`
- `public-data-register.md`
- [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)

## User Request
The user wants the current Wix website for the skateboard non-profit "Skate Club Biriciana e.V." rebuilt completely with Astro SSG.

The rebuild must:
- preserve the site structure
- preserve the site elements/content
- preserve graphics/assets like background images, logo, PDFs, and similar materials
- not replicate the current crude design
- be suitable for GitHub-hosted source control and deployment via Netlify, Vercel, or similar
- use `bun`, not `npm`

The user explicitly said:
- current look/design does not need to be replicated
- structure, elements, and graphics do need to be replicated
- I am the main architect/engineer for the rebuild
- I must thoroughly analyze the current site
- I must produce a detailed plan including:
  - how scraping would work
  - what information/components/assets are needed from the user
  - a complete component list

## Important Historical Note
This audit preserves the planning state reached before execution was allowed.

At the time this was first assembled:
- the session had been in Plan Mode
- repo-tracked mutation had not yet begun
- no Astro app had been scaffolded
- no implementation had started

That historical context matters because some decisions were captured as planning assumptions and some user inputs were intentionally left pending.

## Environment State
- CWD: `/home/nout/REPO/SCB`
- Repo state when inspected: effectively empty except `.git`
- No existing app/codebase to preserve
- This can be treated as a greenfield Astro project

## User Decisions Already Collected
These were explicitly gathered through user input tools during planning.

### Deployment
- Selected: `Netlify`

### Content workflow
- Selected: `Git CMS`

### Git CMS choice
- Selected: `Decap CMS`

### Contact form
- Selected: `Netlify Forms`

Interpretation:
- Plan should be Netlify-first
- Editing workflow should be repo-backed via Decap CMS
- Contact form should use the simplest static-friendly Netlify-native flow

## High-Level Build Direction
Planned stack and direction:
- Astro SSG
- `bun` for package management and scripts
- GitHub repo
- Netlify-first deployment
- Decap CMS for repo-backed editorial workflow
- content collections for posts/events/pages
- all Wix media/assets migrated locally
- privacy-aware embeds for YouTube/Maps
- static-first architecture, no SSR unless later required

## Canonical Site Sources
User provided:
- redirect/custom domain: `https://skateclubbiriciana.de`
- direct Wix domain intended: `https://briareos.wixsite.com/skateclubbiriciana`

Note:
- user message included a malformed direct link with duplicated `https://`
- actual working Wix source used during analysis was:
  - `https://briareos.wixsite.com/skateclubbiriciana`

## Current Site Audit Summary
The current site is not just a few static pages. It contains multiple content systems:
- normal static pages
- blog/news feed with post detail pages
- Wix Events calendar and event detail pages
- downloadable PDFs
- contact form
- Google Map
- media/video gallery

## Current Public Information Architecture
Visible primary navigation:
- Start
- Neuigkeiten
- Uber uns
- Pics n Vids
- Veranstaltungen
- Mitgliedschaft
- Kontakt

Legal/footer pages:
- Impressum
- Datenschutz

## Current Page Inventory

### 1. Homepage
Route:
- `/`

Observed content:
- hero section with banner image and club name
- featured fundraising/news item at top
- intro copy welcoming visitors
- news preview section
- featured recurring/event CTA block for "Sunday Funday!"
- membership CTA block
- skatepark image slideshow preview
- footer with socials/email/legal

Observed key texts:
- "Willkommen beim SKATE CLUB BIRICIANA e.V."
- intro copy welcoming all people interested in skateboarding
- membership CTA: "MITGLIED WERDEN BEIM SCB"
- media CTA: "Mehr gibt's auf unserer Medienpage"

Observed homepage slideshow image labels:
- `SPW_SQ_03`
- `SPW_SQ_07`
- `SPW_SQ_04`
- total shown in widget counter: `1/7`

Observed homepage CTA/event text:
- "Sunday Funday!"
- "Immer Sonntags (bei schoenem Wetter)"
- "von 10 - 12 Uhr!"

Homepage assets identified:
- hero banner image: `dfbc4d_d22c6e8ff3f54d19a657aa5fcc53cd91~mv2.png`
- tiled texture/background: `dfbc4d_5415700252604e53b99070fb0076183d~mv2.jpg`
- logo: `dfbc4d_0c5a0de8605c42cbbf4d5ebc30565f1e~mv2.png`
- skatepark slideshow images include:
  - `dfbc4d_257e47ce94d34232b100d26716444ebe~mv2.jpg`
  - `dfbc4d_9c5b429a33d24f9199426a8918c10409~mv2.jpg`
  - `dfbc4d_0ecb329538bd422b8ff9b34f2106689a~mv2.jpg`

### 2. News / Blog Index
Route:
- `/neuigkeiten`

Observed behavior:
- actual Wix blog/news feed
- category filter visible
- search field visible
- pagination visible
- post cards with dates/excerpts

Visible category data:
- `Alle Beitraege`
- `Halle`

Visible posts on first page during audit:
- `Spendenaufruf: Der Skate Club baut 'ne Halle!`
- `Goodies 4 Tricks 2025`
- `Graffiti-Workshop ein voller Erfolg!!`

### 3. Blog / RSS Feed
Feed URL:
- `https://briareos.wixsite.com/skateclubbiriciana/blog-feed.xml`

This feed is a key scrape source for post index metadata.

Observed total published posts from feed:
- 8 posts as of 2026-04-09

Observed posts from feed:
1. `Spendenaufruf: Der Skate Club baut 'ne Halle!`
2. `Goodies 4 Tricks 2025`
3. `Graffiti-Workshop ein voller Erfolg!!`
4. `Spende von der VR Bayern Mitte!!`
5. `Der Contest in der Zeitung`
6. `Goodies 4 Tricks-Event trotz Regen ein Erfolg`
7. `Der Skate Club in der Zeitung`
8. `Parkausbesserungen`

Observed category:
- `Halle`

Important note:
- The feed title is `Annis Studio`
- The feed description is `SkateClub Biriciana`
- The title mismatch is a Wix artifact; do not preserve it as a site brand

### 4. Blog Post Detail
Example audited:
- `/post/spendenaufruf-der-scb-baut-ne-halle`

Observed structure:
- title
- publish date
- reading time
- long-form body
- inline images/gallery
- sharing actions

Observed important content from audited post:
- fundraising for indoor hall
- hall near Weissenburger Kirchweihplatz
- two separated surfaces planned: bike and board
- donation details displayed inline

Observed donation/bank details in post:
- Account name: `SkateClub Biriciana e.V.`
- IBAN: `DE82 7659 1000 0000 1238 20`
- Bank: `VR Bank im suedlichen Franken`
- Reference: `Spende fuer Hallenbau`

This data is important and must be verified with the user before final publication.

### 5. About Page
Route:
- `/ueber-uns`

Observed structure:
- large hero/title area
- introductory organization story
- "Vereinsziele" section
- link to statutes PDF
- board-member gallery
- footer

Observed important content:
- club founded in 2024 by skaters from the Weissenburg region
- primary goals:
  - maintain the skatepark
  - advocate for skaters
  - increase active skaters in the region

Observed Vereinsziele:
- Erhalt und Pflege des Skateparks Weissenburg
- Jugendarbeit
- Vereinsfahrten / Road Trips
- Veranstaltungen

Observed board members:
- `1. Vorstand Chris Winkler`
- `2. Vorstand Andreas "Nout" Schmidt`
- `2. Schatzmeister Clemens Uhlke`
- `Schriftfuehrer Joe Winkler`

Observed statutes PDF link:
- `https://36da100f-5a64-4e36-9be3-cd978447e787.filesusr.com/ugd/dfbc4d_2c1d96f6aacc4d8db2c12c3bea908a20.pdf`

Observed board photo assets:
- `dfbc4d_6af01197129448a3937b17f95f419cc0~mv2.jpg`
- `dfbc4d_b81f189593f74c3a9072afe00e72095a~mv2.jpg`
- there are more in the gallery; implementation should scrape all of them, not only those surfaced during text extraction

### 6. Pics n Vids Page
Route:
- `/pics-n-vids`

Observed structure:
- video gallery/player
- multiple video entries
- share UI from Wix video widget

Observed visible video titles:
1. `SCB Takeover: Ansbach || Skate Club Biriciana Video Show`
2. `Regensburg Rambazamba || Skate Club Biriciana in der SPOT Halle Regensburg`
3. `Park Affair: Oberasbach || Skate Club Biriciana Video Show`
4. `June Jam || Skate Club Biriciana Video Show`
5. `May Bagel || Skate Club Biriciana Video Show`
6. `Park Affair: Abenberg || Skate Club Biriciana Video Show`
7. `Juli Bambule // Skate Park Weissenburg`
8. `Monday Night at Michi's - July 1st '24 || DIY Mini Ramp Skate Session`
9. `May Biscuit // Chill Sessions @ Skate Park Weissenburg`
10. `Skatepark Weissenburg - Opening Sesh & Goodies 4 Tricks || SPW 2023`

Observed footer YouTube link:
- `https://www.youtube.com/@rollkindvideo/videos`

Important inconsistency:
- footer links to `@rollkindvideo`
- impressum references `https://www.youtube.com/@SkateClubBiriciana`
- this must be clarified with user before final implementation

### 7. Events Page
Route:
- `/veranstaltungen`

Observed structure:
- event calendar
- event CTA
- membership CTA repeated on page
- footer

Observed content:
- heading around upcoming events
- visible event calendar widget
- "MITGLIED WERDEN BEIM SKATECLUB BIRICIANA"
- link to membership application PDF

Important:
- Wix Events is a real widget, not just hardcoded markup
- migration should not assume the calendar can be copy-pasted visually; it needs a new event content model

### 8. Event Detail Page
Example audited:
- `/events/sunday-funday-2025-04-06-13-00`

Observed content:
- title: `Sunday Funday!`
- date shown in page: `So., 30. Nov.`
- full date/time shown: `30. Nov. 2025, 10:00 - 12:00`
- location:
  - `Weissenburg in Bayern`
  - `Gunzenhausener Str. 45, 91781 Weissenburg in Bayern, Deutschland`
- summary:
  - open to beginners
  - free
  - good-weather dependence
  - instructions to check Instagram
  - no signup required
  - decks available to borrow

Critical data quirk:
- event URL slug suggests `2025-04-06`
- page content shows `2025-11-30`
- likely recurring-event / Wix detail-routing mismatch
- this must be treated as a manual QA item during migration
- do not trust the event slug as canonical event date

### 9. Membership Page
Route:
- `/copy-of-veranstaltungen`
- this is awkward Wix naming; final site should probably use a clean route like `/mitgliedschaft`

Observed structure:
- membership intro copy
- fee-related copy on the page
- CTA with logo and membership application PDF
- instructions to print, sign, and send application
- footer

Observed important membership details from page:
- active support of park maintenance and local scene
- events/courses/trips benefits
- annual fee:
  - `24EUR` per year if application before August
  - `12EUR` for first year if application from August onward
- family discount:
  - `50EUR / Jahr`
- yearly direct debit in February
- send application digitally to:
  - `scbiriciana@gmail.com`
- or by post to:
  - `Skate Club Biriciana e.V.`
  - `Noerdlinger Strasse 1`
  - `91781 Weissenburg`

Observed membership CTA PDF link:
- `https://36da100f-5a64-4e36-9be3-cd978447e787.filesusr.com/ugd/13cc9c_c6365cf2649e4c68a4b99d58884b41eb.pdf`

### 10. Membership PDF
Direct URL:
- `https://36da100f-5a64-4e36-9be3-cd978447e787.filesusr.com/ugd/13cc9c_c6365cf2649e4c68a4b99d58884b41eb.pdf`

PDF metadata observed:
- 6 pages
- created April 18, 2025
- A4
- contains:
  - active member
  - passive member
  - supporting member
  - family membership
  - crew membership
  - GDPR acknowledgment
  - statutes acknowledgment
  - one-time signup fee of `5EUR`

Additional fee details from PDF not surfaced on page:
- family membership:
  - `50EUR`
  - reduced to `35EUR` if application from August
- crew membership:
  - `60EUR`
  - reduced to `30EUR` if application from August
- one-time signup fee:
  - `5EUR per application`

This means membership page copy and PDF are not fully identical.

Planning clarification:

- this does not imply a pricing subsystem
- the website does not need a dedicated pricing model
- any fee information kept on the site should remain plain content and/or PDF-linked content

### 11. Contact Page
Route:
- `/kontakt`

Observed structure:
- contact form
- map section
- footer

Observed from widget/type extraction:
- 3 text inputs
- 1 textarea
- submit button
- success message
- Google Map widget on page

Observed visible text:
- `KONTAKTFORMULAR`
- `Ist angekommen, danke!!`
- `ANFAHRT ZUM SPW`

Observed internal component IDs from page:
- `comp-kcgc6w2n` -> TextInput
- `comp-kcgc6w2w1` -> TextInput
- `comp-kcgc7h87` -> TextInput
- `comp-kcgc6w321` -> TextAreaInput
- `comp-kcgc6w3a` -> SiteButton
- `comp-m0i5o0y2` -> GoogleMap

Current form field labels/placeholders were not fully extracted from the Wix HTML. This is still an unresolved data point and should be recovered during implementation by more targeted extraction or by manual review.

Current user choice about contact backend:
- use the simplest Netlify-native launch path
- Netlify Forms is the locked launch decision

### 12. Impressum
Route:
- `/impressum`

Observed important data:
- domain scope includes all subdomains
- social media covered:
  - Instagram: `https://www.instagram.com/skateclub_biriciana/`
  - YouTube: `https://www.youtube.com/@SkateClubBiriciana`
- legal entity:
  - `Skate Club Biriciana e.V.`
  - `Noerdlinger Strasse 1`
  - `91781 Weissenburg`
- phone: `01708303717`
- email: `scbiriciana@gmail.com`
- WhatsApp: `01708303717`
- register:
  - `Amtsgericht Ansbach`
  - `Registernummer: 201141`
- VAT ID:
  - `DE228041698`
- authorized representatives:
  - `Christian Winkler, 1. Vorstand`
  - `Andreas Schmidt, 2. Vorstand`
- valid from:
  - `28. August 2024`

All of the above should be treated as requiring user confirmation before final launch.

### 13. Datenschutz
Route:
- `/datenschutz`

Observed:
- long Wix-generated privacy policy text
- heavily generic/platform-oriented language
- references digital assets, services, cookies, storage in several countries, PCI-DSS, etc.

Important planning implication:
- do not rewrite or "improve" legal text unless user explicitly asks
- migrate current text as-is first
- later, likely user should replace it with site-specific/privacy-lawyer-reviewed copy if desired

## Shared/Footer Assets and Links
Footer across pages includes:
- Instagram icon/link
- YouTube icon/link
- email
- Impressum
- Datenschutz

Observed social links:
- Instagram: `https://www.instagram.com/skateclub_biriciana/`
- YouTube footer: `https://www.youtube.com/@rollkindvideo/videos`

Observed social icon/image assets:
- Instagram icon image: `01c3aff52f2a4dffa526d7a9843d46ea.png`
- YouTube icon image: `11062b_f67ec9c36d8a431eabf904a991d9647f~mv2.png`

## Asset Inventory Already Identified
This is not necessarily exhaustive, but these assets were explicitly surfaced during analysis.

### Core branding
- logo: `dfbc4d_0c5a0de8605c42cbbf4d5ebc30565f1e~mv2.png`
- repeated texture/pattern: `dfbc4d_5415700252604e53b99070fb0076183d~mv2.jpg`

### Homepage
- hero/banner: `dfbc4d_d22c6e8ff3f54d19a657aa5fcc53cd91~mv2.png`

### About
- page background/hero-like image: `dfbc4d_9da7d41c6cb74570b718efd6b78169c4~mv2.jpg`
- board images include at least:
  - `dfbc4d_6af01197129448a3937b17f95f419cc0~mv2.jpg`
  - `dfbc4d_b81f189593f74c3a9072afe00e72095a~mv2.jpg`

### News/feed images
- `13cc9c_ae9388c4b99842caaff70ccd00415727~mv2.jpg`
- `13cc9c_9b4b8f17abe74d40b3915128c22f33d5~mv2.jpg`
- `13cc9c_40230571cb024f61b6936ee67952d0f3~mv2.jpg`
- feed revealed additional images from other posts:
  - `dfbc4d_d71543eec4ac4f3fb7aa44a865c6d601~mv2.jpg`
  - `dfbc4d_59e1e64566d44ea2b074b9cf058761e7~mv2.jpg`
  - `dfbc4d_d4de6327ca7c4883bd7dbc4c3a4e0a84~mv2.jpg`
  - `dfbc4d_3825bd53a4d64365a4edd84a395cd7c9~mv2.jpg`
  - `dfbc4d_581b537602574727b9ff441188b0817c~mv2.jpeg`

### Skatepark slideshow
- `dfbc4d_257e47ce94d34232b100d26716444ebe~mv2.jpg`
- `dfbc4d_9c5b429a33d24f9199426a8918c10409~mv2.jpg`
- `dfbc4d_0ecb329538bd422b8ff9b34f2106689a~mv2.jpg`
- plus additional unseen images implied by `1/7`

### PDFs
- statutes PDF:
  - `dfbc4d_2c1d96f6aacc4d8db2c12c3bea908a20.pdf`
- membership PDF:
  - `13cc9c_c6365cf2649e4c68a4b99d58884b41eb.pdf`

## Important Inconsistencies / Manual QA Items
These must be preserved in handoff because they materially affect planning.

1. Event slug/date mismatch
- Example event URL implies `2025-04-06`
- page content shows `2025-11-30`
- likely recurring event routing artifact
- manual validation required for every migrated event

2. YouTube identity mismatch
- footer links to `@rollkindvideo/videos`
- impressum references `@SkateClubBiriciana`
- user must confirm canonical YouTube destination

3. Membership fee text split across page and PDF
- page mentions annual fee and family fee
- PDF includes active/passive/supporting/family/crew and signup fee
- treat this as source-content mismatch only
- do not derive a pricing schema or pricing subsystem from it

4. Contact form field labels not yet fully recovered
- structure is known
- exact labels/placeholders remain unresolved
- must be extracted or confirmed later

5. Datenschutz is generic Wix legal text
- migrate as-is unless user requests replacement
- do not silently modernize or rewrite

## Historical Planning Material Retired
Earlier planning material used to continue below this point.

That material was intentionally retired after the documentation stack was split into dedicated owner docs.

Use these docs for active decisions instead:

- [website-foundation.md](/home/nout/REPO/SCB-Website/docs/plans/website-foundation.md)
- [routes-and-pages.md](/home/nout/REPO/SCB-Website/docs/plans/routes-and-pages.md)
- [calendar.md](/home/nout/REPO/SCB-Website/docs/plans/calendar.md)
- [content-cms.md](/home/nout/REPO/SCB-Website/docs/plans/content-cms.md)
- [public-data-register.md](/home/nout/REPO/SCB-Website/docs/plans/public-data-register.md)
- [implementation.md](/home/nout/REPO/SCB-Website/docs/plans/implementation.md)
- [migration.md](/home/nout/REPO/SCB-Website/docs/plans/migration.md)

This audit should now be used only for:

- audited Wix routes, content, and assets captured above
- source inconsistencies and manual QA items
- historical source observations
- source URLs used during analysis

## Source URLs Used During Analysis
- Homepage:
  - `https://briareos.wixsite.com/skateclubbiriciana`
- About:
  - `https://briareos.wixsite.com/skateclubbiriciana/ueber-uns`
- Media:
  - `https://briareos.wixsite.com/skateclubbiriciana/pics-n-vids`
- Events:
  - `https://briareos.wixsite.com/skateclubbiriciana/veranstaltungen`
- Example event detail:
  - `https://briareos.wixsite.com/skateclubbiriciana/events/sunday-funday-2025-04-06-13-00`
- Membership:
  - `https://briareos.wixsite.com/skateclubbiriciana/copy-of-veranstaltungen`
- Contact:
  - `https://briareos.wixsite.com/skateclubbiriciana/kontakt`
- Impressum:
  - `https://briareos.wixsite.com/skateclubbiriciana/impressum`
- Datenschutz:
  - `https://briareos.wixsite.com/skateclubbiriciana/datenschutz`
- RSS:
  - `https://briareos.wixsite.com/skateclubbiriciana/blog-feed.xml`
- Membership PDF:
  - `https://36da100f-5a64-4e36-9be3-cd978447e787.filesusr.com/ugd/13cc9c_c6365cf2649e4c68a4b99d58884b41eb.pdf`
- Statutes PDF:
  - `https://36da100f-5a64-4e36-9be3-cd978447e787.filesusr.com/ugd/dfbc4d_2c1d96f6aacc4d8db2c12c3bea908a20.pdf`
