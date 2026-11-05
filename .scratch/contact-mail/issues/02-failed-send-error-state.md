# 02: A failed send shows an error and keeps the entries

Category: enhancement
Status: resolved
Blocked by: 01
Created: 2026-11-05

**What to build:** When the function cannot send (mail server down, wrong settings, invalid input), the visitor returns to `/kontakt/` with a clear German error note and the direct contact details already on the page, and the text they typed is still in the form.

- [x] Invalid input and sender failure each show a fitting message (not the same text)
- [x] Name, email, subject and message are refilled after the error
- [x] The error note is announced to screen readers and sits near the form
- [x] Checked at desktop (about 1440px) and phone width (390px), no horizontal overflow

Decision (deviates from the spec line "same page, no JS needed"): the site is static, so a redirect cannot carry the typed text without putting it in the URL. With JavaScript the page sends the form itself (JSON answer from the function) and shows the note in place, so the text stays. Without JavaScript the function redirects to `/kontakt/#fehler-eingabe` or `#fehler-senden` and the note shows through the URL fragment (CSS `:target`); the typed text is lost there. Browsers' `required` and `maxlength` catch most bad input first.
Checked: `bun test` (15 for the handler), `bun run check`, `bun run build`; note hidden by default and shown by each fragment at 1440 and 390 px, no overflow; with a stubbed server answer: both notes show, typed text kept, button re-enabled, focus on the note, success goes to `/kontakt/danke/`; screenshot of the note at 390 px.
Not checked: a real failed send through Netlify (ticket 03), screen-reader announcement of the note.
