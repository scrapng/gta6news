import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'gradient' | 'glass';
  shadow?: 'sm' | 'md' | 'lg';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  shadow = 'md',
  padding = spacing.lg,
}) => {
  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.xl,
      padding,
      overflow: 'hidden',
    };

    const variants = {
      default: {
        ...baseStyle,
        backgroundColor: colors.bg.secondary,
      },
      gradient: {
        ...baseStyle,
        backgroundColor: colors.bg.tertiary,
      },
      glass: {
        ...baseStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    };

    return variants[variant];
  };

  const shadowStyle = shadows[shadow];

  return (
    <View style={[getVariantStyle(), shadowStyle, style]}>
      {children}
    </View>
  );
};
