import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '@theme';
import { getProgressPercentage } from '@utils/time';

interface ProgressBarProps {
  current: number;
  target: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  variant = 'default',
  showLabel = true,
  label,
  style,
}) => {
  const percentage = getProgressPercentage(current, target);

  const getVariantColor = () => {
    const colorMap = {
      default: colors.accent.gold,
      success: colors.status.success,
      warning: colors.status.warning,
      error: colors.status.error,
    };
    return colorMap[variant];
  };

  return (
    <View style={style}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label || 'Progress'}</Text>
          <Text style={styles.value}>
            {current.toLocaleString()} / {target.toLocaleString()}
          </Text>
        </View>
      )}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getVariantColor(),
            },
          ]}
        />
      </View>
      <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  value: {
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    fontWeight: '600',
  },
  barContainer: {
    height: 12,
    backgroundColor: colors.bg.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentage: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textAlign: 'right',
  },
});
