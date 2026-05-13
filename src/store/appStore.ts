import { create } from 'zustand';
import { User, Wallet, Challenge, ChallengeParticipant, DailyCheckin } from '@types';
import { DEFAULT_USER, DEFAULT_WALLET } from '@constants';

interface AppState {
  user: User;
  wallet: Wallet;
  challenges: Challenge[];
  activeChallenges: Challenge[];
  currentChallengeDetails: Challenge | null;
  participants: ChallengeParticipant[];
  dailyCheckins: DailyCheckin[];
  currentSteps: number;
  isLoading: boolean;
  error: string | null;

  // User actions
  setUser: (user: User) => void;
  setWallet: (wallet: Wallet) => void;

  // Challenge actions
  setChallenges: (challenges: Challenge[]) => void;
  setActiveChallenges: (challenges: Challenge[]) => void;
  setCurrentChallengeDetails: (challenge: Challenge | null) => void;

  // Participant actions
  setParticipants: (participants: ChallengeParticipant[]) => void;

  // Checkin actions
  setDailyCheckins: (checkins: DailyCheckin[]) => void;
  setCurrentSteps: (steps: number) => void;

  // Loading & error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  user: DEFAULT_USER,
  wallet: DEFAULT_WALLET,
  challenges: [],
  activeChallenges: [],
  currentChallengeDetails: null,
  participants: [],
  dailyCheckins: [],
  currentSteps: 0,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setWallet: (wallet) => set({ wallet }),

  setChallenges: (challenges) => set({ challenges }),
  setActiveChallenges: (challenges) => set({ activeChallenges: challenges }),
  setCurrentChallengeDetails: (challenge) => set({ currentChallengeDetails: challenge }),

  setParticipants: (participants) => set({ participants }),

  setDailyCheckins: (checkins) => set({ dailyCheckins: checkins }),
  setCurrentSteps: (steps) => set({ currentSteps: steps }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
