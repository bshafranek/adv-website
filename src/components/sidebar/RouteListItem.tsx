import type { ManifestRoute } from '../../types/manifest';
import { Toggle } from '../common/Toggle';

// TODO: drag handle for reordering.
export function RouteListItem({
  route,
  visible,
  color,
  active,
  onToggleVisible,
  onSelect,
  onColorChange,
}: {
  route: ManifestRoute;
  visible: boolean;
  color: string;
  active: boolean;
  onToggleVisible: (visible: boolean) => void;
  onSelect: () => void;
  onColorChange: (color: string) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-border px-3 py-2 ${
        active ? 'bg-surface-raised' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Toggle checked={visible} onChange={onToggleVisible} />
        <button
          type="button"
          onClick={onSelect}
          className={`text-left text-sm hover:text-accent ${active ? 'font-semibold text-accent' : 'text-gray-200'}`}
        >
          {route.title}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label
          title="Change route color"
          className="relative inline-block h-3 w-3 cursor-pointer rounded-full border border-border"
          style={{ backgroundColor: color }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <a
          href={`${import.meta.env.BASE_URL}${route.file}`}
          download={`${route.id}.gpx`}
          className="rounded-md bg-surface-raised px-2 py-0.5 text-xs text-gray-100 transition-colors hover:bg-accent hover:text-black"
        >
          GPX
        </a>
      </div>
    </div>
  );
}
