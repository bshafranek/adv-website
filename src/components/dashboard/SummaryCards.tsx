import type { GpxStats } from '../../utils/gpx/gpxStats';
import { formatDistance, formatElevation, formatSpeed } from '../../utils/units';
import { formatDuration } from '../../utils/format';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../common/Card';

export function SummaryCards({ stats }: { stats: GpxStats }) {
  const {
    settings: { unitSystem },
  } = useSettings();

  const cards = [
    { title: 'Distance', value: formatDistance(stats.totalDistanceMeters, unitSystem) },
    { title: 'Moving Time', value: formatDuration(stats.movingTimeSeconds) },
    { title: 'Elevation Gain', value: formatElevation(stats.elevationGainMeters, unitSystem) },
    { title: 'Elevation Loss', value: formatElevation(stats.elevationLossMeters, unitSystem) },
    { title: 'Max Speed', value: formatSpeed(stats.maxSpeedMetersPerSecond, unitSystem) },
    {
      title: 'Min / Max Altitude',
      value:
        stats.minAltitudeMeters !== null && stats.maxAltitudeMeters !== null
          ? `${formatElevation(stats.minAltitudeMeters, unitSystem)} / ${formatElevation(stats.maxAltitudeMeters, unitSystem)}`
          : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} title={card.title}>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
