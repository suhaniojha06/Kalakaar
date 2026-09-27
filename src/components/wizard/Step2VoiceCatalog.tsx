import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { SAMPLE_CRAFTS } from '../../data/sampleCrafts';
import { AudioButton } from '../common/AudioButton';
import { Button } from '../common/Button';

export const Step2VoiceCatalog: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const {
    activeDraft,
    isRecording,
    recordingSeconds,
    liveTranscript,
    isProcessingAudio,
    audioProcessingStatus,
    audioMetadata,
    transcriptionConfidence,
    currentAudioUrl,
    playingAudioId,
    toggleAudioPlayback,
    startVoiceRecording,
    stopVoiceRecording,
    processAudioInput,
    uploadAudioFile,
    nextStep,
    prevStep,
  } = useProduct();

  // Hidden web file input reference for audio upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pulsing animation values for the microphone button using useMemo
  const pulseScale = useMemo(() => new Animated.Value(1), []);
  const pulseOpacity = useMemo(() => new Animated.Value(0.6), []);
  const progressBarAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    let pulseAnim: Animated.CompositeAnimation | undefined;
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
  }, [isRecording, pulseScale, pulseOpacity]);

  // Animate processing progress bar when status changes
  useEffect(() => {
    if (isProcessingAudio && audioProcessingStatus?.progress) {
      Animated.timing(progressBarAnim, {
        toValue: audioProcessingStatus.progress,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else if (!isProcessingAudio) {
      progressBarAnim.setValue(0);
    }
  }, [isProcessingAudio, audioProcessingStatus?.progress, progressBarAnim]);

  const handleUploadClick = () => {
    if (Platform.OS === 'web') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        // Fallback programmatic input for web
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            uploadAudioFile(file);
          }
        };
        input.click();
      }
    } else {
      // In mobile environment, trigger sample audio processing as demonstration
      processAudioInput(activeDraft.sampleVoiceNote.id);
    }
  };

  const handleWebFileInputChange = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      uploadAudioFile(file);
      // Reset input value so same file can be re-selected if needed
      event.target.value = '';
    }
  };

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

  const activeAudioId = currentAudioUrl || activeDraft.sampleVoiceNote.id;
  const isPlayingActiveAudio = playingAudioId === activeAudioId;
  const activeDuration = audioMetadata?.durationSeconds || activeDraft.sampleVoiceNote.durationSeconds;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Hidden file input for web audio upload */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleWebFileInputChange}
        />
      )}

      {/* Audio Input Modes Header Bar */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
          style={[styles.modeBtn, isRecording ? styles.modeBtnRecording : styles.modeBtnPrimary]}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop Recording' : 'Record Voice'}
        >
          <Ionicons
            name={isRecording ? 'stop-circle' : 'mic'}
            size={20}
            color={COLORS.textInverse}
          />
          <Text style={styles.modeBtnText}>
            {isRecording ? `Stop (0:0${recordingSeconds}s)` : 'Record Voice'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleUploadClick}
          style={styles.modeBtnSecondary}
          accessibilityRole="button"
          accessibilityLabel="Upload Audio File"
        >
          <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
          <Text style={styles.modeBtnSecondaryText}>Upload Audio</Text>
        </TouchableOpacity>
      </View>

      {/* Central Pulsing Microphone Section */}
      <View style={styles.micSectionCard}>
        <Text style={styles.micInstructionHeader}>
          {isRecording ? t('listening') : t('holdToSpeak')}
        </Text>
        <Text style={styles.micInstructionSub}>
          {isRecording
            ? `Recording: 0:0${recordingSeconds}s • Tap microphone to process audio`
            : 'Speak naturally in your mother tongue (Hindi, Punjabi, Telugu, etc.)'}
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

        {/* Recording / Model status chip */}
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
            {isRecording
              ? `Listening (${recordingSeconds}s)...`
              : isProcessingAudio
              ? 'AI Speech Model: Processing Audio...'
              : 'AI Speech Model: Ready'}
          </Text>
        </View>
      </View>

      {/* Audio Processing Visual State */}
      {isProcessingAudio && (
        <View style={styles.processingCard}>
          <View style={styles.processingHeaderRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.processingHeaderText}>
              Processing Audio Input & Generating Transcript
            </Text>
            <Text style={styles.processingPercent}>
              {audioProcessingStatus?.progress || 35}%
            </Text>
          </View>

          {/* Animated Progress Bar */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressBarAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.processingSubText}>
            {audioProcessingStatus?.message || 'Analyzing audio signal and frequencies...'}
          </Text>
        </View>
      )}

      {/* Preset Regional Artisan Audio Quick Switcher */}
      <View style={styles.sampleVoiceSection}>
        <View style={styles.sampleVoiceHeaderRow}>
          <Ionicons name="musical-notes" size={16} color={COLORS.ochreDark} />
          <Text style={styles.sampleVoiceTitle}>Test with Artisan Audio Recordings:</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sampleVoiceScroll}
        >
          {SAMPLE_CRAFTS.map((craft) => {
            const isSelected = activeDraft.id === craft.id;
            return (
              <TouchableOpacity
                key={craft.id}
                activeOpacity={0.8}
                onPress={() => processAudioInput(craft.sampleVoiceNote.id)}
                style={[
                  styles.audioChip,
                  isSelected && styles.audioChipSelected,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Process audio sample for ${craft.title}`}
              >
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'play-circle-outline'}
                  size={18}
                  color={isSelected ? COLORS.primary : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.audioChipText,
                    isSelected && styles.audioChipTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {craft.craftType.split('(')[0].trim()} Audio ({craft.sampleVoiceNote.durationSeconds}s)
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Live Accurate Regional Transcription Card */}
      <View style={styles.transcriptionCard}>
        <View style={styles.transcriptionHeaderRow}>
          <View style={styles.speechBadge}>
            <Ionicons name="chatbubble-ellipses" size={16} color={COLORS.primary} />
            <Text style={styles.speechBadgeText}>{t('speechPreview')}</Text>
          </View>
          <View style={styles.badgeRow}>
            {transcriptionConfidence && (
              <View style={styles.confidenceTag}>
                <Ionicons name="checkmark-done" size={12} color={COLORS.successDark} />
                <Text style={styles.confidenceText}>
                  {Math.round(transcriptionConfidence * 100)}% Accuracy
                </Text>
              </View>
            )}
            <Text style={styles.langIndicatorText}>
              {currentLanguage.toUpperCase()} Recognizer
            </Text>
          </View>
        </View>

        {/* Audio Format / Duration Tag */}
        {audioMetadata && (
          <View style={styles.audioMetaRow}>
            <Ionicons name="information-circle-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.audioMetaText}>
              Audio: {audioMetadata.durationSeconds}s • {audioMetadata.fileType} • {audioMetadata.fileName}
            </Text>
          </View>
        )}

        {/* The Accurate Generated Transcript */}
        <Text style={styles.transcriptQuote}>&ldquo;{liveTranscript}&rdquo;</Text>

        {/* Audio Re-listen Player Button */}
        <View style={styles.audioPlayerRow}>
          <AudioButton
            isPlaying={isPlayingActiveAudio}
            onToggle={() => toggleAudioPlayback(activeAudioId)}
            durationSeconds={activeDuration}
            label={isPlayingActiveAudio ? 'Playing Processed Audio...' : t('listenVoiceNote')}
            variant="full"
          />
        </View>
      </View>

      {/* Auto-Extracted Preview Fields from Accurate Transcript */}
      <View style={styles.extractedCard}>
        <View style={styles.extractedHeaderRow}>
          <Ionicons name="sparkles" size={18} color={COLORS.ochreDark} />
          <Text style={styles.extractedHeaderText}>
            AI Auto-Extracted Catalog Fields
          </Text>
          <View style={styles.extractedTag}>
            <Text style={styles.extractedTagText}>From Transcript</Text>
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  modeBtnPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modeBtnRecording: {
    backgroundColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  modeBtnText: {
    color: COLORS.textInverse,
    fontSize: 14,
    fontWeight: '800',
  },
  modeBtnSecondary: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    minHeight: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  modeBtnSecondaryText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
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
  processingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.ochreDark,
    padding: 14,
    marginBottom: 16,
  },
  processingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  processingHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
  },
  processingPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ochreDark,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.ochreDark,
    borderRadius: 3,
  },
  processingSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  sampleVoiceSection: {
    marginBottom: 16,
  },
  sampleVoiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  sampleVoiceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sampleVoiceScroll: {
    gap: 8,
  },
  audioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  audioChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySubtle,
  },
  audioChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  audioChipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confidenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.successDark,
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
  audioMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  audioMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
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
