import type { GpxStats } from '../../utils/gpx/gpxStats';
import { metersToFeet, metersToMiles, metersPerSecondToMph } from '../../utils/units';
import { formatNumber, formatDuration } from '../../utils/format';
import { Card } from '../common/Card';

export function SummaryCards({ stats }: { stats: GpxStats }) {
  const cards = [
    { title: 'Distance', value: `${formatNumber(metersToMiles(stats.totalDistanceMeters), 1)} mi` },
    { title: 'Moving Time', value: formatDuration(stats.movingTimeSeconds) },
    {
      title: 'Elevation Gain',
      value: `${formatNumber(metersToFeet(stats.elevationGainMeters))} ft`,
    },
    {
      title: 'Elevation Loss',
      value: `${formatNumber(metersToFeet(stats.elevationLossMeters))} ft`,
    },
    {
      title: 'Max Speed',
      value: `${formatNumber(metersPerSecondToMph(stats.maxSpeedMetersPerSecond))} mph`,
    },
    {
      title: 'Min / Max Altitude',
      value:
        stats.minAltitudeMeters !== null && stats.maxAltitudeMeters !== null
          ? `${formatNumber(metersToFeet(stats.minAltitudeMeters))} / ${formatNumber(metersToFeet(stats.maxAltitudeMeters))} ft`
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
