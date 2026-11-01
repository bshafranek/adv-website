export interface ManifestRoute {
  id: string;
  title: string;
  /** ISO date (YYYY-MM-DD) the route was actually ridden, or null if not yet ridden/unknown */
  date: string | null;
  /** Omitted for routes that sit directly on a group, with no parent collection */
  collectionId?: string;
  /** Path relative to import.meta.env.BASE_URL, e.g. "gpx/<collection>/<route>.gpx" */
  file: string;
  /** Overrides collection.defaultColor (or group.defaultColor, for ungrouped routes) when set */
  color: string | null;
}

export interface ManifestCollection {
  id: string;
  title: string;
  description: string;
  defaultColor: string;
  routes: ManifestRoute[];
}

export interface ManifestGroup {
  id: string;
  title: string;
  /** Fallback color for ungrouped routes (see `routes` below); unused if `routes` is empty/absent */
  defaultColor?: string;
  /** Routes that sit directly under this group with no collection sub-heading in the sidebar */
  routes?: ManifestRoute[];
  collections: ManifestCollection[];
}

export interface Manifest {
  schemaVersion: number;
  groups: ManifestGroup[];
}
