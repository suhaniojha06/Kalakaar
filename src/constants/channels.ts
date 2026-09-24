import { MarketplaceChannel } from '../types/product';
import { COLORS } from './colors';

export const MARKETPLACE_CHANNELS: MarketplaceChannel[] = [
  {
    id: 'ondc',
    name: 'ONDC Network',
    shortName: 'ONDC',
    badgeText: 'Direct to 50Cr+ Buyers',
    description: 'Open Network for Digital Commerce — Sell directly across Paytm, Mystore & Pincode without heavy platform fees.',
    logoIcon: 'globe-outline',
    color: COLORS.ondcBlue,
    governmentBacked: true,
  },
  {
    id: 'india_handmade',
    name: 'IndiaHandmade Portal',
    shortName: 'IndiaHandmade',
    badgeText: 'Min. of Textiles',
    description: 'Official Government of India handicraft portal — Zero commission sales backed by the Ministry of Textiles.',
    logoIcon: 'ribbon-outline',
    color: COLORS.indiaHandmadePink,
    governmentBacked: true,
  },
  {
    id: 'gem',
    name: 'GeM (Govt e-Marketplace)',
    shortName: 'GeM Portal',
    badgeText: 'Govt & PSU Orders',
    description: 'Direct procurement channel for all Central Ministries, State Governments, and public sector units.',
    logoIcon: 'business-outline',
    color: COLORS.gemGreen,
    governmentBacked: true,
  },
  {
    id: 'wholesale',
    name: 'Craft & B2B Wholesale',
    shortName: 'B2B Wholesale',
    badgeText: 'Bulk Exporters',
    description: 'Connect with verified boutique buyers, luxury hotel chains, and overseas fair-trade craft exporters.',
    logoIcon: 'storefront-outline',
    color: COLORS.b2bAmber,
    governmentBacked: false,
  },
];
