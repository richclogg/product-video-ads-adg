import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  ColumnName,
  ConfigField,
  ConfigGroup,
  type AdGroupRow,
  type BaseConfig,
  type OfferRow,
  type OfferToAdGroupRow,
  type PlacementRow,
  type PvaConfig,
  type TimingRow,
} from '@/lib/types';
import { DEFAULT_OFFER_COLUMNS } from '@/lib/constants';

// ── State ──

function createEmptyConfig(): PvaConfig {
  return {
    name: 'Untitled Config',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '',
    baseConfig: {
      [ConfigGroup.googleCloud]: { [ConfigField.storageBucket]: '' },
      [ConfigGroup.merchantCenter]: {
        [ConfigField.accountId]: '',
        [ConfigField.filterFeed]: '',
      },
      [ConfigGroup.youtube]: { [ConfigField.channelId]: '' },
      [ConfigGroup.googleAds]: {
        [ConfigField.accountId]: '',
        [ConfigField.campaignName]: '',
      },
    },
    timing: [],
    placements: [],
    offers: [],
    offerColumns: [...DEFAULT_OFFER_COLUMNS],
    offersToAdGroups: [],
    adGroups: [],
  };
}

// ── Actions ──

export type ConfigAction =
  | { type: 'SET_CONFIG'; payload: PvaConfig }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'UPDATE_BASE_CONFIG'; payload: BaseConfig }
  | { type: 'SET_TIMING'; payload: TimingRow[] }
  | { type: 'ADD_TIMING_ROW' }
  | { type: 'UPDATE_TIMING_ROW'; index: number; payload: TimingRow }
  | { type: 'DELETE_TIMING_ROW'; index: number }
  | { type: 'SET_PLACEMENTS'; payload: PlacementRow[] }
  | { type: 'ADD_PLACEMENT_ROW' }
  | { type: 'UPDATE_PLACEMENT_ROW'; index: number; payload: PlacementRow }
  | { type: 'DELETE_PLACEMENT_ROW'; index: number }
  | { type: 'SET_OFFERS'; payload: OfferRow[] }
  | { type: 'ADD_OFFER_ROW' }
  | { type: 'UPDATE_OFFER_ROW'; index: number; payload: OfferRow }
  | { type: 'DELETE_OFFER_ROW'; index: number }
  | { type: 'ADD_OFFER_COLUMN'; name: string }
  | { type: 'RENAME_OFFER_COLUMN'; oldName: string; newName: string }
  | { type: 'REMOVE_OFFER_COLUMN'; name: string }
  | { type: 'SET_OFFERS_TO_ADGROUPS'; payload: OfferToAdGroupRow[] }
  | { type: 'ADD_OFFER_TO_ADGROUP_ROW' }
  | {
      type: 'UPDATE_OFFER_TO_ADGROUP_ROW';
      index: number;
      payload: OfferToAdGroupRow;
    }
  | { type: 'DELETE_OFFER_TO_ADGROUP_ROW'; index: number }
  | { type: 'SET_ADGROUPS'; payload: AdGroupRow[] }
  | { type: 'ADD_ADGROUP_ROW' }
  | { type: 'UPDATE_ADGROUP_ROW'; index: number; payload: AdGroupRow }
  | { type: 'DELETE_ADGROUP_ROW'; index: number };

// ── Reducer ──

function configReducer(state: PvaConfig, action: ConfigAction): PvaConfig {
  const updated = { ...state, updatedAt: new Date().toISOString() };

  switch (action.type) {
    case 'SET_CONFIG':
      return action.payload;

    case 'SET_NAME':
      return { ...updated, name: action.payload };

    case 'UPDATE_BASE_CONFIG':
      return { ...updated, baseConfig: action.payload };

    // ── Timing ──
    case 'SET_TIMING':
      return { ...updated, timing: action.payload };
    case 'ADD_TIMING_ROW':
      return {
        ...updated,
        timing: [
          ...state.timing,
          {
            [ColumnName.templateVideo]: '',
            [ColumnName.offsetS]: '0',
            [ColumnName.durationS]: '0',
            [ColumnName.placementId]: '1',
          },
        ],
      };
    case 'UPDATE_TIMING_ROW':
      return {
        ...updated,
        timing: state.timing.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case 'DELETE_TIMING_ROW':
      return {
        ...updated,
        timing: state.timing.filter((_, i) => i !== action.index),
      };

    // ── Placements ──
    case 'SET_PLACEMENTS':
      return { ...updated, placements: action.payload };
    case 'ADD_PLACEMENT_ROW': {
      const emptyPlacement: PlacementRow = {};
      for (const col of [
        ColumnName.placementId,
        ColumnName.elementId,
        ColumnName.elementType,
        ColumnName.dataField,
        ColumnName.relativeTo,
        ColumnName.elementHorizontalAnchor,
        ColumnName.elementVerticalAnchor,
        ColumnName.relativeHorizontalAnchor,
        ColumnName.relativeVerticalAnchor,
        ColumnName.offsetX,
        ColumnName.offsetY,
        ColumnName.rotationAngle,
        ColumnName.imageWidth,
        ColumnName.imageHeight,
        ColumnName.keepRatio,
        ColumnName.textFont,
        ColumnName.textSize,
        ColumnName.textWidth,
        ColumnName.textAlignment,
        ColumnName.textColor,
        ColumnName.removeBackground,
      ] as const) {
        emptyPlacement[col] = '';
      }
      return { ...updated, placements: [...state.placements, emptyPlacement] };
    }
    case 'UPDATE_PLACEMENT_ROW':
      return {
        ...updated,
        placements: state.placements.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case 'DELETE_PLACEMENT_ROW':
      return {
        ...updated,
        placements: state.placements.filter((_, i) => i !== action.index),
      };

    // ── Offers ──
    case 'SET_OFFERS':
      return { ...updated, offers: action.payload };
    case 'ADD_OFFER_ROW': {
      const emptyOffer: OfferRow = { [ColumnName.offerId]: '' };
      for (const col of state.offerColumns) {
        emptyOffer[col] = '';
      }
      emptyOffer[ColumnName.zoomEffect] = '';
      emptyOffer[ColumnName.zoomAmount] = '';
      return { ...updated, offers: [...state.offers, emptyOffer] };
    }
    case 'UPDATE_OFFER_ROW':
      return {
        ...updated,
        offers: state.offers.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case 'DELETE_OFFER_ROW':
      return {
        ...updated,
        offers: state.offers.filter((_, i) => i !== action.index),
      };
    case 'ADD_OFFER_COLUMN':
      return {
        ...updated,
        offerColumns: [...state.offerColumns, action.name],
        offers: state.offers.map((o) => ({ ...o, [action.name]: '' })),
      };
    case 'RENAME_OFFER_COLUMN':
      return {
        ...updated,
        offerColumns: state.offerColumns.map((c) =>
          c === action.oldName ? action.newName : c
        ),
        offers: state.offers.map((o) => {
          const next = { ...o };
          next[action.newName] = next[action.oldName] ?? '';
          delete next[action.oldName];
          return next;
        }),
      };
    case 'REMOVE_OFFER_COLUMN':
      return {
        ...updated,
        offerColumns: state.offerColumns.filter((c) => c !== action.name),
        offers: state.offers.map((o) => {
          const next = { ...o };
          delete next[action.name];
          return next;
        }),
      };

    // ── Offers to AdGroups ──
    case 'SET_OFFERS_TO_ADGROUPS':
      return { ...updated, offersToAdGroups: action.payload };
    case 'ADD_OFFER_TO_ADGROUP_ROW':
      return {
        ...updated,
        offersToAdGroups: [
          ...state.offersToAdGroups,
          { [ColumnName.offerId]: '', [ColumnName.adGroup]: '' },
        ],
      };
    case 'UPDATE_OFFER_TO_ADGROUP_ROW':
      return {
        ...updated,
        offersToAdGroups: state.offersToAdGroups.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case 'DELETE_OFFER_TO_ADGROUP_ROW':
      return {
        ...updated,
        offersToAdGroups: state.offersToAdGroups.filter(
          (_, i) => i !== action.index
        ),
      };

    // ── AdGroups ──
    case 'SET_ADGROUPS':
      return { ...updated, adGroups: action.payload };
    case 'ADD_ADGROUP_ROW': {
      const emptyAdGroup: AdGroupRow = {};
      for (const col of [
        ColumnName.adGroup,
        ColumnName.templateVideo,
        ColumnName.adGroupType,
        ColumnName.targetLocation,
        ColumnName.audienceName,
        ColumnName.url,
        ColumnName.callToAction,
        ColumnName.headline,
        ColumnName.longHeadline,
        ColumnName.description1,
        ColumnName.description2,
      ] as const) {
        emptyAdGroup[col] = '';
      }
      return { ...updated, adGroups: [...state.adGroups, emptyAdGroup] };
    }
    case 'UPDATE_ADGROUP_ROW':
      return {
        ...updated,
        adGroups: state.adGroups.map((r, i) =>
          i === action.index ? action.payload : r
        ),
      };
    case 'DELETE_ADGROUP_ROW':
      return {
        ...updated,
        adGroups: state.adGroups.filter((_, i) => i !== action.index),
      };

    default:
      return state;
  }
}

// ── Context ──

interface ConfigState {
  config: PvaConfig;
  dispatch: Dispatch<ConfigAction>;
}

const ConfigContext = createContext<ConfigState | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  initialConfig?: PvaConfig;
}

export function ConfigProvider({ children, initialConfig }: ConfigProviderProps) {
  const [config, dispatch] = useReducer(
    configReducer,
    initialConfig ?? createEmptyConfig()
  );

  return (
    <ConfigContext.Provider value={{ config, dispatch }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigState {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
