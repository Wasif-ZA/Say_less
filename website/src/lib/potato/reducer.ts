import type { PotatoAction, PotatoDeal, PotatoState } from "./types";

export const initialPotatoState: PotatoState = {
  phase: "home",
  players: [],
  rounds: 5,
  round: 0,
  holderIndex: 0,
  promptIndex: 0,
  fuseMs: 30000,
  usedPrompts: [],
  passes: 0,
};

function makeId(): string {
  return `h_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: PotatoState, deal: PotatoDeal, round: number, holderIndex: number): PotatoState {
  return {
    ...state,
    phase: "ready",
    round,
    holderIndex,
    promptIndex: deal.promptIndex,
    fuseMs: deal.fuseMs,
    usedPrompts: [...state.usedPrompts, deal.promptIndex],
    passes: 0,
  };
}

export function potatoReducer(state: PotatoState, action: PotatoAction): PotatoState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.names.map((name) => ({ id: makeId(), name, burns: 0 })) };

    case "ADD_PLAYER": {
      const name = action.name?.trim() || `Player ${state.players.length + 1}`;
      return { ...state, players: [...state.players, { id: makeId(), name, burns: 0 }] };
    }

    case "REMOVE_PLAYER":
      return { ...state, players: state.players.filter((p) => p.id !== action.id) };

    case "RENAME_PLAYER":
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, name: action.name } : p)),
      };

    case "SET_ROUNDS":
      return { ...state, rounds: action.rounds };

    case "START_GAME":
      return startRound(
        { ...state, players: state.players.map((p) => ({ ...p, burns: 0 })), usedPrompts: [] },
        action.deal,
        0,
        0
      );

    case "LIGHT_FUSE":
      return { ...state, phase: "playing" };

    case "PASS":
      if (state.phase !== "playing") return state;
      return {
        ...state,
        holderIndex: (state.holderIndex + 1) % state.players.length,
        passes: state.passes + 1,
      };

    case "EXPLODE":
      if (state.phase !== "playing") return state;
      return {
        ...state,
        phase: "boom",
        players: state.players.map((p, i) => (i === state.holderIndex ? { ...p, burns: p.burns + 1 } : p)),
      };

    // The burnt player starts the next round
    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= state.rounds) return { ...state, phase: "summary" };
      return startRound(state, action.deal, next, state.holderIndex);
    }

    case "FULL_RESET":
      return {
        ...initialPotatoState,
        players: state.players.map((p) => ({ ...p, burns: 0 })),
        rounds: state.rounds,
      };

    default:
      return state;
  }
}
