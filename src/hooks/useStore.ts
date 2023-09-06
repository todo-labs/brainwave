import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Topics } from "@prisma/client";
import type { QuizWithQuestions, Tabs } from "types";

interface State {
  showConfetti: boolean;
  currentTopic: Topics;
  currentSubTopic: string | null;
  currentStep: Tabs;
  currentQuiz: QuizWithQuestions | null;
  setCurrentTopic: (topic: Topics | null) => void;
  setCurrentSubTopic: (subTopic: string | null) => void;
  setShowConfetti: (showConfetti: boolean) => void;
  setCurrentQuiz: (quiz: QuizWithQuestions) => void;
  setCurrentStep: (step: Tabs) => void;
  reset: () => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    currentStep: "choice",
    currentTopic: Topics.MATH_I,
    currentSubTopic: null,
    currentQuiz: null,
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    setCurrentTopic: (currentTopic) =>
      set({ currentTopic: currentTopic as Topics }),
    setCurrentSubTopic: (currentSubTopic) => set({ currentSubTopic }),
    setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    reset: () =>
      set({
        showConfetti: false,
        currentTopic: Topics.MATH_I,
        currentQuiz: null,
        currentSubTopic: null,
        currentStep: "choice",
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
