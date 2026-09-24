export type MarketplaceChannelId = 'ondc' | 'india_handmade' | 'gem' | 'wholesale';

export interface MarketplaceChannel {
  id: MarketplaceChannelId;
  name: string;
  shortName: string;
  badgeText: string;
  description: string;
  logoIcon: string;
  color: string;
  governmentBacked: boolean;
}

export interface QualityBadge {
  id: string;
  key: string;
  label: string;
  verified: boolean;
}

export interface StudioImage {
  originalUri: string;
  enhancedUri: string;
  aspectRatio?: number;
}

export interface VoiceNote {
  id: string;
  durationSeconds: number;
  transcriptEn: string;
  transcriptHi: string;
  transcriptPa: string;
}

export interface CraftMetadata {
  productNameEn: string;
  productNameHi: string;
  productNamePa: string;
  craftTypeEn: string;
  craftTypeHi: string;
  craftTypePa: string;
  materialEn: string;
  materialHi: string;
  materialPa: string;
  dimensions: string;
  weight: string;
  craftStoryEn: string;
  craftStoryHi: string;
  craftStoryPa: string;
}

export interface PriceBreakdown {
  suggestedPrice: number;
  userPrice: number;
  materialCost: number;
  laborHours: number;
  hourlyFairRate: number;
  platformBuffer: number;
  takeHomeProfit: number;
  profitPercentage: number;
  demandTag: string;
}

export type ProductStatus = 'draft' | 'exported';

export interface Product {
  id: string;
  catalogId: string;
  title: string;
  category: string;
  status: ProductStatus;
  createdAt: string;
  image: StudioImage;
  voiceNote: VoiceNote;
  metadata: CraftMetadata;
  pricing: PriceBreakdown;
  exportedChannels: MarketplaceChannelId[];
  qrCodeUrl: string;
}

export interface SampleCraft {
  id: string;
  title: string;
  craftType: string;
  originalImage: string;
  enhancedImage: string;
  sampleVoiceNote: VoiceNote;
  metadata: CraftMetadata;
  pricing: PriceBreakdown;
}
