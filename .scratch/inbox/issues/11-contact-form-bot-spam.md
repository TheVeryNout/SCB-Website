# Contact form: stronger bot protection if spam shows up

Category: enhancement
Status: needs-info
Blocked by: None
Created: 2026-11-05

The contact form (`.scratch/contact-mail/`, live since 2026-11-05) has a honeypot, a 20 KB body cap and field limits. A bot that posts straight to `/api/contact` without the honeypot field still sends one real mail per post through the `info@` account. No rate limit exists (needs external storage).

Owner decision 2026-11-05: wait and watch the club inbox for a few weeks; act only if spam arrives.

If it does, in this order:
1. Time-trap: the form records its load time, the function rejects posts under about 3 seconds. No account needed, about 20 lines plus tests.
2. Cloudflare Turnstile: free, mostly invisible; needs a Cloudflare account and site key, adds a Cloudflare script, so the privacy page (`/datenschutz/`) must mention it.

Honeypot checked live 2026-11-05: field present on `/kontakt/`; a post with it filled gets the thank-you redirect.
