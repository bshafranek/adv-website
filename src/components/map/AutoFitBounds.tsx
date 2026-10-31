import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function AutoFitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [map, positions]);

  return null;
}
