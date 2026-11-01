import type { GpxParseResult } from './gpx';

export interface LocalRoute {
  id: string;
  name: string;
  color: string;
  data: GpxParseResult;
}
