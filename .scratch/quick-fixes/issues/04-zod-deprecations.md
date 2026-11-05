# 04: Replace deprecated Zod calls in the content schema

Category: enhancement
Status: resolved
Blocked by: None
Created: 2026-11-05
Replaces: [inbox/05](../../inbox/issues/05-zod-deprecation-hints.md)

`src/content/config.ts` used Zod 4 deprecated forms: `z.string().url()`, `.datetime({ message })`, `.email()` and `z.ZodIssueCode.custom`. Now `.pipe(z.url())`, `.pipe(z.iso.datetime({ offset: true, error }))`, `.pipe(z.email())` and `code: "custom"`; trimming stays first.

## Checked

`bun run check` 0 errors, 0 warnings, 0 hints (was 8 hints); `bun test` 39/39; build 104 pages, so all existing content still validates. A standalone script confirmed the new URL, datetime and email validators accept valid values, reject invalid ones and still trim.
