import { useState } from 'react';

export interface UseElevationSyncResult {
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
}

// TODO: shared between ElevationChart (sets hoverIndex on mouse move) and
// MapView (renders a cursor marker at points[hoverIndex]).
export function useElevationSync(): UseElevationSyncResult {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  return { hoverIndex, setHoverIndex };
}
