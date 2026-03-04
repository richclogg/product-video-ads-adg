import { useConfig } from '@/context/ConfigContext';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { ColumnName, type TimingRow } from '@/lib/types';

const COLUMNS: ColumnDef[] = [
  { key: ColumnName.templateVideo, label: 'Template Video' },
  { key: ColumnName.offsetS, label: 'Offset [s]', type: 'number', min: 0, max: 3600 },
  { key: ColumnName.durationS, label: 'Duration [s]', type: 'number', min: 0, max: 3600 },
  { key: ColumnName.placementId, label: 'Placement ID', type: 'number', min: 0 },
];

export function TimingEditor() {
  const { config, dispatch } = useConfig();

  return (
    <DataTable
      columns={COLUMNS}
      rows={config.timing}
      onUpdateRow={(i, row) =>
        dispatch({ type: 'UPDATE_TIMING_ROW', index: i, payload: row as TimingRow })
      }
      onDeleteRow={(i) => dispatch({ type: 'DELETE_TIMING_ROW', index: i })}
      onAddRow={() => dispatch({ type: 'ADD_TIMING_ROW' })}
    />
  );
}
