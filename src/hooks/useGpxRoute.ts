import { useEffect, useState } from 'react';
import type { GpxParseResult } from '../types/gpx';
import { parseGpx } from '../utils/gpx/parseGpx';

export interface UseGpxRouteResult {
  data: GpxParseResult | null;
  loading: boolean;
}

// TODO: once parseGpx is implemented, this should also expose parse errors
// surfaced to the App Status page rather than swallowing them.
export function useGpxRoute(file: string | null): UseGpxRouteResult {
  const [result, setResult] = useState<GpxParseResult | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    parseGpx(file).then((parsed) => {
      if (!cancelled) {
        setResult(parsed);
        setLoadedFile(file);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return {
    data: file ? result : null,
    loading: file !== null && loadedFile !== file,
  };
}
