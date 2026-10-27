import type { RoundDeal, Spectrum, TunePlayer } from "./types";

export const MIN_TUNE_PLAYERS = 2;
export const LAP_OPTIONS = [1, 2, 3] as const;

// Half-widths on a 0-100 dial, checked inside out
export const BANDS = [
  { halfWidth: 3, points: 4 },
  { halfWidth: 8, points: 3 },
  { halfWidth: 13, points: 2 },
] as const;

export const SPECTRUMS: Spectrum[] = [
  { left: "Cold", right: "Hot" },
  { left: "Useless", right: "Useful" },
  { left: "Underrated", right: "Overrated" },
  { left: "Boring", right: "Exciting" },
  { left: "Cheap", right: "Expensive" },
  { left: "Soft", right: "Hard" },
  { left: "Quiet", right: "Loud" },
  { left: "Easy to spell", right: "Hard to spell" },
  { left: "Smells bad", right: "Smells good" },
  { left: "Villain", right: "Hero" },
  { left: "Normal pet", right: "Weird pet" },
  { left: "Terrible gift", right: "Perfect gift" },
  { left: "Tiny", right: "Huge" },
  { left: "Healthy", right: "Unhealthy" },
  { left: "Old fashioned", right: "Futuristic" },
  { left: "Sad song", right: "Happy song" },
  { left: "Bad superpower", right: "Great superpower" },
  { left: "No skill needed", right: "Takes real skill" },
  { left: "Calm", right: "Chaotic" },
  { left: "Snack", right: "Full meal" },
  { left: "Dangerous", right: "Safe" },
  { left: "Forgettable", right: "Unforgettable" },
  { left: "Morning thing", right: "Late night thing" },
  { left: "For kids", right: "For adults" },
  { left: "Dry", right: "Wet" },
  { left: "Rough", right: "Smooth" },
  { left: "Bad movie", right: "Great movie" },
  { left: "Low effort date", right: "High effort date" },
  { left: "Fake", right: "Real" },
  { left: "Common", right: "Rare" },
  { left: "Mild", right: "Spicy" },
  { left: "Unpopular opinion", right: "Popular opinion" },
  { left: "Waste of money", right: "Worth every cent" },
  { left: "Tastes bad", right: "Tastes great" },
  { left: "Light", right: "Heavy" },
  { left: "Gone in a day", right: "Lasts forever" },
  { left: "Nerdy", right: "Cool" },
  { left: "Bad habit", right: "Good habit" },
  { left: "Sweet", right: "Savoury" },
  { left: "Indoors", right: "Outdoors" },
  { left: "Mundane", right: "Magical" },
  { left: "Ancient", right: "Modern" },
  { left: "Weak", right: "Strong" },
  { left: "Slow", right: "Fast" },
  { left: "Nobody knows it", right: "Everyone knows it" },
  { left: "Cringe", right: "Iconic" },
  { left: "Bad first date", right: "Good first date" },
  { left: "Easy to draw", right: "Hard to draw" },
  { left: "Polite", right: "Rude" },
  { left: "Relaxing", right: "Stressful" },
  { left: "Simple", right: "Complicated" },
  { left: "Lame party trick", right: "Amazing party trick" },
  { left: "Ugly", right: "Beautiful" },
  { left: "Never cry", right: "Ugly cry" },
  { left: "Easy to cook", right: "Hard to cook" },
  { left: "Introvert's hobby", right: "Extrovert's hobby" },
  { left: "Worst chore", right: "Best chore" },
  { left: "Feels short", right: "Feels endless" },
  { left: "Trashy", right: "Classy" },
  { left: "Fine to say at work", right: "Never say at work" },
  { left: "Bad advice", right: "Good advice" },
  { left: "Hard to fake", right: "Easy to fake" },
  { left: "Underdressed", right: "Overdressed" },
  { left: "Guilty pleasure", right: "Proud of it" },
  { left: "Mid", right: "Elite" },
  { left: "Bad name for a pet", right: "Great name for a pet" },
  { left: "Bad name for a band", right: "Great name for a band" },
  { left: "Lazy Sunday", right: "Productive Sunday" },
  { left: "Needs a manual", right: "Anyone can use it" },
  { left: "Weird food combo", right: "Perfect food combo" },
  { left: "Annoying sound", right: "Satisfying sound" },
  { left: "Least fun class", right: "Most fun class" },
  { left: "Small talk", right: "Deep talk" },
  { left: "Bad excuse", right: "Good excuse" },
  { left: "Tourist trap", right: "Hidden gem" },
  { left: "Comfort food", right: "Fancy food" },
  { left: "Worst time to sneeze", right: "Best time to sneeze" },
  { left: "Overpriced", right: "Bargain" },
  { left: "Scary", right: "Cute" },
  { left: "Boomer", right: "Gen Z" },
  { left: "Bad road trip snack", right: "Great road trip snack" },
  { left: "Ruins a party", right: "Saves a party" },
  { left: "Clean", right: "Messy" },
  { left: "Easy to forgive", right: "Hard to forgive" },
  { left: "Weak flex", right: "Huge flex" },
  { left: "Bad first job", right: "Dream first job" },
  { left: "Mild inconvenience", right: "Total disaster" },
  { left: "Normal at 3am", right: "Weird at 3am" },
  { left: "Old news", right: "Breaking news" },
  { left: "Bad karaoke song", right: "Great karaoke song" },
];

export function psychicFor(players: TunePlayer[], round: number): TunePlayer {
  return players[round % players.length];
}

// Guessers start with the player after the Psychic and wrap round
export function guessersFor(players: TunePlayer[], round: number): TunePlayer[] {
  const p = round % players.length;
  return [...players.slice(p + 1), ...players.slice(0, p)];
}

export function totalRounds(players: TunePlayer[], laps: number): number {
  return players.length * laps;
}

export function pointsFor(guess: number, target: number): number {
  const diff = Math.abs(guess - target);
  for (const band of BANDS) {
    if (diff <= band.halfWidth) return band.points;
  }
  return 0;
}

export function dealRound(used: number[], randomFn: () => number = Math.random): RoundDeal {
  let pool = SPECTRUMS.map((_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = SPECTRUMS.map((_, i) => i);
  const spectrumIndex = pool[Math.floor(randomFn() * pool.length)];
  const target = 3 + Math.floor(randomFn() * 95);
  return { spectrumIndex, target };
}
