import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";
import { Topics } from "@prisma/client";

interface State {
  showConfetti: boolean;
  setShowConfetti: (showConfetti: boolean) => void;
  currentTopic: Topics;
  setCurrentTopic: (topic: Topics | null) => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    currentTopic: Topics.CALCULUS,
    setCurrentTopic: (currentTopic) =>
      set({ currentTopic: currentTopic as Topics }),
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
