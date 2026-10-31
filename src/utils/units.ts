const METERS_PER_MILE = 1609.344;
const METERS_PER_FOOT = 0.3048;

export function metersToMiles(meters: number): number {
  return meters / METERS_PER_MILE;
}

export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

export function metersPerSecondToMph(metersPerSecond: number): number {
  return (metersPerSecond / METERS_PER_MILE) * 3600;
}
