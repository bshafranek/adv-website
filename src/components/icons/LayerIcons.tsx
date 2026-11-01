// Plain SVGs instead of emoji — emoji glyphs render as fixed-color bitmaps in
// most fonts/browsers and ignore the `color`/opacity CSS used to show
// on/off state, so a color/opacity toggle on them would be invisible.
export function LineIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 18 L10 10 L14 14 L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export function StackIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 2 9l10 6 10-6-10-6z" strokeLinejoin="round" />
      <path d="M2 15l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
