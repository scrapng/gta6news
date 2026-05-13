import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Challenge } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card } from '@components';
import { challengeAPI } from '@services/api';
import { useAppStore } from '@store/appStore';
import { formatSteps } from '@utils/time';

interface MyChallengesScreenProps {
  onChallengeSelect?: (challenge: Challenge) => void;
}

export const MyChallengesScreen: React.FC<MyChallengesScreenProps> = ({ onChallengeSelect }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const all = await challengeAPI.getAllChallenges();
      setChallenges(all.filter((c) => c.status !== 'completed'));
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Challenges</Text>
        <Text style={styles.subtitle}>Active and upcoming</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : challenges.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No active challenges</Text>
            <Text style={styles.emptyDesc}>Join a challenge from Discover to get started</Text>
          </View>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge.id} style={styles.challengeItem}>
              <View style={styles.challengeHeader}>
                <View>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeStatus}>
                    {challenge.status === 'live' ? '🔴 LIVE' : '📅 UPCOMING'}
                  </Text>
                </View>
                <View style={styles.participantBadge}>
                  <Text style={styles.badgeText}>{challenge.participantCount}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.challengeMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Daily Goal</Text>
                  <Text style={styles.metaValue}>{formatSteps(challenge.dailyTarget)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Prize Pool</Text>
                  <Text style={styles.metaValue}>${challenge.prizePool}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>{challenge.durationDays}d</Text>
                </View>
              </View>
            </Card>
          ))
        )}
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
  challengeItem: {
    marginBottom: spacing.lg,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  challengeName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  challengeStatus: {
    fontSize: fontSizes.sm,
    color: colors.accent.gold,
  },
  participantBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  metaValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyDesc: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
});
