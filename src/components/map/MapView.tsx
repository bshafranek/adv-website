import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { BASEMAPS } from '../../constants/basemaps';
import { BasemapControl } from './BasemapControl';
import { AutoFitBounds } from './AutoFitBounds';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { useGpxRoutes, type RouteRef } from '../../hooks/useGpxRoutes';

const DEFAULT_CENTER: LatLngExpression = [39.8, -98.6];
const DEFAULT_ZOOM = 4;

// TODO: waypoint markers/popups and per-route loading-state indicators are a
// separate feature; very large tracks (100k+ points) also parse/render on the
// main thread for now, which can be slow until parsing moves to a worker and
// polylines get simplified.
export function MapView() {
  const [activeBasemapId, setActiveBasemapId] = useState(BASEMAPS[0].id);
  const activeBasemap = BASEMAPS.find((b) => b.id === activeBasemapId) ?? BASEMAPS[0];

  const { manifest } = useManifest();
  const { routeState } = useTripCollections();

  const visibleRoutes = useMemo(() => {
    if (!manifest) return [];
    return manifest.collections.flatMap((collection) =>
      collection.routes
        .filter((route) => routeState[route.id]?.visible)
        .map((route) => ({
          id: route.id,
          file: route.file,
          color: routeState[route.id]?.color ?? route.color ?? collection.defaultColor,
        })),
    );
  }, [manifest, routeState]);

  const routeRefs = useMemo<RouteRef[]>(
    () => visibleRoutes.map(({ id, file }) => ({ id, file })),
    [visibleRoutes],
  );
  const routeData = useGpxRoutes(routeRefs);

  const polylinesByRoute = visibleRoutes.map((route) => ({
    ...route,
    positions: (routeData[route.id]?.points ?? []).map((p): LatLngExpression => [p.lat, p.lon]),
  }));

  const allPositions = polylinesByRoute.flatMap((r) => r.positions);

  return (
    <div className="relative h-[32rem] w-full overflow-hidden rounded-lg border border-border">
      <div className="absolute right-3 top-3 z-[1000]">
        <BasemapControl activeId={activeBasemapId} onChange={setActiveBasemapId} />
      </div>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          key={activeBasemap.id}
          url={activeBasemap.url}
          attribution={activeBasemap.attribution}
          maxZoom={activeBasemap.maxZoom}
        />
        {polylinesByRoute
          .filter((r) => r.positions.length > 0)
          .map((r) => (
            <Polyline
              key={r.id}
              positions={r.positions}
              pathOptions={{ color: r.color, weight: 3 }}
            />
          ))}
        <AutoFitBounds positions={allPositions as [number, number][]} />
      </MapContainer>
    </div>
  );
}
