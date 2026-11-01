import { useState } from 'react';
import type { PhotoGroup } from '../../types/photo';

export function PhotoPopup({ group }: { group: PhotoGroup }) {
  const [index, setIndex] = useState(0);
  const photo = group.photos[index];
  const hasMultiple = group.photos.length > 1;

  return (
    <div className="w-56 text-sm">
      <a href={`${import.meta.env.BASE_URL}${photo.full}`} target="_blank" rel="noreferrer">
        <img
          src={`${import.meta.env.BASE_URL}${photo.thumbnail}`}
          alt={photo.caption ?? 'Ride photo'}
          className="w-full rounded"
        />
      </a>
      {photo.caption && <p className="mt-2 font-semibold text-gray-900">{photo.caption}</p>}
      {photo.takenAt && (
        <p className="text-gray-600">
          {new Date(photo.takenAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      )}
      {hasMultiple && (
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + group.photos.length) % group.photos.length)}
            className="rounded px-2 py-0.5 text-gray-700 hover:bg-gray-100"
            aria-label="Previous photo"
          >
            &larr;
          </button>
          <span className="text-xs text-gray-500">
            {index + 1} / {group.photos.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % group.photos.length)}
            className="rounded px-2 py-0.5 text-gray-700 hover:bg-gray-100"
            aria-label="Next photo"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
