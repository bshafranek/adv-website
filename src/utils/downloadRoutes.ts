import JSZip from 'jszip';
import type { ManifestRoute } from '../types/manifest';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// `zipName` is used only for the downloaded filename — routes can come from
// any mix of collections (e.g. a cross-collection selection).
export async function downloadRoutesAsZip(zipName: string, routes: ManifestRoute[]): Promise<void> {
  const zip = new JSZip();

  await Promise.all(
    routes.map(async (route) => {
      const response = await fetch(`${import.meta.env.BASE_URL}${route.file}`);
      if (!response.ok) return;
      const blob = await response.blob();
      const filename = route.file.split('/').pop() ?? `${slugify(route.title)}.gpx`;
      zip.file(filename, blob);
    }),
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(zipName)}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
