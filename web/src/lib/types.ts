// ── Enums (ported from appsscript/src/structure.ts) ──

export enum ColumnName {
  adGroup = 'Output AdGroup',
  adGroupType = 'AdGroup Type',
  adsCreation = 'Ad Creation',
  audienceName = 'Audience Name',
  callToAction = 'Call to Action',
  contentChecksum = 'Content Checksum',
  checksumCreation = 'Checksum Creation',
  dataField = 'Data Field',
  description1 = 'Description 1',
  description2 = 'Description 2',
  durationS = 'Duration [s]',
  elementType = 'Element Type',
  elementId = 'Element ID',
  errors = 'Error(s)',
  expectedStatus = 'Expected Status',
  gcsFolder = 'Folder Name',
  headline = 'Headline',
  longHeadline = 'Long Headline',
  imageWidth = 'Image Width',
  imageHeight = 'Image Height',
  keepRatio = 'Keep Image Ratio',
  removeBackground = 'Remove Background',
  zoomEffect = 'Zoom Effect',
  zoomAmount = 'Zoom Amount',
  offerId = 'Offer ID',
  offsetS = 'Offset [s]',
  outputVideoId = 'Output Video ID',
  placementId = 'Placement ID',
  offsetX = 'Offset X',
  offsetY = 'Offset Y',
  relativeTo = 'Relative To',
  elementHorizontalAnchor = 'Element Horizontal Anchor',
  elementVerticalAnchor = 'Element Vertical Anchor',
  relativeHorizontalAnchor = 'Relative Horizontal Anchor',
  relativeVerticalAnchor = 'Relative Vertical Anchor',
  targetLocation = 'Target Location',
  templateVideo = 'Template Video',
  textAlignment = 'Text Alignment',
  rotationAngle = 'Rotation Angle',
  textColor = 'Text Color',
  textFont = 'Text Font',
  textSize = 'Text Size',
  textWidth = 'Text Width',
  url = 'URL',
  videoCreation = 'Video Creation',
}

export enum ConfigGroup {
  googleCloud = 'Google Cloud',
  merchantCenter = 'Google Merchant Center',
  youtube = 'YouTube',
  googleAds = 'Google Ads',
}

export enum ConfigField {
  accountId = 'Account ID',
  campaignName = 'Campaign Name',
  channelId = 'Channel ID',
  filterFeed = 'Feed Filtering',
  storageBucket = 'Storage Bucket',
}

export enum ElementType {
  text = 'Text',
  image = 'Image',
}

export enum StatusOption {
  enabled = 'ENABLED',
  disabled = 'DISABLED',
}

export enum JsonFieldName {
  textValue = 'text_value',
  imageUrl = 'image_url',
  content = 'content',
  placements = 'placements',
  videoId = 'video_id',
  youtubeChannelId = 'youtube_channel_id',
  youtubeAuthToken = 'youtube_auth_token',
}

// ── Table column definitions ──

export const TIMING_COLUMNS = [
  ColumnName.templateVideo,
  ColumnName.offsetS,
  ColumnName.durationS,
  ColumnName.placementId,
] as const;

export const PLACEMENT_COLUMNS = [
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
] as const;

export const ADGROUP_COLUMNS = [
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
] as const;

export const OFFERS_TO_ADGROUPS_COLUMNS = [
  ColumnName.offerId,
  ColumnName.adGroup,
] as const;

// Columns that can be omitted depending on element type
export const CONDITIONALLY_OMITTABLE: Record<
  string,
  Record<string, ColumnName[]>
> = {
  [ColumnName.elementType]: {
    [ElementType.text]: [ColumnName.imageWidth, ColumnName.imageHeight],
    [ElementType.image]: [
      ColumnName.textFont,
      ColumnName.textSize,
      ColumnName.textWidth,
      ColumnName.textAlignment,
      ColumnName.textColor,
    ],
  },
};

// ── Data model types ──

export interface BaseConfig {
  [ConfigGroup.googleCloud]: Partial<Record<ConfigField, string>>;
  [ConfigGroup.merchantCenter]: Partial<Record<ConfigField, string>>;
  [ConfigGroup.youtube]: Partial<Record<ConfigField, string>>;
  [ConfigGroup.googleAds]: Partial<Record<ConfigField, string>>;
}

export interface TimingRow {
  [ColumnName.templateVideo]: string;
  [ColumnName.offsetS]: string;
  [ColumnName.durationS]: string;
  [ColumnName.placementId]: string;
  [key: string]: string;
}

export interface PlacementRow {
  [key: string]: string;
}

export interface OfferRow {
  [key: string]: string;
}

export interface OfferToAdGroupRow {
  [ColumnName.offerId]: string;
  [ColumnName.adGroup]: string;
  [key: string]: string;
}

export interface AdGroupRow {
  [key: string]: string;
}

export interface PvaConfig {
  id?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  baseConfig: BaseConfig;
  timing: TimingRow[];
  placements: PlacementRow[];
  offers: OfferRow[];
  offerColumns: string[];
  offersToAdGroups: OfferToAdGroupRow[];
  adGroups: AdGroupRow[];
}

// ── JSON output types (what the backend expects) ──

export interface PlacementOutput {
  [key: string]: string | number;
}

export interface TimingOutput {
  offset_s: number;
  duration_s: number;
  placements: PlacementOutput[];
}

export interface VideoConfigOutput {
  ad_group: string;
  template_video: string;
  content: TimingOutput[];
  [key: string]: unknown;
}
