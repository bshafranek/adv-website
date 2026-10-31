import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export interface ElevationPoint {
  distanceMeters: number;
  elevationMeters: number;
}

// TODO: wire onMouseMove -> useElevationSync().setHoverIndex so MapView can
// render a synced cursor marker on the active route's polyline.
export function ElevationChart({ data }: { data: ElevationPoint[] }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="distanceMeters" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="elevationMeters" stroke="#22c55e" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
