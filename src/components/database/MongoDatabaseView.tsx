
import React, { useEffect, useState } from 'react';
import {
  Database,
  HardDrive,
  Server,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface CollectionInfo {
  name: string;
  count: number;
  sizeBytes?: number;
  indexes?: string[];
}

interface DatabaseStats {
  connected: boolean;
  databaseName: string;
  storageSizeBytes?: number;
  collections: CollectionInfo[];
}

interface DatabaseStatsResponse {
  success: boolean;
  stats?: DatabaseStats;
  error?: string;
}

export const MongoDatabaseView: React.FC = () => {
  const [data, setData] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/database/stats');

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }

      const result: DatabaseStatsResponse = await response.json();

      if (!result.success || !result.stats) {
        throw new Error(
          result.error || 'Database statistics are unavailable.'
        );
      }

      setData(result.stats);
    } catch (err: unknown) {
      setData(null);

      setError(
        err instanceof Error
          ? err.message
          : 'Could not load database statistics.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined || !Number.isFinite(bytes)) {
      return 'Unavailable';
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            MongoDB Cluster &amp; Collections View
          </h1>

          <p className="text-xs text-slate-500">
            Live database statistics retrieved from the backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStats()}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Loading database statistics...
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2 font-semibold">
            <XCircle className="w-4 h-4" />
            Database statistics unavailable
          </div>

          <p className="mt-2">{error}</p>

          <p className="mt-1">
            Check the backend endpoint and MongoDB connection.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <Server className="w-8 h-8 text-blue-600" />

          <div>
            <div className="text-xs font-bold text-slate-800">
              Cluster Status
            </div>

            <div
              className={`text-xs font-semibold flex items-center gap-1 ${
                data?.connected
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            >
              {data?.connected ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}

              {data?.connected ? 'Connected' : 'Not confirmed'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <HardDrive className="w-8 h-8 text-indigo-600" />

          <div>
            <div className="text-xs font-bold text-slate-800">
              Storage Usage
            </div>

            <div className="text-xs text-slate-500">
              {formatBytes(data?.storageSizeBytes)}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <Database className="w-8 h-8 text-emerald-600" />

          <div>
            <div className="text-xs font-bold text-slate-800">
              Database Name
            </div>

            <div className="text-xs font-mono text-slate-600">
              {data?.databaseName || 'Unavailable'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-3">Collection</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Data Size</th>
              <th className="p-3">Indexes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-mono">
            {data?.collections.map((collection) => (
              <tr
                key={collection.name}
                className="hover:bg-slate-50"
              >
                <td className="p-3 font-bold text-slate-900">
                  {collection.name}
                </td>

                <td className="p-3">
                  {collection.count.toLocaleString()}
                </td>

                <td className="p-3">
                  {formatBytes(collection.sizeBytes)}
                </td>

                <td className="p-3 text-slate-400 text-[11px]">
                  {collection.indexes?.join(', ') || 'Unavailable'}
                </td>
              </tr>
            ))}

            {!loading && data && data.collections.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-slate-500"
                >
                  No collections found in this database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
