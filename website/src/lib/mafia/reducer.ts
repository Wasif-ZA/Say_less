import type { MafiaAction, MafiaState } from "./types";
import {
  alivePlayers,
  assignMafiaRoles,
  checkWinner,
  maxMafiaFor,
  resolveMafiaTarget,
} from "./engine";

export const initialMafiaState: MafiaState = {
  phase: "home",
  players: [],
  mafiaCount: 1,
  doctorEnabled: true,
  detectiveEnabled: true,
  round: 1,
  currentRevealIndex: 0,
  nightTurnIndex: 0,
  mafiaVotes: {},
  doctorSaveId: null,
  nightResult: null,
  lastEliminatedId: null,
  lastVoteSkipped: false,
  winner: null,
};

function makeId(): string {
  return `m_${Math.random().toString(36).slice(2, 9)}`;
}

function freshNight(): Partial<MafiaState> {
  return {
    phase: "night" as const,
    nightTurnIndex: 0,
    mafiaVotes: {},
    doctorSaveId: null,
    nightResult: null,
  };
}

export function mafiaReducer(state: MafiaState, action: MafiaAction): MafiaState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "ADD_PLAYER": {
      const name = action.name?.trim() || `Player ${state.players.length + 1}`;
      const player = { id: makeId(), name, role: "civilian" as const, isAlive: true };
      return { ...state, players: [...state.players, player] };
    }

    case "REMOVE_PLAYER": {
      const players = state.players.filter((p) => p.id !== action.id);
      const mafiaCount = Math.min(state.mafiaCount, maxMafiaFor(players.length));
      return { ...state, players, mafiaCount };
    }

    case "RENAME_PLAYER":
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };

    case "SET_MAFIA_COUNT": {
      const clamped = Math.max(1, Math.min(action.count, maxMafiaFor(state.players.length)));
      return { ...state, mafiaCount: clamped };
    }

    case "SET_DOCTOR":
      return { ...state, doctorEnabled: action.enabled };

    case "SET_DETECTIVE":
      return { ...state, detectiveEnabled: action.enabled };

    case "START_GAME":
    case "PLAY_AGAIN":
      return {
        ...state,
        players: assignMafiaRoles(
          state.players,
          state.mafiaCount,
          state.doctorEnabled,
          state.detectiveEnabled
        ),
        phase: "reveal",
        round: 1,
        currentRevealIndex: 0,
        nightTurnIndex: 0,
        mafiaVotes: {},
        doctorSaveId: null,
        nightResult: null,
        lastEliminatedId: null,
        lastVoteSkipped: false,
        winner: null,
      };

    case "ADVANCE_REVEAL":
      return { ...state, currentRevealIndex: state.currentRevealIndex + 1 };

    case "BEGIN_NIGHT":
      return { ...state, ...freshNight() };

    case "MAFIA_VOTE":
      return {
        ...state,
        mafiaVotes: { ...state.mafiaVotes, [action.voterId]: action.targetId },
      };

    case "DOCTOR_SAVE":
      return { ...state, doctorSaveId: action.targetId };

    case "ADVANCE_NIGHT": {
      const nextIndex = state.nightTurnIndex + 1;
      if (nextIndex < alivePlayers(state.players).length) {
        return { ...state, nightTurnIndex: nextIndex };
      }
      // Everyone has taken their turn — resolve the night
      const killedId = resolveMafiaTarget(state.mafiaVotes);
      const saved = killedId !== null && state.doctorSaveId === killedId;
      const players =
        killedId && !saved
          ? state.players.map((p) => (p.id === killedId ? { ...p, isAlive: false } : p))
          : state.players;
      return {
        ...state,
        players,
        nightResult: { killedId, saved },
        winner: checkWinner(players),
        phase: "dawn",
      };
    }

    case "DAY_VOTE": {
      if (action.targetId === null) {
        return { ...state, lastEliminatedId: null, lastVoteSkipped: true, phase: "verdict" };
      }
      const players = state.players.map((p) =>
        p.id === action.targetId ? { ...p, isAlive: false } : p
      );
      return {
        ...state,
        players,
        lastEliminatedId: action.targetId,
        lastVoteSkipped: false,
        winner: checkWinner(players),
        phase: "verdict",
      };
    }

    case "CONTINUE_AFTER_VERDICT": {
      if (state.winner) return { ...state, phase: "summary" };
      return { ...state, ...freshNight(), round: state.round + 1 };
    }

    case "FULL_RESET":
      return {
        ...initialMafiaState,
        players: state.players.map((p) => ({ ...p, role: "civilian", isAlive: true })),
        mafiaCount: state.mafiaCount,
        doctorEnabled: state.doctorEnabled,
        detectiveEnabled: state.detectiveEnabled,
      };

    default:
      return state;
  }
}
