import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { AppTab } from '../../types/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';

export const TabBar: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, products } = useProduct();

  const tabs: { id: AppTab; labelKey: 'tabStudio' | 'tabHistory'; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] = [
    {
      id: 'studio',
      labelKey: 'tabStudio',
      icon: 'camera-outline',
      iconActive: 'camera',
    },
    {
      id: 'history',
      labelKey: 'tabHistory',
      icon: 'grid-outline',
      iconActive: 'grid',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = tab.id === 'history' ? products.length : null;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={24}
                color={isActive ? COLORS.primary : COLORS.textMuted}
              />
              {count !== null && (
                <View style={styles.counterBadge}>
                  <Text style={styles.counterText}>{count}</Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}
            >
              {t(tab.labelKey)}
            </Text>

            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    paddingBottom: 10,
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    minHeight: SIZES.minTouchTarget, // 52px min touch target
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    position: 'relative',
  },
  tabBtnActive: {
    backgroundColor: COLORS.primarySubtle,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  counterBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.ochreDark,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  counterText: {
    color: COLORS.textInverse,
    fontSize: 10,
    fontWeight: '900',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});
