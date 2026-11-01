import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet';
import type { LatLngExpression, Polyline as LeafletPolyline } from 'leaflet';
import { BASEMAPS } from '../../constants/basemaps';
import { ACTIVE_ROUTE_HIGHLIGHT_COLOR } from '../../constants/colors';
import { BasemapControl } from './BasemapControl';
import { FullscreenButton } from './FullscreenButton';
import { FitBoundsControl } from './FitBoundsControl';
import { MapResizeHandler } from './MapResizeHandler';
import { MapFlyTo } from './MapFlyTo';
import { WaypointPopup } from '../waypoints/WaypointPopup';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { useGpxRoutes, type RouteRef } from '../../hooks/useGpxRoutes';
import type { LocalRoute } from '../../types/localRoute';

const DEFAULT_CENTER: LatLngExpression = [39.8, -98.6];
const DEFAULT_ZOOM = 4;

// TODO: per-route loading-state indicators are a separate feature; very large
// tracks (100k+ points) also parse/render on the main thread for now, which
// can be slow until parsing moves to a worker and polylines get simplified.
export function MapView({
  cursorPosition,
  flyToTarget,
  localRoutes,
  onFilesDropped,
}: {
  cursorPosition?: [number, number] | null;
  flyToTarget?: [number, number] | null;
  localRoutes: LocalRoute[];
  onFilesDropped: (files: File[]) => void;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeBasemapId, setActiveBasemapId] = useState(BASEMAPS[0].id);
  const activeBasemap = BASEMAPS.find((b) => b.id === activeBasemapId) ?? BASEMAPS[0];

  const { manifest } = useManifest();
  const { routeState, routeOrder, activeRouteId } = useTripCollections();

  const routeLookup = useMemo(() => {
    const map = new Map<string, { file: string; color: string }>();
    manifest?.groups.forEach((group) => {
      group.routes?.forEach((route) => {
        map.set(route.id, {
          file: route.file,
          color: routeState[route.id]?.color ?? route.color ?? group.defaultColor ?? '#3b82f6',
        });
      });
      group.collections.forEach((collection) => {
        collection.routes.forEach((route) => {
          map.set(route.id, {
            file: route.file,
            color: routeState[route.id]?.color ?? route.color ?? collection.defaultColor,
          });
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
        color: route.id === activeRouteId ? ACTIVE_ROUTE_HIGHLIGHT_COLOR : route.color,
        positions: (routeData[route.id]?.points ?? []).map((p): LatLngExpression => [p.lat, p.lon]),
      })),
    [visibleRoutes, routeData, activeRouteId],
  );

  const localPositions = useMemo(
    () =>
      localRoutes.flatMap((route): LatLngExpression[] =>
        route.data.points.map((p) => [p.lat, p.lon]),
      ),
    [localRoutes],
  );

  const allPositions = useMemo(
    () => [...polylinesByRoute.flatMap((r) => r.positions), ...localPositions],
    [polylinesByRoute, localPositions],
  );

  // Leaflet doesn't reorder a layer's DOM position just because React
  // re-renders it in a different array order, so stacking has to be driven
  // explicitly: bring each polyline to front in bottom-to-top order whenever
  // the order changes or a route's data finishes loading. A layer can also
  // get re-attached to the map outside of that (e.g. React StrictMode's
  // deliberate double-invoke of effects in dev re-runs react-leaflet's own
  // mount effect, re-appending that layer's DOM node after ours already ran
  // and silently undoing the fix), so also resync whenever any polyline ref
  // actually attaches, not just when our own dependencies change.
  const polylineRefs = useRef(new Map<string, LeafletPolyline>());

  const resyncStackOrder = useCallback(() => {
    visibleRoutes.forEach((route) => {
      polylineRefs.current.get(route.id)?.bringToFront();
    });
  }, [visibleRoutes]);

  useEffect(() => {
    resyncStackOrder();
  }, [resyncStackOrder, routeData]);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.name.toLowerCase().endsWith('.gpx'),
    );
    if (files.length > 0) onFilesDropped(files);
  }

  return (
    <div
      ref={mapWrapperRef}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className="relative h-full min-h-72 w-full overflow-hidden rounded-lg border border-border"
    >
      {isDraggingOver && (
        <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center border-4 border-dashed border-accent bg-black/40">
          <p className="rounded-md bg-surface px-4 py-2 text-sm font-medium text-gray-100">
            Drop .gpx file to view it
          </p>
        </div>
      )}
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
                  // react-leaflet attaches the underlying layer to the map in
                  // its own effect, which runs after this ref callback - call
                  // bringToFront() here and it's a silent no-op since the
                  // layer isn't on the map yet. Defer past that.
                  setTimeout(resyncStackOrder, 0);
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
        {localRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.data.points.map((p): LatLngExpression => [p.lat, p.lon])}
            pathOptions={{ color: route.color, weight: 3, dashArray: '6 4' }}
          />
        ))}
        {localRoutes.flatMap((route) =>
          route.data.waypoints.map((wp, i) => (
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
