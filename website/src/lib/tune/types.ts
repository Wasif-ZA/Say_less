export type TunePhase = "home" | "setup" | "psychic" | "guess" | "reveal" | "summary";

export interface TunePlayer {
  id: string;
  name: string;
  score: number;
}

export interface Spectrum {
  left: string;
  right: string;
}

export interface RoundDeal {
  spectrumIndex: number;
  target: number;
}

export interface TuneState {
  phase: TunePhase;
  players: TunePlayer[];
  laps: number;
  round: number;
  spectrumIndex: number;
  target: number;
  usedSpectra: number[];
  clue: string;
  guessTurn: number;
  guesses: Record<string, number>;
  roundPoints: Record<string, number>;
}

export type TuneAction =
  | { type: "SET_PHASE"; phase: TunePhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_LAPS"; laps: number }
  | { type: "START_GAME"; deal: RoundDeal }
  | { type: "SET_CLUE"; clue: string }
  | { type: "LOCK_GUESS"; playerId: string; value: number }
  | { type: "NEXT_ROUND"; deal: RoundDeal }
  | { type: "FULL_RESET" };
