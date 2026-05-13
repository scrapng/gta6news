import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Challenge } from '@types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '@theme';
import { ChallengeCard, Button } from '@components';
import { challengeAPI } from '@services/api';
import { useAppStore } from '@store/appStore';

interface DiscoverScreenProps {
  onChallengeSelect: (challenge: Challenge) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onChallengeSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const setChallenges = useAppStore((state) => state.setChallenges);

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    filterChallenges(searchQuery);
  }, [searchQuery]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const challenges = await challengeAPI.getAllChallenges();
      setChallenges(challenges);
      setFilteredChallenges(challenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = async (query: string) => {
    if (query.trim() === '') {
      const challenges = await challengeAPI.getAllChallenges();
      setFilteredChallenges(challenges);
    } else {
      const results = await challengeAPI.searchChallenges(query);
      setFilteredChallenges(results);
    }
  };

  const upcomingChallenges = filteredChallenges.filter((c) => c.status === 'upcoming');
  const publicChallenges = filteredChallenges.filter((c) => c.status !== 'completed');
  const liveChallenges = filteredChallenges.filter((c) => c.status === 'live');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Browse and join challenges</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search challenges..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      ) : filteredChallenges.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No challenges found</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {upcomingChallenges.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>📅 Upcoming Challenges</Text>
              {upcomingChallenges.slice(0, 2).map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={() => onChallengeSelect(challenge)}
                  style={styles.cardMargin}
                />
              ))}
            </View>
          )}

          {publicChallenges.length > 2 && (
            <View>
              <Text style={styles.sectionTitle}>💧 Available Public Challenges</Text>
              {publicChallenges.slice(0, 3).map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={() => onChallengeSelect(challenge)}
                  style={styles.cardMargin}
                />
              ))}
            </View>
          )}

          {liveChallenges.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>🔴 Happening Now</Text>
              {liveChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={() => onChallengeSelect(challenge)}
                  style={styles.cardMargin}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
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
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    fontSize: fontSizes.base,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginLeft: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  cardMargin: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
});
