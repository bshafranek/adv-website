import { useState } from 'react';
import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { RouteListItem } from './RouteListItem';

// Collections with more routes than this default to collapsed, since some
// (e.g. the TAT section library) have 200+ routes.
const AUTO_COLLAPSE_THRESHOLD = 20;

// TODO: drag-and-drop reordering of routes within/across collections.
export function CollectionList() {
  const { manifest, loading, error } = useManifest();
  const { routeState, activeRouteId, setRouteVisible, setRouteColor, setActiveRoute } =
    useTripCollections();
  const [collapsedOverrides, setCollapsedOverrides] = useState<Record<string, boolean>>({});

  if (loading) return <p className="p-3 text-sm text-gray-500">Loading collections…</p>;
  if (error) return <p className="p-3 text-sm text-red-400">{error}</p>;
  if (!manifest) return null;

  return (
    <div>
      {manifest.collections.map((collection) => {
        const collapsed =
          collapsedOverrides[collection.id] ?? collection.routes.length > AUTO_COLLAPSE_THRESHOLD;

        return (
          <div key={collection.id}>
            <button
              type="button"
              onClick={() =>
                setCollapsedOverrides((prev) => ({ ...prev, [collection.id]: !collapsed }))
              }
              className="flex w-full items-center justify-between px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-300"
              aria-expanded={!collapsed}
            >
              <span>
                {collection.title}{' '}
                <span className="text-gray-600">({collection.routes.length})</span>
              </span>
              <span
                className="transition-transform duration-200"
                style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
              >
                ⌃
              </span>
            </button>
            {!collapsed &&
              collection.routes.map((route) => (
                <RouteListItem
                  key={route.id}
                  route={route}
                  visible={routeState[route.id]?.visible ?? false}
                  color={routeState[route.id]?.color ?? route.color ?? collection.defaultColor}
                  active={activeRouteId === route.id}
                  onToggleVisible={(visible) => setRouteVisible(route.id, visible)}
                  onColorChange={(color) => setRouteColor(route.id, color)}
                  onSelect={() => {
                    setActiveRoute(route.id);
                    setRouteVisible(route.id, true);
                  }}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}
