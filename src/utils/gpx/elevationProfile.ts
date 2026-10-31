import type { GpxTrackPoint } from '../../types/gpx';
import { haversineDistance } from './geo';

export interface ElevationProfilePoint {
  distanceMeters: number;
  elevationMeters: number;
  lat: number;
  lon: number;
}

const MAX_PROFILE_SAMPLES = 500;

// Downsamples to a chart-friendly point count while keeping cumulative
// distance accurate (computed from every point, not just the sampled ones).
export function buildElevationProfile(points: GpxTrackPoint[]): ElevationProfilePoint[] {
  if (points.length === 0) return [];

  const stride = Math.max(1, Math.ceil(points.length / MAX_PROFILE_SAMPLES));
  const profile: ElevationProfilePoint[] = [];
  let cumulativeDistanceMeters = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (i > 0) {
      const prev = points[i - 1];
      cumulativeDistanceMeters += haversineDistance(prev.lat, prev.lon, point.lat, point.lon);
    }

    if (i % stride === 0 || i === points.length - 1) {
      profile.push({
        distanceMeters: cumulativeDistanceMeters,
        elevationMeters: point.elevation ?? 0,
        lat: point.lat,
        lon: point.lon,
      });
    }
  }

  return profile;
}
