export interface ManifestRoute {
  id: string;
  title: string;
  /** ISO date (YYYY-MM-DD) the route was actually ridden, or null if not yet ridden/unknown */
  date: string | null;
  collectionId: string;
  /** Path relative to import.meta.env.BASE_URL, e.g. "gpx/<collection>/<route>.gpx" */
  file: string;
  /** Overrides collection.defaultColor when set */
  color: string | null;
}

export interface ManifestCollection {
  id: string;
  title: string;
  description: string;
  defaultColor: string;
  routes: ManifestRoute[];
}

export interface Manifest {
  schemaVersion: number;
  collections: ManifestCollection[];
}
