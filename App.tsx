import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/colors';
import { LanguageProvider } from './src/context/LanguageContext';
import { ProductProvider, useProduct } from './src/context/ProductContext';
import { Header } from './src/components/common/Header';
import { TabBar } from './src/components/common/TabBar';
import { StudioScreen } from './src/screens/StudioScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';

const MainNavigator: React.FC = () => {
  const { activeTab } = useProduct();

  return (
    <View style={styles.screenInner}>
      {/* Top Header: App Branding, Language Switcher, Artisan Profile */}
      <Header />

      {/* Screen Body */}
      <View style={styles.contentContainer}>
        {activeTab === 'studio' ? <StudioScreen /> : <HistoryScreen />}
      </View>

      {/* Bottom Accessible Navigation Bar */}
      <TabBar />
    </View>
  );
};

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <LanguageProvider>
        <ProductProvider>
          <View style={styles.outerCenterContainer}>
            {/* Centered Mobile Embed Frame for Web View */}
            <View style={[styles.mobileDeviceFrame, isWeb && styles.mobileDeviceFrameWeb]}>
              {/* Optional Phone Notch simulation on web desktop */}
              {isWeb && (
                <View style={styles.phoneSpeakerBar}>
                  <View style={styles.speakerGrill} />
                  <View style={styles.cameraLens} />
                </View>
              )}

              <MainNavigator />
            </View>
          </View>
        </ProductProvider>
      </LanguageProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#1F1B18' : COLORS.surface,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  outerCenterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Platform.OS === 'web' ? '#231E1B' : COLORS.background,
  },
  mobileDeviceFrame: {
    width: '100%',
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mobileDeviceFrameWeb: {
    maxWidth: 480,
    maxHeight: '96%',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#423A34',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 12,
  },
  phoneSpeakerBar: {
    height: 18,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  speakerGrill: {
    width: 36,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1C6B8',
  },
  cameraLens: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8C827A',
  },
  screenInner: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
});
