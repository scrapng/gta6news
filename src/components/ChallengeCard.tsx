import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, ViewStyle } from 'react-native';
import { Challenge } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { getTimeUntilStart, formatSteps } from '@utils/time';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
  style?: ViewStyle;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onPress, style }) => {
  const timeUntil = getTimeUntilStart(challenge.startDate);
  const isLive = challenge.status === 'live';

  const backgroundColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'];
  const bgColor = backgroundColors[Math.abs(challenge.id.charCodeAt(0)) % backgroundColors.length];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && { opacity: 0.9 }, style]}>
      <ImageBackground
        source={{ uri: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23' + bgColor.slice(1) + '" width="400" height="300"/%3E%3C/svg%3E' }}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.overlay} />

        <View style={styles.header}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {isLive ? '🔴 LIVE' : '🔔 ' + (challenge.status === 'upcoming' ? 'OPEN TO JOIN' : 'COMPLETED')}
            </Text>
          </View>

          {!isLive && (
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>STARTS IN {timeUntil.days}D</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{challenge.name}</Text>

          <Text style={styles.creator}>
            {challenge.creatorAvatar} {challenge.creatorName}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {formatSteps(challenge.dailyTarget)} steps daily • {challenge.durationDays}d
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>${challenge.entryFee}</Text>
              <Text style={styles.statLabel}>Entry</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>${challenge.prizePool}</Text>
              <Text style={styles.statLabel}>Pool</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{challenge.participantCount}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    height: 240,
  },
  background: {
    flex: 1,
    padding: spacing.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    zIndex: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    color: colors.text.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  timerBadge: {
    backgroundColor: colors.accent.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  timerText: {
    color: colors.bg.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  creator: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    marginBottom: spacing.md,
  },
  metaText: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: spacing.md,
    zIndex: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
