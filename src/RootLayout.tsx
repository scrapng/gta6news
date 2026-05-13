import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Challenge } from '@types';
import { colors } from '@theme';
import {
  DiscoverScreen,
  ChallengeDetailScreen,
  JoinChallengeScreen,
  ActiveChallengeScreen,
  MyChallengesScreen,
  LeaderboardScreen,
  ProfileScreen,
  WalletScreen,
} from '@screens';
import { TabBar } from './components/TabBar';
import { useAppStore } from '@store/appStore';

type Screen = 'discover' | 'challenges' | 'leaderboard' | 'wallet' | 'profile';
type DetailScreen = 'challengeDetail' | 'joinChallenge' | 'activeChallenge' | null;

export const RootLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Screen>('discover');
  const [detailScreen, setDetailScreen] = useState<DetailScreen>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const user = useAppStore((state) => state.user);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDetailScreen('challengeDetail');
  };

  const handleJoin = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDetailScreen('joinChallenge');
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDetailScreen('activeChallenge');
  };

  const handleBackToTabs = () => {
    setDetailScreen(null);
    setSelectedChallenge(null);
  };

  const handleJoinSuccess = () => {
    setDetailScreen('activeChallenge');
  };

  if (detailScreen === 'challengeDetail' && selectedChallenge) {
    return (
      <ChallengeDetailScreen
        challenge={selectedChallenge}
        onBack={handleBackToTabs}
        onJoin={handleJoin}
        onStartChallenge={handleStartChallenge}
      />
    );
  }

  if (detailScreen === 'joinChallenge' && selectedChallenge) {
    return (
      <JoinChallengeScreen
        challenge={selectedChallenge}
        onBack={() => setDetailScreen('challengeDetail')}
        onSuccess={handleJoinSuccess}
      />
    );
  }

  if (detailScreen === 'activeChallenge' && selectedChallenge) {
    return (
      <ActiveChallengeScreen
        challenge={selectedChallenge}
        onBack={handleBackToTabs}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {activeTab === 'discover' && <DiscoverScreen onChallengeSelect={handleSelectChallenge} />}
        {activeTab === 'challenges' && <MyChallengesScreen onChallengeSelect={handleSelectChallenge} />}
        {activeTab === 'leaderboard' && <LeaderboardScreen />}
        {activeTab === 'wallet' && <WalletScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  screenContainer: {
    flex: 1,
  },
});
