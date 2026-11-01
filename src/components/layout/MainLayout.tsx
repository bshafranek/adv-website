import { useState, type ReactNode } from 'react';
import { AppHeader } from './AppHeader';

export function MainLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`shrink-0 overflow-hidden transition-[width] duration-300 ${sidebarOpen ? 'w-72' : 'w-0'}`}
        >
          <aside className="h-full w-72 overflow-y-auto border-r border-border bg-surface">
            {sidebar}
          </aside>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          className="flex w-4 shrink-0 items-center justify-center border-r border-border bg-surface text-gray-500 hover:bg-surface-raised hover:text-gray-800 dark:hover:text-gray-200"
        >
          {sidebarOpen ? '‹' : '›'}
        </button>
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
