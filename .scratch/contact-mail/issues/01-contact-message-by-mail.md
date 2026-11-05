# 01: A contact message arrives by mail

Category: enhancement
Status: ready-for-agent
Blocked by: None
Created: 2026-11-05

**What to build:** A visitor sends the contact form and the club receives it as an email. A Netlify Function validates the post, sends one mail from `info@skateclubbiriciana.de` to the configured recipient over SMTP (`mail.skateclubbiriciana.de`, port 465, SSL), and redirects to `/kontakt/danke/`. Reply-To is the visitor's address. The form no longer uses Netlify Forms.

- [ ] Required fields (`name`, `email`, `message`), plausible email, length limits on every field
- [ ] Line breaks stripped from name, email and subject (header injection)
- [ ] A filled honeypot gets the thank-you redirect and sends nothing
- [ ] Host, port, security mode, user, password and recipient come from environment variables; none in the repo
- [ ] The handler takes the mail sender as a parameter; tests cover valid message, missing field, bad email, over-long field, line breaks in subject, filled honeypot, sender failure
- [ ] The local dev form works end to end with a fake sender
- [ ] `data-netlify` and the `form-name` field are removed from the form; the Netlify functions folder is set in `netlify.toml`
- [ ] The mail library is installed only after the owner's yes (see `hq-package-guard`)

Not here: error page (02), real send and DNS (03).
