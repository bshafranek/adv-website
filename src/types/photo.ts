export interface PhotoRef {
  id: string;
  /** ISO timestamp from EXIF, or null if the photo had none */
  takenAt: string | null;
  caption: string | null;
  /** Paths relative to BASE_URL, e.g. "photos/<route-id>/<group-id>/<id>-thumb.jpg" */
  thumbnail: string;
  full: string;
}

export interface PhotoGroup {
  id: string;
  lat: number;
  lon: number;
  /** One or more photos taken at/near this spot, in chronological order */
  photos: PhotoRef[];
}
