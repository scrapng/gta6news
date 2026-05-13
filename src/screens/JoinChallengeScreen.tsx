import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Animated } from 'react-native';
import { Challenge } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Button, Card, StatCard } from '@components';
import { challengeAPI } from '@services/api';
import { useAppStore } from '@store/appStore';
import { formatSteps } from '@utils/time';

interface JoinChallengeScreenProps {
  challenge: Challenge;
  onBack: () => void;
  onSuccess: () => void;
}

export const JoinChallengeScreen: React.FC<JoinChallengeScreenProps> = ({ challenge, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [slideProgress] = useState(new Animated.Value(0));
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const wallet = useAppStore((state) => state.wallet);
  const setWallet = useAppStore((state) => state.setWallet);

  const canAfford = wallet.balance >= challenge.entryFee;

  const handleJoin = async () => {
    if (!canAfford) return;

    setLoading(true);
    try {
      const result = await challengeAPI.joinChallenge(challenge.id, wallet.userId);
      if (result.success) {
        const newBalance = wallet.balance - challenge.entryFee;
        setWallet({
          ...wallet,
          balance: newBalance,
          totalDeposited: wallet.totalDeposited + challenge.entryFee,
        });
        setConfirmationVisible(true);
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (confirmationVisible) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>You're All Set!</Text>
          <Text style={styles.successMessage}>
            We've charged ${challenge.entryFee} from your wallet. Get ready to step!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.screenTitle}>Confirm Your Entry</Text>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Challenge</Text>
            <Text style={styles.summaryValue}>{challenge.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Daily Target</Text>
            <Text style={styles.summaryValue}>{formatSteps(challenge.dailyTarget)} steps</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{challenge.durationDays} days</Text>
          </View>
        </Card>

        <Text style={styles.paymentTitle}>Using balance from your wallet</Text>

        <Card style={styles.walletCard}>
          <View style={styles.walletInfo}>
            <View>
              <Text style={styles.walletLabel}>Your Wallet</Text>
              <Text style={styles.walletBalance}>${wallet.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.walletArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View>
              <Text style={styles.walletLabel}>After Payment</Text>
              <Text style={[styles.walletBalance, !canAfford && styles.errorText]}>
                ${(wallet.balance - challenge.entryFee).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        {!canAfford && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>Insufficient balance</Text>
          </View>
        )}

        <Card style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Entry Fee</Text>
            <Text style={styles.breakdownValue}>${challenge.entryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={[styles.breakdownItem, styles.totalBreakdown]}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalValue}>${challenge.entryFee.toFixed(2)}</Text>
          </View>
        </Card>

        <View style={styles.ctaContainer}>
          <Button
            label="Slide to join"
            onPress={handleJoin}
            disabled={!canAfford || loading}
            loading={loading}
            variant="primary"
            size="lg"
          />
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
  successContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: fontSizes['4xl'],
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backArrow: {
    fontSize: 20,
    marginRight: spacing.sm,
    color: colors.text.primary,
  },
  backText: {
    color: colors.text.primary,
    marginLeft: spacing.sm,
    fontSize: fontSizes.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  screenTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryItem: {
    paddingVertical: spacing.md,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  paymentTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.accent.gold,
    marginBottom: spacing.md,
  },
  walletCard: {
    marginBottom: spacing.xl,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  walletBalance: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  walletArrow: {
    marginHorizontal: spacing.md,
  },
  arrowText: {
    fontSize: fontSizes.xl,
    color: colors.text.secondary,
  },
  errorMessage: {
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.status.error,
    fontSize: fontSizes.base,
  },
  breakdownCard: {
    marginBottom: spacing.xl,
  },
  breakdownTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  breakdownLabel: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  breakdownValue: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  totalBreakdown: {
    paddingVertical: spacing.lg,
  },
  totalLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
  },
  ctaContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
