# 01: A contact message arrives by mail

Category: enhancement
Status: resolved
Blocked by: None
Created: 2026-11-05

**What to build:** A visitor sends the contact form and the club receives it as an email. A Netlify Function validates the post, sends one mail from `info@skateclubbiriciana.de` to the configured recipient over SMTP (`mail.skateclubbiriciana.de`, port 465, SSL), and redirects to `/kontakt/danke/`. Reply-To is the visitor's address. The form no longer uses Netlify Forms.

- [x] Required fields (`name`, `email`, `message`), plausible email, length limits on every field
- [x] Line breaks stripped from name, email and subject (header injection)
- [x] A filled honeypot gets the thank-you redirect and sends nothing
- [x] Host, port, security mode, user, password and recipient come from environment variables; none in the repo
- [x] The handler takes the mail sender as a parameter; tests cover valid message, missing field, bad email, over-long field, line breaks in subject, filled honeypot, sender failure
- [x] The function sends through a local stand-in mail server (Reply-To, subject, body, failure and missing-setting redirects checked); the form markup is checked in the browser
- [x] `data-netlify` and the `form-name` field are removed from the form; the Netlify functions folder is set in `netlify.toml`
- [x] The mail library is installed only after the owner's yes (see `hq-package-guard`)

Not here: error page (02), real send and DNS (03).

Checked: `bun test` (14 new tests), `bun run check`, `bun run build`; form markup at 1440 and 390 px (action `/api/contact`, no Netlify attributes or text, no overflow). Library: `nodemailer` 10.3.1, pinned; advisory check found fixes in 10.0.13 and later, no compromise reports.
Not checked: the form submitted through the browser (`astro dev` does not serve `/api/contact`; needs Netlify's runtime), Netlify bundling of the function, port 465 with the real server. All three belong to ticket 03.
Environment variables the function reads: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (default on; `false` turns it off), `SMTP_USER` (also the sender), `SMTP_PASS`, `CONTACT_TO`.
