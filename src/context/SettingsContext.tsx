import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SettingsContext, type SettingsContextValue } from './settingsStore';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, type Settings } from '../types/settings';
import { loadPersistedState, savePersistedState } from '../utils/persistence/localStorageState';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() =>
    loadPersistedState(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS),
  );

  useEffect(() => {
    savePersistedState(SETTINGS_STORAGE_KEY, settings);
  }, [settings]);

  // The `dark` class drives every dark: utility class in the app (see
  // src/index.css); toggle it here so switching the theme setting takes
  // effect immediately everywhere.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setUnitSystem: (unitSystem) => setSettings((prev) => ({ ...prev, unitSystem })),
      setDefaultBasemapId: (basemapId) =>
        setSettings((prev) => ({ ...prev, defaultBasemapId: basemapId })),
      setActiveRouteHighlightColor: (color) =>
        setSettings((prev) => ({ ...prev, activeRouteHighlightColor: color })),
      setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
      setRideSummaryDefaultOpen: (open) =>
        setSettings((prev) => ({ ...prev, rideSummaryDefaultOpen: open })),
      setElevationProfileDefaultOpen: (open) =>
        setSettings((prev) => ({ ...prev, elevationProfileDefaultOpen: open })),
      setSidebarOpenByDefault: (open) =>
        setSettings((prev) => ({ ...prev, sidebarOpenByDefault: open })),
      resetSettings: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
