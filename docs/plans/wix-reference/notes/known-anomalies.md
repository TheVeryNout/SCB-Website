# Known Anomalies

These are the main issues already visible from the local Wix reference pack.

## Source Artifacts

- the legacy membership source route is `/copy-of-veranstaltungen`, which must not survive as the final public route
- the representative event detail route is a Wix-specific `/events/...` URL and is only source evidence, not a target URL contract
- screenshots may include the Wix cookie banner, so do not rely on them alone for lower-page content
- the `datenschutz` screenshot was removed from the retained pack because it was unusable; rely on the local HTML and PDF instead

## Feed And Content Irregularities

- `feeds/blog-feed.xml` still carries the feed title `Annis Studio`, which is a Wix artifact and not the site brand
- the blog feed should be used for post inventory, not for branding truth

## Public Data Risks

- the fundraiser post contains donation and bank data that must still be verified before final publication
- the impressum HTML exposes multiple YouTube destinations, including `https://www.youtube.com/@SkateClubBiriciana` and `https://www.youtube.com/@rollkindvideo/videos`
- the Instagram destination observed in the impressum HTML is `https://www.instagram.com/skateclub_biriciana/`

## Working Rule

If any of these anomalies matters for implementation, check the local HTML and PDF captures first, then escalate to live Wix inspection only if the local evidence is insufficient.
