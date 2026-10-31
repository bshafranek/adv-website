import { useEffect, useState } from 'react';
import type { GpxParseResult } from '../types/gpx';
import { parseGpx } from '../utils/gpx/parseGpx';
import { useGpxStatus } from './useGpxStatus';

export interface UseGpxRouteResult {
  data: GpxParseResult | null;
  loading: boolean;
}

export function useGpxRoute(file: string | null): UseGpxRouteResult {
  const [result, setResult] = useState<GpxParseResult | null>(null);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const { reportParseResult } = useGpxStatus();

  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    parseGpx(file).then((parsed) => {
      if (!cancelled) {
        setResult(parsed);
        setLoadedFile(file);
        reportParseResult(file, parsed);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file, reportParseResult]);

  return {
    data: file ? result : null,
    loading: file !== null && loadedFile !== file,
  };
}
