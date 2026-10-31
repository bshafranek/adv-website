import { MainLayout } from '../components/layout/MainLayout';
import { CollectionList } from '../components/sidebar/CollectionList';
import { MapView } from '../components/map/MapView';
import { ElevationChart } from '../components/charts/ElevationChart';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { computeGpxStats } from '../utils/gpx/gpxStats';

export function ViewerPage() {
  const stats = computeGpxStats([]);

  return (
    <MainLayout sidebar={<CollectionList />}>
      <SummaryCards stats={stats} />
      <div className="px-4">
        <MapView />
      </div>
      <div className="px-4 pb-4">
        <ElevationChart data={[]} />
      </div>
    </MainLayout>
  );
}
