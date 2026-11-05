# 03: A real mail reaches the Gmail inbox

Category: task
Status: resolved
Blocked by: 01, 02
Created: 2026-11-05

**What to build:** The feature works on the Netlify address with real settings, and the club's mail lands in the inbox, not in spam. Docs match the new reality.

- [x] Owner enters the settings as Netlify environment variables (names in ticket 01; host `mail.skateclubbiriciana.de`, port `465`, user `info@skateclubbiriciana.de`, recipient `scbiriciana@gmail.com`); no agent sees the password
- [x] Owner adds an SPF record for `skateclubbiriciana.de` (DKIM and DMARC already exist)
- [x] The Netlify build bundles the function and `/api/contact` answers
- [x] One real test message from `https://scbiriciana.netlify.app/kontakt/` reaches `scbiriciana@gmail.com`; Reply-To, subject and spam folder checked
- [x] The launch rule in `docs/plans/implementation.md` and the README line are updated; the "Netlify Forms" wording on `/kontakt/` is gone. Phase-history docs (`cold-start`, `wix-audit`, `status-checklist`) are marked history and keep their old wording on purpose.
- [x] Deployed: `master` pushed to GitHub (remote `github`, added 2026-11-05) and Netlify built it



Review 2026-11-05 (`fresh-eyes`, no blocker): fixed SMTP timeouts, CRLF counted as one character, 20 KB body cap, stricter email shape, note display after a URL-fragment landing, README line on local testing. Accepted risk: no rate limit beyond the honeypot (a script could flood the mailbox; add a time-trap or an external limiter if spam shows up). Left as is: `status-checklist.md` keeps its history wording.

Closed 2026-11-05. Owner set the Netlify variables and the SPF record (live value: `v=spf1 +mx +a +ip4:192.250.229.250 +include:spf.mysecurecloudhost.com ~all`, read from DNS), and a real test message from the Netlify address reached the club's Gmail inbox. Follow-up fixes (sending state, thank-you page) are quick-fixes/08.
Open risk, accepted: only the honeypot and a 20 KB cap guard against bots; see the spam note in the reply of this session (time-trap, Turnstile) if spam appears.
