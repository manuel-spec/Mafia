import { create } from "zustand";

import type { Role } from "@/types/role";

type GameState = {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
  reset: () => set({ roles: [] }),
}));
