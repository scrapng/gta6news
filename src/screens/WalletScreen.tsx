import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card, Button, StatCard } from '@components';
import { useAppStore } from '@store/appStore';

export const WalletScreen: React.FC = () => {
  const wallet = useAppStore((state) => state.wallet);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Card style={styles.balanceCard}>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>${wallet.balance.toFixed(2)}</Text>
            <Text style={styles.balanceDesc}>Ready to challenge</Text>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <StatCard label="Deposited" value={`$${wallet.totalDeposited}`} icon="📥" />
          <StatCard label="Withdrawn" value={`$${wallet.totalWithdrawn}`} icon="📤" />
        </View>

        <Text style={styles.sectionTitle}>Transaction History</Text>
        <Card style={styles.transactionsCard}>
          <View style={styles.transactionItem}>
            <View style={styles.txInfo}>
              <Text style={styles.txLabel}>Joined Cash Club</Text>
              <Text style={styles.txDate}>Today at 2:30 PM</Text>
            </View>
            <Text style={[styles.txAmount, styles.debit]}>-$20.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.transactionItem}>
            <View style={styles.txInfo}>
              <Text style={styles.txLabel}>Prize distribution</Text>
              <Text style={styles.txDate}>May 10, 2026</Text>
            </View>
            <Text style={[styles.txAmount, styles.credit]}>+$150.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.transactionItem}>
            <View style={styles.txInfo}>
              <Text style={styles.txLabel}>Joined Daily Stride</Text>
              <Text style={styles.txDate}>May 8, 2026</Text>
            </View>
            <Text style={[styles.txAmount, styles.debit]}>-$10.00</Text>
          </View>
        </Card>

        <View style={styles.actionContainer}>
          <Button label="Add Funds" onPress={() => {}} variant="primary" size="lg" />
          <Button label="Withdraw" onPress={() => {}} variant="secondary" size="lg" style={styles.secondaryButton} />
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
  balanceCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.accent.gold,
    padding: spacing.xl,
  },
  balanceContent: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: fontSizes.sm,
    color: colors.bg.primary,
    marginBottom: spacing.sm,
  },
  balanceValue: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.bg.primary,
    marginBottom: spacing.sm,
  },
  balanceDesc: {
    fontSize: fontSizes.sm,
    color: colors.bg.primary,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  transactionsCard: {
    marginBottom: spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  txInfo: {
    flex: 1,
  },
  txLabel: {
    fontSize: fontSizes.base,
    color: colors.text.primary,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  txDate: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  txAmount: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  debit: {
    color: colors.status.error,
  },
  credit: {
    color: colors.status.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actionContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.md,
  },
});
