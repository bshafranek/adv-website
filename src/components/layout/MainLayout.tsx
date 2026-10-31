import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';

export function MainLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-border bg-surface">
          {sidebar}
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
