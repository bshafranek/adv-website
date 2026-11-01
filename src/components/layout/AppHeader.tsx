import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';

function HamburgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

const MENU_LINKS = [
  { to: '/status', label: 'App Status' },
  { to: '/download', label: 'Download' },
  { to: '/settings', label: 'Settings' },
  { to: '/how-to-use', label: 'How to Use' },
  { to: '/about', label: 'About' },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  }, [menuOpen]);

  useClickOutside([menuRef, buttonRef], () => setMenuOpen(false), menuOpen);

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <Link to="/" className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Brent's Adventures
      </Link>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        className="rounded p-1 text-gray-700 hover:bg-surface-raised hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <HamburgerIcon />
      </button>
      {menuOpen &&
        menuPos &&
        createPortal(
          <nav
            ref={menuRef}
            style={{ position: 'fixed', top: menuPos.top, right: menuPos.right }}
            className="z-[2000] w-40 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
          >
            {MENU_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-surface-raised hover:text-accent dark:text-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>,
          document.body,
        )}
    </header>
  );
}
