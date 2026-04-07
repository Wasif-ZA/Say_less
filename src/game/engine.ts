import type { Player, VoteRecord } from "./types";
import { getCategoryById } from "../data/categories";
import { MIN_PLAYERS_FOR_TWO_IMPOSTERS } from "../constants/game";

function cryptoRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / 4294967296;
}

export function assignRoles(
  players: Player[],
  imposterCount: 1 | 2,
  randomFn: () => number = cryptoRandom
): Player[] {
  const count =
    imposterCount === 2 && players.length < MIN_PLAYERS_FOR_TWO_IMPOSTERS
      ? 1
      : imposterCount;

  const indices = players.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const imposterIndices = new Set(indices.slice(0, count));

  return players.map((p, i) => ({
    ...p,
    role: imposterIndices.has(i) ? "imposter" as const : "civilian" as const,
  }));
}

export function pickWord(
  categoryId: string,
  usedWords: string[] = [],
  randomFn: () => number = cryptoRandom
): string {
  const category = getCategoryById(categoryId);
  if (!category) return "Unknown";

  let available = category.words.filter((w) => !usedWords.includes(w));
  if (available.length === 0) {
    available = category.words;
  }

  return available[Math.floor(randomFn() * available.length)];
}

export interface VoteTally {
  playerId: string;
  playerName: string;
  voteCount: number;
}

export interface VotingResult {
  tallies: VoteTally[];
  eliminatedId: string | null;
  imposterIds: string[];
  townWins: boolean;
}

export function tallyVotes(
  votes: VoteRecord[],
  players: Player[]
): VotingResult {
  const countMap = new Map<string, number>();
  for (const v of votes) {
    countMap.set(v.targetId, (countMap.get(v.targetId) || 0) + 1);
  }

  const tallies: VoteTally[] = players
    .map((p) => ({
      playerId: p.id,
      playerName: p.name,
      voteCount: countMap.get(p.id) || 0,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  const imposterIds = players
    .filter((p) => p.role === "imposter")
    .map((p) => p.id);

  let eliminatedId: string | null = null;
  if (tallies.length > 0 && tallies[0].voteCount > 0) {
    const topCount = tallies[0].voteCount;
    const tied = tallies.filter((t) => t.voteCount === topCount);
    if (tied.length === 1) {
      eliminatedId = tied[0].playerId;
    }
  }

  const townWins = eliminatedId !== null && imposterIds.includes(eliminatedId);

  return { tallies, eliminatedId, imposterIds, townWins };
}
