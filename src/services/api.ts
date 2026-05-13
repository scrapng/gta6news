import { Challenge, ChallengeParticipant, DailyCheckin, User, Wallet } from '@types';
import { mockChallenges, mockParticipants, mockDailyCheckins } from './mockData';
import { DEFAULT_USER, DEFAULT_WALLET } from '@constants';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const challengeAPI = {
  getAllChallenges: async (): Promise<Challenge[]> => {
    await delay(300);
    return mockChallenges;
  },

  getChallengeById: async (id: string): Promise<Challenge | null> => {
    await delay(200);
    return mockChallenges.find(c => c.id === id) || null;
  },

  getChallengesByStatus: async (status: string): Promise<Challenge[]> => {
    await delay(300);
    return mockChallenges.filter(c => c.status === status);
  },

  searchChallenges: async (query: string): Promise<Challenge[]> => {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return mockChallenges.filter(
      c => c.name.toLowerCase().includes(lowercaseQuery) ||
           c.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  filterChallenges: async (filters: { minFee?: number; maxFee?: number; minDays?: number; maxDays?: number }): Promise<Challenge[]> => {
    await delay(300);
    return mockChallenges.filter(c => {
      if (filters.minFee && c.entryFee < filters.minFee) return false;
      if (filters.maxFee && c.entryFee > filters.maxFee) return false;
      if (filters.minDays && c.durationDays < filters.minDays) return false;
      if (filters.maxDays && c.durationDays > filters.maxDays) return false;
      return true;
    });
  },

  joinChallenge: async (challengeId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    await delay(500);
    // In real app: deduct from wallet, add participant
    return { success: true, message: 'Successfully joined challenge' };
  },
};

export const participantAPI = {
  getParticipants: async (challengeId: string): Promise<ChallengeParticipant[]> => {
    await delay(200);
    return mockParticipants.filter(p => p.challengeId === challengeId);
  },

  getParticipantStatus: async (challengeId: string, userId: string): Promise<ChallengeParticipant | null> => {
    await delay(200);
    return mockParticipants.find(p => p.challengeId === challengeId && p.userId === userId) || null;
  },
};

export const checkinAPI = {
  getDailyCheckins: async (challengeId: string, userId: string): Promise<DailyCheckin[]> => {
    await delay(200);
    return mockDailyCheckins.filter(c => c.challengeId === challengeId && c.userId === userId);
  },

  getCurrentSteps: async (userId: string): Promise<number> => {
    await delay(150);
    // In real app: fetch from Apple Health / Google Fit
    const randomSteps = Math.floor(Math.random() * 15000);
    return randomSteps;
  },

  recordCheckin: async (challengeId: string, userId: string, steps: number, targetMet: boolean): Promise<DailyCheckin> => {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    return {
      id: `checkin-${Date.now()}`,
      challengeId,
      userId,
      date: today,
      steps,
      targetMet,
      checkinAt: new Date().toISOString(),
    };
  },
};

export const userAPI = {
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    return DEFAULT_USER;
  },

  getWallet: async (userId: string): Promise<Wallet> => {
    await delay(200);
    return DEFAULT_WALLET;
  },

  updateWallet: async (userId: string, amount: number): Promise<Wallet> => {
    await delay(300);
    return {
      ...DEFAULT_WALLET,
      balance: DEFAULT_WALLET.balance + amount,
      updatedAt: new Date().toISOString(),
    };
  },
};
