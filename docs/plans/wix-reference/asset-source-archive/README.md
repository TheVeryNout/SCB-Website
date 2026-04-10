# Wix Asset Source Archive

This folder contains directly downloaded media assets extracted from the local Wix reference HTML/feed captures.

Do not import from this folder in site implementation.

This folder is archive/provenance only.

## Contents

- `original/`: downloaded base media files from `static.wixstatic.com/media/<asset-id>`
- `manifest.json`: asset discovery and download metadata

## Notes

- current discovered asset count: `89`
- assets are deduplicated by Wix media asset id
- use this pack as a provenance archive and recovery source
- do not wire app code or content entries directly to files in this folder
- if a needed image is missing, expand the reference crawl or use live-site fallback only for the missing item
