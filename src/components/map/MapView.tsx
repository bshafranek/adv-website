import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet';
import type { LatLngExpression, Polyline as LeafletPolyline } from 'leaflet';
import { BASEMAPS } from '../../constants/basemaps';
import { BasemapControl } from './BasemapControl';
import { FullscreenButton } from './FullscreenButton';
import { FitBoundsControl } from './FitBoundsControl';
import { MapResizeHandler } from './MapResizeHandler';
import { MapFlyTo } from './MapFlyTo';
import { WaypointPopup } from '../waypoints/WaypointPopup';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { useGpxRoutes, type RouteRef } from '../../hooks/useGpxRoutes';

const DEFAULT_CENTER: LatLngExpression = [39.8, -98.6];
const DEFAULT_ZOOM = 4;

// TODO: per-route loading-state indicators are a separate feature; very large
// tracks (100k+ points) also parse/render on the main thread for now, which
// can be slow until parsing moves to a worker and polylines get simplified.
export function MapView({
  cursorPosition,
  flyToTarget,
}: {
  cursorPosition?: [number, number] | null;
  flyToTarget?: [number, number] | null;
}) {
  const [activeBasemapId, setActiveBasemapId] = useState(BASEMAPS[0].id);
  const activeBasemap = BASEMAPS.find((b) => b.id === activeBasemapId) ?? BASEMAPS[0];

  const { manifest } = useManifest();
  const { routeState, routeOrder } = useTripCollections();

  const routeLookup = useMemo(() => {
    const map = new Map<string, { file: string; color: string }>();
    manifest?.collections.forEach((collection) => {
      collection.routes.forEach((route) => {
        map.set(route.id, {
          file: route.file,
          color: routeState[route.id]?.color ?? route.color ?? collection.defaultColor,
        });
      });
    });
    return map;
  }, [manifest, routeState]);

  // routeOrder[0] is the top of the stack (set by ActiveLayersList's drag
  // reordering); reverse it so that route ends up rendered last, i.e. on top.
  const visibleRoutes = useMemo(() => {
    return [...routeOrder]
      .reverse()
      .map((id) => {
        const info = routeLookup.get(id);
        return info ? { id, file: info.file, color: info.color } : null;
      })
      .filter((route): route is { id: string; file: string; color: string } => route !== null);
  }, [routeOrder, routeLookup]);

  const routeRefs = useMemo<RouteRef[]>(
    () => visibleRoutes.map(({ id, file }) => ({ id, file })),
    [visibleRoutes],
  );
  const routeData = useGpxRoutes(routeRefs);

  // Memoized so the positions array passed to FitBoundsControl stays stable
  // across unrelated renders (e.g. hover-driven cursor updates).
  const polylinesByRoute = useMemo(
    () =>
      visibleRoutes.map((route) => ({
        ...route,
        positions: (routeData[route.id]?.points ?? []).map((p): LatLngExpression => [p.lat, p.lon]),
      })),
    [visibleRoutes, routeData],
  );

  const allPositions = useMemo(
    () => polylinesByRoute.flatMap((r) => r.positions),
    [polylinesByRoute],
  );

  // Leaflet doesn't reorder a layer's DOM position just because React
  // re-renders it in a different array order, so stacking has to be driven
  // explicitly: bring each polyline to front in bottom-to-top order whenever
  // the order changes or a route's data finishes loading.
  const polylineRefs = useRef(new Map<string, LeafletPolyline>());
  useEffect(() => {
    visibleRoutes.forEach((route) => {
      polylineRefs.current.get(route.id)?.bringToFront();
    });
  }, [visibleRoutes, routeData]);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mapWrapperRef}
      className="relative h-full min-h-72 w-full overflow-hidden rounded-lg border border-border"
    >
      <div className="absolute right-3 top-3 z-[1000]">
        <BasemapControl activeId={activeBasemapId} onChange={setActiveBasemapId} />
      </div>
      <div className="absolute bottom-3 right-3 z-[1000]">
        <FullscreenButton targetRef={mapWrapperRef} />
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
          .filter((r) => r.positions.length > 0 && (routeState[r.id]?.lineVisible ?? true))
          .map((r) => (
            <Polyline
              key={r.id}
              ref={(instance) => {
                if (instance) {
                  polylineRefs.current.set(r.id, instance);
                } else {
                  polylineRefs.current.delete(r.id);
                }
              }}
              positions={r.positions}
              pathOptions={{ color: r.color, weight: 3 }}
            />
          ))}
        {visibleRoutes
          .filter((route) => routeState[route.id]?.waypointsVisible ?? true)
          .flatMap((route) =>
            (routeData[route.id]?.waypoints ?? []).map((wp, i) => (
              <Marker key={`${route.id}-wp-${i}`} position={[wp.lat, wp.lon]}>
                <Popup>
                  <WaypointPopup waypoint={wp} />
                </Popup>
              </Marker>
            )),
          )}
        {cursorPosition && (
          <CircleMarker
            center={cursorPosition}
            radius={7}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#f97316', fillOpacity: 1 }}
          />
        )}
        <FitBoundsControl positions={allPositions as [number, number][]} />
        <MapFlyTo target={flyToTarget ?? null} />
        <MapResizeHandler />
      </MapContainer>
    </div>
  );
}
