import type { OddAction, OddState } from "./types";
import { isFinalRound, winningSide } from "./engine";

export const initialOddState: OddState = {
  phase: "home",
  players: [],
  rounds: 5,
  round: 0,
  promptIndex: 0,
  usedPrompts: [],
  pickTurn: 0,
  picks: {},
  majority: null,
  contrarian: false,
};

function makeId(): string {
  return `o_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: OddState, promptIndex: number, round: number, contrarian = false): OddState {
  return {
    ...state,
    phase: "pick",
    round,
    promptIndex,
    usedPrompts: [...state.usedPrompts, promptIndex],
    pickTurn: 0,
    picks: {},
    majority: null,
    contrarian,
  };
}

export function oddReducer(state: OddState, action: OddAction): OddState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.names.map((name) => ({ id: makeId(), name, score: 0 })) };

    case "ADD_PLAYER": {
      const name = action.name?.trim() || `Player ${state.players.length + 1}`;
      return { ...state, players: [...state.players, { id: makeId(), name, score: 0 }] };
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
        { ...state, players: state.players.map((p) => ({ ...p, score: 0 })), usedPrompts: [] },
        action.promptIndex,
        0
      );

    case "PICK": {
      if (state.phase !== "pick") return state;
      const picks = { ...state.picks, [action.playerId]: action.choice };
      if (state.pickTurn + 1 < state.players.length) {
        return { ...state, picks, pickTurn: state.pickTurn + 1 };
      }
      const majority = winningSide(state.players.map((p) => picks[p.id]), state.contrarian);
      const points = isFinalRound(state.round, state.rounds) ? 2 : 1;
      const players = state.players.map((p) =>
        majority !== null && picks[p.id] === majority ? { ...p, score: p.score + points } : p
      );
      return { ...state, picks, players, majority, phase: "reveal" };
    }

    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= state.rounds) return { ...state, phase: "summary" };
      return startRound(state, action.promptIndex, next, action.contrarian);
    }

    case "FULL_RESET":
      return {
        ...initialOddState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        rounds: state.rounds,
      };

    default:
      return state;
  }
}
