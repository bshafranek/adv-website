import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  GpxStatusContext,
  type GpxStatusContextValue,
  type ProcessedFileEntry,
} from './gpxStatusStore';
import type { GpxParseResult } from '../types/gpx';

export function GpxStatusProvider({ children }: { children: ReactNode }) {
  const [processedFiles, setProcessedFiles] = useState<Record<string, ProcessedFileEntry>>({});

  // Stable identity (no deps) so it's safe as an effect dependency in the
  // parsing hooks without re-triggering them every time any file reports in.
  const reportParseResult = useCallback((file: string, result: GpxParseResult) => {
    setProcessedFiles((prev) => ({
      ...prev,
      [file]: {
        file,
        pointCount: result.points.length,
        waypointCount: result.waypoints.length,
        errors: result.errors.map((e) => e.message),
        processedAt: Date.now(),
      },
    }));
  }, []);

  const value = useMemo<GpxStatusContextValue>(
    () => ({ processedFiles, reportParseResult }),
    [processedFiles, reportParseResult],
  );

  return <GpxStatusContext.Provider value={value}>{children}</GpxStatusContext.Provider>;
}
