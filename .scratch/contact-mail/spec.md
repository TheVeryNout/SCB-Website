# Contact form by mail

Status: ready-for-agent
Branch: feat/contact-mail
Created: 2026-11-05

## Problem Statement

The contact form on `/kontakt/` depends on Netlify Forms. Messages only sit in the Netlify dashboard, no notification is set up, and the free quota is small. The club now has its own mailbox, `info@skateclubbiriciana.de`, and wants form messages delivered as email to `scbiriciana@gmail.com`.

## Solution

A visitor fills in the same form and lands on `/kontakt/danke/`. Behind it, a Netlify Function logs in to the club's mail server (SMTP) as `info@skateclubbiriciana.de` and sends the message to `scbiriciana@gmail.com`. Replying in Gmail answers the visitor. If sending fails, the visitor sees a clear error and the direct contact details already on the page.

## User Stories

1. As a visitor, I want to send a message from the contact page, so that I can reach the club without opening my own mail app.
2. As a visitor, I want a thank-you page after sending, so that I know the message went out.
3. As a visitor, I want a clear error with the club's direct contact details if sending fails, so that I do not lose my message or my time.
4. As a visitor, I want my entries kept in the form after an error, so that I do not have to retype.
5. As a club member reading the Gmail inbox, I want each message to show name, subject and text, so that I can act on it at a glance.
6. As a club member, I want to press Reply and answer the visitor directly, so that I need no extra tool.
7. As a club member, I want almost no spam, so that real requests are not buried.
8. As the site owner, I want the mail password stored only in Netlify settings, so that it never appears in the repo or in the page.
9. As the site owner, I want the recipient address in one setting, so that changing it needs no code change.
10. As the site owner, I want the form to keep working while the custom domain still points to the old host, so that the Netlify address is testable before cutover.
11. As the site owner, I want to remove the dependency on Netlify Forms, so that the quota and dashboard no longer matter.

## Implementation Decisions

- One Netlify Function receives the form post, validates it, sends one mail through SMTP and redirects (303) to `/kontakt/danke/`. Failure redirects back to `/kontakt/` with an error state.
- Fields stay `name`, `email`, `message`, optional `subject`; the honeypot `bot-field` stays. A filled honeypot gets the normal thank-you redirect and sends nothing.
- Validation: required fields present, email shape plausible, length limits on every field, header-injection characters (line breaks) stripped from name, email and subject.
- Mail: sent from `info@skateclubbiriciana.de` to the configured recipient; `Reply-To` is the visitor's address; the subject carries a fixed prefix plus the visitor's subject.
- Configuration lives in Netlify environment variables (SMTP host, port, security mode, user, password, recipient). The owner enters the password; no agent sees or writes it.
- The function's logic sits behind one handler with the mail transport passed in, so tests run without a real mail server.
- The form drops `data-netlify`; the `form-name` field is no longer needed. Visible fallback contact details on `/kontakt/` stay.
- This reverses the launch rule in `docs/plans/implementation.md` ("no serverless function"). That doc and `docs/plans/content-cms.md` or `routes-and-pages.md`, wherever they describe the form, are updated in the same work.
- `netlify.toml` needs the functions directory; it is a risky file (see AGENTS.md) and counts as big.

## Testing Decisions

- Seam: the function handler, called with a request and a fake transport. A good test checks only outward behaviour: what mail would be sent, which redirect comes back.
- Cases: valid message, missing field, bad email, over-long field, line breaks in subject, filled honeypot, transport failure.
- Prior art: `bun test` suites under the repo's existing test folders.
- Browser: submit the form on the local dev server with the fake transport and on the Netlify address once with a real send; check desktop and phone width and the error state.

## Out of Scope

- A hosted form service, a database of messages, or an admin view of submissions.
- Auto-reply to the visitor.
- File attachments.
- DNS or the custom-domain cutover. Mail deliverability (SPF/DKIM on `skateclubbiriciana.de`) is checked but not changed here.
- CAPTCHA, unless spam shows up after launch.

## Further Notes

- Open questions are in `map.md`.
- Netlify's own email notification only goes to team members of the Netlify account (checked by the owner, 2026-11-05); the owner will not upgrade the plan. That is why this spec exists.
