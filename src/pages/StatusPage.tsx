import { Link } from 'react-router-dom';

// TODO: populate from parsed GPX results — processed files, parse errors/warnings,
// total coordinate points, and Leaflet memory load.
export function StatusPage() {
  return (
    <div className="min-h-screen bg-background p-6 text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">App Status</h1>
      <table className="mt-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-gray-500">
            <th className="py-2">File</th>
            <th className="py-2">Status</th>
            <th className="py-2">Points</th>
            <th className="py-2">Warnings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="py-4 text-gray-500">
              No GPX files processed yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
