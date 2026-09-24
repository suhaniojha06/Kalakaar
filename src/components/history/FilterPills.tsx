import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types/product';

export type ProductFilterType = 'all' | 'exported' | 'draft';

interface FilterPillsProps {
  currentFilter: ProductFilterType;
  onFilterChange: (filter: ProductFilterType) => void;
  products: Product[];
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  currentFilter,
  onFilterChange,
  products,
}) => {
  const { t } = useLanguage();

  const allCount = products.length;
  const exportedCount = products.filter((p) => p.status === 'exported').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;

  const filters: { id: ProductFilterType; labelKey: 'allProducts' | 'exportedProducts' | 'savedDrafts'; count: number }[] = [
    { id: 'all', labelKey: 'allProducts', count: allCount },
    { id: 'exported', labelKey: 'exportedProducts', count: exportedCount },
    { id: 'draft', labelKey: 'savedDrafts', count: draftCount },
  ];

  return (
    <View style={styles.container}>
      {filters.map((f) => {
        const isSelected = currentFilter === f.id;

        return (
          <TouchableOpacity
            key={f.id}
            activeOpacity={0.75}
            onPress={() => onFilterChange(f.id)}
            style={[
              styles.pillButton,
              isSelected && styles.pillButtonSelected,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${t(f.labelKey)}: ${f.count} items`}
          >
            <Text
              style={[
                styles.pillText,
                isSelected && styles.pillTextSelected,
              ]}
            >
              {t(f.labelKey)}
            </Text>

            <View
              style={[
                styles.badge,
                isSelected ? styles.badgeSelected : styles.badgeNormal,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isSelected && styles.badgeTextSelected,
                ]}
              >
                {f.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pillButton: {
    flex: 1,
    minHeight: SIZES.minTouchTarget, // 52px min touch target
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  pillButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  pillTextSelected: {
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeNormal: {
    backgroundColor: COLORS.border,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  badgeTextSelected: {
    color: COLORS.textInverse,
  },
});
