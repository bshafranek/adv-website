import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background p-6 text-gray-900 dark:text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">About</h1>
      <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <p>
          Brent's Adventures is an open-source, client-side web app for visualizing, analyzing, and
          sharing motorcycle ride GPX tracks. Everything — track parsing, map rendering, route
          management — runs in the browser, with no backend server.
        </p>
        <p>
          It's where I keep track of two kinds of rides: the ones I've already taken, with real
          recorded GPS tracks, and the ones still on my bucket list — planned or reference routes
          I'd like to ride someday. Past Rides and Future Rides in the sidebar split the two apart.
        </p>
        <p>
          Built with React, Vite, Leaflet, and Tailwind CSS, and deployed as a static site on GitHub
          Pages via GitHub Actions.
        </p>
        <p>
          <a
            href="https://github.com/bshafranek/adv-website"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            View the source on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
