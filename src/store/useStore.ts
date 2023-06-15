import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Topics } from "@prisma/client";
import type { AIQuiz } from "types";

type Steps = "choice" | "config" | "exam" | "result";

interface State {
  showConfetti: boolean;
  setShowConfetti: (showConfetti: boolean) => void;
  currentTopic: Topics;
  setCurrentTopic: (topic: Topics | null) => void;
  currentStep: Steps;
  setCurrentStep: (step: Steps) => void;
  currentQuiz: AIQuiz[] | null;
  setCurrentQuiz: (quiz: AIQuiz[]) => void;
  reset: () => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    currentTopic: Topics.CALCULUS,
    setCurrentTopic: (currentTopic) =>
      set({ currentTopic: currentTopic as Topics }),
    currentStep: "choice",
    setCurrentStep: (currentStep) => set({ currentStep }),
    currentQuiz: null,
    setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
    reset: () =>
      set({
        showConfetti: false,
        currentTopic: Topics.CALCULUS,
        currentStep: "choice",
        currentQuiz: null,
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
