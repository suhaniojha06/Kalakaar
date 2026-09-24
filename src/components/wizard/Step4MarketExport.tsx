import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { MARKETPLACE_CHANNELS } from '../../constants/channels';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Step4MarketExport: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const {
    activeDraft,
    userPrice,
    selectedChannels,
    toggleChannel,
    exportActiveProduct,
    isExporting,
    prevStep,
  } = useProduct();

  const productName =
    currentLanguage === 'hi'
      ? activeDraft.metadata.productNameHi
      : currentLanguage === 'pa'
      ? activeDraft.metadata.productNamePa
      : activeDraft.metadata.productNameEn;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Product Summary Mini Card */}
      <View style={styles.summaryCard}>
        <Image
          source={{ uri: activeDraft.enhancedImage }}
          style={styles.summaryImage}
          resizeMode="cover"
        />
        <View style={styles.summaryCol}>
          <Badge
            label="Ready for Multi-Channel Broadcast"
            iconName="checkmark-done"
            variant="success"
            size="sm"
            style={styles.readyBadge}
          />
          <Text style={styles.summaryTitle} numberOfLines={2}>
            {productName}
          </Text>
          <View style={styles.summaryPriceRow}>
            <Text style={styles.summaryPriceLabel}>Catalog Price:</Text>
            <Text style={styles.summaryPriceValue}>₹{userPrice.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>

      {/* Checklist Header */}
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="git-network-outline" size={20} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>{t('selectChannels')}</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Tap to select portals. Your catalog, studio photos, and voice details will be synchronized instantly.
      </Text>

      {/* Multi-Channel Checklist Cards Required by Prompt */}
      <View style={styles.channelsList}>
        {MARKETPLACE_CHANNELS.map((channel) => {
          const isSelected = selectedChannels.includes(channel.id);

          return (
            <TouchableOpacity
              key={channel.id}
              activeOpacity={0.8}
              onPress={() => toggleChannel(channel.id)}
              style={[
                styles.channelCard,
                isSelected && styles.channelCardSelected,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Export to ${channel.name}`}
            >
              {/* Checkbox indicator (min 40px) */}
              <View
                style={[
                  styles.checkboxCircle,
                  isSelected && styles.checkboxCircleSelected,
                ]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={18} color={COLORS.textInverse} />
                )}
              </View>

              {/* Channel Details */}
              <View style={styles.channelInfoCol}>
                <View style={styles.channelNameRow}>
                  <Text style={styles.channelName}>{channel.name}</Text>
                  <View
                    style={[
                      styles.channelBadge,
                      { backgroundColor: channel.color + '18' },
                    ]}
                  >
                    <Text style={[styles.channelBadgeText, { color: channel.color }]}>
                      {channel.badgeText}
                    </Text>
                  </View>
                </View>

                <Text style={styles.channelDesc}>{channel.description}</Text>

                {channel.governmentBacked && (
                  <View style={styles.govtBadge}>
                    <Ionicons name="shield-checkmark" size={12} color={COLORS.success} />
                    <Text style={styles.govtBadgeText}>Govt of India Verified Channel</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Prominent Export Action Button */}
      <Button
        title={isExporting ? t('exporting') : t('exportToPortals')}
        subtitle={
          isExporting
            ? 'Publishing digital catalog...'
            : `Syncing to ${selectedChannels.length} Selected Portals`
        }
        onPress={exportActiveProduct}
        loading={isExporting}
        size="lg"
        variant="primary"
        iconName="rocket"
        iconPosition="right"
        style={styles.exportPrimaryBtn}
      />

      {/* WhatsApp Share Catalog Button Required by Prompt */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.whatsappShareBtn}
        accessibilityRole="button"
        accessibilityLabel="Share Catalog on WhatsApp"
      >
        <Ionicons name="logo-whatsapp" size={22} color={COLORS.textInverse} />
        <View style={styles.whatsappBtnTextCol}>
          <Text style={styles.whatsappBtnTitle}>Share Catalog on WhatsApp</Text>
          <Text style={styles.whatsappBtnSubtitle}>Send link to buyers & traders</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={'rgba(255,255,255,0.8)'} />
      </TouchableOpacity>

      {/* Back button */}
      <Button
        title={t('prevStep')}
        onPress={prevStep}
        variant="ghost"
        size="md"
        iconName="arrow-back"
        style={styles.backBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  summaryCol: {
    flex: 1,
    justifyContent: 'center',
  },
  readyBadge: {
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  summaryPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  summaryPriceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 4,
  },
  summaryPriceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  channelsList: {
    gap: 12,
    marginBottom: 20,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
    minHeight: SIZES.minTouchTarget, // accessible touch target
  },
  channelCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 2,
  },
  checkboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  channelInfoCol: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  channelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  channelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  channelDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 6,
  },
  govtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  govtBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.successDark,
    marginLeft: 4,
  },
  exportPrimaryBtn: {
    marginBottom: 12,
  },
  whatsappShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  whatsappBtnTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  whatsappBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
  whatsappBtnSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
    fontWeight: '600',
  },
  backBtn: {
    alignSelf: 'center',
  },
});
