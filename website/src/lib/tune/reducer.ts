import type { RoundDeal, TuneAction, TuneState } from "./types";
import { guessersFor, pointsFor, psychicFor } from "./engine";

export const initialTuneState: TuneState = {
  phase: "home",
  players: [],
  laps: 1,
  round: 0,
  spectrumIndex: 0,
  target: 50,
  usedSpectra: [],
  clue: "",
  guessTurn: 0,
  guesses: {},
  roundPoints: {},
};

function makeId(): string {
  return `t_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: TuneState, deal: RoundDeal, round: number): TuneState {
  return {
    ...state,
    phase: "psychic",
    round,
    spectrumIndex: deal.spectrumIndex,
    target: deal.target,
    usedSpectra: [...state.usedSpectra, deal.spectrumIndex],
    clue: "",
    guessTurn: 0,
    guesses: {},
    roundPoints: {},
  };
}

export function tuneReducer(state: TuneState, action: TuneAction): TuneState {
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

    case "SET_LAPS":
      return { ...state, laps: action.laps };

    case "START_GAME":
      return startRound(
        { ...state, players: state.players.map((p) => ({ ...p, score: 0 })), usedSpectra: [] },
        action.deal,
        0
      );

    case "SET_CLUE":
      return { ...state, clue: action.clue.trim(), phase: "guess", guessTurn: 0 };

    case "LOCK_GUESS": {
      const guesses = { ...state.guesses, [action.playerId]: action.value };
      const guessers = guessersFor(state.players, state.round);
      if (state.guessTurn + 1 < guessers.length) {
        return { ...state, guesses, guessTurn: state.guessTurn + 1 };
      }
      const roundPoints: Record<string, number> = {};
      for (const g of guessers) roundPoints[g.id] = pointsFor(guesses[g.id], state.target);
      const guesserTotal = guessers.reduce((sum, g) => sum + roundPoints[g.id], 0);
      const psychic = psychicFor(state.players, state.round);
      roundPoints[psychic.id] = Math.round(guesserTotal / guessers.length);
      const players = state.players.map((p) => ({ ...p, score: p.score + (roundPoints[p.id] ?? 0) }));
      return { ...state, guesses, players, roundPoints, phase: "reveal" };
    }

    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= state.players.length * state.laps) return { ...state, phase: "summary" };
      return startRound(state, action.deal, next);
    }

    case "FULL_RESET":
      return {
        ...initialTuneState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        laps: state.laps,
      };

    default:
      return state;
  }
}
