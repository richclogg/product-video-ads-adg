import { ColumnName, ConfigField, ConfigGroup, ElementType } from './types';

// ── Value restriction types ──

export type ValueRestriction =
  | { type: 'enum'; values: string[] }
  | { type: 'numRange'; min: number; max: number }
  | { type: 'regex'; pattern: string }
  | { type: 'columnNames' };

// ── Enum restrictions ──

export const VALUE_RESTRICTIONS: Partial<Record<string, ValueRestriction>> = {
  [ColumnName.elementType]: {
    type: 'enum',
    values: [ElementType.text, ElementType.image],
  },
  [ColumnName.textAlignment]: {
    type: 'enum',
    values: ['left', 'center', 'right', ''],
  },
  [ColumnName.textColor]: {
    type: 'regex',
    pattern: `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\\(\\d{1,3},\\s*\\d{1,3},\\s*\\d{1,3}\\)|hsl\\(\\d{1,3},\\s*\\d{1,3}%,\\s*\\d{1,3}%\\)|$`,
  },
  [ColumnName.dataField]: { type: 'columnNames' },
  [ColumnName.keepRatio]: { type: 'enum', values: ['Yes', 'No', ''] },
  [ColumnName.removeBackground]: { type: 'enum', values: ['Yes', 'No', ''] },
  [ColumnName.zoomEffect]: { type: 'enum', values: ['in', 'out', ''] },
  [ColumnName.elementHorizontalAnchor]: {
    type: 'enum',
    values: ['left', 'center', 'right', ''],
  },
  [ColumnName.elementVerticalAnchor]: {
    type: 'enum',
    values: ['top', 'center', 'bottom', ''],
  },
  [ColumnName.relativeHorizontalAnchor]: {
    type: 'enum',
    values: ['left', 'center', 'right', ''],
  },
  [ColumnName.relativeVerticalAnchor]: {
    type: 'enum',
    values: ['top', 'center', 'bottom', ''],
  },
};

// ── Numeric range restrictions ──

const RANGE_RESTRICTIONS: [string, number, number][] = [
  [ColumnName.offsetS, 0, 3600],
  [ColumnName.durationS, 0, 3600],
  [ColumnName.placementId, 0, 1e6],
  [ColumnName.offsetX, -1e5, 1e5],
  [ColumnName.offsetY, -1e5, 1e5],
  [ColumnName.imageWidth, 0, 1e5],
  [ColumnName.imageHeight, 0, 1e5],
  [ColumnName.textSize, 1, 1000],
  [ColumnName.textWidth, 1, 1e5],
  [ColumnName.rotationAngle, 0, 360],
  [ColumnName.zoomAmount, 1, 3],
];

for (const [column, min, max] of RANGE_RESTRICTIONS) {
  VALUE_RESTRICTIONS[column] = { type: 'numRange', min, max };
}

// ── Base config structure ──

export const CONFIG_STRUCTURE: Record<ConfigGroup, ConfigField[]> = {
  [ConfigGroup.googleCloud]: [ConfigField.storageBucket],
  [ConfigGroup.merchantCenter]: [
    ConfigField.accountId,
    ConfigField.filterFeed,
  ],
  [ConfigGroup.youtube]: [ConfigField.channelId],
  [ConfigGroup.googleAds]: [ConfigField.accountId, ConfigField.campaignName],
};

// ── Default offer columns (beyond offerId) ──

export const DEFAULT_OFFER_COLUMNS = ['Title', 'Image', 'Price'];
