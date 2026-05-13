import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, style }) => {
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    fontSize: fontSizes['3xl'],
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
});
