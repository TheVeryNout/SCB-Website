# 03: A real mail reaches the Gmail inbox

Category: task
Status: ready-for-human
Blocked by: 01, 02
Created: 2026-11-05

**What to build:** The feature works on the Netlify address with real settings, and the club's mail lands in the inbox, not in spam. Docs match the new reality.

- [ ] Owner enters the settings as Netlify environment variables (names in ticket 01; host `mail.skateclubbiriciana.de`, port `465`, user `info@skateclubbiriciana.de`, recipient `scbiriciana@gmail.com`); no agent sees the password
- [ ] Owner adds an SPF record for `skateclubbiriciana.de` (DKIM and DMARC already exist)
- [ ] The Netlify build bundles the function and `/api/contact` answers
- [ ] One real test message from `https://scbiriciana.netlify.app/kontakt/` reaches `scbiriciana@gmail.com`; Reply-To, subject and spam folder checked
- [x] The launch rule in `docs/plans/implementation.md` and the README line are updated; the "Netlify Forms" wording on `/kontakt/` is gone. Phase-history docs (`cold-start`, `wix-audit`, `status-checklist`) are marked history and keep their old wording on purpose.
- [ ] Deploying to GitHub `master` is a separate step that needs the owner to name GitHub

Remaining steps are the owner's (Netlify variables, SPF record, merge and deploy) plus one real test mail. State: waiting for the owner.

Review 2026-11-05 (`fresh-eyes`, no blocker): fixed SMTP timeouts, CRLF counted as one character, 20 KB body cap, stricter email shape, note display after a URL-fragment landing, README line on local testing. Accepted risk: no rate limit beyond the honeypot (a script could flood the mailbox; add a time-trap or an external limiter if spam shows up). Left as is: `status-checklist.md` keeps its history wording.
