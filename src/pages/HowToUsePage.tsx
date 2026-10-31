import { Link } from 'react-router-dom';
import { LineIcon, PinIcon } from '../components/icons/LayerIcons';

export function HowToUsePage() {
  return (
    <div className="min-h-screen bg-background p-6 text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">How to Use</h1>
      <div className="mt-4 space-y-5 text-sm text-gray-300">
        <section>
          <h2 className="font-semibold text-gray-100">Showing routes</h2>
          <p>
            Check a route's box in the sidebar to add it to the map and the Active Layers list.
            Click a route's title to select it as the active route for the elevation chart and ride
            summary stats.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-100">Active Layers</h2>
          <p>
            Drag a row by its ⠿ handle to reorder which route draws on top where routes overlap.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1">
            Each row has two icons for showing/hiding that route's line and waypoints independently
            of each other: a
            <span className="inline-flex text-accent">
              <LineIcon />
            </span>
            line icon toggles the route's path on the map, and a
            <span className="inline-flex text-accent">
              <PinIcon />
            </span>
            pin icon toggles its waypoint markers. Both default to on; click either to turn it off —
            it turns gray (
            <span className="inline-flex text-gray-500">
              <LineIcon />
            </span>
            ) when off, and clicking it again turns it back on. This doesn't remove the route from
            Active Layers, just what's drawn on the map for it.
          </p>
          <p className="mt-2">
            The color swatch opens your browser's color picker to recolor the route's line, and the
            ✕ removes it from Active Layers entirely (unchecking it in the list below).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-100">Elevation chart</h2>
          <p>
            Hover over the chart to move a cursor marker along the route on the map in real time.
            Click a point on the chart to fly the map to that spot.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-100">Map controls</h2>
          <p>
            Switch between Street, Topographic, and Aerial basemaps top-right of the map. The small
            button under the zoom controls (top-left) fits the view to whatever routes are currently
            visible.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-gray-100">Downloading GPX files</h2>
          <p>
            Click the GPX button next to any route in the sidebar to download its raw .gpx file.
          </p>
        </section>
      </div>
    </div>
  );
}
