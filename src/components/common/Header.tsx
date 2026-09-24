import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGE_OPTIONS } from '../../constants/translations';
import { LanguageCode } from '../../types/language';

export const Header: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLangObj =
    LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setLangModalVisible(false);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Top Row: App Brand & Language Selector Trigger */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.brandIconCircle}>
            <Ionicons name="sparkles" size={18} color={COLORS.ochre} />
          </View>
          <View>
            <View style={styles.appNameRow}>
              <Text style={styles.appTitleNative}>कलाकार</Text>
              <Text style={styles.appTitleLatin}>Kalakar</Text>
            </View>
            <Text style={styles.appSubline}>{t('appTagline')}</Text>
          </View>
        </View>

        {/* Global Multi-Language Selector Trigger (Dropdown Button) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setLangModalVisible(true)}
          style={styles.langDropdownBtn}
          accessibilityRole="button"
          accessibilityLabel={`Current language: ${currentLangObj.label}. Tap to choose language`}
        >
          <Ionicons name="globe-outline" size={16} color={COLORS.primary} style={styles.langGlobeIcon} />
          <Text style={styles.langDropdownText}>{currentLangObj.nativeLabel}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Quick Language Switcher Pills (Horizontal Scroll) */}
      <View style={styles.quickPillsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPillsScroll}
        >
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.75}
                onPress={() => setLanguage(lang.code)}
                style={[
                  styles.quickPill,
                  isSelected && styles.quickPillSelected,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${lang.label}`}
              >
                <Text
                  style={[
                    styles.quickPillText,
                    isSelected && styles.quickPillTextSelected,
                  ]}
                >
                  {lang.nativeLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Artisan Profile Card: Ram Charan • Kalamkari Cluster, Andhra Pradesh */}
      <View style={styles.profileCard}>
        <View style={styles.profileLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
              }}
              style={styles.avatarImage}
            />
            <View style={styles.verifiedDot}>
              <Ionicons name="checkmark" size={10} color={COLORS.textInverse} />
            </View>
          </View>

          <View style={styles.profileTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.artisanName}>{t('artisanName')}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color={COLORS.success} />
                <Text style={styles.verifiedText}>{t('verifiedArtisan')}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
              <Text style={styles.locationText}>{t('artisanLocation')}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.clusterText}>Kalamkari Cluster, AP</Text>
            </View>
          </View>
        </View>

        {/* Audio Assistance Quick Trigger */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.voiceHelpBtn}
          accessibilityRole="button"
          accessibilityLabel="Voice assistance guide"
        >
          <Ionicons name="mic-circle" size={24} color={COLORS.ochreDark} />
          <Text style={styles.voiceHelpText}>{t('voiceHelp')}</Text>
        </TouchableOpacity>
      </View>

      {/* Multi-Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="globe" size={22} color={COLORS.primary} />
                <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setLangModalVisible(false)}
                style={styles.modalCloseBtn}
                accessibilityRole="button"
                accessibilityLabel="Close language selector"
              >
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose your preferred language for voice notes and cataloging:
            </Text>

            <ScrollView style={styles.langListScroll} showsVerticalScrollIndicator={false}>
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    activeOpacity={0.75}
                    onPress={() => handleSelectLanguage(lang.code)}
                    style={[
                      styles.langOptionCard,
                      isSelected && styles.langOptionCardSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${lang.label}`}
                  >
                    <View style={styles.langOptionLeft}>
                      <Text
                        style={[
                          styles.langOptionNative,
                          isSelected && styles.langOptionNativeSelected,
                        ]}
                      >
                        {lang.nativeLabel}
                      </Text>
                      <Text style={styles.langOptionSub}>
                        {lang.label} • {lang.region}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.langCheckCircle,
                        isSelected && styles.langCheckCircleSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={COLORS.textInverse} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surface,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  appTitleNative: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  appTitleLatin: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ochreDark,
    marginLeft: 6,
  },
  appSubline: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  langDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44, // Accessible touch area
    gap: 6,
  },
  langGlobeIcon: {
    marginRight: 2,
  },
  langDropdownText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  quickPillsRow: {
    marginBottom: 12,
  },
  quickPillsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  quickPillTextSelected: {
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: COLORS.success,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  profileTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  artisanName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginRight: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    color: COLORS.successDark,
    fontWeight: '700',
    marginLeft: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 3,
  },
  dotSeparator: {
    marginHorizontal: 4,
    color: COLORS.textMuted,
  },
  clusterText: {
    fontSize: 11,
    color: COLORS.ochreDark,
    fontWeight: '700',
  },
  voiceHelpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ochreSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.ochreBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minHeight: 46,
  },
  voiceHelpText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.ochreDark,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 17,
  },
  langListScroll: {
    maxHeight: 360,
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    minHeight: SIZES.minTouchTarget, // Accessible >= 52px touch target
  },
  langOptionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySubtle,
    borderWidth: 2,
  },
  langOptionLeft: {
    flex: 1,
  },
  langOptionNative: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  langOptionNativeSelected: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  langOptionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  langCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  langCheckCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
