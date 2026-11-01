---
name: trip-writeup
description: Write a narrative summary of a completed ride or multi-day trip from its GPX file(s) — dates, distance/elevation stats, and the towns/roads/landmarks along the route — and save it as a readme.md next to the GPX files. Use when the user asks for a write-up, summary, or recap of a past ride/trip in this repo.
---

# Trip write-up

Produces a markdown summary of one or more completed rides, derived from their
`.gpx` file(s), and saves it to a `readme.md` alongside those files under
`public/gpx/`. Built from the process used for the Wichita Mountains and
Arkansas trip write-ups — follow it the same way for new ones.

## User-specific facts (always apply these)

- The rider lives in **Edmond, OK**. Call the home base "Edmond", not "OKC" or
  "Oklahoma City", even though Edmond is in the OKC metro.
- **Don't compare trips to each other** in the narrative (no "the biggest
  climbing day of either trip" type lines). Each write-up stands alone.
- Timestamps in the GPX files are UTC. Convert to local Central time (UTC-5
  CDT / UTC-6 CST — check the date against US DST rules, which run early
  March to early November) before presenting times to the user.

## Process

1. **Find the GPX file(s).** Look up the route(s) in `public/gpx/manifest.json`
   for the exact `file` path and the `date` field (trust the manifest's `date`
   over a raw GPX `<time>` tag — see `public/gpx/README.md` for why: some
   planning tools stamp a single export timestamp that isn't a real ride
   date). Only proceed with a narrative write-up for routes with a real
   recorded date; a `date: null` planned/reference route doesn't have a story
   to tell yet.

2. **Pull stats per ride/day**, computed the same way the app does it (see
   `src/utils/gpx/gpxStats.ts`):
   - Distance: sum of haversine distance between consecutive trackpoints.
   - Moving time: only count segments where speed > 0.5 m/s (filters out
     stops), from the gap between consecutive `<time>` tags.
   - Elevation gain/loss: use a noise threshold, not a raw point-to-point
     sum — only count a climb/descent once it's moved at least 3 meters from
     the last reversal point. A raw sum way overcounts GPS jitter (see the
     "elevation gain doesn't make sense" conversation in this project's
     history if you need the full reasoning/example).
   - Min/max altitude, first/last timestamp.
   - A reasonable one-off Node script reading the file directly (regex for
     `<trkpt lat="..." lon="...">...<ele>...</ele>...<time>...</time>`) is
     fine for this — no need to run it through the actual app.

3. **Trace the geography.** Check for embedded `<wpt>` waypoints first (rare
   in practice for these personal ride recordings, but check). Absent those,
   sample lat/lon across the **entire** track — not just the start — and
   match coordinates against known real-world towns, highways, parks, and
   landmarks using general geographic knowledge. Sample densely enough to
   catch loops/out-and-backs and off-road trail riding (repeated direction
   reversals in a small area = trail riding, not a highway detour) rather
   than just the overall start/end points — a prior write-up got a route
   badly wrong (assumed a Texas crossing that never happened) by only
   checking a coarse sample.

4. **Draft the write-up** and show it to the user before finalizing:
   - One `##` heading per day/ride: title, date, and a bold stats line
     (distance, moving time, and local start/end time if useful).
   - A narrative paragraph describing the route through named towns/roads,
     bolding specific notable landmarks.
   - For any stop the user specifically mentions (a town they toured, a cafe
     they ate at, a park they visited), add a short researched blockquote
     with real background on that place — what it is, why it's notable/
     historic. Don't invent details; use well-established facts only.
   - Expect corrections on the first pass — hometown framing, which town a
     day actually started/ended in, roads actually ridden (vs. your best
     guess from coordinates alone), specific stops to call out. Fold them in
     and re-confirm rather than assuming the first draft is final.

5. **Save it.** Write (or overwrite, if filling in an existing empty one) a
   `readme.md` in the same folder as the GPX file(s):
   - A multi-day trip living in its own subfolder (e.g.
     `public/gpx/past-rides/arkansas-trip/`) gets its own `readme.md` there,
     one `##` section per day.
   - Standalone day rides with no subfolder of their own (loose files
     directly under a group, e.g. `public/gpx/past-rides/`) share one
     `readme.md` at that group root, one `##` section per ride.

6. **Commit.** `git status` to confirm only the intended `readme.md` file(s)
   changed, then commit with a plain descriptive message (e.g. "Write trip
   summary for <trip name>"), matching this repo's existing commit style —
   see `git log` for tone/format if unsure.
