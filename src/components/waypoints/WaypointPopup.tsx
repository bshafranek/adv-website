import type { GpxWaypoint } from '../../types/gpx';

export function WaypointPopup({ waypoint }: { waypoint: GpxWaypoint }) {
  return (
    <div className="max-w-xs text-sm">
      <h4 className="font-semibold text-gray-900">{waypoint.name ?? 'Waypoint'}</h4>
      <p className="text-gray-600">
        {waypoint.lat.toFixed(5)}, {waypoint.lon.toFixed(5)}
        {waypoint.elevation !== null && ` · ${waypoint.elevation.toFixed(0)} m`}
      </p>
      {waypoint.description && <p className="mt-1 text-gray-700">{waypoint.description}</p>}
      {waypoint.comment && <p className="mt-1 italic text-gray-500">{waypoint.comment}</p>}
    </div>
  );
}
