import { type ValueRestriction, VALUE_RESTRICTIONS } from '@/lib/constants';
import { validateValue } from '@/lib/validation';

export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'color';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  hidden?: (row: Record<string, string>) => boolean;
}

interface DataTableProps {
  columns: ColumnDef[];
  rows: Record<string, string>[];
  onUpdateRow: (index: number, row: Record<string, string>) => void;
  onDeleteRow: (index: number) => void;
  onAddRow: () => void;
  offerColumns?: string[];
}

function getColumnType(col: ColumnDef): ColumnDef['type'] {
  if (col.type) return col.type;
  const restriction = VALUE_RESTRICTIONS[col.key] as ValueRestriction | undefined;
  if (!restriction) return 'text';
  switch (restriction.type) {
    case 'enum':
      return 'select';
    case 'numRange':
      return 'number';
    case 'regex':
      if (col.key.toLowerCase().includes('color')) return 'color';
      return 'text';
    default:
      return 'text';
  }
}

function getOptions(col: ColumnDef): string[] {
  if (col.options) return col.options;
  const restriction = VALUE_RESTRICTIONS[col.key] as ValueRestriction | undefined;
  if (restriction?.type === 'enum') return restriction.values;
  return [];
}

export function DataTable({
  columns,
  rows,
  onUpdateRow,
  onDeleteRow,
  onAddRow,
  offerColumns,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-2 py-2 text-xs font-medium text-gray-500">#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-2 py-2 text-xs font-medium text-gray-500"
              >
                {col.label}
              </th>
            ))}
            <th className="px-2 py-2 text-xs font-medium text-gray-500" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-2 py-1 text-xs text-gray-400">{rowIdx + 1}</td>
              {columns.map((col) => {
                const isHidden = col.hidden?.(row);
                const cellType = getColumnType(col);
                const error = validateValue(col.key, row[col.key] ?? '', offerColumns);

                return (
                  <td key={col.key} className="px-1 py-1">
                    {isHidden ? (
                      <span className="text-xs text-gray-300">—</span>
                    ) : (
                      <CellEditor
                        type={cellType ?? 'text'}
                        value={row[col.key] ?? ''}
                        options={getOptions(col)}
                        error={error}
                        onChange={(val) =>
                          onUpdateRow(rowIdx, { ...row, [col.key]: val })
                        }
                      />
                    )}
                  </td>
                );
              })}
              <td className="px-2 py-1">
                <button
                  onClick={() => onDeleteRow(rowIdx)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete row"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onAddRow}
        className="mt-2 rounded-md border border-dashed border-gray-300 px-4 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
      >
        + Add row
      </button>
    </div>
  );
}

// ── Inline cell editor ──

interface CellEditorProps {
  type: 'text' | 'number' | 'select' | 'color';
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}

function CellEditor({ type, value, options, error, onChange }: CellEditorProps) {
  const base = `w-full rounded border px-2 py-1 text-sm ${
    error
      ? 'border-red-300 bg-red-50'
      : 'border-gray-200 focus:border-blue-400'
  } focus:outline-none`;

  if (type === 'select') {
    return (
      <div className="group relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
          title={error}
        >
          <option value="">—</option>
          {options
            .filter((o) => o !== '')
            .map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
        </select>
        {error && (
          <div className="absolute left-0 top-full z-10 mt-1 hidden whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white group-hover:block">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="group relative flex gap-1">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border border-gray-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} flex-1`}
          title={error}
        />
        {error && (
          <div className="absolute left-0 top-full z-10 mt-1 hidden whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white group-hover:block">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={base}
        title={error}
      />
      {error && (
        <div className="absolute left-0 top-full z-10 mt-1 hidden whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white group-hover:block">
          {error}
        </div>
      )}
    </div>
  );
}
