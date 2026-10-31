# adv-website

An open-source, client-side web app for visualizing, analyzing, and sharing motorcycle
ride tracks (`.gpx` files). Built with React, Vite, Leaflet, and Tailwind CSS, and
deployed as a static site on GitHub Pages — no backend required.

See [`CLAUDE.md`](./CLAUDE.md) for the full project spec.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # run ESLint
npm run format   # format with Prettier
```

## GPX data

Raw ride data currently lives in `gpx-rides/` (completed rides) and `future-gpx-rides/`
(planned rides). The app itself reads routes from `public/gpx/` via a `manifest.json`
(see [`public/gpx/README.md`](./public/gpx/README.md)) — moving/organizing the existing
ride collection into that structure is a follow-up task.
