import type { UnitSystem } from '../types/settings';
import { formatNumber } from './format';

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

export function metersToKilometers(meters: number): number {
  return meters / 1000;
}

export function metersPerSecondToKmh(metersPerSecond: number): number {
  return metersPerSecond * 3.6;
}

/** Long-distance display (route distance): miles or kilometers. */
export function formatDistance(
  meters: number,
  unitSystem: UnitSystem,
  fractionDigits = 1,
): string {
  return unitSystem === 'metric'
    ? `${formatNumber(metersToKilometers(meters), fractionDigits)} km`
    : `${formatNumber(metersToMiles(meters), fractionDigits)} mi`;
}

/** Elevation display: feet or meters. */
export function formatElevation(meters: number, unitSystem: UnitSystem): string {
  return unitSystem === 'metric'
    ? `${formatNumber(meters)} m`
    : `${formatNumber(metersToFeet(meters))} ft`;
}

/** Speed display: mph or km/h. */
export function formatSpeed(metersPerSecond: number, unitSystem: UnitSystem): string {
  return unitSystem === 'metric'
    ? `${formatNumber(metersPerSecondToKmh(metersPerSecond))} km/h`
    : `${formatNumber(metersPerSecondToMph(metersPerSecond))} mph`;
}
