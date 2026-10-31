import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function MapFlyTo({
  target,
  zoom = 13,
}: {
  target: [number, number] | null;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo(target, zoom);
    }
  }, [map, target, zoom]);

  return null;
}
