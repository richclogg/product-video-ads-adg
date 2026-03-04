import { useState } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { ColumnName, type OfferRow } from '@/lib/types';

export function OffersEditor() {
  const { config, dispatch } = useConfig();
  const [newColName, setNewColName] = useState('');

  // Build columns: offerId + user-defined columns + zoom columns
  const columns: ColumnDef[] = [
    { key: ColumnName.offerId, label: 'Offer ID' },
    ...config.offerColumns.map((col) => ({
      key: col,
      label: col,
    })),
    {
      key: ColumnName.zoomEffect,
      label: 'Zoom Effect',
      type: 'select' as const,
      options: ['in', 'out'],
    },
    {
      key: ColumnName.zoomAmount,
      label: 'Zoom Amount',
      type: 'number' as const,
      min: 1,
      max: 3,
      step: 0.1,
    },
  ];

  const addColumn = () => {
    const name = newColName.trim();
    if (!name || config.offerColumns.includes(name)) return;
    dispatch({ type: 'ADD_OFFER_COLUMN', name });
    setNewColName('');
  };

  return (
    <div className="space-y-4">
      {/* Column management */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Add data column
          </label>
          <input
            type="text"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
            placeholder="e.g. Description"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addColumn}
          disabled={!newColName.trim()}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Removable column chips */}
      {config.offerColumns.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {config.offerColumns.map((col) => (
            <span
              key={col}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
            >
              {col}
              <button
                onClick={() =>
                  dispatch({ type: 'REMOVE_OFFER_COLUMN', name: col })
                }
                className="ml-0.5 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                title={`Remove "${col}" column`}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Data table */}
      <DataTable
        columns={columns}
        rows={config.offers}
        onUpdateRow={(i, row) =>
          dispatch({ type: 'UPDATE_OFFER_ROW', index: i, payload: row as OfferRow })
        }
        onDeleteRow={(i) => dispatch({ type: 'DELETE_OFFER_ROW', index: i })}
        onAddRow={() => dispatch({ type: 'ADD_OFFER_ROW' })}
      />
    </div>
  );
}
