import React from 'react';
import { View, Pressable, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '@theme';

type Screen = 'discover' | 'challenges' | 'leaderboard' | 'wallet' | 'profile';

interface TabBarProps {
  activeTab: Screen;
  onTabChange: (tab: Screen) => void;
}

interface TabItem {
  name: Screen;
  label: string;
  emoji: string;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    { name: 'discover', label: 'Discover', emoji: '🔍' },
    { name: 'challenges', label: 'Challenges', emoji: '⭐' },
    { name: 'leaderboard', label: 'Leaderboard', emoji: '🏆' },
    { name: 'wallet', label: 'Wallet', emoji: '💰' },
    { name: 'profile', label: 'Profile', emoji: '👤' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabChange(tab.name)}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIcon]}>
                <Text style={styles.emoji}>{tab.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? colors.accent.gold : colors.text.tertiary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  activeTab: {
    backgroundColor: colors.bg.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent.gold,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  activeIcon: {
    shadowColor: colors.accent.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
});
