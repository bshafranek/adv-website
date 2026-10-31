# Project Context
An open-source, client-side web application hosted on GitHub Pages designed to visualize, analyze, and share motorcycle ride tracks (.gpx files). The app acts as an interactive ride viewer where visitors can explore track geometry, inspect elevation and telemetry, view route waypoints, group rides by trip collections, and download raw GPX data for their own GPS units.

# Hosting & Deployment
- **Platform:** GitHub Pages (100% open-source, zero-backend, static site deployment via GitHub Actions).
- **Data Source:** Raw `.gpx` files and optional manifest files stored in `/public/gpx` or `/routes`, with fallback drag-and-drop file import support for local files.

# Tech Stack & Libraries
- **Framework:** React + Vite (configured for static GitHub Pages builds)
- **Mapping Engine:** Leaflet.js (`react-leaflet`)
- **Basemap Providers:** OpenStreetMap (Street), Esri World Imagery (Aerial/Satellite), OpenTopoMap (Topographic)
- **GPX Parsing:** `gpxparser` or `@we-gold/gpxjs`
- **Charts:** Recharts or Chart.js for elevation profile sync
- **Styling:** Tailwind CSS (dark mode optimized for GPS/outdoor aesthetic)

# Core Features & Requirements

1. **Basemap Switcher:**
   - Layer control allowing instant toggle between three core basemaps:
     * Street Map (OpenStreetMap)
     * Topographic Map (OpenTopoMap / USGS Topo)
     * Aerial/Satellite Imagery (Esri World Imagery)

2. **Trip Collections & Route Management:**
   - Group GPX tracks into organized "Trip Collections" (e.g., multi-day tours, regional loops, or terrain types).
   - Sidebar layer list with controls per route:
     * Visibility Toggle (checkbox to turn polylines on/off)
     * Color Picker (custom stroke color per route)
     * Layer Reordering (drag-and-drop list order to manage visual stacking)
   - Direct "Download Raw GPX" button on each route and collection.

3. **Waypoint & POI Popups:**
   - Parse GPX waypoints (`<wpt>`) to render custom map markers for points of interest (e.g., fuel stops, scenic overlooks, campsites, trailheads).
   - Clickable popups displaying waypoint name, elevation, coordinates, and notes (`<desc>` / `<cmt>`).

4. **Telemetry & Synchronized Elevation Graph:**
   - Interactive elevation profile (Altitude vs. Distance) for the active route.
   - Hovering over the elevation graph shows a synchronized position cursor marker on the map polyline in real time.

5. **Ride Summary & System Status:**
   - Dashboard cards displaying total distance, moving time, elevation gain/loss, max speed, and min/max altitude.
   - Dedicated App Status page listing processed GPX files, parse errors/warnings, total coordinate points, and Leaflet memory load.

# Coding & Architectural Rules
- **Base Path Safety:** Always use relative paths or configure `base: './'` in `vite.config.js` to ensure assets resolve properly on GitHub Pages custom subpaths.
- **Client-Side Isolation:** Keep all parsing, state management, and layer styling local in the browser.
- **Robust Error Handling:** Safely handle malformed, missing, or empty GPX tags without breaking map rendering.
