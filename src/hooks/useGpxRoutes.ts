import { useEffect, useRef, useState } from 'react';
import type { GpxParseResult } from '../types/gpx';
import { parseGpx } from '../utils/gpx/parseGpx';
import { useGpxStatus } from './useGpxStatus';

export interface RouteRef {
  id: string;
  file: string;
}

// Fetches+parses each visible route once and caches the result by route id,
// so toggling a route off and back on doesn't re-fetch it.
export function useGpxRoutes(routes: RouteRef[]): Record<string, GpxParseResult> {
  const [cache, setCache] = useState<Record<string, GpxParseResult>>({});
  const inFlight = useRef(new Set<string>());
  const { reportParseResult } = useGpxStatus();

  useEffect(() => {
    for (const { id, file } of routes) {
      if (cache[id] || inFlight.current.has(id)) continue;
      inFlight.current.add(id);
      parseGpx(file).then((data) => {
        inFlight.current.delete(id);
        setCache((prev) => ({ ...prev, [id]: data }));
        reportParseResult(file, data);
      });
    }
  }, [routes, cache, reportParseResult]);

  return cache;
}
