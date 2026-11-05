# 02: A failed send shows an error and keeps the entries

Category: enhancement
Status: ready-for-agent
Blocked by: 01
Created: 2026-11-05

**What to build:** When the function cannot send (mail server down, wrong settings, invalid input), the visitor returns to `/kontakt/` with a clear German error note and the direct contact details already on the page, and the text they typed is still in the form. Works without JavaScript.

- [ ] Invalid input and sender failure each show a fitting message (not the same text)
- [ ] Name, email, subject and message are refilled after the error
- [ ] The error note is announced to screen readers and sits near the form
- [ ] Checked at desktop (about 1440px) and phone width (390px), no horizontal overflow
