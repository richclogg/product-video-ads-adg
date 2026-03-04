import {
  ColumnName,
  ElementType,
  JsonFieldName,
  type AdGroupRow,
  type OfferRow,
  type OfferToAdGroupRow,
  type PlacementRow,
  type TimingRow,
  type VideoConfigOutput,
} from './types';
import { deriveFieldKey, hasDuplicates } from './utils';

// ── Element property config (mirrors appsscript/src/videoRequest.ts) ──

const ELEMENT_PROPERTY_CONFIG = {
  [ElementType.text]: {
    stringProps: [
      ColumnName.textFont,
      ColumnName.textAlignment,
      ColumnName.textColor,
    ],
    floatProps: [ColumnName.textSize, ColumnName.textWidth],
    specialValue: { key: JsonFieldName.textValue, source: 'offer' as const },
  },
  [ElementType.image]: {
    stringProps: [ColumnName.removeBackground, ColumnName.keepRatio],
    floatProps: [ColumnName.imageWidth, ColumnName.imageHeight],
    specialValue: { key: JsonFieldName.imageUrl, source: 'offer' as const },
  },
};

// ── Placement builder ──

function getPlacement(
  placementRecord: PlacementRow,
  offer: OfferRow
): { placement?: Record<string, string | number>; error?: string } {
  const dataField = placementRecord[ColumnName.dataField]!;
  const elementType = placementRecord[ColumnName.elementType] as ElementType;

  if (!offer[dataField]) {
    return { error: `Referenced field absent: "${dataField}"` };
  }

  const placement: Record<string, string | number> = {
    [deriveFieldKey(ColumnName.offsetX)]:
      parseFloat(placementRecord[ColumnName.offsetX]!) || 0,
    [deriveFieldKey(ColumnName.offsetY)]:
      parseFloat(placementRecord[ColumnName.offsetY]!) || 0,
    [deriveFieldKey(ColumnName.rotationAngle)]:
      parseFloat(placementRecord[ColumnName.rotationAngle]!) || 0,
    [deriveFieldKey(ColumnName.elementId)]:
      placementRecord[ColumnName.elementId]!,
    [deriveFieldKey(ColumnName.relativeTo)]:
      placementRecord[ColumnName.relativeTo]!,
    [deriveFieldKey(ColumnName.elementHorizontalAnchor)]:
      placementRecord[ColumnName.elementHorizontalAnchor]!,
    [deriveFieldKey(ColumnName.elementVerticalAnchor)]:
      placementRecord[ColumnName.elementVerticalAnchor]!,
    [deriveFieldKey(ColumnName.relativeHorizontalAnchor)]:
      placementRecord[ColumnName.relativeHorizontalAnchor]!,
    [deriveFieldKey(ColumnName.relativeVerticalAnchor)]:
      placementRecord[ColumnName.relativeVerticalAnchor]!,
  };

  const config = ELEMENT_PROPERTY_CONFIG[elementType];
  if (!config) {
    return { error: `Unknown element type: "${elementType}"` };
  }

  if (config.specialValue.source === 'offer') {
    placement[config.specialValue.key] = offer[dataField]!;
  }

  for (const prop of config.stringProps) {
    placement[deriveFieldKey(prop)] = placementRecord[prop] ?? '';
  }

  for (const prop of config.floatProps) {
    placement[deriveFieldKey(prop)] =
      parseFloat(placementRecord[prop]!) || 0;
  }

  // Zoom settings from offer (images only)
  if (elementType === ElementType.image) {
    if (offer[ColumnName.zoomEffect]) {
      placement[deriveFieldKey(ColumnName.zoomEffect)] =
        offer[ColumnName.zoomEffect]!;
    }
    if (offer[ColumnName.zoomAmount]) {
      placement[deriveFieldKey(ColumnName.zoomAmount)] =
        parseFloat(offer[ColumnName.zoomAmount]!) || 0;
    }
  }

  return { placement };
}

// ── Main config assembly ──

export interface GenerateConfigInput {
  adGroups: AdGroupRow[];
  timing: TimingRow[];
  placements: PlacementRow[];
  offers: OfferRow[];
  offersToAdGroups: OfferToAdGroupRow[];
}

export interface GenerateConfigResult {
  configs: VideoConfigOutput[];
  errors: Record<string, string>;
}

/**
 * Port of getConfigForUpload from appsscript/src/videoRequest.ts.
 * Assembles the JSON config array from all entity data.
 */
export function generateConfig(
  input: GenerateConfigInput
): GenerateConfigResult {
  const errors: Record<string, string> = {};

  // Index offers by ID for fast lookup
  const offersById: Record<string, OfferRow> = {};
  for (const offer of input.offers) {
    offersById[offer[ColumnName.offerId]!] = offer;
  }

  const configs: VideoConfigOutput[] = [];

  for (const adGroupRecord of input.adGroups) {
    const adGroup = adGroupRecord[ColumnName.adGroup]!;
    const templateVideo = adGroupRecord[ColumnName.templateVideo]!;

    // Find offers mapped to this ad group
    const offerIds = input.offersToAdGroups
      .filter((e) => e[ColumnName.adGroup] === adGroup)
      .map((e) => e[ColumnName.offerId]);

    // Find timing records for this template video
    const timingRecords = input.timing.filter(
      (e) => e[ColumnName.templateVideo] === templateVideo
    );

    if (timingRecords.length !== offerIds.length) {
      errors[adGroup] =
        `Offer mismatch: has ${offerIds.length}, needs ${timingRecords.length}`;
      continue;
    }

    if (hasDuplicates(offerIds)) {
      errors[adGroup] = 'Redundant offers referenced';
      continue;
    }

    let hasError = false;
    const timings = [];

    for (let i = 0; i < timingRecords.length; i++) {
      const timingRecord = timingRecords[i]!;
      const offerId = offerIds[i]!;
      const offer = offersById[offerId];

      if (!offer) {
        errors[adGroup] = `Offer referenced but absent: "${offerId}"`;
        hasError = true;
        break;
      }

      const placementId = timingRecord[ColumnName.placementId];
      const placementRecords = input.placements.filter(
        (e) => e[ColumnName.placementId] === placementId
      );

      const placementsForTiming = [];
      for (const placementRecord of placementRecords) {
        const result = getPlacement(placementRecord, offer);
        if (result.error) {
          errors[adGroup] = result.error;
          hasError = true;
          break;
        }
        placementsForTiming.push(result.placement!);
      }

      if (hasError) break;

      timings.push({
        offset_s: parseFloat(timingRecord[ColumnName.offsetS]),
        duration_s: parseFloat(timingRecord[ColumnName.durationS]),
        placements: placementsForTiming,
      });
    }

    if (hasError) continue;

    configs.push({
      [deriveFieldKey(ColumnName.adGroup)]: adGroup,
      [deriveFieldKey(ColumnName.templateVideo)]: templateVideo,
      content: timings,
    } as VideoConfigOutput);
  }

  return { configs, errors };
}
