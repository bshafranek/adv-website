# adv-website

An open-source, client-side web app for visualizing, analyzing, and sharing motorcycle
ride tracks (`.gpx` files). Built with React, Vite, Leaflet, and Tailwind CSS, and
deployed as a static site on GitHub Pages — no backend required.

See [`CLAUDE.md`](./CLAUDE.md) for the full original project spec, and [`TODO.md`](./TODO.md)
for the active backlog.

## Local development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # serve the production build locally
npm run lint     # run ESLint
npm run format   # format with Prettier
```

## How routes are organized

Everything the app displays comes from one file, **`public/gpx/manifest.json`**, plus the
raw `.gpx` files it points to. There's no database and no admin UI for this — you edit the
manifest and the GPX files directly, commit, and push.

Three levels of nesting: **group** → **collection** → **route** (e.g. "Past Rides" →
"Arkansas Trip" → "Arkansas Trip Day 1"). The on-disk folder structure generally mirrors
this, but the manifest's `file` path is always the source of truth, not the folder layout —
a collection's files don't strictly have to live in a folder matching its `id` (see
[`public/gpx/README.md`](./public/gpx/README.md) for the real, slightly messier current
layout, e.g. "Day Rides" routes sitting loose in a group folder with no collection subfolder
of their own, and the TAT collection split across subfolders).

```
public/gpx/
  manifest.json
  <group-slug>/
    <collection-slug>/
      <route-slug>.gpx
```

### `manifest.json` schema

```jsonc
{
  "schemaVersion": 2,
  "groups": [
    {
      "id": "past-rides", // unique group slug
      "title": "Past Rides", // shown as the top-level heading
      "collections": [
        {
          "id": "arkansas-trip", // unique, matches the folder name
          "title": "Arkansas Trip", // shown in the sidebar
          "description": "",
          "defaultColor": "#22c55e", // hex color for routes that don't override it
          "routes": [
            {
              "id": "arkansas-trip-day-1", // unique across the whole manifest
              "title": "Arkansas Trip Day 1",
              "date": "2026-08-26", // ISO YYYY-MM-DD, or null (see below)
              "collectionId": "arkansas-trip", // must match the parent collection's id
              "file": "gpx/past-rides/arkansas-trip/arkansas-trip-day-1.gpx", // relative to BASE_URL
              "color": null, // hex override, or null to use defaultColor
            },
          ],
        },
      ],
    },
  ],
}
```

**`date`** — only set this to a real date if the GPX file is an actual recorded track (lots
of sequential timestamped trackpoints). Only set to `null` if it's a planned/reference route
that hasn't been ridden, or you genuinely don't know. Don't trust a single `<time>` tag as a
ride date — some planning tools (e.g. "DMD HUB GPX Planner", Google My Maps exports) stamp
one `<time>` that's just the file's export time, not a ride date.

### Adding a new route

1. Add the `.gpx` file somewhere sensible under `public/gpx/` (typically
   `<group-slug>/<collection-slug>/<route-slug>.gpx`, but see the note above). Slugs are
   lowercase, hyphen-separated, and filesystem/URL-safe (e.g. `Colorado 1200!.gpx` →
   `colorado-1200.gpx`).
2. Add an entry for it in that collection's `routes[]` in `manifest.json` (schema above),
   with `file` matching exactly where you put it. `id` must be unique across the _entire_
   manifest, not just within its collection.
3. Run `npm run dev`, find it in the sidebar, toggle it on, and confirm it renders and
   downloads correctly before committing.

### Adding a new collection

1. Add its `.gpx` files under `public/gpx/` somewhere (a new
   `<group-slug>/<new-collection-slug>/` folder is the normal convention).
2. Add a new object to the right group's `collections[]` array in `manifest.json` (`id`,
   `title`, `description`, `defaultColor`, and its `routes[]` with correct `file` paths).
3. Collections with more than 20 routes default to collapsed in the sidebar (see
   `AUTO_COLLAPSE_THRESHOLD` in `src/components/sidebar/CollectionList.tsx`) — this is
   automatic based on route count, not something you configure per collection.

### Adding a new group

Add a new object to `manifest.json`'s top-level `groups[]` array: a unique `id`, a `title`
(shown as the heading in the sidebar and Download page), and a `collections[]` array built
the same way as above. A group with no collections in it is valid but pointless — add at
least one collection to it.

### Removing a route

Delete its entry from `manifest.json` **and** delete the `.gpx` file itself. Removing just
one without the other either leaves a dead file nobody links to, or a broken manifest entry.

### Removing a collection

Delete the whole collection object (and all its routes) from its group's `collections[]` in
`manifest.json`, then delete its `.gpx` files from disk (check each route's `file` path —
don't assume it has its own dedicated folder).

### Removing a group

Delete the whole group object (and everything nested under it — all its collections and
their routes) from `manifest.json`'s `groups[]`, then delete each of those collections'
`public/gpx/<collection-slug>/` folders. No other code changes are needed for any of the
above — the sidebar, map, and Download page are all driven entirely by `manifest.json`.

### Downloading raw files in bulk

The in-app **Download** page (☰ menu) can zip an entire collection or any cross-collection
selection on demand — you don't need to maintain any pre-made zip files yourself.

## Deployment

Pushing to `main` is the entire deploy process: `.github/workflows/deploy.yml` runs
`npm ci && npm run build` and publishes `dist/` to GitHub Pages automatically. There's no
manual build/upload step. (One-time repo setup already done: **Settings → Pages → Source:
GitHub Actions** — only relevant again if the repo is ever recreated.)

## Things worth knowing

- **Layer state doesn't persist.** Which routes are checked, their stacking order, line/
  waypoint visibility, color overrides, and the selected "active" route all live only in
  that browser tab's memory — refreshing the page resets everything to all-routes-off.
  (Tracked as a known gap, not yet implemented.)
- **Drag-and-drop local files are view-only.** A `.gpx` dropped onto the map renders
  immediately but isn't wired into the elevation chart or ride summary stats.
- **Very large tracks parse on the main thread.** Files with 100k+ points (a few of the
  real ride recordings are this big) can noticeably pause the UI while parsing; there's no
  background worker for this yet.
- **The TAT is split across 3 collections** (general sections, LA section, NY section) under
  the "Future Rides" group, totaling 227 routes — if you're adding a lot of routes at once to
  one collection, expect it to auto-collapse in the sidebar by default (see above).

## Tech stack

React + Vite + TypeScript, `react-leaflet`/Leaflet for mapping, `@we-gold/gpxjs` for GPX
parsing, Recharts for the elevation chart, Tailwind CSS v4 for styling, JSZip for bundling
downloads. See [`CLAUDE.md`](./CLAUDE.md) for the original design spec this was built from.
