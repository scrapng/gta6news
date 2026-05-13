export const DEFAULT_USER = {
  id: 'user-1',
  name: 'Alex Runner',
  email: 'alex@stepchallenge.com',
  createdAt: new Date().toISOString(),
};

export const DEFAULT_WALLET = {
  id: 'wallet-1',
  userId: DEFAULT_USER.id,
  balance: 2500,
  totalDeposited: 5000,
  totalWithdrawn: 2500,
  updatedAt: new Date().toISOString(),
};

export const CHALLENGE_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
} as const;

export const PARTICIPANT_STATUS = {
  ACTIVE: 'active',
  ELIMINATED: 'eliminated',
  COMPLETED: 'completed',
} as const;

export const TAB_ROUTES = {
  DISCOVER: '/(tabs)/discover',
  CHALLENGES: '/(tabs)/my-challenges',
  LEADERBOARD: '/(tabs)/leaderboard',
  WALLET: '/(tabs)/wallet',
  PROFILE: '/(tabs)/profile',
} as const;

export const SCREEN_PADDING = 16;

export const ANIMATION_DURATION = 300;

export const TAP_FEEDBACK = {
  ios: 'light' as const,
  android: 'tactile' as const,
};
