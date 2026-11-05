# Contact mail: open decisions

Status: resolved

1. **SMTP details** — resolved 2026-11-05: `mail.skateclubbiriciana.de`, port 465, SSL, user `info@skateclubbiriciana.de`. The server certificate covers `*.skateclubbiriciana.de` and verifies.
2. **Netlify Forms during the switch**: drop at once, or keep both until the first real mail arrives. Leaning: switch at once, because a double path doubles spam. (The Netlify email notification is not an option: team members only.)
3. **Deliverability** (DNS checked 2026-11-05): MX is `s13612.fra1.stableserver.net` (the old web host). DKIM record `default._domainkey` exists, DMARC is `p=none`, no SPF record at the domain root. Mail relayed through the host's own SMTP should pass DKIM; the missing SPF is a weak spot. Owner adds an SPF TXT record at the DNS provider (value from the mail host's panel). Open: does it still go to Gmail's inbox in the real test.
4. **Error and success pages**: reuse `/kontakt/` with an error note, or a separate page. Leaning: same page, no JS needed.
5. **Rate limit**: honeypot only, or also a simple per-IP limit. Leaning: honeypot only for launch.
