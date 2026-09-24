import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';
import { useProduct } from '../context/ProductContext';
import { WizardStepper } from '../components/wizard/WizardStepper';
import { Step1PhotoStudio } from '../components/wizard/Step1PhotoStudio';
import { Step2VoiceCatalog } from '../components/wizard/Step2VoiceCatalog';
import { Step3SmartPricing } from '../components/wizard/Step3SmartPricing';
import { Step4MarketExport } from '../components/wizard/Step4MarketExport';
import { ExportSuccessModal } from '../components/wizard/ExportSuccessModal';

export const StudioScreen: React.FC = () => {
  const { currentStep } = useProduct();

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PhotoStudio />;
      case 2:
        return <Step2VoiceCatalog />;
      case 3:
        return <Step3SmartPricing />;
      case 4:
        return <Step4MarketExport />;
      default:
        return <Step1PhotoStudio />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Visual 4-Step Guided Progress Stepper */}
        <WizardStepper />

        {/* Dynamic Step Content */}
        <View style={styles.stepContent}>{renderActiveStep()}</View>

        {/* Celebration Modal on Successful Export */}
        <ExportSuccessModal />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepContent: {
    flex: 1,
  },
});
