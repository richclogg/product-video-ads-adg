import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listConfigs, deleteConfig } from '@/lib/firestoreService';
import type { PvaConfig } from '@/lib/types';

interface ConfigListPageProps {
  onSelect: (config: PvaConfig) => void;
  onNew: () => void;
}

export function ConfigListPage({ onSelect, onNew }: ConfigListPageProps) {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<PvaConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const list = await listConfigs(user.uid);
    setConfigs(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this config?')) return;
    await deleteConfig(id);
    await refresh();
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Saved Configs</h1>
        <button
          onClick={onNew}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          New Config
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : configs.length === 0 ? (
        <p className="text-sm text-gray-500">
          No saved configs yet. Create one to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {configs.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <button
                onClick={() => onSelect(c)}
                className="flex-1 text-left"
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">
                  {c.adGroups.length} ad groups &middot; {c.offers.length}{' '}
                  offers &middot; Updated{' '}
                  {typeof c.updatedAt === 'string'
                    ? new Date(c.updatedAt).toLocaleDateString()
                    : 'recently'}
                </div>
              </button>
              <button
                onClick={() => c.id && handleDelete(c.id)}
                className="ml-4 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                title="Delete"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
