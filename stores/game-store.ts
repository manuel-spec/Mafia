import { create } from "zustand";

import type { Role } from "@/types/role";
import type { RoundResult } from "@/types/round";

type GameState = {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  roundDurationSeconds: number;
  setRoundDurationSeconds: (seconds: number) => void;
  rounds: RoundResult[];
  setRounds: (rounds: RoundResult[]) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  roles: [],
  roundDurationSeconds: 0,
  rounds: [],
  setRoles: (roles) => set({ roles }),
  setRoundDurationSeconds: (seconds) => set({ roundDurationSeconds: seconds }),
  setRounds: (rounds) => set({ rounds }),
  reset: () => set({ roles: [], roundDurationSeconds: 0, rounds: [] }),
}));
