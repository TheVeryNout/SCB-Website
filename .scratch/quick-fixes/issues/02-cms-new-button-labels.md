# 02: German "Neue(r/s) …" button in the CMS

Category: bug
Status: resolved
Blocked by: None
Created: 2026-11-05

Decap's German locale labels the new-entry button "Neue(r/s) <collection>". `public/admin/preview.js` now overrides that phrase to "<singular> erstellen", and `config.yml` gives Neuigkeiten and Veranstaltungen a `label_singular`.

## Checked

Local editor (headless browser): the buttons read "Beitrag erstellen", "Veranstaltung erstellen", "Fotogalerie erstellen"; no new console errors.
