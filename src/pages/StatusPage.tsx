import { Link } from 'react-router-dom';
import { useGpxStatus } from '../hooks/useGpxStatus';
import { formatNumber } from '../utils/format';
import { Card } from '../components/common/Card';

export function StatusPage() {
  const { processedFiles } = useGpxStatus();
  const entries = Object.values(processedFiles).sort((a, b) => b.processedAt - a.processedAt);
  const totalPoints = entries.reduce((sum, entry) => sum + entry.pointCount, 0);
  const filesWithErrors = entries.filter((entry) => entry.errors.length > 0).length;

  return (
    <div className="min-h-screen bg-background p-6 text-gray-900 dark:text-gray-100">
      <Link to="/" className="text-sm text-accent hover:underline">
        &larr; Back to viewer
      </Link>
      <h1 className="mt-4 text-xl font-semibold">App Status</h1>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card title="Files Processed">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatNumber(entries.length)}
          </p>
        </Card>
        <Card title="Points in Memory">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatNumber(totalPoints)}
          </p>
        </Card>
        <Card title="Files with Errors">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatNumber(filesWithErrors)}
          </p>
        </Card>
      </div>

      <table className="mt-6 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-gray-500">
            <th className="py-2">File</th>
            <th className="py-2">Status</th>
            <th className="py-2">Points</th>
            <th className="py-2">Waypoints</th>
            <th className="py-2">Warnings</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-gray-500">
                No GPX files processed yet — toggle a route visible or select one in the sidebar.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.file} className="border-b border-border/50">
                <td className="py-2 font-mono text-xs">{entry.file}</td>
                <td className="py-2">
                  {entry.errors.length > 0 ? (
                    <span className="text-red-400">Error</span>
                  ) : (
                    <span className="text-green-400">OK</span>
                  )}
                </td>
                <td className="py-2">{formatNumber(entry.pointCount)}</td>
                <td className="py-2">{formatNumber(entry.waypointCount)}</td>
                <td className="py-2 text-gray-600 dark:text-gray-400">
                  {entry.errors.join('; ') || '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
