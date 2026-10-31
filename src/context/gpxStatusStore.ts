import { createContext } from 'react';
import type { GpxParseResult } from '../types/gpx';

export interface ProcessedFileEntry {
  file: string;
  pointCount: number;
  waypointCount: number;
  errors: string[];
  processedAt: number;
}

export interface GpxStatusContextValue {
  processedFiles: Record<string, ProcessedFileEntry>;
  reportParseResult: (file: string, result: GpxParseResult) => void;
}

export const GpxStatusContext = createContext<GpxStatusContextValue | null>(null);
