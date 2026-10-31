import { parseGPX } from '@we-gold/gpxjs';
import type { GpxParseResult, GpxTrackPoint, GpxWaypoint } from '../../types/gpx';

export async function parseGpx(source: string | File): Promise<GpxParseResult> {
  let text: string;

  try {
    if (typeof source === 'string') {
      const response = await fetch(`${import.meta.env.BASE_URL}${source}`);
      if (!response.ok) {
        return {
          points: [],
          waypoints: [],
          errors: [
            { message: `Failed to fetch ${source}: ${response.status} ${response.statusText}` },
          ],
        };
      }
      text = await response.text();
    } else {
      text = await source.text();
    }
  } catch (err) {
    return {
      points: [],
      waypoints: [],
      errors: [{ message: err instanceof Error ? err.message : String(err) }],
    };
  }

  const [parsed, error] = parseGPX(text);
  if (error || !parsed) {
    return {
      points: [],
      waypoints: [],
      errors: [{ message: error?.message ?? 'Unknown GPX parse error' }],
    };
  }

  // Prefer <trk> points; fall back to <rte> points for route-only files.
  const pointSource = parsed.tracks.length > 0 ? parsed.tracks : parsed.routes;
  const points: GpxTrackPoint[] = pointSource.flatMap((t) =>
    t.points.map((p) => ({
      lat: p.latitude,
      lon: p.longitude,
      elevation: p.elevation ?? null,
      time: p.time ? p.time.toISOString() : null,
    })),
  );

  const waypoints: GpxWaypoint[] = parsed.waypoints.map((w) => ({
    lat: w.latitude,
    lon: w.longitude,
    elevation: w.elevation ?? null,
    name: w.name ?? null,
    description: w.description ?? null,
    comment: w.comment ?? null,
  }));

  return { points, waypoints, errors: [] };
}
