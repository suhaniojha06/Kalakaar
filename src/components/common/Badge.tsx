import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface BadgeProps {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'success' | 'warning' | 'primary' | 'neutral' | 'channel';
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  iconName,
  variant = 'neutral',
  style,
  textStyle,
  size = 'md',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: COLORS.successLight, text: COLORS.successDark, icon: COLORS.success };
      case 'warning':
        return { bg: COLORS.warningLight, text: COLORS.warning, icon: COLORS.warning };
      case 'primary':
        return { bg: COLORS.primarySubtle, text: COLORS.primaryDark, icon: COLORS.primary };
      case 'channel':
        return { bg: COLORS.ochreSubtle, text: COLORS.ochreDark, icon: COLORS.ochre };
      default:
        return { bg: COLORS.surfaceCard, text: COLORS.textSecondary, icon: COLORS.textMuted };
    }
  };

  const colors = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        isSm && styles.badgeSm,
        style,
      ]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={isSm ? 13 : 15}
          color={colors.icon}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text },
          isSm && styles.textSm,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
    fontWeight: '600',
  },
});
