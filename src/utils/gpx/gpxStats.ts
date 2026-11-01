import type { GpxTrackPoint } from '../../types/gpx';
import { haversineDistance } from './geo';

export interface GpxStats {
  totalDistanceMeters: number;
  movingTimeSeconds: number;
  elevationGainMeters: number;
  elevationLossMeters: number;
  maxSpeedMetersPerSecond: number;
  minAltitudeMeters: number | null;
  maxAltitudeMeters: number | null;
}

// A segment counts toward "moving time" only if its average speed is above
// this threshold — filters out stops/idling without needing GPS-noise-aware
// stop detection.
const MOVING_SPEED_THRESHOLD_MPS = 0.5;

// Consumer GPS elevation jitters by a few meters between points even on
// flat ground. Summing every raw delta treats that noise as real climbing,
// inflating gain/loss by an order of magnitude on long tracks. Only count a
// change once it's moved this far from the last registered high/low point -
// the same "hysteresis"/deadband approach Strava and Garmin use.
const ELEVATION_NOISE_THRESHOLD_METERS = 3;

export function computeGpxStats(points: GpxTrackPoint[]): GpxStats {
  let totalDistanceMeters = 0;
  let movingTimeSeconds = 0;
  let elevationGainMeters = 0;
  let elevationLossMeters = 0;
  let maxSpeedMetersPerSecond = 0;
  let minAltitudeMeters: number | null = null;
  let maxAltitudeMeters: number | null = null;
  let elevationBaseline: number | null = null;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    if (point.elevation !== null) {
      minAltitudeMeters =
        minAltitudeMeters === null ? point.elevation : Math.min(minAltitudeMeters, point.elevation);
      maxAltitudeMeters =
        maxAltitudeMeters === null ? point.elevation : Math.max(maxAltitudeMeters, point.elevation);

      if (elevationBaseline === null) {
        elevationBaseline = point.elevation;
      } else {
        const delta = point.elevation - elevationBaseline;
        if (delta >= ELEVATION_NOISE_THRESHOLD_METERS) {
          elevationGainMeters += delta;
          elevationBaseline = point.elevation;
        } else if (delta <= -ELEVATION_NOISE_THRESHOLD_METERS) {
          elevationLossMeters += -delta;
          elevationBaseline = point.elevation;
        }
      }
    }

    if (i === 0) continue;
    const prev = points[i - 1];
    const segmentDistanceMeters = haversineDistance(prev.lat, prev.lon, point.lat, point.lon);
    totalDistanceMeters += segmentDistanceMeters;

    if (prev.time && point.time) {
      const seconds = (new Date(point.time).getTime() - new Date(prev.time).getTime()) / 1000;
      if (seconds > 0) {
        const speed = segmentDistanceMeters / seconds;
        if (speed > maxSpeedMetersPerSecond) maxSpeedMetersPerSecond = speed;
        if (speed > MOVING_SPEED_THRESHOLD_MPS) movingTimeSeconds += seconds;
      }
    }
  }

  return {
    totalDistanceMeters,
    movingTimeSeconds,
    elevationGainMeters,
    elevationLossMeters,
    maxSpeedMetersPerSecond,
    minAltitudeMeters,
    maxAltitudeMeters,
  };
}
