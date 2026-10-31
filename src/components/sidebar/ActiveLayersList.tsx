import { useMemo, useState } from 'react';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';

// routeOrder[0] is the top of the visual stack (rendered last/on top by
// MapView). Dragging a row here reorders both the list and the map stacking.
export function ActiveLayersList() {
  const { manifest } = useManifest();
  const { routeState, routeOrder, activeRouteId, reorderRoutes, setRouteVisible, setActiveRoute } =
    useTripCollections();
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
