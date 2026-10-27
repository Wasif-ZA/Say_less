import { CATEGORIES } from "@/lib/wordbanks";
import type { HeadAction, HeadState } from "./types";
import { streakBonus } from "./engine";

export const initialHeadState: HeadState = {
  phase: "home",
  players: [],
  categoryId: CATEGORIES[0].id,
  turnSeconds: 60,
  laps: 1,
  turn: 0,
  deck: [],
  deckPos: 0,
  results: [],
  usedWords: [],
};

function makeId(): string {
  return `c_${Math.random().toString(36).slice(2, 9)}`;
}

function finishTurn(state: HeadState): HeadState {
  const points = state.results.filter((r) => r.got).length + streakBonus(state.results);
  const guesser = state.players[state.turn % state.players.length];
  return {
    ...state,
    phase: "turnEnd",
    players: state.players.map((p) => (p.id === guesser.id ? { ...p, score: p.score + points } : p)),
    usedWords: [...state.usedWords, ...state.results.map((r) => r.word)],
  };
}

export function headReducer(state: HeadState, action: HeadAction): HeadState {
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

    case "SET_CATEGORY":
      return { ...state, categoryId: action.categoryId };

    case "SET_TURN_SECONDS":
      return { ...state, turnSeconds: action.seconds };

    case "SET_LAPS":
      return { ...state, laps: action.laps };

    case "START_GAME":
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        phase: "ready",
        turn: 0,
        deck: action.deck,
        deckPos: 0,
        results: [],
        usedWords: [],
      };

    case "BEGIN_TURN":
      return { ...state, phase: "playing" };

    case "ANSWER": {
      if (state.phase !== "playing") return state;
      const results = [...state.results, { word: state.deck[state.deckPos], got: action.got }];
      const next = { ...state, results, deckPos: state.deckPos + 1 };
      return next.deckPos >= state.deck.length ? finishTurn(next) : next;
    }

    case "END_TURN":
      return state.phase === "playing" ? finishTurn(state) : state;

    case "NEXT_TURN": {
      const turn = state.turn + 1;
      if (turn >= state.players.length * state.laps) return { ...state, phase: "summary" };
      return { ...state, phase: "ready", turn, deck: action.deck, deckPos: 0, results: [] };
    }

    case "FULL_RESET":
      return {
        ...initialHeadState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        categoryId: state.categoryId,
        turnSeconds: state.turnSeconds,
        laps: state.laps,
      };

    default:
      return state;
  }
}
