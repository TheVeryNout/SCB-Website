# 2026-04-13 1140 final build wrap up

## Author

Codex GPT-5.4

## Scope

This changelog records the final wrap-up state for the SCB Astro website build after the Phase 6 closeout and Phase 7 release-candidate pass.

It does not replace the detailed implementation changelogs for the individual phases. It exists as the handoff index for the completed build.

Relevant prior changelogs:

- `docs/changelog/2026-04-10_1800_phase-5-route-completion.md`
- `docs/changelog/2026-04-10_1850_phase-6-migration-batch.md`
- `docs/changelog/2026-04-10_1907_phase-6-closeout.md`
- `docs/changelog/2026-04-13_phase-7-release-candidate.md`

## Pressing issue

The user asked to wrap up the entire website build and identify any remaining to-dos or next steps.

At the start of the wrap-up, the repository was already in this state:

- Phases 1 to 6 were recorded as cleared by the planning docs
- Phase 7 had just been completed as a technical release-candidate pass
- the worktree still contained uncommitted implementation, content, planning, and changelog changes
- final public launch signoff was still blocked by public-data decisions, not by missing implementation work

## Analysis and process

The wrap-up followed the local wrapper command:

- read `.codex/commands/wrapper.md`
- checked the referenced changelog instruction
- found that the wrapper pointed to a stale Claude-era changelogger path, which did not exist in this repo
- used the existing `.codex/commands/changelogger.md` instruction and the established `docs/changelog/` folder convention instead
- checked the existing changelogs so this final record would not duplicate already documented Phase 6 and Phase 7 implementation detail

The important conclusion:

- the website build is complete as a technical release candidate
- launch signoff is still a content/fact confirmation task
- no additional implementation phase remains open in the current plan stack

## What was already implemented before this wrap

### Phase 6 closeout

Documented in `docs/changelog/2026-04-10_1907_phase-6-closeout.md`.

The closeout reconciled:

- homepage copy against retained local Wix evidence
- about and membership copy against retained local Wix evidence
- `Sunday Funday` event data against the retained event index and detail evidence
- migration manifest statuses from broad `qa-pending` toward concrete `migrated` or `blocked`
- execution docs so Phase 7 became the active continuation phase

Notable compromise:

- `Sunday Funday` is kept as the single verified `2025-11-30` occurrence instead of an unsupported recurring series
- `parkausbesserungen` remains blocked for fuller content recovery because retained evidence is truncated

### Phase 7 release candidate

Documented in `docs/changelog/2026-04-13_phase-7-release-candidate.md`.

The release-candidate pass added:

- `netlify.toml`
- build command and publish directory for Netlify
- canonical-domain redirects
- high-confidence retained Wix legacy redirects
- a single verified event redirect for `Sunday Funday`
- global `:focus-visible` styling for keyboard users
- Phase 7 status updates in the planning docs

Important redirect rule:

- no broad event wildcard redirect was added
- the only event redirect uses the retained visible occurrence date: `/events/sunday-funday-2025-04-06-13-00` to `/veranstaltungen/sunday-funday/2025-11-30/`

## What changed in this wrap-up step

This wrap-up step added only this changelog:

- `docs/changelog/2026-04-13_1140_final-build-wrap-up.md`

No app code, schema, route, database, backend, or design-system logic was changed during this final wrap-up step.

## Verification state

The immediately preceding Phase 7 pass verified:

- `bun test`
- `bun run check`
- `bun run build`
- local preview HTTP 200 checks for launch routes, `/admin/`, localized PDFs, and the verified event detail route
- phone-width Chromium screenshots at `390x844`
- contact form static Netlify attributes
- image alt coverage
- external Instagram, YouTube, and Google Maps links
- Decap CMS config assumptions for Git Gateway on `master`
- risky public facts against `docs/plans/public-data-register.md`

Known check caveat:

- `bun run check` still reports only non-blocking Zod deprecation hints in `src/content/config.ts`

## Remaining to-dos

These are the remaining launch tasks:

1. Confirm the canonical YouTube destination.

   `docs/plans/public-data-register.md` still records a conflict between:

   - `https://www.youtube.com/@SkateClubBiriciana`
   - `https://www.youtube.com/@rollkindvideo/videos`

2. Decide what to do with donation and bank details.

   The fundraising content preserves source-observed donation data, but the public-data register still marks the financial facts as pending.

   Before final public launch, decide whether to:

   - keep the source-observed values as-is
   - replace them with confirmed current values
   - remove or de-emphasize the fundraising details

3. Enable and verify Netlify project services after deployment.

   The repo is configured for Netlify, but the deployed project still needs operational setup:

   - Netlify Identity
   - Git Gateway
   - form notification handling for the contact form
   - production domain attachment and DNS

4. Optional later cleanup.

   These do not block the current release candidate:

   - recover fuller `parkausbesserungen` source evidence if better local evidence appears
   - modernize the Zod deprecation hints in `src/content/config.ts`
   - perform final asset curation after launch decisions are settled

## Current result

The SCB Astro website build is wrapped as a technical release candidate.

All planned implementation phases are complete in the repo docs.

The next meaningful step is not another implementation phase. It is final public-fact signoff and deployment operations.
