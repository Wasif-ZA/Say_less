import type { SneakAction, SneakState } from "./types";
import { scoreDebrief } from "./engine";

export const initialSneakState: SneakState = {
  phase: "home",
  players: [],
  minutes: 10,
  round: 0,
  missions: {},
  usedMissions: [],
  dealTurn: 0,
  results: {},
};

function makeId(): string {
  return `s_${Math.random().toString(36).slice(2, 9)}`;
}

function startRound(state: SneakState, missions: Record<string, number>, round: number): SneakState {
  return {
    ...state,
    phase: "deal",
    round,
    missions,
    usedMissions: [...state.usedMissions, ...Object.values(missions)],
    dealTurn: 0,
    results: {},
  };
}

export function sneakReducer(state: SneakState, action: SneakAction): SneakState {
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

    case "SET_MINUTES":
      return { ...state, minutes: action.minutes };

    case "START_GAME":
      return startRound(
        { ...state, players: state.players.map((p) => ({ ...p, score: 0 })), usedMissions: [] },
        action.missions,
        1
      );

    case "NEXT_DEAL":
      return { ...state, dealTurn: state.dealTurn + 1 };

    case "START_LIVE":
      return { ...state, phase: "live" };

    case "SET_RESULT": {
      const results = { ...state.results };
      if (action.result) results[action.playerId] = action.result;
      else delete results[action.playerId];
      return { ...state, results };
    }

    case "FINISH_DEBRIEF": {
      if (state.phase !== "debrief") return state;
      const points = scoreDebrief(state.results);
      return {
        ...state,
        phase: "summary",
        players: state.players.map((p) => ({ ...p, score: p.score + (points[p.id] ?? 0) })),
      };
    }

    case "NEW_ROUND":
      return startRound(state, action.missions, state.round + 1);

    case "FULL_RESET":
      return {
        ...initialSneakState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        minutes: state.minutes,
      };

    default:
      return state;
  }
}
