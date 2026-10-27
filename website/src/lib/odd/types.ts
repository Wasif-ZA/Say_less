export type OddPhase = "home" | "setup" | "pick" | "reveal" | "summary";

export type OddChoice = 0 | 1;

export interface OddPlayer {
  id: string;
  name: string;
  score: number;
}

export interface OddState {
  phase: OddPhase;
  players: OddPlayer[];
  rounds: number;
  round: number;
  promptIndex: number;
  usedPrompts: number[];
  pickTurn: number;
  picks: Record<string, OddChoice>;
  majority: OddChoice | null;
  contrarian: boolean;
}

export type OddAction =
  | { type: "SET_PHASE"; phase: OddPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_ROUNDS"; rounds: number }
  | { type: "START_GAME"; promptIndex: number }
  | { type: "PICK"; playerId: string; choice: OddChoice }
  | { type: "NEXT_ROUND"; promptIndex: number; contrarian: boolean }
  | { type: "FULL_RESET" };
