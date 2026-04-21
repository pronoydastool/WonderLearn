import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgeGroup = '3-5' | '6-8' | '9-12';
export type Theme = 'default' | 'ocean' | 'space' | 'forest' | 'sunset' | 'galaxy';

interface SubjectStats {
  completed: number;
  score: number;
  accuracy: number;
  timeSpent: number; // in minutes
  lastPlayed: string;
}

interface UserState {
  isFirstLogin: boolean;
  name: string;
  nickname: string;
  avatar: string;
  ageGroup: AgeGroup;
  nativeLanguage: string;
  xp: number;
  level: number;
  theme: Theme;
  unlockedItems: string[];
  parentalPin: string | null;
  screenTimeLimit: number | null; // in minutes
  timeSpentToday: number; // in minutes
  lastLoginDate: string;
  stats: Record<string, SubjectStats>;
  disabledModules: string[];
  
  // Actions
  setIsFirstLogin: (isFirst: boolean) => void;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setAvatar: (avatar: string) => void;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setNativeLanguage: (lang: string) => void;
  setTheme: (theme: Theme) => void;
  addXP: (amount: number) => void;
  unlockItem: (itemId: string) => void;
  setParentalPin: (pin: string | null) => void;
  setScreenTimeLimit: (limit: number | null) => void;
  updateTimeSpent: (minutes: number) => void;
  updateStats: (subject: string, score: number, accuracy?: number, timeSpent?: number) => void;
  resetDailyStats: () => void;
  toggleModule: (moduleId: string) => void;
  setDisabledModules: (modules: string[]) => void;
  logout: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      isFirstLogin: true,
      name: 'Explorer',
      nickname: '',
      avatar: '🦊',
      ageGroup: '6-8',
      nativeLanguage: 'English',
      xp: 0,
      level: 1,
      theme: 'default',
      unlockedItems: ['hair_short', 'hair_long', 'acc_none', 'cloth_blue'],
      parentalPin: null,
      screenTimeLimit: null,
      timeSpentToday: 0,
      lastLoginDate: new Date().toISOString().split('T')[0],
      stats: {},
      disabledModules: [],

      setIsFirstLogin: (isFirst) => set({ isFirstLogin: isFirst }),
      setName: (name) => set({ name }),
      setNickname: (nickname) => set({ nickname }),
      setAvatar: (avatar) => set({ avatar }),
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setTheme: (theme) => set({ theme }),
      addXP: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return { xp: newXp, level: newLevel };
      }),
      unlockItem: (itemId) => set((state) => ({
        unlockedItems: [...new Set([...state.unlockedItems, itemId])]
      })),
      setParentalPin: (pin) => set({ parentalPin: pin }),
      setScreenTimeLimit: (limit) => set({ screenTimeLimit: limit }),
      updateTimeSpent: (minutes) => set((state) => ({ timeSpentToday: state.timeSpentToday + minutes })),
      updateStats: (subject, score, accuracy = 100, timeSpent = 0) => set((state) => {
        const current = state.stats[subject] || { completed: 0, score: 0, accuracy: 0, timeSpent: 0, lastPlayed: '' };
        return {
          stats: {
            ...state.stats,
            [subject]: {
              completed: current.completed + 1,
              score: Math.max(current.score, score),
              accuracy: Math.round((current.accuracy * current.completed + accuracy) / (current.completed + 1)),
              timeSpent: current.timeSpent + timeSpent,
              lastPlayed: new Date().toISOString(),
            }
          }
        };
      }),
      resetDailyStats: () => set({ timeSpentToday: 0, lastLoginDate: new Date().toISOString().split('T')[0] }),
      toggleModule: (moduleId) => set((state) => ({
        disabledModules: state.disabledModules.includes(moduleId)
          ? state.disabledModules.filter(id => id !== moduleId)
          : [...state.disabledModules, moduleId]
      })),
      setDisabledModules: (modules) => set({ disabledModules: modules }),
      logout: () => {
        // Also sign out of firebase
        import('../firebase').then(({ auth }) => {
          auth.signOut();
        });
        set({
          isFirstLogin: true,
          name: 'Explorer',
          nickname: '',
          avatar: '🦊',
          xp: 0,
          level: 1,
          stats: {},
          unlockedItems: ['hair_short', 'hair_long', 'acc_none', 'cloth_blue'],
          parentalPin: null,
          screenTimeLimit: null,
          timeSpentToday: 0,
          disabledModules: []
        });
      },
    }),
    {
      name: 'wonderlearn-storage',
    }
  )
);
