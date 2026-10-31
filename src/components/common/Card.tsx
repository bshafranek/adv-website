import type { ReactNode } from 'react';

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      {title && <h3 className="mb-2 text-sm font-medium text-gray-400">{title}</h3>}
      {children}
    </div>
  );
}
