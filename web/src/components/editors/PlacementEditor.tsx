import { useConfig } from '@/context/ConfigContext';
import { DataTable, type ColumnDef } from '@/components/shared/DataTable';
import {
  ColumnName,
  ElementType,
  CONDITIONALLY_OMITTABLE,
  type PlacementRow,
} from '@/lib/types';

function isHiddenForElementType(
  columnKey: string,
  row: Record<string, string>
): boolean {
  const elementType = row[ColumnName.elementType] ?? '';
  const omittable = CONDITIONALLY_OMITTABLE[ColumnName.elementType];
  if (!omittable) return false;
  const cols = omittable[elementType];
  if (!cols) return false;
  return cols.includes(columnKey as ColumnName);
}

const COLUMNS: ColumnDef[] = [
  // Identity
  { key: ColumnName.placementId, label: 'Placement ID', type: 'number', min: 0 },
  { key: ColumnName.elementId, label: 'Element ID' },
  {
    key: ColumnName.elementType,
    label: 'Element Type',
    type: 'select',
    options: [ElementType.text, ElementType.image],
  },
  { key: ColumnName.dataField, label: 'Data Field' },
  // Position & Anchors
  { key: ColumnName.relativeTo, label: 'Relative To' },
  {
    key: ColumnName.elementHorizontalAnchor,
    label: 'Elem H Anchor',
    type: 'select',
    options: ['left', 'center', 'right'],
  },
  {
    key: ColumnName.elementVerticalAnchor,
    label: 'Elem V Anchor',
    type: 'select',
    options: ['top', 'center', 'bottom'],
  },
  {
    key: ColumnName.relativeHorizontalAnchor,
    label: 'Rel H Anchor',
    type: 'select',
    options: ['left', 'center', 'right'],
  },
  {
    key: ColumnName.relativeVerticalAnchor,
    label: 'Rel V Anchor',
    type: 'select',
    options: ['top', 'center', 'bottom'],
  },
  { key: ColumnName.offsetX, label: 'Offset X', type: 'number' },
  { key: ColumnName.offsetY, label: 'Offset Y', type: 'number' },
  { key: ColumnName.rotationAngle, label: 'Rotation', type: 'number', min: 0, max: 360 },
  // Image properties (hidden for Text)
  {
    key: ColumnName.imageWidth,
    label: 'Image Width',
    type: 'number',
    hidden: (row) => isHiddenForElementType(ColumnName.imageWidth, row),
  },
  {
    key: ColumnName.imageHeight,
    label: 'Image Height',
    type: 'number',
    hidden: (row) => isHiddenForElementType(ColumnName.imageHeight, row),
  },
  {
    key: ColumnName.keepRatio,
    label: 'Keep Ratio',
    type: 'select',
    options: ['Yes', 'No'],
    hidden: (row) =>
      row[ColumnName.elementType] === ElementType.text,
  },
  // Text properties (hidden for Image)
  {
    key: ColumnName.textFont,
    label: 'Text Font',
    hidden: (row) => isHiddenForElementType(ColumnName.textFont, row),
  },
  {
    key: ColumnName.textSize,
    label: 'Text Size',
    type: 'number',
    min: 1,
    max: 1000,
    hidden: (row) => isHiddenForElementType(ColumnName.textSize, row),
  },
  {
    key: ColumnName.textWidth,
    label: 'Text Width',
    type: 'number',
    hidden: (row) => isHiddenForElementType(ColumnName.textWidth, row),
  },
  {
    key: ColumnName.textAlignment,
    label: 'Text Align',
    type: 'select',
    options: ['left', 'center', 'right'],
    hidden: (row) => isHiddenForElementType(ColumnName.textAlignment, row),
  },
  {
    key: ColumnName.textColor,
    label: 'Text Color',
    type: 'color',
    hidden: (row) => isHiddenForElementType(ColumnName.textColor, row),
  },
  // Other
  {
    key: ColumnName.removeBackground,
    label: 'Remove BG',
    type: 'select',
    options: ['Yes', 'No'],
    hidden: (row) =>
      row[ColumnName.elementType] === ElementType.text,
  },
];

export function PlacementEditor() {
  const { config, dispatch } = useConfig();

  return (
    <DataTable
      columns={COLUMNS}
      rows={config.placements}
      onUpdateRow={(i, row) =>
        dispatch({
          type: 'UPDATE_PLACEMENT_ROW',
          index: i,
          payload: row as PlacementRow,
        })
      }
      onDeleteRow={(i) => dispatch({ type: 'DELETE_PLACEMENT_ROW', index: i })}
      onAddRow={() => dispatch({ type: 'ADD_PLACEMENT_ROW' })}
      offerColumns={config.offerColumns}
    />
  );
}
