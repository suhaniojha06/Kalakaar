import { Product } from '../types/product';
import { SAMPLE_CRAFTS } from './sampleCrafts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    catalogId: 'KLK-2026-9042',
    title: 'GI Hand-Block Machilipatnam Kalamkari Natural Silk Fabric',
    category: 'Kalamkari Heritage',
    status: 'exported',
    createdAt: '23 Sep 2026',
    image: {
      originalUri: SAMPLE_CRAFTS[0].originalImage,
      enhancedUri: SAMPLE_CRAFTS[0].enhancedImage,
    },
    voiceNote: SAMPLE_CRAFTS[0].sampleVoiceNote,
    metadata: SAMPLE_CRAFTS[0].metadata,
    pricing: {
      ...SAMPLE_CRAFTS[0].pricing,
      userPrice: 2450,
    },
    exportedChannels: ['ondc', 'india_handmade', 'gem'],
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://kalakar.art/catalog/KLK-2026-9042',
  },
  {
    id: 'prod-002',
    catalogId: 'KLK-2026-8819',
    title: 'Natural Terracotta Clay Earthenware Handi',
    category: 'Earthen Pottery',
    status: 'exported',
    createdAt: '19 Sep 2026',
    image: {
      originalUri: SAMPLE_CRAFTS[2].originalImage,
      enhancedUri: SAMPLE_CRAFTS[2].enhancedImage,
    },
    voiceNote: SAMPLE_CRAFTS[2].sampleVoiceNote,
    metadata: SAMPLE_CRAFTS[2].metadata,
    pricing: {
      ...SAMPLE_CRAFTS[2].pricing,
      userPrice: 750,
    },
    exportedChannels: ['ondc', 'india_handmade'],
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://kalakar.art/catalog/KLK-2026-8819',
  },
  {
    id: 'prod-003',
    catalogId: 'KLK-2026-7640',
    title: 'Jaipur Handcrafted Blue Pottery Floral Table Vase',
    category: 'Blue Pottery',
    status: 'draft',
    createdAt: '15 Sep 2026',
    image: {
      originalUri: SAMPLE_CRAFTS[3].originalImage,
      enhancedUri: SAMPLE_CRAFTS[3].enhancedImage,
    },
    voiceNote: SAMPLE_CRAFTS[3].sampleVoiceNote,
    metadata: SAMPLE_CRAFTS[3].metadata,
    pricing: {
      ...SAMPLE_CRAFTS[3].pricing,
      userPrice: 1250,
    },
    exportedChannels: [],
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://kalakar.art/draft/KLK-2026-7640',
  },
];
