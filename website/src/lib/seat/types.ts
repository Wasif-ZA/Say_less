export type SeatPhase = "home" | "setup" | "vote" | "reveal" | "accuse" | "summary";

export interface SeatPlayer {
  id: string;
  name: string;
  score: number;
  titles: number[];
}

export interface SeatState {
  phase: SeatPhase;
  players: SeatPlayer[];
  rounds: number;
  round: number;
  promptIndex: number;
  usedPrompts: number[];
  voteTurn: number;
  votes: Record<string, string>;
  top: string[];
  accuse: { guessId: string; hit: boolean } | null;
}

export type SeatAction =
  | { type: "SET_PHASE"; phase: SeatPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_ROUNDS"; rounds: number }
  | { type: "START_GAME"; promptIndex: number }
  | { type: "VOTE"; voterId: string; targetId: string }
  | { type: "ACCUSE"; guessId: string }
  | { type: "NEXT_ROUND"; promptIndex: number }
  | { type: "FULL_RESET" };
