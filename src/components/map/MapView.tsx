import { useState } from 'react';
import { BASEMAPS } from '../../constants/basemaps';
import { BasemapControl } from './BasemapControl';

// TODO: replace placeholder with react-leaflet <MapContainer>/<TileLayer>, route
// polylines per visible ManifestRoute, and waypoint markers.
export function MapView() {
  const [activeBasemap, setActiveBasemap] = useState(BASEMAPS[0].id);

  return (
    <div className="relative flex h-full min-h-96 items-center justify-center bg-surface text-gray-500">
      <div className="absolute right-3 top-3 z-10">
        <BasemapControl activeId={activeBasemap} onChange={setActiveBasemap} />
      </div>
      <p>Map placeholder — Leaflet map renders here</p>
    </div>
  );
}
