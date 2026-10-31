import { useContext } from 'react';
import { GpxStatusContext, type GpxStatusContextValue } from '../context/gpxStatusStore';

export function useGpxStatus(): GpxStatusContextValue {
  const ctx = useContext(GpxStatusContext);
  if (!ctx) {
    throw new Error('useGpxStatus must be used within a GpxStatusProvider');
  }
  return ctx;
}
