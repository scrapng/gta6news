import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card, Button, StatCard } from '@components';
import { useAppStore } from '@store/appStore';

export const ProfileScreen: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const wallet = useAppStore((state) => state.wallet);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Account Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total Deposited" value={`$${wallet.totalDeposited}`} icon="💰" />
          <StatCard label="Total Withdrawn" value={`$${wallet.totalWithdrawn}`} icon="🏦" />
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy</Text>
            <Text style={styles.settingValue}>Public Profile</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </View>
        </Card>

        <View style={styles.actionContainer}>
          <Button label="Sign Out" onPress={() => {}} variant="secondary" size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.xl,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  profileAvatar: {
    fontSize: fontSizes['4xl'],
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  settingsCard: {
    marginBottom: spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  settingLabel: {
    fontSize: fontSizes.base,
    color: colors.text.primary,
    fontWeight: fontWeights.semibold,
  },
  settingValue: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actionContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
