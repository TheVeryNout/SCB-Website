# 08: Contact form gives no feedback while sending; thank-you page is poor

Category: bug
Status: resolved
Blocked by: None
Created: 2026-11-05

Found by the owner in the first live test of the mail form:
- After "Nachricht senden" nothing changed for a few seconds (the SMTP send takes that long), so the button looked dead.
- `/kontakt/danke/` had a huge uppercase headline, a hedging sentence ("Wenn die Formularübermittlung erfolgreich war, ...") and a confusing small print line.

Fix: the button switches at once to "Wird gesendet …" with a spinner, is disabled and marked `aria-busy`, and a screen-reader status says so; it resets after an error. The thank-you page is a short card: check mark, "Danke für deine Nachricht!", "Sie ist beim Verein angekommen. Wir melden uns so bald wie möglich bei dir.", buttons "Zur Startseite" and "Zu den News". `src/pages/kontakt/index.astro` and `danke.astro` only.
Checked: sending state, reset after a stubbed slow error, and the thank-you page at 1440 and 390 px (no overflow, screenshots); `bun test`, `bun run check`, `bun run build`.
Not checked: the real send on Netlify after the fix; screen-reader announcement; the no-JavaScript path has no sending state (the browser shows its own loading).
Open for the owner: the promise "Wir melden uns so bald wie möglich" is the club's to make; reword if it should not promise a reply.
