export type SneakPhase = "home" | "setup" | "deal" | "live" | "debrief" | "summary";

export type SneakResult = { kind: "done" } | { kind: "busted"; by: string } | { kind: "failed" };

export interface SneakPlayer {
  id: string;
  name: string;
  score: number;
}

export interface SneakState {
  phase: SneakPhase;
  players: SneakPlayer[];
  minutes: number;
  round: number;
  missions: Record<string, number>;
  usedMissions: number[];
  dealTurn: number;
  results: Record<string, SneakResult>;
}

export type SneakAction =
  | { type: "SET_PHASE"; phase: SneakPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_MINUTES"; minutes: number }
  | { type: "START_GAME"; missions: Record<string, number> }
  | { type: "NEXT_DEAL" }
  | { type: "START_LIVE" }
  | { type: "SET_RESULT"; playerId: string; result: SneakResult | null }
  | { type: "FINISH_DEBRIEF" }
  | { type: "NEW_ROUND"; missions: Record<string, number> }
  | { type: "FULL_RESET" };
