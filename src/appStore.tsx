import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStoreState {
  dopen: boolean;
  updateOpen: (dopen: boolean) => void;
}

const appStore = persist<AppStoreState>((set) => ({
  dopen: true,
  updateOpen: (dopen) => set({ dopen }),
}), { name: "my_app_store" });

export const useAppStore = create(appStore);