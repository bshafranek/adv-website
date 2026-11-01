# GPX Data Layout

Raw ride tracks live here, grouped by trip collection, which are themselves grouped into
top-level groups. The on-disk folder structure mirrors the manifest's group → collection
nesting:

```
public/gpx/
  manifest.json
  <group-slug>/
    <collection-slug>/
      <route-slug>.gpx
```

Current structure (group → collection → routes):

- `past-rides` (**Past Rides**)
  - `arkansas-trip` — multi-day Arkansas trip (completed, real ride dates)
  - `day-rides` — standalone completed day rides, loose `.gpx` files directly under
    `past-rides/` rather than their own subfolder (real ride dates)
  - `wichita-trip` — 2-day Wichita Mountains trip (completed, real ride dates)
- `future-rides` (**Future Rides**)
  - 46 planned/reference routes (`date: null`) sit directly on this group (no collection
    sub-heading in the sidebar) — loose `.gpx` files directly under `future-rides/`
  - `trans-america-trail` — TAT general/numbered sections (`date: null`)
  - `trans-america-trail-la` — TAT LA section, lives in `trans-america-trail/la-section/`
    on disk (`date: null`)
  - `trans-america-trail-ny` — TAT NY section, lives in `trans-america-trail/ny-section/`
    on disk (`date: null`)

Not every collection's folder name matches its `id` 1:1 — `trans-america-trail-la` and
`trans-america-trail-ny` are subfolders _within_ `trans-america-trail/`, and `day-rides` has
no folder of its own at all. The manifest's `file` path is always the source of truth, not
the folder layout.

## manifest.json

`manifest.json` lists every group, collection, and route the app should load. Schema:

- `groups[]`
  - `id` — unique group slug
  - `title` — shown as the top-level heading in the sidebar and Download page
  - `defaultColor` — hex color used for routes placed directly in this group's `routes[]` (see
    below) that don't set their own `color`. Unused if the group has no such routes.
  - `routes[]` — **optional.** Routes that sit directly under this group with no collection
    sub-heading in the sidebar (e.g. `future-rides`'s 46 bucket-list routes). Same route schema
    as `collections[].routes[]` below, except there's no `collectionId` (omit it) and the color
    fallback is the group's own `defaultColor` instead of a collection's.
  - `collections[]`
    - `id` — unique collection slug (doesn't have to match a real folder name — see above)
    - `title`, `description` — shown in the sidebar
    - `defaultColor` — hex color used for routes in this collection that don't set their own `color`
    - `routes[]`
      - `id` — unique route slug (unique across the **entire** manifest, not just its collection)
      - `title`
      - `date` — ISO `YYYY-MM-DD` the route was actually ridden, or `null` if it hasn't been ridden yet
        (or the ride date isn't known). Only trust a GPX file's embedded `<time>` tags as a ride date
        when the file is an actual recorded track (many sequential timestamped trackpoints) — planning
        tools (e.g. "DMD HUB GPX Planner", mymaps exports) sometimes stamp a single `<time>` that's just
        the file's creation/export time, not a ride date.
      - `collectionId` — must match the parent collection's `id` (omitted for group-level routes)
      - `file` — path to the `.gpx` file, **relative to the site's base URL**, e.g.
        `gpx/<group-slug>/<collection-slug>/<route-slug>.gpx` (or wherever it actually lives)
      - `color` — hex override, or `null` to fall back to `defaultColor`

To add a real ride:

1. Drop the `.gpx` file wherever makes sense under `public/gpx/` (slug = lowercase,
   hyphen-separated, filesystem/URL-safe).
2. Add (or update) the corresponding entry in `manifest.json`, with a `file` path that
   matches exactly where you put it.

To add a new group or collection, see the root [`README.md`](../../README.md)'s "How routes are
organized" section.

Code that loads `manifest.json` or a route's `file` path must prefix it with
`import.meta.env.BASE_URL` (see `src/utils/manifest/loadManifest.ts`) so links keep
working when the site is served from a GitHub Pages project subpath.

Drag-and-drop local file import bypasses this manifest entirely — it loads a `.gpx` file
directly from the user's machine without touching `public/gpx/` (view-only on the map, not
part of any group/collection).
