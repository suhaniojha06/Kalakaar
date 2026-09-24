import { TextStyle } from 'react-native';
import { COLORS } from './colors';

export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800' as TextStyle['fontWeight'],
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: COLORS.textPrimary,
  },
  bodyRegular: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: COLORS.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: COLORS.textMuted,
  },
  priceHero: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900' as TextStyle['fontWeight'],
    color: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.textInverse,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
};
