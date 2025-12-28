export type RoundResult = {
  id: number;
  durationSeconds: number;
  endedAt: number;
  reason: "complete" | "ended";
};
