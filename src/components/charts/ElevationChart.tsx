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
import { metersToFeet, metersToMiles } from '../../utils/units';
import { formatNumber } from '../../utils/format';

function ElevationTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload as ElevationProfilePoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded bg-surface/80 px-2 py-1 text-xs leading-tight text-gray-100 shadow backdrop-blur-sm">
      <div>{formatNumber(metersToMiles(point.distanceMeters), 2)} mi</div>
      <div>{formatNumber(metersToFeet(point.elevationMeters))} ft</div>
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
            tickFormatter={(value: number) => `${formatNumber(metersToMiles(value), 1)} mi`}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value: number) => `${formatNumber(metersToFeet(value))} ft`}
          />
          <Tooltip content={ElevationTooltip} />
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
