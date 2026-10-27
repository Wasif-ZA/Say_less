import type { RoundDeal, TuneAction, TuneState } from "./types";
import { MAX_BONUS_ROUNDS, gameRounds, pointsFor } from "./engine";

export const initialTuneState: TuneState = {
  phase: "home",
  players: [],
  laps: 1,
  round: 0,
  spectrumIndex: 0,
  target: 50,
  usedSpectra: [],
  clue: "",
  guess: 50,
  roundPoints: 0,
  roundBonus: false,
  bonusRounds: 0,
  teamScore: 0,
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
    guess: 50,
    roundPoints: 0,
    roundBonus: false,
  };
}

export function tuneReducer(state: TuneState, action: TuneAction): TuneState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.names.map((name) => ({ id: makeId(), name })) };

    case "ADD_PLAYER": {
      const name = action.name?.trim() || `Player ${state.players.length + 1}`;
      return { ...state, players: [...state.players, { id: makeId(), name }] };
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
        { ...state, usedSpectra: [], bonusRounds: 0, teamScore: 0 },
        action.deal,
        0
      );

    case "SET_CLUE":
      return { ...state, clue: action.clue.trim(), phase: "guess" };

    case "LOCK_GUESS": {
      const last = state.round + 1 >= gameRounds(state.players, state.laps, state.bonusRounds);
      const base = pointsFor(action.value, state.target);
      const roundPoints = last ? base * 2 : base;
      const roundBonus = base === 4 && !last && state.bonusRounds < MAX_BONUS_ROUNDS;
      return {
        ...state,
        phase: "reveal",
        guess: action.value,
        roundPoints,
        roundBonus,
        bonusRounds: state.bonusRounds + (roundBonus ? 1 : 0),
        teamScore: state.teamScore + roundPoints,
      };
    }

    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= gameRounds(state.players, state.laps, state.bonusRounds)) return { ...state, phase: "summary" };
      return startRound(state, action.deal, next);
    }

    case "FULL_RESET":
      return {
        ...initialTuneState,
        players: state.players,
        laps: state.laps,
      };

    default:
      return state;
  }
}
