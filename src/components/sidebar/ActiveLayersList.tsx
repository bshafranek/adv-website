import { useMemo, useState } from 'react';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';

// Plain SVGs instead of emoji — emoji glyphs render as fixed-color bitmaps in
// most fonts/browsers and ignore the `color`/opacity CSS used to show
// on/off state, so a color/opacity toggle on them would be invisible.
function LineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 18 L10 10 L14 14 L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

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
    setWaypointsVisible,
    setLineVisible,
    setActiveRoute,
  } = useTripCollections();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const routeLookup = useMemo(() => {
    const map = new Map<string, { title: string; color: string }>();
    manifest?.collections.forEach((collection) => {
      collection.routes.forEach((route) => {
        map.set(route.id, {
          title: route.title,
          color: routeState[route.id]?.color ?? route.color ?? collection.defaultColor,
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
      <h2 className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Active Layers {routeOrder.length > 0 && `(${routeOrder.length})`}
      </h2>
      {routeOrder.length === 0 ? (
        <p className="px-3 pb-2 text-xs text-gray-600">
          Check a route below to add it here, drag to reorder stacking.
        </p>
      ) : (
        routeOrder.map((id) => {
          const info = routeLookup.get(id);
          if (!info) return null;
          const lineVisible = routeState[id]?.lineVisible ?? true;
          const waypointsVisible = routeState[id]?.waypointsVisible ?? true;

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
                onClick={() => setActiveRoute(id)}
                className={`flex-1 truncate text-left hover:text-accent ${
                  activeRouteId === id ? 'font-semibold text-accent' : 'text-gray-200'
                }`}
              >
                {info.title}
              </button>
              <button
                type="button"
                onClick={() => setLineVisible(id, !lineVisible)}
                title={lineVisible ? 'Hide line' : 'Show line'}
                className={lineVisible ? 'text-accent' : 'text-gray-500 hover:text-gray-300'}
              >
                <LineIcon />
              </button>
              <button
                type="button"
                onClick={() => setWaypointsVisible(id, !waypointsVisible)}
                title={waypointsVisible ? 'Hide waypoints' : 'Show waypoints'}
                className={waypointsVisible ? 'text-accent' : 'text-gray-500 hover:text-gray-300'}
              >
                <PinIcon />
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
