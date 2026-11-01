import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { BASEMAPS } from '../constants/basemaps';
import { Card } from '../components/common/Card';
import type { Theme, UnitSystem } from '../types/settings';

function RadioOption<T extends string>({
  name,
  value,
  current,
  label,
  onChange,
}: {
  name: string;
  value: T;
  current: T;
  label: string;
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
      <input
        type="radio"
        name={name}
        checked={current === value}
        onChange={() => onChange(value)}
        className="accent-accent"
      />
      {label}
    </label>
  );
}

export function SettingsPage() {
  const {
    settings,
    setUnitSystem,
    setDefaultBasemapId,
    setActiveRouteHighlightColor,
    setTheme,
    resetSettings,
  } = useSettings();

  return (
    <div className="min-h-screen bg-background p-6 text-gray-900 dark:text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Saved in this browser — they'll still be set next time you load the site here, but won't
        follow you to a different browser or device.
      </p>

      <div className="mt-6 grid max-w-xl gap-4">
        <Card title="Units">
          <div className="flex gap-6">
            <RadioOption
              name="unitSystem"
              value="imperial"
              current={settings.unitSystem}
              label="Imperial (mi, ft, mph)"
              onChange={(value: UnitSystem) => setUnitSystem(value)}
            />
            <RadioOption
              name="unitSystem"
              value="metric"
              current={settings.unitSystem}
              label="Metric (km, m, km/h)"
              onChange={(value: UnitSystem) => setUnitSystem(value)}
            />
          </div>
        </Card>

        <Card title="Default basemap">
          <select
            value={settings.defaultBasemapId}
            onChange={(e) => setDefaultBasemapId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
          >
            {BASEMAPS.map((basemap) => (
              <option key={basemap.id} value={basemap.id}>
                {basemap.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Which basemap the map opens with. You can still switch basemaps per-visit from the map's
            own basemap dropdown.
          </p>
        </Card>

        <Card title="Active route highlight color">
          <div className="flex items-center gap-3">
            <label
              title="Change highlight color"
              className="relative inline-block h-6 w-6 shrink-0 cursor-pointer rounded-full border border-border"
              style={{ backgroundColor: settings.activeRouteHighlightColor }}
            >
              <input
                type="color"
                value={settings.activeRouteHighlightColor}
                onChange={(e) => setActiveRouteHighlightColor(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {settings.activeRouteHighlightColor}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The color a route's line changes to on the map while it's selected as the active route.
          </p>
        </Card>

        <Card title="Theme">
          <div className="flex gap-6">
            <RadioOption
              name="theme"
              value="dark"
              current={settings.theme}
              label="Dark"
              onChange={(value: Theme) => setTheme(value)}
            />
            <RadioOption
              name="theme"
              value="light"
              current={settings.theme}
              label="Light"
              onChange={(value: Theme) => setTheme(value)}
            />
          </div>
        </Card>

        <button
          type="button"
          onClick={resetSettings}
          className="mt-2 w-fit rounded-md bg-surface-raised px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-accent hover:text-black dark:text-gray-300"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
