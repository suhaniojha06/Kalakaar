import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { WizardStep } from '../../types/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';

export const WizardStepper: React.FC = () => {
  const { t } = useLanguage();
  const { currentStep, setCurrentStep } = useProduct();

  const steps: { step: WizardStep; icon: keyof typeof Ionicons.glyphMap; titleKey: 'step1Title' | 'step2Title' | 'step3Title' | 'step4Title' }[] = [
    { step: 1, icon: 'camera', titleKey: 'step1Title' },
    { step: 2, icon: 'mic', titleKey: 'step2Title' },
    { step: 3, icon: 'pricetag', titleKey: 'step3Title' },
    { step: 4, icon: 'share-social', titleKey: 'step4Title' },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <View style={styles.container}>
      {/* Step Circles Row */}
      <View style={styles.stepsRow}>
        {/* Background track bar */}
        <View style={styles.trackContainer}>
          <View style={styles.trackBg} />
          <View style={[styles.trackFill, { width: `${progressPercent}%` }]} />
        </View>

        {steps.map((item) => {
          const isCompleted = currentStep > item.step;
          const isCurrent = currentStep === item.step;

          return (
            <TouchableOpacity
              key={item.step}
              activeOpacity={0.7}
              onPress={() => {
                if (item.step <= currentStep) {
                  setCurrentStep(item.step);
                }
              }}
              disabled={item.step > currentStep}
              style={[
                styles.stepCircle,
                isCurrent && styles.stepCircleCurrent,
                isCompleted && styles.stepCircleCompleted,
                item.step > currentStep && styles.stepCircleUpcoming,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Step ${item.step}: ${t(item.titleKey)}`}
            >
              {isCompleted ? (
                <Ionicons name="checkmark-sharp" size={20} color={COLORS.textInverse} />
              ) : (
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isCurrent ? COLORS.textInverse : COLORS.textMuted}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Step Labels Row */}
      <View style={styles.labelsRow}>
        {steps.map((item) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          return (
            <Text
              key={item.step}
              style={[
                styles.stepLabel,
                isCurrent && styles.stepLabelActive,
                isCompleted && styles.stepLabelCompleted,
              ]}
              numberOfLines={1}
            >
              {t(item.titleKey)}
            </Text>
          );
        })}
      </View>

      {/* Active Step Subtitle */}
      <View style={styles.activeLabelRow}>
        <Text style={styles.stepCounterText}>
          {`Step ${currentStep} of 4 • `}
          <Text style={styles.activeStepTitle}>
            {currentStep === 1
              ? t('step1Title')
              : currentStep === 2
              ? t('step2Title')
              : currentStep === 3
              ? t('step3Title')
              : t('step4Title')}
          </Text>
        </Text>
        <Text style={styles.activeStepSubtitle}>
          {currentStep === 1
            ? t('step1Subtitle')
            : currentStep === 2
            ? t('step2Subtitle')
            : currentStep === 3
            ? t('step3Subtitle')
            : t('step4Subtitle')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    position: 'relative',
  },
  trackContainer: {
    position: 'absolute',
    left: 26,
    right: 26,
    top: '50%',
    marginTop: -2,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    zIndex: 0,
  },
  trackBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.borderDark,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    backgroundColor: COLORS.surfaceCard,
    borderColor: COLORS.borderDark,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 5,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.successDark,
  },
  stepCircleUpcoming: {
    backgroundColor: COLORS.surfaceCard,
    borderColor: COLORS.borderDark,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  stepLabelCompleted: {
    color: COLORS.success,
    fontWeight: '700',
  },
  activeLabelRow: {
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  stepCounterText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
  activeStepTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  activeStepSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});
