# Photo Inbox

Drop a trip's original photos here before importing them onto the map — one
subfolder per trip, e.g.:

```
photo-inbox/
  arkansas-trip/
    IMG_1234.HEIC
    IMG_1235.HEIC
```

Nothing in this folder except this file is tracked by git — it's purely a
local staging area, never committed or deployed. HEIC or JPEG both work.

Once a batch is ready, say which route it's for and what each photo is
(captions, which stop they belong to). Claude runs
`scripts/import-photos.cjs` against the subfolder, which writes only the
converted/resized output into `public/photos/<route-id>/` — that's the only
thing that actually ends up in the repo.

Delete a trip's subfolder here once it's been imported; there's no reason to
keep the originals around once they're in the manifest.
