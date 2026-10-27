import type { SeatAction, SeatState } from "./types";
import { tally } from "./engine";

export const initialSeatState: SeatState = {
  phase: "home",
  players: [],
  rounds: 5,
  round: 0,
  promptIndex: 0,
  usedPrompts: [],
  voteTurn: 0,
  votes: {},
  top: [],
};

function makeId(): string {
  return `s_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: SeatState, promptIndex: number, round: number): SeatState {
  return {
    ...state,
    phase: "vote",
    round,
    promptIndex,
    usedPrompts: [...state.usedPrompts, promptIndex],
    voteTurn: 0,
    votes: {},
    top: [],
  };
}

export function seatReducer(state: SeatState, action: SeatAction): SeatState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.names.map((name) => ({ id: makeId(), name, score: 0, titles: [] })) };

    case "ADD_PLAYER": {
      const name = action.name?.trim() || `Player ${state.players.length + 1}`;
      return { ...state, players: [...state.players, { id: makeId(), name, score: 0, titles: [] }] };
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
        { ...state, players: state.players.map((p) => ({ ...p, score: 0, titles: [] })), usedPrompts: [] },
        action.promptIndex,
        0
      );

    case "VOTE": {
      if (state.phase !== "vote") return state;
      const votes = { ...state.votes, [action.voterId]: action.targetId };
      if (state.voteTurn + 1 < state.players.length) {
        return { ...state, votes, voteTurn: state.voteTurn + 1 };
      }
      const { top } = tally(votes, state.players.map((p) => p.id));
      const players = state.players.map((p) => ({
        ...p,
        score: p.score + (top.includes(votes[p.id]) ? 1 : 0),
        titles: top.includes(p.id) ? [...p.titles, state.promptIndex] : p.titles,
      }));
      return { ...state, votes, players, top, phase: "reveal" };
    }

    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= state.rounds) return { ...state, phase: "summary" };
      return startRound(state, action.promptIndex, next);
    }

    case "FULL_RESET":
      return {
        ...initialSeatState,
        players: state.players.map((p) => ({ ...p, score: 0, titles: [] })),
        rounds: state.rounds,
      };

    default:
      return state;
  }
}
