import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Topics } from "@prisma/client";
import type { QuizWithQuestions, Tabs } from "types";

type DashboardTabs = 'overview' | 'user-management' | 'reports' | 'quizzes';

interface State {
  showConfetti: boolean;
  currentTopic: Topics;
  currentSubTopic: string | null;
  currentStep: Tabs;
  currentQuiz: QuizWithQuestions | null;
  dashboardTab: DashboardTabs;
  setCurrentTopic: (topic: Topics | null) => void;
  setCurrentSubTopic: (subTopic: string | null) => void;
  setShowConfetti: (showConfetti: boolean) => void;
  setCurrentQuiz: (quiz: QuizWithQuestions) => void;
  setCurrentStep: (step: Tabs) => void;
  setDashboardTab: (tab: DashboardTabs) => void;
  reset: () => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    currentStep: "choice",
    currentTopic: Topics.MATH_I,
    currentSubTopic: null,
    currentQuiz: null,
    dashboardTab: 'overview',
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    setCurrentTopic: (currentTopic) =>
      set({ currentTopic: currentTopic as Topics }),
    setCurrentSubTopic: (currentSubTopic) => set({ currentSubTopic }),
    setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    setDashboardTab: (dashboardTab) => set({ dashboardTab }),
    reset: () =>
      set({
        showConfetti: false,
        currentTopic: Topics.MATH_I,
        currentQuiz: null,
        currentSubTopic: null,
        currentStep: "choice",
        dashboardTab: 'overview',
      }),
  }),
  {
    name: "brainwave-store",
    storage: createJSONStorage(() => localStorage),
  }
) as StateCreator<State>;

const useStore = create<State>(store);

export default useStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}
