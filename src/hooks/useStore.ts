import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Topics } from "@prisma/client";
import type { AIQuiz } from "types";

interface State {
  showConfetti: boolean;
  setShowConfetti: (showConfetti: boolean) => void;
  currentTopic: Topics;
  currentSubTopic: string | null;
  setCurrentTopic: (topic: Topics | null) => void;
  setCurrentSubTopic: (subTopic: string | null) => void;
  currentQuiz: AIQuiz | null;
  setCurrentQuiz: (quiz: AIQuiz) => void;
  reset: () => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    currentTopic: Topics.MATH_I,
    setCurrentTopic: (currentTopic) =>
      set({ currentTopic: currentTopic as Topics }),
    currentStep: "choice",
    currentSubTopic: null,
    setCurrentSubTopic: (currentSubTopic) => set({ currentSubTopic }),
    currentQuiz: null,
    setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
    reset: () =>
      set({
        showConfetti: false,
        currentTopic: Topics.MATH_I,
        currentQuiz: null,
        currentSubTopic: null,
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