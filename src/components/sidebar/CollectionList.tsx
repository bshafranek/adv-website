import { useManifest } from '../../hooks/useManifest';
import { useTripCollections } from '../../hooks/useTripCollections';
import { RouteListItem } from './RouteListItem';

// TODO: drag-and-drop reordering of routes within/across collections.
export function CollectionList() {
  const { manifest, loading, error } = useManifest();
  const { routeState, setRouteVisible } = useTripCollections();

  if (loading) return <p className="p-3 text-sm text-gray-500">Loading collections…</p>;
  if (error) return <p className="p-3 text-sm text-red-400">{error}</p>;
  if (!manifest) return null;

  return (
    <div>
      {manifest.collections.map((collection) => (
        <div key={collection.id}>
          <h2 className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {collection.title}
          </h2>
          {collection.routes.map((route) => (
            <RouteListItem
              key={route.id}
              route={route}
              visible={routeState[route.id]?.visible ?? true}
              color={route.color ?? collection.defaultColor}
              onToggleVisible={(visible) => setRouteVisible(route.id, visible)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
