# GPX Data Layout

Raw ride tracks live here, grouped by trip collection:

```
public/gpx/
  manifest.json
  <collection-slug>/
    <route-slug>.gpx
```

## manifest.json

`manifest.json` lists every collection and route the app should load. Schema:

- `collections[]`
  - `id` — unique collection slug, matches the folder name under `public/gpx/`
  - `title`, `description` — shown in the sidebar
  - `defaultColor` — hex color used for routes in this collection that don't set their own `color`
  - `routes[]`
    - `id` — unique route slug
    - `title`, `date` (ISO `YYYY-MM-DD`)
    - `collectionId` — must match the parent collection's `id`
    - `file` — path to the `.gpx` file, **relative to the site's base URL**, e.g. `gpx/<collection-slug>/<route-slug>.gpx`
    - `color` — hex override, or `null` to fall back to `defaultColor`

To add a real ride:

1. Drop the `.gpx` file into `public/gpx/<collection-slug>/<route-slug>.gpx`.
2. Add (or update) the corresponding entry in `manifest.json`.
3. Delete the `example-collection` entry once you have real data.

Code that loads `manifest.json` or a route's `file` path must prefix it with
`import.meta.env.BASE_URL` (see `src/utils/manifest/loadManifest.ts`) so links keep
working when the site is served from a GitHub Pages project subpath.

Drag-and-drop local file import (planned) bypasses this manifest entirely — it loads
a `.gpx` file directly from the user's machine without touching `public/gpx/`.
