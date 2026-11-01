import { useState, type ReactNode } from 'react';

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  /** Which way the arrow points while the panel is open; it flips 180° when collapsed. */
  arrowWhenOpen = 'up',
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  arrowWhenOpen?: 'up' | 'down';
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const pointingDown = arrowWhenOpen === 'up' ? !open : open;

  return (
    <div className="shrink-0 border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center text-xs font-semibold uppercase tracking-wide text-gray-600 hover:bg-surface-raised hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 ${
          open ? 'justify-between px-4 py-2' : 'justify-center py-1'
        }`}
        aria-expanded={open}
      >
        {open && <span>{title}</span>}
        <span
          className="transition-transform duration-200"
          style={{ transform: pointingDown ? 'rotate(180deg)' : 'none' }}
        >
          ⌃
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? '2000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 300ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
