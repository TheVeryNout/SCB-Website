# 01: Move the local CMS proxy off port 4325

Category: bug
Status: resolved
Blocked by: None
Created: 2026-11-05

Port 4325, used by the SCB Decap proxy since the media-page work, is also used by the Blauer-Bock ibelsa mock, so `bun run dev:cms` could not get its port while that mock ran. Owner's call: move SCB, not the mock.

## Decision

- New port 4335: free on EVA-01 and named nowhere else in `~/REPO`.

## Checked

`grep` finds no `4325` outside history files; `bun run build` passes. Not checked: a live `bun run dev:cms` start (the owner runs the dev servers).
