import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { Product } from '../../types/product';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { MARKETPLACE_CHANNELS } from '../../constants/channels';
import { AudioButton } from '../common/AudioButton';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currentLanguage } = useLanguage();
  const { playingAudioId, toggleAudioPlayback, resumeDraft } = useProduct();

  const isExported = product.status === 'exported';

  const title =
    currentLanguage === 'hi'
      ? product.metadata.productNameHi
      : currentLanguage === 'pa'
      ? product.metadata.productNamePa
      : product.metadata.productNameEn || product.title;

  const craftType =
    currentLanguage === 'hi'
      ? product.metadata.craftTypeHi
      : currentLanguage === 'pa'
      ? product.metadata.craftTypePa
      : product.metadata.craftTypeEn || product.category;

  // Find channels for badges
  const exportedChannelDetails = MARKETPLACE_CHANNELS.filter((c) =>
    product.exportedChannels.includes(c.id)
  );

  return (
    <View style={styles.cardContainer}>
      {/* Top Image Container with Clean Aspect Ratio (16:10 / 4:3 fit) */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image.enhancedUri }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Status Pill on top left */}
        <View
          style={[
            styles.statusBanner,
            isExported ? styles.statusExported : styles.statusDraft,
          ]}
        >
          <Ionicons
            name={isExported ? 'checkmark-circle' : 'time-outline'}
            size={14}
            color={COLORS.textInverse}
          />
          <Text style={styles.statusBannerText}>
            {isExported ? 'Live on Portals' : 'Draft in Progress'}
          </Text>
        </View>

        {/* Catalog ID on top right */}
        <View style={styles.catalogIdPill}>
          <Text style={styles.catalogIdText}>{product.catalogId}</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Craft Tag & Date */}
        <View style={styles.metaRow}>
          <Badge
            label={craftType}
            iconName="ribbon-outline"
            variant="channel"
            size="sm"
          />
          <Text style={styles.dateText}>{product.createdAt}</Text>
        </View>

        {/* Product Title */}
        <Text style={styles.productTitle} numberOfLines={2}>
          {title}
        </Text>

        {/* Price & Artisan Margin Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Retail Price</Text>
            <Text style={styles.priceAmount}>
              ₹{product.pricing.userPrice.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.profitBadge}>
            <Ionicons name="sparkles" size={14} color={COLORS.successDark} />
            <Text style={styles.profitBadgeText}>
              Artisan Profit: ₹{product.pricing.takeHomeProfit.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Multi-Channel Export Badges Required by Prompt */}
        <View style={styles.exportBadgesSection}>
          <Text style={styles.exportBadgesLabel}>
            {isExported ? 'Exported Portals:' : 'Target Portals:'}
          </Text>
          <View style={styles.badgesWrapper}>
            {isExported && exportedChannelDetails.length > 0 ? (
              exportedChannelDetails.map((ch) => (
                <View
                  key={ch.id}
                  style={[
                    styles.channelBadge,
                    { backgroundColor: ch.color + '15', borderColor: ch.color + '60' },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={13} color={ch.color} />
                  <Text style={[styles.channelBadgeText, { color: ch.color }]}>
                    {ch.shortName}
                  </Text>
                </View>
              ))
            ) : (
              <Badge
                label="Ready to Export"
                iconName="cloud-upload-outline"
                variant="warning"
                size="sm"
              />
            )}
          </View>
        </View>

        {/* Audio Playback Button Required by Prompt */}
        <View style={styles.audioSection}>
          <AudioButton
            isPlaying={playingAudioId === product.id}
            onToggle={() => toggleAudioPlayback(product.id)}
            durationSeconds={product.voiceNote.durationSeconds}
            label="Original Voice Note"
            variant="full"
          />
        </View>

        {/* Bottom Action Footer with Accessible >= 52px Touch Target */}
        <View style={styles.actionFooter}>
          {isExported ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.shareCatalogBtn}
              accessibilityRole="button"
              accessibilityLabel="Share digital catalog link on WhatsApp"
            >
              <Ionicons name="logo-whatsapp" size={20} color="#15803D" />
              <Text style={styles.shareCatalogText}>Share Catalog on WhatsApp</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => resumeDraft(product)}
              style={styles.resumeDraftBtn}
              accessibilityRole="button"
              accessibilityLabel="Resume cataloging draft"
            >
              <Ionicons name="arrow-forward-circle" size={20} color={COLORS.textInverse} />
              <Text style={styles.resumeDraftText}>Resume Cataloging Draft</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 20, // Increased vertical spacing
    overflow: 'hidden',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9, // Clean 16:9 proportional layout
    backgroundColor: COLORS.surfaceMuted,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  statusBanner: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  statusExported: {
    backgroundColor: 'rgba(21, 128, 61, 0.95)',
  },
  statusDraft: {
    backgroundColor: 'rgba(217, 119, 6, 0.95)',
  },
  statusBannerText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  catalogIdPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(28, 25, 23, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  catalogIdText: {
    color: COLORS.textInverse,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentArea: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700', // Higher contrast for outdoor visibility
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 23,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceCol: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  profitBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  exportBadgesSection: {
    marginBottom: 14,
  },
  exportBadgesLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary, // Higher contrast
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  badgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 5,
  },
  channelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  audioSection: {
    marginBottom: 14,
  },
  actionFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  shareCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SIZES.minTouchTarget, // Accessible >= 52px
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#86EFAC',
    borderRadius: 14,
    gap: 8,
    paddingHorizontal: 14,
  },
  shareCatalogText: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '800',
  },
  resumeDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SIZES.minTouchTarget, // Accessible >= 52px
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    gap: 8,
    paddingHorizontal: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  resumeDraftText: {
    color: COLORS.textInverse,
    fontSize: 14,
    fontWeight: '800',
  },
});
