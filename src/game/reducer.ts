import type { GameState, GameAction, Player } from "./types";
import { assignRoles, pickWord, tallyVotes } from "./engine";
import {
  MIN_PLAYERS_FOR_TWO_IMPOSTERS,
  DEFAULT_TIMER_SECONDS,
} from "../constants/game";

let nextId = 1;
function genId(): string {
  return `p${nextId++}`;
}

export function createInitialState(): GameState {
  return {
    phase: "home",
    players: [
      { id: genId(), name: "Player 1", role: null },
      { id: genId(), name: "Player 2", role: null },
      { id: genId(), name: "Player 3", role: null },
      { id: genId(), name: "Player 4", role: null },
    ],
    categoryId: null,
    secretWord: null,
    imposterCount: 1,
    currentRevealIndex: 0,
    timerSeconds: DEFAULT_TIMER_SECONDS,
    votes: [],
    currentVoterIndex: 0,
    roundScores: [],
    roundNumber: 1,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_PLAYERS":
      return { ...state, players: action.players };

    case "ADD_PLAYER": {
      const newPlayer: Player = { id: genId(), name: action.name, role: null };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case "REMOVE_PLAYER":
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };

    case "RENAME_PLAYER":
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };

    case "SET_CATEGORY":
      return { ...state, categoryId: action.categoryId };

    case "SET_IMPOSTER_COUNT": {
      const count =
        action.count === 2 &&
        state.players.length < MIN_PLAYERS_FOR_TWO_IMPOSTERS
          ? 1
          : action.count;
      return { ...state, imposterCount: count };
    }

    case "START_ROUND": {
      if (!state.categoryId) return state;
      const assigned = assignRoles(state.players, state.imposterCount);
      const word = pickWord(state.categoryId);
      return {
        ...state,
        players: assigned,
        secretWord: word,
        currentRevealIndex: 0,
        votes: [],
        currentVoterIndex: 0,
        phase: "reveal",
      };
    }

    case "ADVANCE_REVEAL":
      return {
        ...state,
        currentRevealIndex: state.currentRevealIndex + 1,
      };

    case "SET_TIMER":
      return { ...state, timerSeconds: action.seconds };

    case "CAST_VOTE":
      return {
        ...state,
        votes: [
          ...state.votes,
          { voterId: action.voterId, targetId: action.targetId },
        ],
      };

    case "ADVANCE_VOTER":
      return {
        ...state,
        currentVoterIndex: state.currentVoterIndex + 1,
      };

    case "FINISH_VOTING": {
      const result = tallyVotes(state.votes, state.players);
      const score = {
        round: state.roundNumber,
        winningSide: result.townWins
          ? ("town" as const)
          : ("imposter" as const),
        imposterIds: result.imposterIds,
        eliminatedId: result.eliminatedId,
      };
      return {
        ...state,
        roundScores: [...state.roundScores, score],
        phase: "summary",
      };
    }

    case "PLAY_AGAIN": {
      if (!state.categoryId) return state;
      const freshPlayers: Player[] = state.players.map((p) => ({
        ...p,
        role: null,
      }));
      const assigned = assignRoles(freshPlayers, state.imposterCount);
      const word = pickWord(state.categoryId);
      return {
        ...state,
        players: assigned,
        secretWord: word,
        currentRevealIndex: 0,
        votes: [],
        currentVoterIndex: 0,
        roundNumber: state.roundNumber + 1,
        phase: "reveal",
      };
    }

    case "FULL_RESET":
      return createInitialState();

    default:
      return state;
  }
}
