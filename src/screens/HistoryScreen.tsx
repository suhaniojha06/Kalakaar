import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';
import { useProduct } from '../context/ProductContext';
import { FilterPills, ProductFilterType } from '../components/history/FilterPills';
import { ProductCard } from '../components/history/ProductCard';

export const HistoryScreen: React.FC = () => {
  const { t } = useLanguage();
  const { products, setActiveTab, setCurrentStep } = useProduct();
  const [filter, setFilter] = useState<ProductFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter products by tab and search query
  const filteredProducts = products.filter((product) => {
    // Tab filter
    if (filter === 'exported' && product.status !== 'exported') return false;
    if (filter === 'draft' && product.status !== 'draft') return false;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchId = product.catalogId.toLowerCase().includes(q);
      return matchTitle || matchCat || matchId;
    }

    return true;
  });

  const handleStartNew = () => {
    setCurrentStep(1);
    setActiveTab('studio');
  };

  const exportedCount = products.filter((p) => p.status === 'exported').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Total Crafts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>{exportedCount}</Text>
            <Text style={styles.statLabel}>Live on Portals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{draftCount}</Text>
            <Text style={styles.statLabel}>Saved Drafts</Text>
          </View>

          {/* New Craft CTA inside stats row */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStartNew}
            style={styles.inlineFabBtn}
            accessibilityRole="button"
            accessibilityLabel="Catalog New Craft"
          >
            <Ionicons name="add" size={20} color={COLORS.textInverse} />
            <Text style={styles.inlineFabText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar with Accessible min 52px Touch Target */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color={COLORS.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search catalog items"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearBtn}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.micSearchBtn}
              accessibilityRole="button"
              accessibilityLabel="Search by Voice"
            >
              <Ionicons name="mic" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs: All Items, Exported, Saved Drafts */}
        <FilterPills
          currentFilter={filter}
          onFilterChange={setFilter}
          products={products}
        />

        {/* Product Cards List */}
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="file-tray-outline" size={48} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>{t('noProductsFound')}</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search or catalog a new artisan craft.
              </Text>
              <TouchableOpacity
                style={styles.emptyCta}
                onPress={handleStartNew}
                accessibilityRole="button"
                accessibilityLabel="Catalog your first product"
              >
                <Ionicons name="add-circle" size={22} color={COLORS.textInverse} />
                <Text style={styles.emptyCtaText}>{t('catalogNew')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    position: 'relative',
  },
  // --- Stats Banner ---
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  inlineFabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
    minHeight: 44,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  inlineFabText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 4,
  },
  // --- Search Bar ---
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 14,
    minHeight: SIZES.minTouchTarget, // Accessible >= 52px
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    minHeight: 48,
  },
  clearBtn: {
    padding: 6,
  },
  micSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  // --- Product List ---
  scrollList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // room for tab bar
  },
  // --- Empty State ---
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 22,
    lineHeight: 19,
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    minHeight: SIZES.minTouchTarget,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  emptyCtaText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '800',
  },
});
