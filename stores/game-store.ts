import { create } from "zustand";

import type { Role } from "@/types/role";

type GameState = {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  roundDurationSeconds: number;
  setRoundDurationSeconds: (seconds: number) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  roles: [],
  roundDurationSeconds: 0,
  setRoles: (roles) => set({ roles }),
  setRoundDurationSeconds: (seconds) => set({ roundDurationSeconds: seconds }),
  reset: () => set({ roles: [], roundDurationSeconds: 0 }),
}));
