import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  loading = false,
}) => {
  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const variants = {
      primary: {
        ...baseStyle,
        backgroundColor: colors.accent.gold,
      },
      secondary: {
        ...baseStyle,
        backgroundColor: colors.bg.tertiary,
        borderWidth: 1,
        borderColor: colors.border,
      },
      success: {
        ...baseStyle,
        backgroundColor: colors.status.success,
      },
      danger: {
        ...baseStyle,
        backgroundColor: colors.status.error,
      },
    };

    return variants[variant];
  };

  const getSizeStyle = () => {
    const sizes = {
      sm: { padding: spacing.sm },
      md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
      lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
    };

    return sizes[size];
  };

  const getTextColor = () => {
    if (variant === 'primary' || variant === 'success' || variant === 'danger') {
      return colors.text.primary;
    }
    return colors.text.secondary;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getVariantStyle(),
        getSizeStyle(),
        pressed && !disabled && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: size === 'sm' ? fontSizes.sm : size === 'lg' ? fontSizes.lg : fontSizes.base,
            fontWeight: fontWeights.semibold,
          },
        ]}
      >
        {loading ? 'Loading...' : label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
