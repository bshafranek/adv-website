import type { Manifest } from '../../types/manifest';

export async function loadManifest(): Promise<Manifest> {
  const response = await fetch(`${import.meta.env.BASE_URL}gpx/manifest.json`);
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as Manifest;
}
