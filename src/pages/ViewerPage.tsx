import { useMemo, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CollectionList } from '../components/sidebar/CollectionList';
import { ActiveLayersList } from '../components/sidebar/ActiveLayersList';
import { LocalFilesList } from '../components/sidebar/LocalFilesList';
import { MapView } from '../components/map/MapView';
import { ElevationChart } from '../components/charts/ElevationChart';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { CollapsiblePanel } from '../components/common/CollapsiblePanel';
import { useManifest } from '../hooks/useManifest';
import { useTripCollections } from '../hooks/useTripCollections';
import { useGpxRoute } from '../hooks/useGpxRoute';
import { useGpxStatus } from '../hooks/useGpxStatus';
import { computeGpxStats } from '../utils/gpx/gpxStats';
import { buildElevationProfile, type ElevationProfilePoint } from '../utils/gpx/elevationProfile';
import { parseGpx } from '../utils/gpx/parseGpx';
import { DEFAULT_ROUTE_COLORS } from '../constants/colors';
import type { LocalRoute } from '../types/localRoute';

export function ViewerPage() {
  const { manifest } = useManifest();
  const { activeRouteId } = useTripCollections();

  const activeRoute = useMemo(() => {
    if (!manifest || !activeRouteId) return null;
    for (const group of manifest.groups) {
      const ungroupedRoute = group.routes?.find((r) => r.id === activeRouteId);
      if (ungroupedRoute) return ungroupedRoute;
      for (const collection of group.collections) {
        const route = collection.routes.find((r) => r.id === activeRouteId);
        if (route) return route;
      }
    }
    return null;
  }, [manifest, activeRouteId]);

  const { data: activeRouteData } = useGpxRoute(activeRoute?.file ?? null);
  const points = useMemo(() => activeRouteData?.points ?? [], [activeRouteData]);

  const stats = useMemo(() => computeGpxStats(points), [points]);
  const profile = useMemo(() => buildElevationProfile(points), [points]);

  const [cursorPosition, setCursorPosition] = useState<[number, number] | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const [localRoutes, setLocalRoutes] = useState<LocalRoute[]>([]);
  const { reportParseResult } = useGpxStatus();

  const handleHover = (point: ElevationProfilePoint | null) => {
    setCursorPosition(point ? [point.lat, point.lon] : null);
  };

  const handleClickPoint = (point: ElevationProfilePoint) => {
    setFlyToTarget([point.lat, point.lon]);
  };

  const handleFilesDropped = async (files: File[]) => {
    for (const file of files) {
      const data = await parseGpx(file);
      reportParseResult(file.name, data);
      setLocalRoutes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: file.name,
          color: DEFAULT_ROUTE_COLORS[prev.length % DEFAULT_ROUTE_COLORS.length],
          data,
        },
      ]);
    }
  };

  const handleRemoveLocalRoute = (id: string) => {
    setLocalRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  return (
    <MainLayout
      sidebar={
        <>
          <div className="sticky top-0 z-10 border-b border-border bg-surface pb-2">
            <ActiveLayersList />
            <LocalFilesList localRoutes={localRoutes} onRemove={handleRemoveLocalRoute} />
          </div>
          <CollectionList />
        </>
      }
    >
      <CollapsiblePanel title="Ride Summary" defaultOpen={false}>
        {activeRoute ? (
          <SummaryCards stats={stats} />
        ) : (
          <p className="px-4 py-4 text-sm text-gray-500">
            Select a route in the sidebar to see its ride summary.
          </p>
        )}
      </CollapsiblePanel>
      <div className="min-h-0 flex-1 p-4">
        <MapView
          cursorPosition={cursorPosition}
          flyToTarget={flyToTarget}
          localRoutes={localRoutes}
          onFilesDropped={handleFilesDropped}
        />
      </div>
      <CollapsiblePanel title="Elevation Profile" arrowWhenOpen="down" defaultOpen={false}>
        <div className="px-4 pb-4">
          {activeRoute ? (
            <ElevationChart data={profile} onHover={handleHover} onClickPoint={handleClickPoint} />
          ) : (
            <p className="py-4 text-sm text-gray-500">
              Select a route in the sidebar to see its elevation profile.
            </p>
          )}
        </div>
      </CollapsiblePanel>
    </MainLayout>
  );
}
