import { BASEMAPS } from '../../constants/basemaps';

// TODO: wire selected basemap into MapView's active TileLayer.
export function BasemapControl({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-md border border-border bg-surface p-1 text-xs">
      {BASEMAPS.map((basemap) => (
        <button
          key={basemap.id}
          onClick={() => onChange(basemap.id)}
          className={`rounded px-2 py-1 ${
            activeId === basemap.id
              ? 'bg-accent text-black'
              : 'text-gray-300 hover:bg-surface-raised'
          }`}
        >
          {basemap.name}
        </button>
      ))}
    </div>
  );
}
