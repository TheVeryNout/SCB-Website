# 03: A real mail reaches the Gmail inbox

Category: task
Status: ready-for-agent
Blocked by: 01, 02
Created: 2026-11-05

**What to build:** The feature works on the Netlify address with real settings, and the club's mail lands in the inbox, not in spam. Docs match the new reality.

- [ ] Owner enters the SMTP settings and password as Netlify environment variables (no agent sees the password)
- [ ] Owner adds an SPF record for `skateclubbiriciana.de` (DKIM and DMARC already exist)
- [ ] One real test message from `https://scbiriciana.netlify.app/kontakt/` reaches `scbiriciana@gmail.com`; Reply-To, subject and spam folder checked
- [ ] The launch rule in `docs/plans/implementation.md` and every doc that describes the form are updated; the "Netlify Forms" wording on `/kontakt/` no longer appears
- [ ] Deploying to GitHub `master` is a separate step that needs the owner to name GitHub
