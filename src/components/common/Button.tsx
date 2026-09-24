import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  subtitle?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  subtitle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'success':
        return styles.successBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'ghost':
        return styles.ghostBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'primary':
      case 'success':
        return COLORS.textInverse;
      case 'secondary':
        return COLORS.textPrimary;
      case 'outline':
        return COLORS.primary;
      case 'ghost':
        return COLORS.textSecondary;
      default:
        return COLORS.textInverse;
    }
  };

  const getMinHeight = () => {
    if (size === 'sm') return 44;
    if (size === 'lg') return 60;
    return SIZES.minTouchTarget; // 52px min touch target
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseBtn,
        getContainerStyle(),
        { minHeight: getMinHeight() },
        disabled && styles.disabledBtn,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={size === 'lg' ? 24 : 20}
              color={textColor}
              style={styles.leftIcon}
            />
          )}

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.btnText,
                size === 'lg' && styles.btnTextLg,
                size === 'sm' && styles.btnTextSm,
                { color: textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[
                  styles.btnSubtitle,
                  { color: variant === 'primary' ? 'rgba(255,255,255,0.85)' : COLORS.textMuted },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={size === 'lg' ? 24 : 20}
              color={textColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtn: {
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryBtn: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
  },
  successBtn: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  disabledBtn: {
    backgroundColor: COLORS.surfaceMuted,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  btnTextLg: {
    fontSize: 18,
  },
  btnTextSm: {
    fontSize: 14,
  },
  btnSubtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
