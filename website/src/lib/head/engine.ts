import { CATEGORIES, getCategoryById } from "@/lib/wordbanks";

export const MIN_HEAD_PLAYERS = 2;
export const TURN_OPTIONS = [45, 60, 90] as const;
export const LAP_OPTIONS = [1, 2] as const;
export const COUNTDOWN_SECONDS = 3;
export const STREAK_SIZE = 3;

export function currentStreak(results: { got: boolean }[]): number {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i].got; i--) n++;
  return n;
}

// +1 for every 3 in a row without a skip
export function streakBonus(results: { got: boolean }[]): number {
  let run = 0;
  let bonus = 0;
  for (const r of results) {
    run = r.got ? run + 1 : 0;
    if (run > 0 && run % STREAK_SIZE === 0) bonus++;
  }
  return bonus;
}

export function dealDeck(categoryId: string, used: string[], randomFn: () => number = Math.random): string[] {
  const words = (getCategoryById(categoryId) ?? CATEGORIES[0]).words;
  let pool = words.filter((w) => !used.includes(w));
  if (pool.length < 10) pool = [...words];
  const deck = [...pool];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
