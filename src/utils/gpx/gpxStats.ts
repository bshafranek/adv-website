import type { GpxTrackPoint } from '../../types/gpx';

export interface GpxStats {
  totalDistanceMeters: number;
  movingTimeSeconds: number;
  elevationGainMeters: number;
  elevationLossMeters: number;
  maxSpeedMetersPerSecond: number;
  minAltitudeMeters: number | null;
  maxAltitudeMeters: number | null;
}

// TODO: derive real stats from consecutive GpxTrackPoint pairs (haversine distance,
// elevation delta accumulation, speed from distance/time).
export function computeGpxStats(_points: GpxTrackPoint[]): GpxStats {
  return {
    totalDistanceMeters: 0,
    movingTimeSeconds: 0,
    elevationGainMeters: 0,
    elevationLossMeters: 0,
    maxSpeedMetersPerSecond: 0,
    minAltitudeMeters: null,
    maxAltitudeMeters: null,
  };
}
