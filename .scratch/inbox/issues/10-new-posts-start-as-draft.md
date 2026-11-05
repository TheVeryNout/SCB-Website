# New posts start as draft: keep or change?

Category: question
Status: needs-info
Blocked by: None
Created: 2026-11-05

The CMS "Entwurf" switch is on by default for new news posts, so an editor who forgets to switch it off publishes nothing. `docs/plans/content-cms.md` (lines 396 and 523) records this as the intended behaviour, so it was not changed.

Question for the owner: keep new posts as drafts (safe, but an editor can forget the switch), or publish by default (a half-written post that is saved goes live)? If changed: one line in `public/admin/config.yml` (`draft`, `default`) and the two doc lines.
