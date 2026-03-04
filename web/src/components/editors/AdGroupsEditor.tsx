import { useConfig } from '@/context/ConfigContext';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { ColumnName, type AdGroupRow } from '@/lib/types';

const COLUMNS: ColumnDef[] = [
  { key: ColumnName.adGroup, label: 'Ad Group' },
  { key: ColumnName.templateVideo, label: 'Template Video' },
  { key: ColumnName.adGroupType, label: 'Type' },
  { key: ColumnName.targetLocation, label: 'Location' },
  { key: ColumnName.audienceName, label: 'Audience' },
  { key: ColumnName.url, label: 'URL' },
  { key: ColumnName.callToAction, label: 'Call to Action' },
  { key: ColumnName.headline, label: 'Headline' },
  { key: ColumnName.longHeadline, label: 'Long Headline' },
  { key: ColumnName.description1, label: 'Description 1' },
  { key: ColumnName.description2, label: 'Description 2' },
];

export function AdGroupsEditor() {
  const { config, dispatch } = useConfig();

  return (
    <DataTable
      columns={COLUMNS}
      rows={config.adGroups}
      onUpdateRow={(i, row) =>
        dispatch({
          type: 'UPDATE_ADGROUP_ROW',
          index: i,
          payload: row as AdGroupRow,
        })
      }
      onDeleteRow={(i) => dispatch({ type: 'DELETE_ADGROUP_ROW', index: i })}
      onAddRow={() => dispatch({ type: 'ADD_ADGROUP_ROW' })}
    />
  );
}
