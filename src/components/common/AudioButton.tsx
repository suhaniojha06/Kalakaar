import React, { useEffect, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface AudioButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  durationSeconds?: number;
  label?: string;
  style?: ViewStyle;
  variant?: 'compact' | 'full';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  isPlaying,
  onToggle,
  durationSeconds = 14,
  label,
  style,
  variant = 'compact',
}) => {
  // Wave bar animated heights using useMemo
  const wave1 = useMemo(() => new Animated.Value(6), []);
  const wave2 = useMemo(() => new Animated.Value(12), []);
  const wave3 = useMemo(() => new Animated.Value(18), []);
  const wave4 = useMemo(() => new Animated.Value(10), []);

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | undefined;
    if (isPlaying) {
      animLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(wave1, { toValue: 18, duration: 250, useNativeDriver: false }),
            Animated.timing(wave2, { toValue: 8, duration: 250, useNativeDriver: false }),
            Animated.timing(wave3, { toValue: 22, duration: 250, useNativeDriver: false }),
            Animated.timing(wave4, { toValue: 16, duration: 250, useNativeDriver: false }),
          ]),
          Animated.parallel([
            Animated.timing(wave1, { toValue: 8, duration: 250, useNativeDriver: false }),
            Animated.timing(wave2, { toValue: 20, duration: 250, useNativeDriver: false }),
            Animated.timing(wave3, { toValue: 10, duration: 250, useNativeDriver: false }),
            Animated.timing(wave4, { toValue: 6, duration: 250, useNativeDriver: false }),
          ]),
        ])
      );
      animLoop.start();
    } else {
      wave1.setValue(6);
      wave2.setValue(12);
      wave3.setValue(16);
      wave4.setValue(8);
    }
    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isPlaying, wave1, wave2, wave3, wave4]);

  const isFull = variant === 'full';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[
        styles.container,
        isFull ? styles.containerFull : styles.containerCompact,
        isPlaying && styles.containerPlaying,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? 'Pause audio' : 'Play voice note'}
    >
      <View style={[styles.iconCircle, isPlaying && styles.iconCirclePlaying]}>
        <Ionicons
          name={isPlaying ? 'pause' : 'volume-medium'}
          size={isFull ? 20 : 16}
          color={isPlaying ? COLORS.textInverse : COLORS.primary}
        />
      </View>

      <View style={styles.infoCol}>
        <Text style={[styles.titleText, isPlaying && styles.titlePlaying]} numberOfLines={1}>
          {label || (isPlaying ? 'Playing Voice Note...' : 'Listen Voice Note')}
        </Text>
        <Text style={styles.durationText}>0:0{durationSeconds}s • Tap to {isPlaying ? 'stop' : 'listen'}</Text>
      </View>

      {/* Animated Waveform */}
      <View style={styles.waveContainer}>
        <Animated.View style={[styles.waveBar, { height: wave1, backgroundColor: isPlaying ? COLORS.primary : COLORS.borderDark }]} />
        <Animated.View style={[styles.waveBar, { height: wave2, backgroundColor: isPlaying ? COLORS.primary : COLORS.borderDark }]} />
        <Animated.View style={[styles.waveBar, { height: wave3, backgroundColor: isPlaying ? COLORS.primary : COLORS.borderDark }]} />
        <Animated.View style={[styles.waveBar, { height: wave4, backgroundColor: isPlaying ? COLORS.primary : COLORS.borderDark }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    borderRadius: 14,
    minHeight: 52, // accessible touch target
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  containerCompact: {
    alignSelf: 'flex-start',
  },
  containerFull: {
    width: '100%',
  },
  containerPlaying: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySubtle,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCirclePlaying: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titlePlaying: {
    color: COLORS.primaryDark,
  },
  durationText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    width: 32,
    justifyContent: 'space-between',
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
});
