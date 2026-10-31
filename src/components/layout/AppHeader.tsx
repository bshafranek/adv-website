import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <Link to="/" className="font-semibold tracking-tight text-gray-100">
        Brent's Adventures
      </Link>
      <nav className="text-sm">
        <Link to="/status" className="text-gray-400 hover:text-accent">
          App Status
        </Link>
      </nav>
    </header>
  );
}
