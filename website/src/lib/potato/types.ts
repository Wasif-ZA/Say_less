export type PotatoPhase = "home" | "setup" | "ready" | "playing" | "boom" | "summary";

export interface PotatoPlayer {
  id: string;
  name: string;
  burns: number;
}

export interface PotatoDeal {
  promptIndex: number;
  fuseMs: number;
}

export interface PotatoState {
  phase: PotatoPhase;
  players: PotatoPlayer[];
  rounds: number;
  round: number;
  holderIndex: number;
  promptIndex: number;
  fuseMs: number;
  usedPrompts: number[];
  passes: number;
}

export type PotatoAction =
  | { type: "SET_PHASE"; phase: PotatoPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "SET_PLAYERS"; names: string[] }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_ROUNDS"; rounds: number }
  | { type: "START_GAME"; deal: PotatoDeal }
  | { type: "LIGHT_FUSE" }
  | { type: "PASS" }
  | { type: "EXPLODE" }
  | { type: "NEXT_ROUND"; deal: PotatoDeal }
  | { type: "FULL_RESET" };
