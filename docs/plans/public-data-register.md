# Public Data Register

## Purpose

This document is the canonical register for high-risk public facts used by the `SCB` website.

Its job is to prevent silent normalization of uncertain data during migration and implementation.

Use it to track:

- what public fact is currently known
- where it came from
- whether it is confirmed
- whether it is safe to publish as final

If a value here is marked `pending`, it may be migrated from the Wix source for parity, but it must not be treated as newly confirmed truth.

---

## Boundaries

This document defines:

- factual public data status
- confirmation state
- source references for risky values

This document does not define:

- page copy
- CMS schema
- implementation details
- migration workflow

Those belong in:

- `routes-and-pages.md`
- `content-cms.md`
- `implementation.md`
- `migration.md`

---

## Status Vocabulary

Use only these statuses:

- `confirmed`: explicitly confirmed by the user for final publication
- `pending`: observed in source material but not explicitly reconfirmed
- `conflict`: multiple source values exist and no canonical choice is approved
- `superseded`: previously observed value is no longer current

Launch rule:

- only `confirmed` values should be treated as final truth without warning
- `pending` values may be migrated for source parity but must remain easy to review
- `conflict` values require explicit resolution before final launch signoff

---

## Register

Last cold-read audit source date:

- `2026-04-09`

### Organization Identity

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| organizationName | `Skate Club Biriciana e.V.` | Wix pages and legal text | pending | safe to use as migration baseline |

### Social Links

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| instagram | `https://www.instagram.com/skateclub_biriciana/` | footer and impressum audit | pending | can be migrated, should still be reconfirmed |
| youtubePrimary | `https://www.youtube.com/@SkateClubBiriciana` | impressum audit | conflict | do not treat as canonical until user resolves |
| youtubeFooter | `https://www.youtube.com/@rollkindvideo/videos` | footer/media audit | conflict | do not treat as canonical until user resolves |

### Legal And Contact Data

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| legalAddress | `Noerdlinger Strasse 1, 91781 Weissenburg` | impressum and membership page audit | pending | can be migrated, must be reconfirmed |
| contactEmail | `scbiriciana@gmail.com` | impressum and membership page audit | pending | can be migrated, must be reconfirmed |
| contactPhone | `01708303717` | impressum audit | pending | do not treat as final without confirmation |
| whatsApp | `01708303717` | impressum audit | pending | do not treat as final without confirmation |
| registerCourt | `Amtsgericht Ansbach` | impressum audit | pending | legal fact, requires confirmation |
| registerNumber | `201141` | impressum audit | pending | legal fact, requires confirmation |
| vatId | `DE228041698` | impressum audit | pending | legal fact, requires confirmation |
| authorizedRepresentatives | `Christian Winkler, Andreas Schmidt` | impressum audit | pending | legal fact, requires confirmation |
| legalTextValidFrom | `28. August 2024` | impressum audit | pending | preserve as source fact unless replaced |

### Donation Data

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| donationAccountName | `SkateClub Biriciana e.V.` | audited fundraising post | pending | do not newly emphasize without confirmation |
| donationIban | `DE82 7659 1000 0000 1238 20` | audited fundraising post | pending | financial fact, requires confirmation |
| donationBank | `VR Bank im suedlichen Franken` | audited fundraising post | pending | financial fact, requires confirmation |
| donationReference | `Spende fuer Hallenbau` | audited fundraising post | pending | preserve only as source-observed text |

### Membership Pricing

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| membershipActiveBeforeAugust | `24EUR per year` | membership page audit | conflict | pricing requires explicit user confirmation |
| membershipActiveFromAugust | `12EUR first year` | membership page audit | conflict | pricing requires explicit user confirmation |
| membershipFamily | `50EUR per year` | membership page audit | conflict | pricing requires explicit user confirmation |
| membershipFamilyReduced | `35EUR from August` | membership PDF audit | conflict | pricing requires explicit user confirmation |
| membershipCrew | `60EUR per year` | membership PDF audit | conflict | pricing requires explicit user confirmation |
| membershipCrewReduced | `30EUR from August` | membership PDF audit | conflict | pricing requires explicit user confirmation |
| signupFee | `5EUR per application` | membership PDF audit | conflict | pricing requires explicit user confirmation |

### Membership Submission Details

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| membershipSubmitEmail | `scbiriciana@gmail.com` | membership page audit | pending | can be migrated, should be reconfirmed |
| membershipSubmitPost | `Skate Club Biriciana e.V., Noerdlinger Strasse 1, 91781 Weissenburg` | membership page audit | pending | can be migrated, should be reconfirmed |
| yearlyDebitMonth | `February` | membership page audit | pending | preserve as source fact unless updated |

### PDFs And Downloadables

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| statutesPdf | Wix-hosted statutes PDF | about page audit | pending | migrate locally and keep source URL in manifest |
| membershipFormPdf | Wix-hosted membership PDF created `2025-04-18` | membership page and PDF audit | pending | migrate locally and preserve as current source artifact |

### Location Data

| Key | Current value | Source | Status | Publication rule |
| --- | --- | --- | --- | --- |
| skateparkLocationName | `Weissenburg in Bayern` | audited event detail | pending | can be used as source baseline |
| skateparkAddress | `Gunzenhausener Str. 45, 91781 Weissenburg in Bayern, Deutschland` | audited event detail | pending | map/location fact should be checked before final publication |

---

## Known Conflicts Requiring Explicit Resolution

These items must be resolved before final launch signoff:

1. canonical YouTube destination
2. current valid membership pricing model
3. current valid donation/bank details if fundraising content stays live

## Current Freeze For Implementation

Until the user confirms replacements, treat the unresolved items above as frozen publication blockers, not as open design questions.

Use these safe defaults:

- do not invent a single canonical YouTube account in shared settings or the footer while the conflict remains unresolved
- preserve audited per-item video destinations in migrated media content where needed
- do not merge conflicting membership pricing values into one new canonical web pricing table without user confirmation
- if fundraising content remains in scope, do not newly feature donation details outside source-parity migration until the user confirms them

---

## Publication Rules

### Allowed before confirmation

- migrate source-observed facts for parity
- mark unresolved facts in migration notes
- keep implementation wired so facts are easy to replace

### Not allowed before confirmation

- silently merging conflicting values into one invented value
- treating a `conflict` value as canonical in new copy
- expanding financial or legal claims beyond what the source already states

---

## Update Rule

When the user confirms a value:

1. change its status to `confirmed`
2. note the confirmation source/date
3. update the implementation content source accordingly

When the user replaces a source value:

1. mark the old value `superseded`
2. add the new value as `confirmed`

---

## Acceptance Rule

This document is satisfied only when:

- every risky public fact has a status
- every conflicting fact is explicit
- later agents can tell which values are safe to treat as final
- legal, financial, social, and pricing data are no longer scattered across other docs
