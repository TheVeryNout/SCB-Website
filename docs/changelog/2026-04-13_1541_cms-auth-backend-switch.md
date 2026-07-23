# CMS Auth Backend Switch

Author: Codex GPT-5

Date: 2026-04-13 15:41 Europe/Berlin

## Pressing Issue

The deployed Decap CMS login originally depended on Netlify Identity plus Git Gateway. During first live Netlify setup, that path failed repeatedly:

- Netlify Identity invite and password reset links landed on the public site instead of completing the CMS password setup flow.
- Redirecting token URLs to `/admin/` fixed navigation but did not complete password creation.
- The user remained in an email-not-verified state even after following Netlify email links.
- Netlify UI presented Identity external providers, which did not solve Decap GitHub backend authentication.

This blocked the intended low-friction `/admin/` CMS login for deployed editing.

## Analysis And Path Taken

1. The first assumption was that Netlify Identity token links were landing on a route without the Identity widget.
2. A lightweight public-route token redirect was added so `invite_token`, `confirmation_token`, and `recovery_token` hashes would be forwarded to `/admin/`.
3. The admin route was then hardened to delay Decap CMS loading while Netlify Identity token handling ran.
4. Further testing showed that the user still reached the generic login screen or remained unverified.
5. The token matcher was expanded for Netlify widget-compatible `#/...` hashes, but this still did not produce a reliable password setup flow.
6. The public layout briefly loaded the official Netlify Identity widget globally to let Netlify process tokens on whatever route it chose.
7. That also failed to provide a reliable confirmation/password flow.
8. The implementation then changed direction: stop relying on deprecated Netlify Identity and Git Gateway, and switch deployed Decap CMS auth to the GitHub backend.

The key conclusion was that the failed Netlify Identity flow was not worth further hardening. The repo already lives on GitHub, and the user accepted a dedicated club GitHub account as the practical CMS identity for non-technical editors.

## Final Implementation

### Deployed CMS Backend

`public/admin/config.yml` now uses Decap's GitHub backend:

```yaml
backend:
  name: github
  repo: TheVeryNout/SCB-Website
  branch: master
```

This means deployed `/admin/` login uses GitHub OAuth through Netlify's OAuth provider bridge. A CMS user must authenticate with a GitHub account that has push access to `TheVeryNout/SCB-Website`.

### Admin Route

`src/pages/admin/index.astro` was simplified back to plain Decap CMS loading:

- removed Netlify Identity widget loading
- removed custom token handling
- kept the Decap script as the only runtime CMS dependency

This avoids having two auth systems fighting over `/admin/`.

### Public Layout

`src/layouts/BaseLayout.astro` no longer loads Netlify Identity. The public site has no runtime dependency on Netlify Identity.

### Content Schema Hardening

`src/content/config.ts` now tolerates YAML-parsed `Date` objects for date and date-time fields and normalizes them back to strings.

Reason:

- a CMS save or YAML parser may rewrite unquoted ISO values as Date objects
- Astro content validation previously expected strings only
- this caused `publishedAt` validation to fail for `spende-von-der-volksbank-franken-sued`

The schema hardening prevents a harmless YAML formatting change from taking down the build.

### Documentation Updates

The following docs were updated during the session to reflect the final backend choice:

- `README.md`
- `docs/plans/cold-start.md`
- `docs/plans/implementation.md`
- `docs/plans/execution-plan.md`
- `docs/plans/status-checklist.md`

The docs now record that deployed CMS auth uses Decap's GitHub backend via Netlify OAuth, while local CMS still uses the unauthenticated Decap local backend proxy.

## Operational Setup

The working deployed setup requires:

1. GitHub OAuth app registered for the CMS.
2. OAuth callback URL set to `https://api.netlify.com/auth/done`.
3. GitHub OAuth provider configured in Netlify with the OAuth app Client ID and Client Secret.
4. A GitHub account with push access to `TheVeryNout/SCB-Website`.
5. Editors opening `/admin/`, choosing GitHub login, and authenticating with the authorized GitHub account.

The user created a dedicated GitHub account using the non-profit Gmail address, which is acceptable for this pragmatic club-CMS setup. The account should be limited to this repo and secured with controlled recovery access.

## Compromises

- The Git history contains several noisy commits from failed Netlify Identity attempts. These were already pushed to `origin/master`.
- The final tree is clean and coherent, so history rewrite was rejected as unnecessary risk.
- Shared GitHub credentials for non-technical editors are not ideal security practice, but a dedicated low-privilege club account is a practical launch compromise.
- The deployed CMS no longer offers Netlify-managed per-editor email/password accounts. Proper per-editor accounts would require a different CMS/auth provider later.

## Verification

Final state was verified with:

```bash
bun test
bun run check
bun run build
```

Results:

- tests passed
- Astro check passed with only the known Zod deprecation hints
- build passed and generated 20 pages

## Important References

- `public/admin/config.yml`
- `src/pages/admin/index.astro`
- `src/content/config.ts`
- `docs/plans/implementation.md`
- `docs/plans/status-checklist.md`
- `docs/changelog/2026-04-13_1301_wix-design-correction-pass.md`

## Remaining Work

- Test a real deployed CMS edit through `/admin/` using the GitHub-backed CMS account.
- Add trusted editors as GitHub collaborators or continue using the dedicated club CMS GitHub account.
- Continue the planned CMS usability and design refinement work, starting with the `/ueber-uns/` board-member section.
