import type { GameAction, GamePhase, Player } from "./types";

export const setPhase = (phase: GamePhase): GameAction => ({
  type: "SET_PHASE",
  phase,
});

export const setPlayers = (players: Player[]): GameAction => ({
  type: "SET_PLAYERS",
  players,
});

export const addPlayer = (name: string): GameAction => ({
  type: "ADD_PLAYER",
  name,
});

export const removePlayer = (id: string): GameAction => ({
  type: "REMOVE_PLAYER",
  id,
});

export const renamePlayer = (id: string, name: string): GameAction => ({
  type: "RENAME_PLAYER",
  id,
  name,
});

export const setCategory = (categoryId: string): GameAction => ({
  type: "SET_CATEGORY",
  categoryId,
});

export const setImposterCount = (count: 1 | 2): GameAction => ({
  type: "SET_IMPOSTER_COUNT",
  count,
});

export const startRound = (): GameAction => ({
  type: "START_ROUND",
});

export const advanceReveal = (): GameAction => ({
  type: "ADVANCE_REVEAL",
});

export const setTimer = (seconds: number | null): GameAction => ({
  type: "SET_TIMER",
  seconds,
});

export const castVote = (voterId: string, targetId: string): GameAction => ({
  type: "CAST_VOTE",
  voterId,
  targetId,
});

export const advanceVoter = (): GameAction => ({
  type: "ADVANCE_VOTER",
});

export const finishVoting = (): GameAction => ({
  type: "FINISH_VOTING",
});

export const playAgain = (): GameAction => ({
  type: "PLAY_AGAIN",
});

export const fullReset = (): GameAction => ({
  type: "FULL_RESET",
});
