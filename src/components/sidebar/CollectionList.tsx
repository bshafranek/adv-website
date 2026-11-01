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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [collapsedCollections, setCollapsedCollections] = useState<Record<string, boolean>>({});

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
                  onSelect={() => {
                    setActiveRoute(route.id);
                    setRouteVisible(route.id, true);
                  }}
                />
              ))}
            {!groupCollapsed &&
              group.collections.map((collection) => {
                const collapsed =
                  collapsedCollections[collection.id] ??
                  collection.routes.length > AUTO_COLLAPSE_THRESHOLD;

                return (
                  <div key={collection.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedCollections((prev) => ({
                          ...prev,
                          [collection.id]: !collapsed,
                        }))
                      }
                      className="flex w-full items-center justify-between py-1 pl-6 pr-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-300"
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
                          color={
                            routeState[route.id]?.color ?? route.color ?? collection.defaultColor
                          }
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
      })}
    </div>
  );
}
