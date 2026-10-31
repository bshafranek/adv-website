import type { GpxParseResult } from '../../types/gpx';

// TODO: wrap @we-gold/gpxjs here, mapping its parsed tracks/waypoints and any
// parse errors into GpxParseResult so malformed GPX never throws past this boundary.
export async function parseGpx(_file: string | File): Promise<GpxParseResult> {
  return { points: [], waypoints: [], errors: [] };
}
