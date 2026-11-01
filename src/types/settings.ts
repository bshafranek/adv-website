import { ACTIVE_ROUTE_HIGHLIGHT_COLOR } from '../constants/colors';

export type UnitSystem = 'imperial' | 'metric';
export type Theme = 'dark' | 'light';

export interface Settings {
  schemaVersion: number;
  unitSystem: UnitSystem;
  /** Matches a BasemapDefinition.id in src/constants/basemaps.ts */
  defaultBasemapId: string;
  activeRouteHighlightColor: string;
  theme: Theme;
}

export const SETTINGS_STORAGE_KEY = 'adv-website:settings';

export const DEFAULT_SETTINGS: Settings = {
  schemaVersion: 1,
  unitSystem: 'imperial',
  defaultBasemapId: 'street',
  activeRouteHighlightColor: ACTIVE_ROUTE_HIGHLIGHT_COLOR,
  theme: 'dark',
};
