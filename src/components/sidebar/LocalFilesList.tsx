import type { LocalRoute } from '../../types/localRoute';

// Routes dropped directly onto the map — not part of the manifest, so they
// don't have the line/waypoint toggles or color picker manifest routes get;
// removing one removes both its line and its waypoint markers together.
export function LocalFilesList({
  localRoutes,
  onRemove,
}: {
  localRoutes: LocalRoute[];
  onRemove: (id: string) => void;
}) {
  if (localRoutes.length === 0) return null;

  return (
    <div className="border-b border-border">
      <h2 className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Local Files ({localRoutes.length})
      </h2>
      {localRoutes.map((route) => (
        <div
          key={route.id}
          className="flex items-center gap-2 border-b border-border/50 px-3 py-1.5 text-sm"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: route.color }}
          />
          <span className="flex-1 truncate text-gray-200" title={route.name}>
            {route.name}
          </span>
          <button
            type="button"
            onClick={() => onRemove(route.id)}
            aria-label="Remove file"
            className="text-gray-500 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
