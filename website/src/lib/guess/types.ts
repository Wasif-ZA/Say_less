export type GuessPhase = "home" | "setup" | "guess" | "reveal" | "summary";

export interface GuessPlayer {
  id: string;
  name: string;
  score: number;
}

export interface GuessState {
  phase: GuessPhase;
  players: GuessPlayer[];
  rounds: number;
  round: number;
  questionIndex: number;
  usedQuestions: number[];
  guessTurn: number;
  guesses: Record<string, number>;
  gained: Record<string, number>;
}

export type GuessAction =
  | { type: "SET_PHASE"; phase: GuessPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_ROUNDS"; rounds: number }
  | { type: "START_GAME"; questionIndex: number }
  | { type: "GUESS"; playerId: string; value: number }
  | { type: "NEXT_ROUND"; questionIndex: number }
  | { type: "FULL_RESET" };
