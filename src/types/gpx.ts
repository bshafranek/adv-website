export interface GpxTrackPoint {
  lat: number;
  lon: number;
  elevation: number | null;
  time: string | null;
}

export interface GpxWaypoint {
  lat: number;
  lon: number;
  elevation: number | null;
  name: string | null;
  description: string | null;
  comment: string | null;
}

export interface GpxParseError {
  message: string;
}

export interface GpxParseResult {
  points: GpxTrackPoint[];
  waypoints: GpxWaypoint[];
  errors: GpxParseError[];
}
