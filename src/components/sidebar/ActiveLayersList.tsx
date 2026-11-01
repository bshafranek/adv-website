import { useMemo, useState } from 'react';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { useGpxStatus } from '../../hooks/useGpxStatus';
import { resolveRouteColor } from '../../utils/routeColor';
import { CameraIcon, LineIcon, PinIcon } from '../icons/LayerIcons';

// routeOrder[0] is the top of the visual stack (rendered last/on top by
// MapView). Dragging a row here reorders both the list and the map stacking.
export function ActiveLayersList() {
  const { manifest } = useManifest();
  const {
    routeState,
    routeOrder,
    activeRouteId,
    reorderRoutes,
    setRouteVisible,
    setRoutesVisible,
    setWaypointsVisible,
    setLineVisible,
    setPhotosVisible,
    setActiveRoute,
  } = useTripCollections();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { processedFiles } = useGpxStatus();

  const routeLookup = useMemo(() => {
    const map = new Map<string, { title: string; color: string; file: string; hasPhotos: boolean }>();
    manifest?.groups.forEach((group) => {
      group.routes?.forEach((route) => {
        map.set(route.id, {
          title: route.title,
          color: resolveRouteColor(route.id, route, routeState, group.defaultColor ?? '#3b82f6'),
          file: route.file,
          hasPhotos: (route.photos?.length ?? 0) > 0,
        });
      });
      group.collections.forEach((collection) => {
        collection.routes.forEach((route) => {
          map.set(route.id, {
            title: route.title,
            color: resolveRouteColor(route.id, route, routeState, collection.defaultColor),
            file: route.file,
            hasPhotos: (route.photos?.length ?? 0) > 0,
          });
        });
      });
    });
    return map;
  }, [manifest, routeState]);

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const next = routeOrder.filter((id) => id !== draggedId);
    const targetIndex = next.indexOf(targetId);
    next.splice(targetIndex, 0, draggedId);
    reorderRoutes(next);
    setDraggedId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Active Layers {routeOrder.length > 0 && `(${routeOrder.length})`}
        </h2>
        {routeOrder.length > 0 && (
          <button
            type="button"
            onClick={() => setRoutesVisible(routeOrder, false)}
            className="text-xs text-gray-500 hover:text-red-400"
          >
            Clear all
          </button>
        )}
      </div>
      {routeOrder.length === 0 ? (
        <p className="px-3 pb-2 text-xs text-gray-400 dark:text-gray-600">
          Check a route below to add it here, drag to reorder stacking.
        </p>
      ) : (
        routeOrder.map((id) => {
          const info = routeLookup.get(id);
          if (!info) return null;
          const lineVisible = routeState[id]?.lineVisible ?? true;
          const waypointsVisible = routeState[id]?.waypointsVisible ?? true;
          const photosVisible = routeState[id]?.photosVisible ?? true;
          // Default to true (assume it might have waypoints) until the file
          // actually finishes parsing, so the icon doesn't flash disabled.
          const hasWaypoints = (processedFiles[info.file]?.waypointCount ?? 1) > 0;

          return (
            <div
              key={id}
              draggable
              onDragStart={() => setDraggedId(id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(id)}
              onDragEnd={() => setDraggedId(null)}
              className={`flex items-center gap-2 border-b border-border px-3 py-1.5 text-sm ${
                draggedId === id ? 'opacity-40' : ''
              } ${activeRouteId === id ? 'bg-surface-raised' : ''}`}
            >
              <span className="cursor-grab select-none text-gray-500" aria-hidden="true">
                ⠿
              </span>
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: info.color }}
              />
              <button
                type="button"
                onClick={() => setActiveRoute(activeRouteId === id ? null : id)}
                className={`flex-1 truncate text-left hover:text-accent ${
                  activeRouteId === id ? 'font-semibold text-accent' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {info.title}
              </button>
              <button
                type="button"
                onClick={() => setLineVisible(id, !lineVisible)}
                title={lineVisible ? 'Hide line' : 'Show line'}
                className={
                  lineVisible ? 'text-accent' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              >
                <LineIcon />
              </button>
              <button
                type="button"
                onClick={() => hasWaypoints && setWaypointsVisible(id, !waypointsVisible)}
                disabled={!hasWaypoints}
                title={
                  !hasWaypoints
                    ? 'This route has no waypoints'
                    : waypointsVisible
                      ? 'Hide waypoints'
                      : 'Show waypoints'
                }
                className={
                  !hasWaypoints
                    ? 'cursor-not-allowed text-gray-300 dark:text-gray-700'
                    : waypointsVisible
                      ? 'text-accent'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              >
                <PinIcon />
              </button>
              <button
                type="button"
                onClick={() => info.hasPhotos && setPhotosVisible(id, !photosVisible)}
                disabled={!info.hasPhotos}
                title={
                  !info.hasPhotos
                    ? 'This route has no photos'
                    : photosVisible
                      ? 'Hide photos'
                      : 'Show photos'
                }
                className={
                  !info.hasPhotos
                    ? 'cursor-not-allowed text-gray-300 dark:text-gray-700'
                    : photosVisible
                      ? 'text-accent'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              >
                <CameraIcon />
              </button>
              <button
                type="button"
                onClick={() => setRouteVisible(id, false)}
                aria-label="Hide layer"
                className="text-gray-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
