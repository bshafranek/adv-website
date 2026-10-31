# To Do

## ~~Navigation: hamburger menu + new pages~~ — done

`AppHeader` now has a hamburger (☰) button opening a dropdown with App
Status, How to Use, and About — closes on link click or click-outside.
Added `/about` (`AboutPage`) and `/how-to-use` (`HowToUsePage`) routes.

Still-open ideas for more pages later:

- **Changelog / What's New** — this app has grown a lot through iteration;
  could be nice to show progress for an open-source project
- **Settings** — unit system (imperial/metric), default basemap, maybe
  theme — only worth it once there's more than one or two preferences
- Probably _not_ needed: a separate "browse all routes" catalog page, since
  the sidebar + collections already cover that

## ~~Independent waypoint/route visibility~~ — done

Implemented per-route: a small 📍 toggle controls
`routeState[routeId].waypointsVisible` independently of `visible`, defaulting
to `true`. `MapView` filters waypoint markers on this flag separately from
the polyline rendering. Lives **only in `ActiveLayersList`**, not in the
sidebar's `RouteListItem` browse list (removed from there per feedback).

## Active Layers list should stay visible while scrolling

When the route browse list (below Active Layers in the sidebar) gets long
and scrolls, Active Layers should stay pinned/visible at the top instead of
scrolling out of view — likely `position: sticky` on its wrapper within the
sidebar's scroll container.
