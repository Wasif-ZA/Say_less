import { useState, useSyncExternalStore } from "react";

export const LINES = {
  hubTagline: [
    "One phone. Pass it round. Trust no one.",
    "Your friends are lying. Prove it.",
    "Pass the phone, keep a straight face.",
    "Friendships tested since today.",
    "Somebody here is bluffing.",
  ],
  imposterHome: [
    "Find the imposter. Trust no one.",
    "One of you has no idea. Find them.",
    "Everyone knows the word. Almost.",
    "Bluff hard. Vote harder.",
  ],
  sleeve: [
    "Only {name} looks. Everyone else, eyes away.",
    "{name}, cover the screen. No peeking, the rest of you.",
    "Hand it to {name}. Phones are private property.",
    "Eyes off the phone unless you are {name}.",
  ],
  imposterBlurb: [
    "Blend in. Don't get caught.",
    "Nod along like you know.",
    "Listen first, bluff second.",
    "Act natural. You've got this.",
    "Agree with the loudest person.",
  ],
  civilianBlurb: [
    "Hint at it. Don't hand it over.",
    "Too obvious and the imposter learns it.",
    "Be vague enough to fool them.",
    "Keep your clue sneaky.",
  ],
  goesFirst: [
    "Describe the word without saying it.",
    "Start us off. One clue, keep it sneaky.",
    "You set the vibe. Make it subtle.",
    "First clue is yours. No pressure.",
  ],
  discuss: ["Discuss", "Talk it out", "Sus it out", "Clues, then chaos"],
  vote: [
    "Tap the player everyone agrees on",
    "Point fingers. Pick one.",
    "Who was acting weird?",
    "Majority rules. Choose wisely.",
  ],
  confirm: [
    "Their role is revealed straight after. No take-backs.",
    "Final answer? No undo button here.",
    "If you're wrong, the imposter walks.",
  ],
  townWins: [
    "Caught red-handed.",
    "Nobody fools this group.",
    "The bluff did not land.",
    "Justice, served cold.",
  ],
  imposterWins: [
    "Fooled the whole room.",
    "Oscar-worthy performance.",
    "You were played.",
    "Trust issues: unlocked.",
  ],
} as const;

export type LinePool = keyof typeof LINES;

const loadSeed = typeof window === "undefined" ? 0 : Math.floor(Math.random() * 1000);
const noop = () => () => {};

export function useLoadSeed(): number {
  return useSyncExternalStore(noop, () => loadSeed, () => 0);
}

export function useMountSeed(): number {
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  return seed;
}

export function line(pool: LinePool, seed: number, vars: Record<string, string> = {}): string {
  const options = LINES[pool];
  const text: string = options[Math.abs(Math.floor(seed)) % options.length];
  return text.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}
