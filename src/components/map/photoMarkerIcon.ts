import L from 'leaflet';

const CAMERA_PATH =
  'M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z';

/** A round camera-glyph pin, visually distinct from the default waypoint marker,
 * with a small count badge when a photo group has more than one photo. */
export function createPhotoMarkerIcon(photoCount: number): L.DivIcon {
  const badge =
    photoCount > 1
      ? `<span style="position:absolute;top:-4px;right:-4px;min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:#f97316;color:#000;font-size:9px;line-height:14px;font-weight:700;text-align:center;">${photoCount}</span>`
      : '';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:26px;height:26px;border-radius:50%;background:#f97316;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#000" stroke-width="2">
          <path d="${CAMERA_PATH}" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="14" r="3.5" />
        </svg>
        ${badge}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
}
