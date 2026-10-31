import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Leaflet caches its container size at mount and won't notice CSS-driven
// resizes (sidebar/panel collapse animations) on its own, leaving stale
// tiles/blank strips until invalidateSize() is called.
export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}
