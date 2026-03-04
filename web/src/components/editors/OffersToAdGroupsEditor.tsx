import { useConfig } from '@/context/ConfigContext';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import { ColumnName, type OfferToAdGroupRow } from '@/lib/types';

export function OffersToAdGroupsEditor() {
  const { config, dispatch } = useConfig();

  // Build dropdown options from existing data
  const offerIds = config.offers.map((o) => o[ColumnName.offerId] ?? '').filter(Boolean);
  const adGroupNames = config.adGroups.map((a) => a[ColumnName.adGroup] ?? '').filter(Boolean);

  const columns: ColumnDef[] = [
    {
      key: ColumnName.offerId,
      label: 'Offer ID',
      type: 'select',
      options: offerIds,
    },
    {
      key: ColumnName.adGroup,
      label: 'Ad Group',
      type: 'select',
      options: adGroupNames,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={config.offersToAdGroups}
      onUpdateRow={(i, row) =>
        dispatch({
          type: 'UPDATE_OFFER_TO_ADGROUP_ROW',
          index: i,
          payload: row as OfferToAdGroupRow,
        })
      }
      onDeleteRow={(i) =>
        dispatch({ type: 'DELETE_OFFER_TO_ADGROUP_ROW', index: i })
      }
      onAddRow={() => dispatch({ type: 'ADD_OFFER_TO_ADGROUP_ROW' })}
    />
  );
}
