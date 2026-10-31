import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// A native Leaflet control (not a React-rendered element) so it stacks
// directly under the built-in zoom buttons in the same corner.
export function FitBoundsControl({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  const positionsRef = useRef(positions);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    const control = new L.Control({ position: 'topleft' });

    control.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
      button.type = 'button';
      button.title = 'Zoom to visible layers';
      button.innerHTML = '⛶';
      button.style.width = '30px';
      button.style.height = '30px';
      button.style.lineHeight = '28px';
      button.style.fontSize = '16px';
      button.style.textAlign = 'center';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = 'white';
      button.style.color = '#1f2937';

      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.on(button, 'click', () => {
        const current = positionsRef.current;
        if (current.length === 0) return;
        const bounds = L.latLngBounds(current);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [32, 32] });
        }
      });

      return button;
    };

    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}
