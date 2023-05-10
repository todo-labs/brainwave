import { create, type StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  showConfetti: boolean;
  setShowConfetti: (showConfetti: boolean) => void;
}

const store: StateCreator<State> = persist(
  (set) => ({
    showConfetti: false,
    setShowConfetti: (showConfetti) => set({ showConfetti }),
  }),
  {
    name: "kawe-store",
    storage: createJSONStorage(() => localStorage),
  }
) as StateCreator<State>; // Add the type assertion here

const useStore = create<State>(store);

export default useStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}
