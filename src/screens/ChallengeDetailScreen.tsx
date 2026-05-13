import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, ImageBackground } from 'react-native';
import { Challenge, ChallengeParticipant } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '@theme';
import { Button, Card, StatCard, ProgressBar } from '@components';
import { participantAPI, challengeAPI } from '@services/api';
import { getTimeUntilStart, formatDate, formatSteps } from '@utils/time';

interface ChallengeDetailScreenProps {
  challenge: Challenge;
  onBack: () => void;
  onJoin: (challenge: Challenge) => void;
  onStartChallenge: (challenge: Challenge) => void;
}

export const ChallengeDetailScreen: React.FC<ChallengeDetailScreenProps> = ({
  challenge,
  onBack,
  onJoin,
  onStartChallenge,
}) => {
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);

  useEffect(() => {
    loadParticipants();
  }, [challenge.id]);

  const loadParticipants = async () => {
    try {
      const p = await participantAPI.getParticipants(challenge.id);
      setParticipants(p);
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
  };

  const timeUntil = getTimeUntilStart(challenge.startDate);
  const totalProgress = (challenge.prizePool / (challenge.participantCount * challenge.entryFee)) * 100;
  const backgroundColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'];
  const bgColor = backgroundColors[Math.abs(challenge.id.charCodeAt(0)) % backgroundColors.length];

  const isLive = challenge.status === 'live';

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <ImageBackground
          source={{ uri: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23' + bgColor.slice(1) + '" width="400" height="300"/%3E%3C/svg%3E' }}
          style={styles.heroImage}
          imageStyle={{ opacity: 0.3 }}
        >
          <View style={styles.heroOverlay} />
        </ImageBackground>

        <View style={styles.detailsContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{challenge.name}</Text>
            <Text style={styles.subtitle}>
              {challenge.description}
            </Text>
          </View>

          <Card style={styles.prizeCard}>
            <View style={styles.prizeContent}>
              <Text style={styles.prizeLabel}>Prize Pool</Text>
              <Text style={styles.prizeValue}>${challenge.prizePool}</Text>
              <Text style={styles.prizeDesc}>Finish all challenge days to share the prize pool.</Text>
              <ProgressBar
                current={challenge.prizePool}
                target={challenge.participantCount * challenge.entryFee}
                label="Pool Progress"
                variant="success"
                style={styles.progressBar}
              />
            </View>
          </Card>

          <View style={styles.statsGrid}>
            <StatCard label="Commitment" value={`$${challenge.entryFee}`} icon="💰" />
            <StatCard label="Participants" value={challenge.participantCount} icon="👥" />
          </View>

          <View style={styles.statsGrid}>
            <StatCard label="Daily Steps" value={formatSteps(challenge.dailyTarget)} icon="👟" />
            <StatCard label="Duration" value={`${challenge.durationDays}d`} icon="📅" />
          </View>

          {!isLive && (
            <Card style={styles.countdownCard}>
              <View>
                <Text style={styles.countdownLabel}>Starts In</Text>
                <View style={styles.countdownRow}>
                  <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{timeUntil.days}</Text>
                    <Text style={styles.countdownUnit}>Days</Text>
                  </View>
                  <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{timeUntil.hours}</Text>
                    <Text style={styles.countdownUnit}>Hours</Text>
                  </View>
                  <View style={styles.countdownBox}>
                    <Text style={styles.countdownValue}>{timeUntil.minutes}</Text>
                    <Text style={styles.countdownUnit}>Mins</Text>
                  </View>
                </View>
              </View>
            </Card>
          )}

          <Card style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>How It Works</Text>
            {challenge.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>{index + 1}</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.participantsCard}>
            <Text style={styles.participantsTitle}>
              {challenge.participantCount} people are in
            </Text>
            <Text style={styles.participantsDesc}>You can still join.</Text>
            <View style={styles.avatarRow}>
              {participants.slice(0, 4).map((p) => (
                <View key={p.id} style={styles.avatar}>
                  <Text style={styles.avatarText}>{p.userAvatar || '👤'}</Text>
                </View>
              ))}
              {challenge.participantCount > 4 && (
                <View style={[styles.avatar, styles.moreAvatar]}>
                  <Text style={styles.moreAvatarText}>+{challenge.participantCount - 4}</Text>
                </View>
              )}
            </View>
          </Card>
        </View>

        <View style={styles.actionButtonContainer}>
          <Button
            label={isLive ? 'View Challenge' : 'Join Challenge'}
            onPress={() => (isLive ? onStartChallenge(challenge) : onJoin(challenge))}
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
  },
  heroImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },
  prizeCard: {
    marginBottom: spacing.xl,
  },
  prizeContent: {
    alignItems: 'center',
  },
  prizeLabel: {
    fontSize: fontSizes.sm,
    color: colors.accent.gold,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.md,
  },
  prizeValue: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  prizeDesc: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  progressBar: {
    width: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  countdownCard: {
    marginBottom: spacing.xl,
  },
  countdownLabel: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  countdownBox: {
    alignItems: 'center',
    backgroundColor: colors.bg.tertiary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: '25%',
  },
  countdownValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  countdownUnit: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  rulesCard: {
    marginBottom: spacing.xl,
  },
  rulesTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
    marginBottom: spacing.lg,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  ruleNumber: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.accent.gold,
    marginRight: spacing.md,
    width: 30,
    textAlign: 'center',
  },
  ruleText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },
  participantsCard: {
    marginBottom: spacing.xl,
  },
  participantsTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  participantsDesc: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -10,
    borderWidth: 2,
    borderColor: colors.bg.primary,
  },
  avatarText: {
    fontSize: fontSizes.lg,
  },
  moreAvatar: {
    backgroundColor: colors.accent.pink,
  },
  moreAvatarText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  actionButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
