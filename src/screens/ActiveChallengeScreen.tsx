import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Challenge, DailyCheckin } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { Card, Button, ProgressBar, StatCard } from '@components';
import { checkinAPI, participantAPI } from '@services/api';
import { useAppStore } from '@store/appStore';
import { formatSteps } from '@utils/time';

interface ActiveChallengeScreenProps {
  challenge: Challenge;
  onBack: () => void;
}

export const ActiveChallengeScreen: React.FC<ActiveChallengeScreenProps> = ({ challenge, onBack }) => {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncTime, setSyncTime] = useState<string | null>(null);

  const user = useAppStore((state) => state.user);
  const setCurrentStepsStore = useAppStore((state) => state.setCurrentSteps);
  const setDailyCheckinsStore = useAppStore((state) => state.setDailyCheckins);

  useEffect(() => {
    loadChallengeData();
  }, []);

  const loadChallengeData = async () => {
    setLoading(true);
    try {
      const steps = await checkinAPI.getCurrentSteps(user.id);
      setCurrentSteps(steps);
      setCurrentStepsStore(steps);

      const checkins = await checkinAPI.getDailyCheckins(challenge.id, user.id);
      setDailyCheckins(checkins);
      setDailyCheckinsStore(checkins);
    } catch (error) {
      console.error('Failed to load challenge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSteps = async () => {
    setLoading(true);
    try {
      const steps = await checkinAPI.getCurrentSteps(user.id);
      setCurrentSteps(steps);
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentStepsStore(steps);

      const today = new Date().toISOString().split('T')[0];
      const targetMet = steps >= challenge.dailyTarget;
      const checkin = await checkinAPI.recordCheckin(challenge.id, user.id, steps, targetMet);

      setDailyCheckins((prev) => {
        const updated = prev.filter((c) => c.date !== today);
        return [...updated, checkin];
      });
    } catch (error) {
      console.error('Failed to sync steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayCheckin = dailyCheckins.find((c) => c.date === new Date().toISOString().split('T')[0]);
  const targetMet = todayCheckin ? todayCheckin.targetMet : false;
  const totalCompleted = dailyCheckins.filter((c) => c.targetMet).length;
  const isOnTrack = targetMet;
  const streak = dailyCheckins.length;

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Card style={styles.heroCard}>
          <Text style={styles.challengeName}>{challenge.name}</Text>
          <Text style={styles.challengeStatus}>
            {isOnTrack ? '✅ On Track' : '⚠️ Behind'}
          </Text>
        </Card>

        <View style={styles.stepsContainer}>
          <Card style={styles.stepsCard}>
            <Text style={styles.stepsLabel}>Today's Steps</Text>
            <Text style={styles.stepsValue}>{formatSteps(currentSteps)}</Text>
            <ProgressBar
              current={currentSteps}
              target={challenge.dailyTarget}
              label="Daily Goal"
              variant={isOnTrack ? 'success' : 'warning'}
              style={styles.progressBar}
            />
            <Text style={styles.syncInfo}>
              {syncTime ? `Last synced at ${syncTime}` : 'Not synced today'}
            </Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Days Left" value={challenge.durationDays - streak} icon="📅" />
          <StatCard label="Streak" value={totalCompleted} icon="🔥" />
        </View>

        <Card style={styles.historyCard}>
          <Text style={styles.historyTitle}>Daily Progress</Text>
          <View style={styles.daysList}>
            {Array.from({ length: challenge.durationDays }).map((_, i) => {
              const checkin = dailyCheckins[i];
              const dayNum = i + 1;
              return (
                <View key={i} style={styles.dayItem}>
                  <View style={[
                    styles.dayIndicator,
                    checkin?.targetMet ? styles.daySuccess : styles.dayPending,
                  ]}>
                    <Text style={styles.dayNumber}>{dayNum}</Text>
                  </View>
                  <Text style={styles.daySteps}>
                    {checkin ? formatSteps(checkin.steps) : '-'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <View style={styles.ctaContainer}>
          <Button
            label="Sync Steps"
            onPress={handleSyncSteps}
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
  heroCard: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  challengeName: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  challengeStatus: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.accent.gold,
  },
  stepsContainer: {
    marginBottom: spacing.xl,
  },
  stepsCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  stepsLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  stepsValue: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
    marginBottom: spacing.lg,
  },
  progressBar: {
    marginBottom: spacing.lg,
  },
  syncInfo: {
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  historyCard: {
    marginBottom: spacing.xl,
  },
  historyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  daysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
  },
  dayIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  daySuccess: {
    backgroundColor: colors.status.success,
  },
  dayPending: {
    backgroundColor: colors.bg.tertiary,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dayNumber: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
    color: colors.text.primary,
  },
  daySteps: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  ctaContainer: {
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
