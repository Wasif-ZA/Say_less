export type HeadPhase = "home" | "setup" | "ready" | "playing" | "turnEnd" | "summary";

export interface HeadPlayer {
  id: string;
  name: string;
  score: number;
}

export interface HeadResult {
  word: string;
  got: boolean;
}

export interface HeadState {
  phase: HeadPhase;
  players: HeadPlayer[];
  categoryId: string;
  turnSeconds: number;
  laps: number;
  turn: number;
  deck: string[];
  deckPos: number;
  results: HeadResult[];
  usedWords: string[];
}

export type HeadAction =
  | { type: "SET_PHASE"; phase: HeadPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_CATEGORY"; categoryId: string }
  | { type: "SET_TURN_SECONDS"; seconds: number }
  | { type: "SET_LAPS"; laps: number }
  | { type: "START_GAME"; deck: string[] }
  | { type: "BEGIN_TURN" }
  | { type: "ANSWER"; got: boolean }
  | { type: "END_TURN" }
  | { type: "NEXT_TURN"; deck: string[] }
  | { type: "FULL_RESET" };
