export interface ManifestRoute {
  id: string;
  title: string;
  date: string;
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
