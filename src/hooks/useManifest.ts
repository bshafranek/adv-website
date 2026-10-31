import { useEffect, useState } from 'react';
import type { Manifest } from '../types/manifest';
import { loadManifest } from '../utils/manifest/loadManifest';

export interface UseManifestResult {
  manifest: Manifest | null;
  loading: boolean;
  error: string | null;
}

export function useManifest(): UseManifestResult {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadManifest()
      .then((result) => {
        if (!cancelled) setManifest(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { manifest, loading, error };
}
