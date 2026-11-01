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

## Active Layers list staying visible while scrolling — reverted

Tried making its wrapper in `ViewerPage` `sticky top-0` within the sidebar's
scroll container. Broke down once Active Layers held 100+ rows (e.g. all TAT
routes toggled on): the sticky box grew to the full row-list height and
stayed pinned, pushing the collections list below it out of reach, and a
follow-up fix (capping it with its own `overflow-y-auto`) just traded that
for two visible scrollbars in the sidebar. Reverted to plain flow — Active
Layers, Local Files, and the collections list all share one scrollbar on
`<aside>` now. Worth it for routes with 100+ active layers, less so for a
handful — revisit only with a design that doesn't reintroduce either problem.

## ~~Hide Ride Summary cards when no route is selected~~ — done

`ViewerPage` now shows the same placeholder pattern as Elevation Profile:
"Select a route in the sidebar to see its ride summary" when
`activeRoute` is null, instead of always rendering zeroed-out stats.

## Maybe rename the app

"Brent's Adventures" feels off since the app mixes rides already done with
rides only planned ("Past, Present and Future" as a subtitle didn't land
either). Candidates to revisit, undecided:

- **Waypoints** — short, on-theme, doesn't imply past or future
- **Brent's Route Book** — real rally/ADV term for a collection of routes
- **Brent's Ride Atlas** — leans into the map/collection angle
