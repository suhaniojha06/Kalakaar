import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { SAMPLE_CRAFTS } from '../../data/sampleCrafts';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const Step1PhotoStudio: React.FC = () => {
  const { t } = useLanguage();
  const {
    activeDraft,
    previewMode,
    setPreviewMode,
    selectSampleCraft,
    nextStep,
  } = useProduct();

  const isEnhanced = previewMode === 'enhanced';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Photo Capture & Upload Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cameraBtn}
          accessibilityRole="button"
          accessibilityLabel="Take Photo with Camera"
        >
          <Ionicons name="camera" size={24} color={COLORS.textInverse} />
          <Text style={styles.cameraBtnText}>{t('takePhoto')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.uploadBtn}
          accessibilityRole="button"
          accessibilityLabel="Upload from Gallery"
        >
          <Ionicons name="images-outline" size={22} color={COLORS.primary} />
          <Text style={styles.uploadBtnText}>{t('uploadPhoto')}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Before / After Image Viewer Card */}
      <View style={styles.viewerCard}>
        {/* Toggle Switch Bar */}
        <View style={styles.toggleBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPreviewMode('original')}
            style={[styles.toggleBtn, !isEnhanced && styles.toggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="View Original Photo"
          >
            <Ionicons
              name="image-outline"
              size={18}
              color={!isEnhanced ? COLORS.textInverse : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.toggleText,
                !isEnhanced && styles.toggleTextActive,
              ]}
            >
              {t('originalPhoto')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPreviewMode('enhanced')}
            style={[styles.toggleBtn, isEnhanced && styles.toggleBtnActiveEnhanced]}
            accessibilityRole="button"
            accessibilityLabel="View AI Studio Enhanced Photo"
          >
            <Ionicons
              name="sparkles"
              size={18}
              color={isEnhanced ? COLORS.textInverse : COLORS.ochreDark}
            />
            <Text
              style={[
                styles.toggleText,
                isEnhanced && styles.toggleTextActive,
              ]}
            >
              {t('aiStudioPhoto')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Display with Mode Banner */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: isEnhanced ? activeDraft.enhancedImage : activeDraft.originalImage,
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Floating Pill on image */}
          <View
            style={[
              styles.imageFloatingTag,
              isEnhanced ? styles.tagEnhanced : styles.tagOriginal,
            ]}
          >
            <Ionicons
              name={isEnhanced ? 'sparkles' : 'camera-outline'}
              size={14}
              color={COLORS.textInverse}
            />
            <Text style={styles.tagText}>
              {isEnhanced ? '✨ AI Studio 4K' : '📷 Raw Camera'}
            </Text>
          </View>
        </View>

        {/* Visual Quality Badges Required by Prompt */}
        <View style={styles.badgesSection}>
          <Text style={styles.badgesHeader}>AI Studio Quality Verifications:</Text>
          <View style={styles.badgesWrap}>
            <Badge
              label={t('badgeBgCleaned')}
              iconName="checkmark-circle"
              variant="success"
              style={styles.badgeItem}
            />
            <Badge
              label={t('badgeLightingBalanced')}
              iconName="sunny"
              variant="success"
              style={styles.badgeItem}
            />
            <Badge
              label={t('badgeMarketplaceReady')}
              iconName="shield-checkmark"
              variant="success"
              style={styles.badgeItem}
            />
            <Badge
              label={t('badge4kEnhanced')}
              iconName="scan"
              variant="channel"
              style={styles.badgeItem}
            />
          </View>
        </View>
      </View>

      {/* Preset Indian Handicrafts Quick Switcher */}
      <View style={styles.sampleSection}>
        <Text style={styles.sampleSectionTitle}>
          {t('selectSamplePrompt')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sampleScroll}
        >
          {SAMPLE_CRAFTS.map((craft) => {
            const isSelected = activeDraft.id === craft.id;
            return (
              <TouchableOpacity
                key={craft.id}
                activeOpacity={0.8}
                onPress={() => selectSampleCraft(craft)}
                style={[
                  styles.craftChip,
                  isSelected && styles.craftChipSelected,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select sample craft: ${craft.title}`}
              >
                <Image
                  source={{ uri: craft.enhancedImage }}
                  style={styles.craftChipImage}
                />
                <View style={styles.craftChipTextCol}>
                  <Text
                    style={[
                      styles.craftChipTitle,
                      isSelected && styles.craftChipTitleSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {craft.title}
                  </Text>
                  <Text style={styles.craftChipType} numberOfLines={1}>
                    {craft.craftType}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.selectedTick}>
                    <Ionicons name="checkmark" size={12} color={COLORS.textInverse} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Next Step Primary CTA */}
      <Button
        title={t('continueToVoice')}
        subtitle="Step 2: Voice Description & Cataloging"
        onPress={nextStep}
        size="lg"
        variant="primary"
        iconName="arrow-forward"
        iconPosition="right"
        style={styles.continueBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cameraBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    minHeight: SIZES.minTouchTarget,
    borderRadius: SIZES.radiusMd,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  cameraBtnText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    minHeight: SIZES.minTouchTarget,
    borderRadius: SIZES.radiusMd,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  uploadBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  viewerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 18,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  toggleBtn: {
    flex: 1,
    minHeight: 50, // Accessible touch target
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.textSecondary,
  },
  toggleBtnActiveEnhanced: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  toggleTextActive: {
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceMuted,
  },
  mainImage: {
    width: '100%',
    height: 270,
  },
  imageFloatingTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  tagEnhanced: {
    backgroundColor: 'rgba(200, 90, 50, 0.92)',
  },
  tagOriginal: {
    backgroundColor: 'rgba(41, 37, 36, 0.85)',
  },
  tagText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  badgesSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  badgesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeItem: {
    marginRight: 4,
    marginBottom: 4,
  },
  sampleSection: {
    marginBottom: 20,
  },
  sampleSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  sampleScroll: {
    gap: 12,
  },
  craftChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 14,
    padding: 8,
    minHeight: 52,
    width: 220,
  },
  craftChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 2,
  },
  craftChipImage: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginRight: 8,
  },
  craftChipTextCol: {
    flex: 1,
  },
  craftChipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  craftChipTitleSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  craftChipType: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  selectedTick: {
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  continueBtn: {
    marginTop: 10,
  },
});
