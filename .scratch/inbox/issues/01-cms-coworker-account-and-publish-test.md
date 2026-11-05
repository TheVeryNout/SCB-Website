# CMS: coworker account and end-to-end publish test

Status: needs-triage
Blocked by: None
Created: 2026-11-05
Source: [docs/operational-status.md](../../../docs/operational-status.md), Open Operational Items

The deployed CMS uses invite-only Netlify Identity accounts through Git Gateway. The admin login works. Still open: invite a separate coworker account and publish one real change through the deployed CMS at `https://scbiriciana.netlify.app/admin/`, then confirm it reaches `master` and the live site.

Needs the owner: Netlify Identity invites and a real editor login.

Also covers (folded in from inbox/07, CMS-06): the coworker does one real post with one image through the one-image-at-a-time flow. Check that the upload is converted to WebP and named after the post title, and that the image shows on the live site.
Also check the new batch button ([gallery-batch-upload](../../gallery-batch-upload/spec.md)): add 3 to 5 phone photos to a post gallery at once on the live CMS, fill the descriptions, publish, and confirm the images show on the live site.
