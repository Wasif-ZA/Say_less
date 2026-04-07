export type GamePhase =
  | "home"
  | "category"
  | "players"
  | "reveal"
  | "discussion"
  | "voting"
  | "summary";

export interface Player {
  id: string;
  name: string;
  role: "civilian" | "imposter" | null;
}

export interface VoteRecord {
  voterId: string;
  targetId: string;
}

export interface RoundScore {
  round: number;
  winningSide: "town" | "imposter";
  imposterIds: string[];
  eliminatedId: string | null;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  words: string[];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  categoryId: string | null;
  secretWord: string | null;
  imposterCount: 1 | 2;
  currentRevealIndex: number;
  timerSeconds: number | null;
  votes: VoteRecord[];
  currentVoterIndex: number;
  roundScores: RoundScore[];
  roundNumber: number;
}

export type GameAction =
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_PLAYERS"; players: Player[] }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_CATEGORY"; categoryId: string }
  | { type: "SET_IMPOSTER_COUNT"; count: 1 | 2 }
  | { type: "START_ROUND" }
  | { type: "ADVANCE_REVEAL" }
  | { type: "SET_TIMER"; seconds: number | null }
  | { type: "CAST_VOTE"; voterId: string; targetId: string }
  | { type: "ADVANCE_VOTER" }
  | { type: "FINISH_VOTING" }
  | { type: "PLAY_AGAIN" }
  | { type: "FULL_RESET" };
