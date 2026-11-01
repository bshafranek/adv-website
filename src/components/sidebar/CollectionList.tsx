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
  const {
    routeState,
    activeRouteId,
    setRouteVisible,
    setRoutesVisible,
    setRouteColor,
    setActiveRoute,
  } = useTripCollections();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [collapsedCollections, setCollapsedCollections] = useState<Record<string, boolean>>({});

  // Clicking the already-active route's title deselects it (removes the map
  // highlight) instead of re-selecting it; otherwise selects it and makes
  // sure it's visible.
  function handleSelect(routeId: string) {
    if (activeRouteId === routeId) {
      setActiveRoute(null);
    } else {
      setActiveRoute(routeId);
      setRouteVisible(routeId, true);
    }
  }

  if (loading) return <p className="p-3 text-sm text-gray-500">Loading collections…</p>;
  if (error) return <p className="p-3 text-sm text-red-400">{error}</p>;
  if (!manifest) return null;

  return (
    <div>
      {manifest.groups.map((group) => {
        const groupCollapsed = collapsedGroups[group.id] ?? false;
        const routeCount =
          (group.routes?.length ?? 0) +
          group.collections.reduce((sum, c) => sum + c.routes.length, 0);

        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() =>
                setCollapsedGroups((prev) => ({ ...prev, [group.id]: !groupCollapsed }))
              }
              className="flex w-full items-center justify-between bg-surface-raised px-3 py-2 text-sm font-semibold text-gray-200 hover:text-gray-100"
              aria-expanded={!groupCollapsed}
            >
              <span>
                {group.title} <span className="font-normal text-gray-500">({routeCount})</span>
              </span>
              <span
                className="transition-transform duration-200"
                style={{ transform: groupCollapsed ? 'rotate(180deg)' : 'none' }}
              >
                ⌃
              </span>
            </button>
            {!groupCollapsed &&
              group.routes?.map((route) => (
                <RouteListItem
                  key={route.id}
                  route={route}
                  visible={routeState[route.id]?.visible ?? false}
                  color={routeState[route.id]?.color ?? route.color ?? group.defaultColor ?? '#3b82f6'}
                  active={activeRouteId === route.id}
                  onToggleVisible={(visible) => setRouteVisible(route.id, visible)}
                  onColorChange={(color) => setRouteColor(route.id, color)}
                  onSelect={() => handleSelect(route.id)}
                />
              ))}
            {!groupCollapsed &&
              group.collections.map((collection) => {
                const collapsed =
                  collapsedCollections[collection.id] ??
                  collection.routes.length > AUTO_COLLAPSE_THRESHOLD;
                const collectionRouteIds = collection.routes.map((r) => r.id);
                const visibleCount = collectionRouteIds.filter(
                  (id) => routeState[id]?.visible,
                ).length;
                const allVisible =
                  collectionRouteIds.length > 0 && visibleCount === collectionRouteIds.length;
                const someVisible = visibleCount > 0 && !allVisible;

                return (
                  <div key={collection.id}>
                    <div className="flex items-center gap-2 pl-6 pr-3">
                      <input
                        type="checkbox"
                        checked={allVisible}
                        ref={(el) => {
                          if (el) el.indeterminate = someVisible;
                        }}
                        onChange={() => setRoutesVisible(collectionRouteIds, !allVisible)}
                        title="Show/hide all routes in this collection"
                        className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedCollections((prev) => ({
                            ...prev,
                            [collection.id]: !collapsed,
                          }))
                        }
                        className="flex flex-1 items-center justify-between py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-300"
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
                    </div>
                    {!collapsed &&
                      collection.routes.map((route) => (
                        <RouteListItem
                          key={route.id}
                          route={route}
                          visible={routeState[route.id]?.visible ?? false}
                          color={
                            routeState[route.id]?.color ?? route.color ?? collection.defaultColor
                          }
                          active={activeRouteId === route.id}
                          onToggleVisible={(visible) => setRouteVisible(route.id, visible)}
                          onColorChange={(color) => setRouteColor(route.id, color)}
                          onSelect={() => handleSelect(route.id)}
                        />
                      ))}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
