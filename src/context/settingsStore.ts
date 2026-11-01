import { createContext } from 'react';
import type { Settings } from '../types/settings';

export interface SettingsContextValue {
  settings: Settings;
  setUnitSystem: (unitSystem: Settings['unitSystem']) => void;
  setDefaultBasemapId: (basemapId: string) => void;
  setActiveRouteHighlightColor: (color: string) => void;
  setTheme: (theme: Settings['theme']) => void;
  setRideSummaryDefaultOpen: (open: boolean) => void;
  setElevationProfileDefaultOpen: (open: boolean) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
