import type { GameState, GameAction } from "./types";
import { assignRoles, pickWord } from "./engine";
import { MAX_PLAYERS } from "./constants";

export const initialState: GameState = {
  phase: "home",
  players: [
    { id: "p1", name: "Player 1", role: "unassigned", isEliminated: false },
  ],
  categoryId: null,
  secretWord: "",
  imposterCount: 1,
  timerSeconds: 120,
  hintsEnabled: false,
  currentRevealIndex: 0,
  roundScores: [],
  usedWords: [],
  round: 1,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.players };

    case "ADD_PLAYER": {
      if (state.players.length >= MAX_PLAYERS) return state;
      const newId = "p" + Date.now() + Math.random().toString(36).slice(2, 5);
      const name = action.name || `Player ${state.players.length + 1}`;
      return {
        ...state,
        players: [...state.players, { id: newId, name, role: "unassigned", isEliminated: false }],
      };
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

    case "SET_IMPOSTER_COUNT":
      return { ...state, imposterCount: action.count };

    case "SET_TIMER":
      return { ...state, timerSeconds: action.seconds };

    case "SET_HINTS":
      return { ...state, hintsEnabled: action.enabled };

    case "START_ROUND": {
      if (!state.categoryId) return state;
      const word = pickWord(state.categoryId, state.usedWords);
      const assigned = assignRoles(state.players, state.imposterCount);
      return {
        ...state,
        phase: "reveal",
        players: assigned,
        secretWord: word,
        currentRevealIndex: 0,
        usedWords: [...state.usedWords, word],
      };
    }

    case "ADVANCE_REVEAL":
      return { ...state, currentRevealIndex: state.currentRevealIndex + 1 };

    case "ELIMINATE_PLAYER": {
      const imposterIds = state.players.filter((p) => p.role === "imposter").map((p) => p.id);
      const townWins = imposterIds.includes(action.targetId);
      return {
        ...state,
        phase: "summary",
        roundScores: [
          ...state.roundScores,
          {
            round: state.round,
            townWins,
            imposterIds,
            eliminatedId: action.targetId,
            isTie: false,
          },
        ],
      };
    }

    case "PLAY_AGAIN": {
      if (!state.categoryId) return state;
      const word = pickWord(state.categoryId, state.usedWords);
      const resetPlayers = state.players.map((p) => ({
        ...p,
        role: "unassigned" as const,
        isEliminated: false,
      }));
      const assigned = assignRoles(resetPlayers, state.imposterCount);
      return {
        ...state,
        phase: "reveal",
        players: assigned,
        secretWord: word,
        currentRevealIndex: 0,
        round: state.round + 1,
        usedWords: [...state.usedWords, word],
      };
    }

    case "CHANGE_CATEGORY":
      return {
        ...state,
        phase: "category",
        players: state.players.map((p) => ({ ...p, role: "unassigned" as const, isEliminated: false })),
        currentRevealIndex: 0,
      };

    case "FULL_RESET":
      return { ...initialState };

    default:
      return state;
  }
}
