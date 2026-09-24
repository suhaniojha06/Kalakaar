import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const Step3SmartPricing: React.FC = () => {
  const { t } = useLanguage();
  const {
    activeDraft,
    userPrice,
    adjustPrice,
    setUserPriceDirect,
    nextStep,
    prevStep,
  } = useProduct();

  const pricing = activeDraft.pricing;
  const netProfit = Math.max(0, userPrice - pricing.materialCost - pricing.platformBuffer);
  const profitPercentage = Math.round((netProfit / userPrice) * 100);

  // Common quick adjustment presets
  const presets = [
    { label: '- ₹500', delta: -500 },
    { label: '- ₹100', delta: -100 },
    { label: '+ ₹100', delta: 100 },
    { label: '+ ₹500', delta: 500 },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* AI Suggested Price Hero Card */}
      <View style={styles.priceHeroCard}>
        <View style={styles.badgeRow}>
          <Badge
            label={t('suggestedPrice')}
            iconName="sparkles"
            variant="primary"
          />
          <Badge
            label={pricing.demandTag}
            iconName="trending-up"
            variant="success"
          />
        </View>

        {/* Large Rupee Price Display */}
        <View style={styles.priceContainer}>
          <Text style={styles.rupeeSymbol}>₹</Text>
          <Text style={styles.priceValue}>{userPrice.toLocaleString('en-IN')}</Text>
        </View>
        <Text style={styles.priceSubtext}>
          Benchmarked against 1,200+ verified handicraft listings
        </Text>

        {/* Tactile Large + / - Buttons Required by Prompt (min 52px height) */}
        <View style={styles.stepperContainer}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p.label}
              activeOpacity={0.75}
              onPress={() => adjustPrice(p.delta)}
              style={styles.stepperButton}
              accessibilityRole="button"
              accessibilityLabel={`Adjust price by ${p.label}`}
            >
              <Text style={styles.stepperText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick price tier selector pills */}
        <View style={styles.tierSelectorRow}>
          <Text style={styles.tierSelectorLabel}>Quick Sets:</Text>
          {[1200, 1500, 1850, 2200].map((presetVal) => (
            <TouchableOpacity
              key={presetVal}
              activeOpacity={0.7}
              onPress={() => setUserPriceDirect(presetVal)}
              style={[
                styles.tierPill,
                userPrice === presetVal && styles.tierPillActive,
              ]}
            >
              <Text
                style={[
                  styles.tierPillText,
                  userPrice === presetVal && styles.tierPillTextActive,
                ]}
              >
                ₹{presetVal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fair Artisan Wage Breakdown Section */}
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownHeader}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.breakdownTitle}>{t('fairArtisanWage')}</Text>
        </View>
        <Text style={styles.breakdownSubtitle}>
          Transparent costing ensures artisans receive dignified livelihood wages.
        </Text>

        {/* Breakdown Items */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIconWrap}>
            <Ionicons name="cart-outline" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.breakdownItemCol}>
            <Text style={styles.breakdownItemLabel}>{t('materialCost')}</Text>
            <Text style={styles.breakdownItemHint}>Dye, silk threads, clay</Text>
          </View>
          <Text style={styles.breakdownItemPrice}>₹{pricing.materialCost}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIconWrap}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.breakdownItemCol}>
            <Text style={styles.breakdownItemLabel}>{t('laborCost')}</Text>
            <Text style={styles.breakdownItemHint}>
              {pricing.laborHours} hrs @ ₹{pricing.hourlyFairRate}/hr fair wage
            </Text>
          </View>
          <Text style={styles.breakdownItemPrice}>
            ₹{pricing.laborHours * pricing.hourlyFairRate}
          </Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIconWrap}>
            <Ionicons name="cube-outline" size={16} color={COLORS.textSecondary} />
          </View>
          <View style={styles.breakdownItemCol}>
            <Text style={styles.breakdownItemLabel}>Packaging & Logistics Buffer</Text>
            <Text style={styles.breakdownItemHint}>Protective artisan packaging</Text>
          </View>
          <Text style={styles.breakdownItemPrice}>₹{pricing.platformBuffer}</Text>
        </View>

        {/* Net Profit Highlight Banner */}
        <View style={styles.profitBanner}>
          <View style={styles.profitBannerLeft}>
            <Ionicons name="cash" size={24} color={COLORS.successDark} />
            <View style={styles.profitTextCol}>
              <Text style={styles.profitBannerLabel}>{t('takeHomeProfit')}</Text>
              <Text style={styles.profitBannerSub}>{profitPercentage}% Direct Margin</Text>
            </View>
          </View>
          <Text style={styles.profitBannerAmount}>₹{netProfit.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Navigation Row */}
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
          title={t('continueToExport')}
          subtitle="Step 4: Market Export"
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
  priceHeroCard: {
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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 4,
  },
  rupeeSymbol: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 6,
    marginRight: 4,
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  priceSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  stepperButton: {
    flex: 1,
    minHeight: SIZES.minTouchTarget, // 52px min touch target
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tierSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tierSelectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tierPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tierPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  tierPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tierPillTextActive: {
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  breakdownSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  breakdownItemCol: {
    flex: 1,
  },
  breakdownItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  breakdownItemHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  breakdownItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  profitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.successLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  profitBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitTextCol: {
    marginLeft: 10,
  },
  profitBannerLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.successDark,
  },
  profitBannerSub: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  profitBannerAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.successDark,
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
