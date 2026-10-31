import type { ManifestRoute } from '../../types/manifest';
import { Toggle } from '../common/Toggle';
import { Button } from '../common/Button';

// TODO: drag handle for reordering, color swatch opens a color picker, download
// button streams the raw .gpx file from its manifest path.
export function RouteListItem({
  route,
  visible,
  color,
  onToggleVisible,
}: {
  route: ManifestRoute;
  visible: boolean;
  color: string;
  onToggleVisible: (visible: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
      <Toggle checked={visible} onChange={onToggleVisible} label={route.title} />
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full border border-border"
          style={{ backgroundColor: color }}
        />
        <Button className="px-2 py-0.5 text-xs">GPX</Button>
      </div>
    </div>
  );
}
