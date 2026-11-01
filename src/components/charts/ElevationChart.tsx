import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  type MouseHandlerDataParam,
  type TooltipContentProps,
} from 'recharts';
import type { ElevationProfilePoint } from '../../utils/gpx/elevationProfile';
import { formatDistance, formatElevation } from '../../utils/units';
import { useSettings } from '../../hooks/useSettings';
import type { UnitSystem } from '../../types/settings';

function ElevationTooltip({
  active,
  payload,
  unitSystem,
}: TooltipContentProps & { unitSystem: UnitSystem }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload as ElevationProfilePoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded bg-surface/80 px-2 py-1 text-xs leading-tight text-gray-900 shadow backdrop-blur-sm dark:text-gray-100">
      <div>{formatDistance(point.distanceMeters, unitSystem, 2)}</div>
      <div>{formatElevation(point.elevationMeters, unitSystem)}</div>
    </div>
  );
}

function resolvePoint(
  state: MouseHandlerDataParam,
  data: ElevationProfilePoint[],
): ElevationProfilePoint | null {
  // activeTooltipIndex is typed number | string | null — Recharts' internal
  // tooltip state actually stores it as a string, so Number(...) it rather
  // than relying on typeof === 'number'. Number(null) is 0, not NaN, so
  // null/undefined must be excluded explicitly before converting.
  const raw = state.activeTooltipIndex;
  const index = raw === null || raw === undefined ? NaN : Number(raw);
  return Number.isFinite(index) ? (data[index] ?? null) : null;
}

export function ElevationChart({
  data,
  onHover,
  onClickPoint,
}: {
  data: ElevationProfilePoint[];
  onHover?: (point: ElevationProfilePoint | null) => void;
  onClickPoint?: (point: ElevationProfilePoint) => void;
}) {
  const {
    settings: { unitSystem },
  } = useSettings();

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onMouseMove={(state) => onHover?.(resolvePoint(state, data))}
          onMouseLeave={() => onHover?.(null)}
          onClick={(state) => {
            const point = resolvePoint(state, data);
            if (point) onClickPoint?.(point);
          }}
        >
          <XAxis
            dataKey="distanceMeters"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value: number) => formatDistance(value, unitSystem, 1)}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value: number) => formatElevation(value, unitSystem)}
          />
          <Tooltip content={(props) => <ElevationTooltip {...props} unitSystem={unitSystem} />} />
          <Line
            type="monotone"
            dataKey="elevationMeters"
            stroke="#22c55e"
            dot={false}
            isAnimationActive={false}
            className="cursor-pointer"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
