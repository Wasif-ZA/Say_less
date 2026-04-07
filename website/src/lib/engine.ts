import type { Player } from "./types";
import { CATEGORIES } from "./wordbanks";

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function assignRoles(players: Player[], imposterCount: 1 | 2): Player[] {
  const indices = players.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const imposterIndices = new Set(indices.slice(0, imposterCount));
  return players.map((p, i) => ({
    ...p,
    role: imposterIndices.has(i) ? "imposter" as const : "civilian" as const,
    isEliminated: false,
  }));
}

export function pickWord(categoryId: string, usedWords: string[] = []): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return "";
  const available = cat.words.filter((w) => !usedWords.includes(w));
  const pool = available.length > 0 ? available : cat.words;
  return pool[secureRandom(pool.length)];
}
