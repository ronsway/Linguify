'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Language, UserProgress, LessonState, LessonResult } from '@/lib/types';

interface Store extends AppState {
  // User actions
  setUser: (user: AppState['user']) => void;
  logout: () => void;

  // Language selection
  setLanguage: (language: Language) => void;

  // Progress tracking
  updateProgress: (progress: Partial<UserProgress>) => void;
  setProgress: (progress: UserProgress) => void;
  addXP: (amount: number) => void;
  addStreak: () => void;
  resetStreak: () => void;
  decrementHearts: () => void;
  restoreHearts: () => void;

  // Lesson state
  initializeLessonState: (totalQuestions: number) => void;
  nextQuestion: () => void;
  recordAnswer: (isCorrect: boolean) => void;
  endLesson: (lessonId: string) => void;
  clearLastLessonResult: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

const initialProgress: UserProgress = {
  language: 'portuguese_portugal',
  completedLessons: [],
  totalXP: 0,
  streak: 0,
  gems: 0,
  level: 1,
  hearts: 5,
  maxHearts: 5,
};

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      user: {},
      language: 'portuguese_portugal',
      progress: initialProgress,
      isLoading: false,
      error: undefined,

      // User actions
      setUser: (user) => set({ user }),
      logout: () => set({ user: {}, progress: initialProgress }),

      // Language selection
      setLanguage: (language) => set({ language }),

      // Progress tracking
      updateProgress: (progress) =>
        set((state) => ({
          progress: { ...state.progress, ...progress },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.totalXP + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            progress: {
              ...state.progress,
              totalXP: newXP,
              level: newLevel,
            },
          };
        }),

      setProgress: (progress) => set({ progress }),

      addStreak: () =>
        set((state) => ({
          progress: { ...state.progress, streak: state.progress.streak + 1 },
        })),

      resetStreak: () =>
        set((state) => ({
          progress: { ...state.progress, streak: 0 },
        })),

      decrementHearts: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: Math.max(0, state.progress.hearts - 1),
          },
        })),

      restoreHearts: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: state.progress.maxHearts,
          },
        })),

      // Lesson state
      initializeLessonState: (totalQuestions) =>
        set({
          lessonState: {
            questionIndex: 0,
            correctCount: 0,
            wrongCount: 0,
            hearts: get().progress.hearts,
            answered: false,
          },
        }),

      nextQuestion: () =>
        set((state) => ({
          lessonState: state.lessonState
            ? {
                ...state.lessonState,
                questionIndex: state.lessonState.questionIndex + 1,
                answered: false,
              }
            : undefined,
        })),

      recordAnswer: (isCorrect) =>
        set((state) => {
          if (!state.lessonState) return state;
          const newLessonState = { ...state.lessonState };
          if (isCorrect) {
            newLessonState.correctCount++;
            // Accumulate XP immediately
            const newXP = state.progress.totalXP + 10;
            const newLevel = Math.floor(newXP / 100) + 1;
            newLessonState.answered = true;
            return {
              lessonState: newLessonState,
              progress: { ...state.progress, totalXP: newXP, level: newLevel },
            };
          } else {
            newLessonState.wrongCount++;
            newLessonState.hearts = Math.max(0, newLessonState.hearts - 1);
            newLessonState.answered = true;
            return {
              lessonState: newLessonState,
              progress: {
                ...state.progress,
                hearts: Math.max(0, state.progress.hearts - 1),
              },
            };
          }
        }),

      endLesson: (lessonId) => {
        const { lessonState } = get();
        if (!lessonState) return;

        const total = lessonState.correctCount + lessonState.wrongCount;
        const accuracy = total > 0
          ? Math.round((lessonState.correctCount / total) * 100)
          : 0;
        const xpGained = lessonState.correctCount * 10;
        const streakBonus = accuracy >= 80;

        const result: LessonResult = {
          lessonId,
          correctCount: lessonState.correctCount,
          wrongCount: lessonState.wrongCount,
          xpGained,
          accuracy,
          streakBonus,
        };

        set((state) => ({
          progress: {
            ...state.progress,
            completedLessons: Array.from(new Set([
              ...state.progress.completedLessons,
              lessonId,
            ])),
            hearts: lessonState.hearts,
            streak: streakBonus ? state.progress.streak + 1 : 0,
          },
          lessonState: undefined,
          lastLessonResult: result,
        }));
      },

      clearLastLessonResult: () => set({ lastLessonResult: undefined }),

      // Utility
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'linguify-store',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        progress: state.progress,
      }),
    }
  )
);
