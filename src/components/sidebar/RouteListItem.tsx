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
      className={`flex items-center justify-between gap-2 border-b border-border py-2 pl-8 pr-3 ${
        active ? 'bg-surface-raised' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Toggle checked={visible} onChange={onToggleVisible} />
        <button
          type="button"
          onClick={onSelect}
          className={`text-left text-sm hover:text-accent ${active ? 'font-semibold text-accent' : 'text-gray-800 dark:text-gray-200'}`}
        >
          {route.title}
        </button>
      </div>
      <label
        title="Change route color"
        className="relative inline-block h-3 w-3 shrink-0 cursor-pointer rounded-full border border-border"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}
