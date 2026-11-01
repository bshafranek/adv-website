import { Link } from 'react-router-dom';
import { CameraIcon, LineIcon, PinIcon } from '../components/icons/LayerIcons';

export function HowToUsePage() {
  return (
    <div className="min-h-screen bg-background p-6 text-gray-900 dark:text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">How to Use</h1>
      <div className="mt-4 space-y-5 text-sm text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Showing routes</h2>
          <p>
            Check a route's box in the sidebar to add it to the map and the Active Layers list.
            Click a route's title (in the sidebar or in Active Layers) to select it as the active
            route for the elevation chart and ride summary stats — it also highlights on the map in
            a distinct color so it's easy to pick out from the rest. Click its title again to
            deselect it; its line goes back to its normal color, and it stays visible on the map.
            Each collection also has its own checkbox next to its name that shows or hides every
            route in that collection at once.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Active Layers</h2>
          <p>
            Drag a row by its ⠿ handle to reorder which route draws on top where routes overlap.
            "Clear all" next to the Active Layers heading hides every active route at once.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1">
            Each row has icons for showing/hiding that route's line, waypoints, and photos
            independently of each other: a
            <span className="inline-flex text-accent">
              <LineIcon />
            </span>
            line icon toggles the route's path on the map, a
            <span className="inline-flex text-accent">
              <PinIcon />
            </span>
            pin icon toggles its waypoint markers, and a
            <span className="inline-flex text-accent">
              <CameraIcon />
            </span>
            camera icon toggles its GPS-tagged photos (only enabled for routes that have any). Each
            defaults to on; click one to turn it off — it turns gray (
            <span className="inline-flex text-gray-500">
              <LineIcon />
            </span>
            ) when off, and clicking it again turns it back on. This doesn't remove the route from
            Active Layers, just what's drawn on the map for it.
          </p>
          <p className="mt-2">
            Photo pins show a small count badge when more than one photo was taken at that spot —
            click the pin to see the first one, with prev/next buttons to step through the rest.
          </p>
          <p className="mt-2">
            The color swatch opens your browser's color picker to recolor the route's line, and the
            ✕ removes it from Active Layers entirely (unchecking it in the list below).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Elevation chart</h2>
          <p>
            Hover over the chart to move a cursor marker along the route on the map in real time.
            Click a point on the chart to fly the map to that spot.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Map controls</h2>
          <p>
            The basemap button top-right of the map opens a dropdown to switch between Street,
            Aerial, Topographic, and Light Gray basemaps. The small button under the zoom controls
            (top-left) fits the view to whatever routes are currently visible. The button
            bottom-right toggles full screen.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Viewing a local GPX file</h2>
          <p>
            Drag a .gpx file from your computer and drop it onto the map to view it immediately — it
            doesn't need to be part of this site's collection. It shows up as a dashed line (and a
            "Local Files" entry in the sidebar with a ✕ to remove it) so it's easy to tell apart
            from the site's own routes.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Downloading GPX files</h2>
          <p>
            Open <strong>Download</strong> from the ☰ menu to grab raw .gpx files. Check routes from
            anywhere on the page — any mix of groups and collections — to bundle a custom selection
            into one .zip, use a group's or collection's own "Download All" for everything in it at
            once, or click "Download" next to a single route for just its raw .gpx file.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <p>
            Open <strong>Settings</strong> from the ☰ menu to set units (imperial or metric), which
            basemap the map opens with, the active-route highlight color, dark or light theme, and
            whether the sidebar, Ride Summary, and Elevation Profile start open or collapsed.
            These are saved in this browser, so they'll still be set next time you load the site
            here — but they won't follow you to a different browser or device.
          </p>
        </section>
      </div>
    </div>
  );
}
