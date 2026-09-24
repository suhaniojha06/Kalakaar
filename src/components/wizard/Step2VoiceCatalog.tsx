import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { AudioButton } from '../common/AudioButton';
import { Button } from '../common/Button';

export const Step2VoiceCatalog: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const {
    activeDraft,
    isRecording,
    recordingSeconds,
    liveTranscript,
    playingAudioId,
    toggleAudioPlayback,
    startVoiceRecording,
    stopVoiceRecording,
    nextStep,
    prevStep,
  } = useProduct();

  // Pulsing animation values for the microphone button
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let pulseAnim: Animated.CompositeAnimation;
    if (isRecording) {
      pulseAnim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseScale, { toValue: 1.45, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseScale, { toValue: 1, duration: 800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, { toValue: 0.1, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
          ]),
        ])
      );
      pulseAnim.start();
    } else {
      pulseScale.setValue(1);
      pulseOpacity.setValue(0);
    }
    return () => {
      if (pulseAnim) pulseAnim.stop();
    };
  }, [isRecording]);

  const productName =
    currentLanguage === 'hi'
      ? activeDraft.metadata.productNameHi
      : currentLanguage === 'pa'
      ? activeDraft.metadata.productNamePa
      : activeDraft.metadata.productNameEn;

  const craftType =
    currentLanguage === 'hi'
      ? activeDraft.metadata.craftTypeHi
      : currentLanguage === 'pa'
      ? activeDraft.metadata.craftTypePa
      : activeDraft.metadata.craftTypeEn;

  const material =
    currentLanguage === 'hi'
      ? activeDraft.metadata.materialHi
      : currentLanguage === 'pa'
      ? activeDraft.metadata.materialPa
      : activeDraft.metadata.materialEn;

  const craftStory =
    currentLanguage === 'hi'
      ? activeDraft.metadata.craftStoryHi
      : currentLanguage === 'pa'
      ? activeDraft.metadata.craftStoryPa
      : activeDraft.metadata.craftStoryEn;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Central Pulsing Microphone Section */}
      <View style={styles.micSectionCard}>
        <Text style={styles.micInstructionHeader}>
          {isRecording ? t('listening') : t('holdToSpeak')}
        </Text>
        <Text style={styles.micInstructionSub}>
          {isRecording
            ? `Recording: 0:0${recordingSeconds}s • Tap microphone to finish`
            : 'Speak naturally in your mother tongue (Hindi, Punjabi, etc.)'}
        </Text>

        {/* Pulsing concentric rings wrapper */}
        <View style={styles.micButtonContainer}>
          {/* Animated Outer Pulse Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />

          {/* Central Touch Target (90px diameter) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'Stop Recording' : 'Hold to Speak'}
          >
            <Ionicons
              name={isRecording ? 'stop-circle' : 'mic'}
              size={40}
              color={COLORS.textInverse}
            />
          </TouchableOpacity>
        </View>

        {/* Recording status chip */}
        <View
          style={[
            styles.statusChip,
            isRecording ? styles.statusChipActive : styles.statusChipIdle,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isRecording && styles.statusDotActive,
            ]}
          />
          <Text style={styles.statusChipText}>
            {isRecording ? `Listening (${recordingSeconds}s)...` : 'AI Speech Model: Ready'}
          </Text>
        </View>
      </View>

      {/* Live Regional Transcription Chip */}
      <View style={styles.transcriptionCard}>
        <View style={styles.transcriptionHeaderRow}>
          <View style={styles.speechBadge}>
            <Ionicons name="chatbubble-ellipses" size={16} color={COLORS.primary} />
            <Text style={styles.speechBadgeText}>{t('speechPreview')}</Text>
          </View>
          <Text style={styles.langIndicatorText}>
            {currentLanguage.toUpperCase()} Recognizer
          </Text>
        </View>

        <Text style={styles.transcriptQuote}>"{liveTranscript}"</Text>

        {/* Audio Re-listen Button */}
        <View style={styles.audioPlayerRow}>
          <AudioButton
            isPlaying={playingAudioId === activeDraft.sampleVoiceNote.id}
            onToggle={() => toggleAudioPlayback(activeDraft.sampleVoiceNote.id)}
            durationSeconds={activeDraft.sampleVoiceNote.durationSeconds}
            label={t('listenVoiceNote')}
            variant="full"
          />
        </View>
      </View>

      {/* Auto-Extracted Preview Fields Required by Prompt */}
      <View style={styles.extractedCard}>
        <View style={styles.extractedHeaderRow}>
          <Ionicons name="sparkles" size={18} color={COLORS.ochreDark} />
          <Text style={styles.extractedHeaderText}>
            AI Auto-Extracted Catalog Fields
          </Text>
          <View style={styles.extractedTag}>
            <Text style={styles.extractedTagText}>Auto-Filled</Text>
          </View>
        </View>

        {/* Field 1: Product Name */}
        <View style={styles.fieldItem}>
          <View style={styles.fieldIconCircle}>
            <Ionicons name="pricetag-outline" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={styles.fieldLabel}>{t('productName')}</Text>
            <Text style={styles.fieldValue}>{productName}</Text>
          </View>
        </View>

        {/* Field 2: Craft Heritage / Type */}
        <View style={styles.fieldItem}>
          <View style={styles.fieldIconCircle}>
            <Ionicons name="ribbon-outline" size={16} color={COLORS.ochreDark} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={styles.fieldLabel}>{t('craftType')}</Text>
            <Text style={styles.fieldValue}>{craftType}</Text>
          </View>
        </View>

        {/* Field 3: Material */}
        <View style={styles.fieldItem}>
          <View style={styles.fieldIconCircle}>
            <Ionicons name="color-filter-outline" size={16} color={COLORS.gemGreen} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={styles.fieldLabel}>{t('material')}</Text>
            <Text style={styles.fieldValue}>{material}</Text>
          </View>
        </View>

        {/* Field 4: Dimensions & Weight */}
        <View style={styles.fieldItem}>
          <View style={styles.fieldIconCircle}>
            <Ionicons name="resize-outline" size={16} color={COLORS.ondcBlue} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={styles.fieldLabel}>{t('dimensions')}</Text>
            <Text style={styles.fieldValue}>{activeDraft.metadata.dimensions}</Text>
          </View>
        </View>

        {/* Field 5: Craft Heritage Story */}
        <View style={[styles.fieldItem, styles.fieldItemLast]}>
          <View style={styles.fieldIconCircle}>
            <Ionicons name="book-outline" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={styles.fieldLabel}>{t('craftStory')}</Text>
            <Text style={styles.fieldValueStory}>{craftStory}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <Button
          title={t('prevStep')}
          onPress={prevStep}
          variant="secondary"
          size="md"
          iconName="arrow-back"
          style={styles.backBtn}
        />
        <Button
          title={t('continueToPricing')}
          subtitle="Step 3: Smart Pricing"
          onPress={nextStep}
          variant="primary"
          size="lg"
          iconName="arrow-forward"
          iconPosition="right"
          style={styles.nextBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  micSectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  micInstructionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  micInstructionSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  micButtonContainer: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: COLORS.primaryLight,
  },
  micButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  micButtonRecording: {
    backgroundColor: COLORS.error,
    borderColor: '#FCA5A5',
    shadowColor: COLORS.error,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  statusChipActive: {
    backgroundColor: COLORS.errorLight,
  },
  statusChipIdle: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: COLORS.error,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  transcriptionCard: {
    backgroundColor: COLORS.primarySubtle,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    padding: 16,
    marginBottom: 16,
  },
  transcriptionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  speechBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speechBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  langIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.ochreDark,
    backgroundColor: COLORS.ochreSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transcriptQuote: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 14,
  },
  audioPlayerRow: {
    marginTop: 4,
  },
  extractedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  extractedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  extractedHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  extractedTag: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  extractedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fieldItemLast: {
    marginBottom: 0,
  },
  fieldIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldTextCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  fieldValueStory: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backBtn: {
    width: 100,
  },
  nextBtn: {
    flex: 1,
  },
});
