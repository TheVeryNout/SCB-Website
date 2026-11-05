# Deployed-site spot check after the next publish

Status: resolved
Blocked by: None
Created: 2026-11-05
Source: [docs/operational-status.md](../../../docs/operational-status.md), Recent Operational Work 2026-07-26

The calendar series grouping and the frontend visual polish both named a deployed-site spot check after the Netlify build as their next step; no record shows it was done. The media-page-refresh merge is not yet deployed either. Check the live site once `master` is published.

## Answer

Checked 2026-11-05 after `a04d737` deployed (about 45 s after the push). All 11 routes return 200; the live CMS serves the new image config and upload hook; `/admin/` shows the login. At 1440 px and 390 px: home, Neuigkeiten, Pics n Vids and Veranstaltungen load with no broken images and no console or network errors; Pics n Vids shows four galleries and the lightbox opens ("1 von 8"). At 390 px, `/` and `/veranstaltungen/` scroll sideways: [quick-fixes/05](../../quick-fixes/issues/05-phone-width-overflow.md).

Not checked: logging in and saving in the live CMS (inbox/01), other routes at 390 px.
