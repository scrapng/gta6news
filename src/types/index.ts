export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  creatorName: string;
  creatorAvatar?: string;
  image?: string;
  dailyTarget: number; // steps per day
  durationDays: number;
  entryFee: number;
  prizePool: number;
  participantCount: number;
  joinedCount: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'live' | 'completed';
  rules: string[];
  createdAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'active' | 'eliminated' | 'completed';
  daysCompleted: number;
  joinedAt: string;
}

export interface DailyCheckin {
  id: string;
  challengeId: string;
  userId: string;
  date: string;
  steps: number;
  targetMet: boolean;
  checkinAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  challengeId?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  challengeId: string;
  userId: string;
  amount: number;
  distributeAt: string;
  status: 'pending' | 'distributed';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  relatedChallengeId?: string;
  read: boolean;
  createdAt: string;
}
