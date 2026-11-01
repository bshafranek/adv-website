import { useRef, useState } from 'react';
import { BASEMAPS } from '../../constants/basemaps';
import { useClickOutside } from '../../hooks/useClickOutside';
import { StackIcon } from '../icons/LayerIcons';

export function BasemapControl({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeBasemap = BASEMAPS.find((b) => b.id === activeId) ?? BASEMAPS[0];

  useClickOutside([rootRef], () => setOpen(false), open);

  return (
    <div ref={rootRef} className="relative text-xs">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 text-gray-800 hover:bg-surface-raised dark:text-gray-200"
      >
        <StackIcon />
        <span>{activeBasemap.name}</span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          {BASEMAPS.map((basemap) => (
            <button
              key={basemap.id}
              type="button"
              role="option"
              aria-selected={activeId === basemap.id}
              onClick={() => {
                onChange(basemap.id);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left ${
                activeId === basemap.id
                  ? 'bg-accent text-black'
                  : 'text-gray-700 hover:bg-surface-raised dark:text-gray-300'
              }`}
            >
              {basemap.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
