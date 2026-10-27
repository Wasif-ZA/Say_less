import type { SneakResult } from "./types";

export const MIN_SNEAK_PLAYERS = 3;
export const TIMER_OPTIONS = [5, 10, 15];

export const MISSIONS = [
  "Get someone to say the word “pineapple”",
  "Get a high five from two different people",
  "Make someone tell you what time it is",
  "Use the phrase “to be fair” three times",
  "Get someone to swap seats with you",
  "Get someone to show you a photo on their phone",
  "Compliment three people's shoes",
  "Get someone to say the word “banana”",
  "Get someone to recommend a movie to you",
  "Get someone to tell you their favourite food",
  "Get two people to laugh at the same time",
  "Get someone to tell you about their weekend",
  "Ask three different people for a fun fact",
  "Get someone to say “good question”",
  "Get someone to tell you their star sign",
  "Get someone to shake your hand",
  "Get someone to tell you where they would travel next",
  "Get someone to stand up and sit back down",
  "Get someone to ask what you are eating or drinking",
  "Say “honestly” five times in conversation",
  "Get someone to say the word “obviously”",
  "Get someone to tell you a childhood nickname",
  "Get someone to pass you something you did not ask for",
  "Get someone to recommend a song",
  "Compliment someone's jumper or shirt",
  "Get someone to tell you their favourite colour",
  "Get someone to agree with you by saying “exactly”",
  "Get someone to check the time on their phone",
  "Get someone to say the word “tomato”",
  "Get three different people to say your name",
  "Get someone to tell you about a pet",
  "Ask someone for advice and get them to give it",
  "Get someone to say “no way”",
  "Get someone to tell you the best thing they ate this week",
  "Get someone to say the word “weekend”",
  "Get someone to point at something across the room",
  "Get someone to say “I love that”",
  "Get someone to tell you what they did today",
  "Get someone to fold their arms",
  "Get someone to pick a number between one and ten for you",
  "Get someone to name their favourite animal",
  "Get someone to say the word “elephant”",
  "Get someone to tell you a joke",
  "Get someone to say “fair enough”",
  "Get someone to open or close a door or window for you",
  "Get someone to tell you the name of a book they like",
  "Get someone to lend you a pen",
  "Get someone to say the word “umbrella”",
  "Get someone to tell you about the worst weather they have seen",
  "Get a high five from the person across the table",
];

function shuffle<T>(items: T[], randomFn: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dealMissions(
  playerIds: string[],
  used: number[],
  randomFn: () => number = Math.random
): Record<string, number> {
  const all = MISSIONS.map((_, i) => i);
  const fresh = all.filter((i) => !used.includes(i));
  const pool = shuffle(fresh.length >= playerIds.length ? fresh : all, randomFn);
  return Object.fromEntries(playerIds.map((id, i) => [id, pool[i % pool.length]]));
}

export function scoreDebrief(results: Record<string, SneakResult>): Record<string, number> {
  const points: Record<string, number> = {};
  for (const [id, r] of Object.entries(results)) {
    points[id] ??= 0;
    if (r.kind === "done") points[id] += 2;
    if (r.kind === "busted") points[r.by] = (points[r.by] ?? 0) + 1;
  }
  return points;
}
