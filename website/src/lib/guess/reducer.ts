import type { GuessAction, GuessState } from "./types";
import { QUESTIONS, scoreGuesses } from "./engine";

export const initialGuessState: GuessState = {
  phase: "home",
  players: [],
  rounds: 5,
  round: 0,
  questionIndex: 0,
  usedQuestions: [],
  guessTurn: 0,
  guesses: {},
  gained: {},
};

function makeId(): string {
  return `g_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: GuessState, questionIndex: number, round: number): GuessState {
  return {
    ...state,
    phase: "guess",
    round,
    questionIndex,
    usedQuestions: [...state.usedQuestions, questionIndex],
    guessTurn: 0,
    guesses: {},
    gained: {},
  };
}

export function guessReducer(state: GuessState, action: GuessAction): GuessState {
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
        { ...state, players: state.players.map((p) => ({ ...p, score: 0 })), usedQuestions: [] },
        action.questionIndex,
        0
      );

    case "GUESS": {
      if (state.phase !== "guess") return state;
      const guesses = { ...state.guesses, [action.playerId]: action.value };
      if (state.guessTurn + 1 < state.players.length) {
        return { ...state, guesses, guessTurn: state.guessTurn + 1 };
      }
      const gained = scoreGuesses(guesses, QUESTIONS[state.questionIndex].answer);
      const players = state.players.map((p) => ({ ...p, score: p.score + (gained[p.id] ?? 0) }));
      return { ...state, guesses, gained, players, phase: "reveal" };
    }

    case "NEXT_ROUND": {
      const next = state.round + 1;
      if (next >= state.rounds) return { ...state, phase: "summary" };
      return startRound(state, action.questionIndex, next);
    }

    case "FULL_RESET":
      return {
        ...initialGuessState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        rounds: state.rounds,
      };

    default:
      return state;
  }
}
