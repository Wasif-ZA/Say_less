export type GamePhase =
  | "home"
  | "category"
  | "players"
  | "reveal"
  | "discussion"
  | "voting"
  | "summary";

export type Role = "civilian" | "imposter" | "unassigned";

export interface Player {
  id: string;
  name: string;
  role: Role;
  isEliminated: boolean;
}

export interface RoundScore {
  round: number;
  townWins: boolean;
  imposterIds: string[];
  eliminatedId: string | null;
  isTie: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  categoryId: string | null;
  secretWord: string;
  imposterCount: 1 | 2;
  timerSeconds: number;
  hintsEnabled: boolean;
  currentRevealIndex: number;
  roundScores: RoundScore[];
  usedWords: string[];
  round: number;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  words: string[];
}

export type GameAction =
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_PLAYERS"; players: Player[] }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_CATEGORY"; categoryId: string }
  | { type: "SET_IMPOSTER_COUNT"; count: 1 | 2 }
  | { type: "SET_TIMER"; seconds: number }
  | { type: "SET_HINTS"; enabled: boolean }
  | { type: "START_ROUND" }
  | { type: "ADVANCE_REVEAL" }
  | { type: "ELIMINATE_PLAYER"; targetId: string }
  | { type: "PLAY_AGAIN" }
  | { type: "CHANGE_CATEGORY" }
  | { type: "FULL_RESET" };
