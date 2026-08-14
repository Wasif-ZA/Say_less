export type MafiaPhase =
  | "home"
  | "setup"
  | "reveal"
  | "night"
  | "dawn"
  | "day"
  | "verdict"
  | "summary";

export type MafiaRole = "mafia" | "detective" | "doctor" | "civilian";

export type MafiaWinner = "town" | "mafia";

export interface MafiaPlayer {
  id: string;
  name: string;
  role: MafiaRole;
  isAlive: boolean;
}

export interface NightResult {
  killedId: string | null;
  saved: boolean;
}

export interface MafiaState {
  phase: MafiaPhase;
  players: MafiaPlayer[];
  mafiaCount: number;
  doctorEnabled: boolean;
  detectiveEnabled: boolean;
  round: number;
  currentRevealIndex: number;
  nightTurnIndex: number;
  mafiaVotes: Record<string, string>;
  doctorSaveId: string | null;
  nightResult: NightResult | null;
  lastEliminatedId: string | null;
  lastVoteSkipped: boolean;
  winner: MafiaWinner | null;
}

export type MafiaAction =
  | { type: "SET_PHASE"; phase: MafiaPhase }
  | { type: "ADD_PLAYER"; name?: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_MAFIA_COUNT"; count: number }
  | { type: "SET_DOCTOR"; enabled: boolean }
  | { type: "SET_DETECTIVE"; enabled: boolean }
  | { type: "START_GAME" }
  | { type: "ADVANCE_REVEAL" }
  | { type: "BEGIN_NIGHT" }
  | { type: "MAFIA_VOTE"; voterId: string; targetId: string }
  | { type: "DOCTOR_SAVE"; targetId: string }
  | { type: "ADVANCE_NIGHT" }
  | { type: "DAY_VOTE"; targetId: string | null }
  | { type: "CONTINUE_AFTER_VERDICT" }
  | { type: "PLAY_AGAIN" }
  | { type: "FULL_RESET" };
