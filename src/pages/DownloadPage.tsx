import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useManifest } from '../hooks/useManifest';
import { downloadRoutesAsZip } from '../utils/downloadRoutes';
import type { ManifestGroup, ManifestRoute } from '../types/manifest';

function SelectAllCheckbox({
  routeIds,
  selectedIds,
  onChange,
  title,
}: {
  routeIds: string[];
  selectedIds: Set<string>;
  onChange: (routeIds: string[], select: boolean) => void;
  title: string;
}) {
  const selectedCount = routeIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = selectedCount === routeIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <input
      type="checkbox"
      checked={allSelected}
      ref={(el) => {
        if (el) el.indeterminate = someSelected;
      }}
      onChange={() => onChange(routeIds, !allSelected)}
      title={title}
      className="h-4 w-4 cursor-pointer accent-accent"
    />
  );
}

export function DownloadPage() {
  const { manifest, loading, error } = useManifest();
  const [zippingId, setZippingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const routeLookup = useMemo(() => {
    const map = new Map<string, ManifestRoute>();
    manifest?.groups.forEach((group) => {
      group.collections.forEach((collection) => {
        collection.routes.forEach((route) => map.set(route.id, route));
      });
    });
    return map;
  }, [manifest]);

  function toggleRoute(routeId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(routeId)) next.delete(routeId);
      else next.add(routeId);
      return next;
    });
  }

  function toggleRoutes(routeIds: string[], select: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of routeIds) {
        if (select) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  async function handleDownloadZip(zipId: string, title: string, routes: ManifestRoute[]) {
    setZippingId(zipId);
    try {
      await downloadRoutesAsZip(title, routes);
    } finally {
      setZippingId(null);
    }
  }

  async function handleDownloadSelected() {
    setZippingId('__selected__');
    try {
      const routes = [...selectedIds]
        .map((id) => routeLookup.get(id))
        .filter((r): r is ManifestRoute => !!r);
      await downloadRoutesAsZip('selected-routes', routes);
    } finally {
      setZippingId(null);
    }
  }

  function groupRoutes(group: ManifestGroup): ManifestRoute[] {
    return group.collections.flatMap((c) => c.routes);
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-24 text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Download GPX Files</h1>
      <p className="mt-2 text-sm text-gray-400">
        Check routes from anywhere below to bundle a custom selection into one .zip, use a group's
        or collection's own "Download All" for everything in it at once, or click "Download" next to
        a single route to grab just its raw .gpx file.
      </p>

      {loading && <p className="mt-6 text-sm text-gray-500">Loading…</p>}
      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {manifest?.groups.map((group) => {
        const routes = groupRoutes(group);
        return (
          <section key={group.id} className="mt-8">
            <div className="flex items-center justify-between border-b-2 border-border pb-2">
              <div className="flex items-center gap-3">
                <SelectAllCheckbox
                  routeIds={routes.map((r) => r.id)}
                  selectedIds={selectedIds}
                  onChange={toggleRoutes}
                  title="Select/deselect all routes in this group"
                />
                <h2 className="text-lg font-semibold text-gray-100">
                  {group.title}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({routes.length} routes)
                  </span>
                </h2>
              </div>
              <button
                type="button"
                disabled={zippingId === group.id}
                onClick={() => handleDownloadZip(group.id, group.title, routes)}
                className="rounded-md bg-surface-raised px-3 py-1.5 text-sm text-gray-100 transition-colors hover:bg-accent hover:text-black disabled:cursor-wait disabled:opacity-60"
              >
                {zippingId === group.id ? 'Zipping…' : 'Download All (.zip)'}
              </button>
            </div>

            {group.collections.map((collection) => (
              <div key={collection.id} className="mt-4 pl-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-3">
                    <SelectAllCheckbox
                      routeIds={collection.routes.map((r) => r.id)}
                      selectedIds={selectedIds}
                      onChange={toggleRoutes}
                      title="Select/deselect all routes in this collection"
                    />
                    <h3 className="font-semibold text-gray-100">
                      {collection.title}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        ({collection.routes.length} routes)
                      </span>
                    </h3>
                  </div>
                  <button
                    type="button"
                    disabled={zippingId === collection.id}
                    onClick={() =>
                      handleDownloadZip(collection.id, collection.title, collection.routes)
                    }
                    className="rounded-md bg-surface-raised px-3 py-1.5 text-sm text-gray-100 transition-colors hover:bg-accent hover:text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {zippingId === collection.id ? 'Zipping…' : 'Download All (.zip)'}
                  </button>
                </div>
                <ul className="mt-2">
                  {collection.routes.map((route) => (
                    <li
                      key={route.id}
                      className="flex items-center justify-between gap-3 border-b border-border/50 py-1.5 text-sm"
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(route.id)}
                          onChange={() => toggleRoute(route.id)}
                          className="h-4 w-4 cursor-pointer accent-accent"
                        />
                        <span className="text-gray-300">{route.title}</span>
                      </label>
                      <a
                        href={`${import.meta.env.BASE_URL}${route.file}`}
                        download={`${route.id}.gpx`}
                        className="rounded-md bg-surface-raised px-2 py-0.5 text-xs text-gray-100 transition-colors hover:bg-accent hover:text-black"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}

      {selectedIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-border bg-surface px-6 py-3 shadow-lg">
          <span className="text-sm text-gray-300">
            {selectedIds.size} route{selectedIds.size === 1 ? '' : 's'} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-md px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={zippingId === '__selected__'}
              onClick={handleDownloadSelected}
              className="rounded-md bg-accent px-3 py-1.5 text-sm text-black transition-colors hover:brightness-90 disabled:cursor-wait disabled:opacity-60"
            >
              {zippingId === '__selected__' ? 'Zipping…' : 'Download Selected (.zip)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
