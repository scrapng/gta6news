import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card } from '@components';
import { useAppStore } from '@store/appStore';

const mockLeaderboard = [
  { rank: 1, name: 'Swift Runner', steps: 287450, avatar: '🏃' },
  { rank: 2, name: 'Step Master', steps: 256300, avatar: '👟' },
  { rank: 3, name: 'Active Believer', steps: 243890, avatar: '⚡' },
  { rank: 4, name: 'Pace Keeper', steps: 198760, avatar: '⏱️' },
  { rank: 5, name: 'Trail Blazer', steps: 187450, avatar: '🚶' },
  { rank: 6, name: 'Steady Steps', steps: 156789, avatar: '👣' },
  { rank: 7, name: 'Goal Crusher', steps: 145620, avatar: '💪' },
  { rank: 8, name: 'Daily Jogger', steps: 134560, avatar: '🏃‍♂️' },
];

export const LeaderboardScreen: React.FC = () => {
  const user = useAppStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Global rankings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Card style={styles.yourRankCard}>
          <View style={styles.yourRankContent}>
            <Text style={styles.yourRankLabel}>Your Rank</Text>
            <Text style={styles.yourRankValue}>#42</Text>
            <Text style={styles.yourSteps}>154,230 steps</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Top Steppers</Text>
        {mockLeaderboard.map((entry) => (
          <Card key={entry.rank} style={styles.leaderboardItem}>
            <View style={styles.rankContainer}>
              <Text style={[styles.rank, entry.rank === 1 && styles.rankFirst, entry.rank === 2 && styles.rankSecond, entry.rank === 3 && styles.rankThird]}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
              </Text>
            </View>
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>{entry.avatar} {entry.name}</Text>
              <Text style={styles.leaderboardSteps}>{entry.steps.toLocaleString()} steps</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badge}>
                {Math.floor(entry.steps / 10000)}k
              </Text>
            </View>
          </Card>
        ))}
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  yourRankCard: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.accent.gold,
  },
  yourRankContent: {
    alignItems: 'center',
  },
  yourRankLabel: {
    fontSize: fontSizes.sm,
    color: colors.bg.primary,
    marginBottom: spacing.sm,
  },
  yourRankValue: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.bg.primary,
    marginBottom: spacing.sm,
  },
  yourSteps: {
    fontSize: fontSizes.base,
    color: colors.bg.primary,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rankContainer: {
    marginRight: spacing.lg,
    minWidth: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
  },
  rankFirst: {
    color: colors.accent.gold,
  },
  rankSecond: {
    color: colors.accent.gold,
  },
  rankThird: {
    color: colors.accent.gold,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  leaderboardSteps: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  badgeContainer: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  badge: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
  },
});
