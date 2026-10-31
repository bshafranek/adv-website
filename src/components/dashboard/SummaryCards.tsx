import type { GpxStats } from '../../utils/gpx/gpxStats';
import { Card } from '../common/Card';

export function SummaryCards({ stats }: { stats: GpxStats }) {
  const cards = [
    { title: 'Distance', value: `${(stats.totalDistanceMeters / 1000).toFixed(1)} km` },
    { title: 'Moving Time', value: `${Math.round(stats.movingTimeSeconds / 60)} min` },
    { title: 'Elevation Gain', value: `${stats.elevationGainMeters.toFixed(0)} m` },
    { title: 'Elevation Loss', value: `${stats.elevationLossMeters.toFixed(0)} m` },
    { title: 'Max Speed', value: `${(stats.maxSpeedMetersPerSecond * 3.6).toFixed(0)} km/h` },
    {
      title: 'Min / Max Altitude',
      value:
        stats.minAltitudeMeters !== null && stats.maxAltitudeMeters !== null
          ? `${stats.minAltitudeMeters.toFixed(0)} / ${stats.maxAltitudeMeters.toFixed(0)} m`
          : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} title={card.title}>
          <p className="text-lg font-semibold text-gray-100">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
