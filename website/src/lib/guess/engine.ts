export const MIN_GUESS_PLAYERS = 2;
export const ROUND_OPTIONS = [5, 8, 10] as const;

export interface GuessQuestion {
  q: string;
  answer: number;
  unit: string;
}

export const QUESTIONS: GuessQuestion[] = [
  { q: "How many bones are in an adult human body?", answer: 206, unit: "bones" },
  { q: "How many keys are on a standard piano?", answer: 88, unit: "keys" },
  { q: "How many squares are on a chessboard?", answer: 64, unit: "squares" },
  { q: "How many minutes are in a day?", answer: 1440, unit: "minutes" },
  { q: "How many hearts does an octopus have?", answer: 3, unit: "hearts" },
  { q: "In what year did the first iPhone come out?", answer: 2007, unit: "" },
  { q: "How tall is Mount Everest, in metres?", answer: 8849, unit: "metres" },
  { q: "How long is a marathon, in metres?", answer: 42195, unit: "metres" },
  { q: "How many member states does the United Nations have?", answer: 193, unit: "countries" },
  { q: "How many stripes are on the US flag?", answer: 13, unit: "stripes" },
  { q: "How many players does a soccer team have on the pitch?", answer: 11, unit: "players" },
  { q: "In what year did the Sydney Opera House open?", answer: 1973, unit: "" },
  { q: "In what year did the Sydney Harbour Bridge open?", answer: 1932, unit: "" },
  { q: "In what year did Australia federate?", answer: 1901, unit: "" },
  { q: "How many states does Australia have?", answer: 6, unit: "states" },
  { q: "How many elements are on the periodic table?", answer: 118, unit: "elements" },
  { q: "In what year did Apollo 11 land on the Moon?", answer: 1969, unit: "" },
  { q: "In what year did the Titanic sink?", answer: 1912, unit: "" },
  { q: "In what year did the Berlin Wall fall?", answer: 1989, unit: "" },
  { q: "How many teeth does a full adult set have?", answer: 32, unit: "teeth" },
  { q: "How many cards are in a standard deck, without jokers?", answer: 52, unit: "cards" },
  { q: "How many strings does a standard guitar have?", answer: 6, unit: "strings" },
  { q: "How many sides does a stop sign have?", answer: 8, unit: "sides" },
  { q: "How many players per team are on a basketball court?", answer: 5, unit: "players" },
  { q: "How many colours are in a rainbow?", answer: 7, unit: "colours" },
  { q: "How many planets are in our solar system?", answer: 8, unit: "planets" },
  { q: "How many degrees are in a full circle?", answer: 360, unit: "degrees" },
  { q: "How many bones are in one human hand?", answer: 27, unit: "bones" },
  { q: "How many rings are on the Olympic flag?", answer: 5, unit: "rings" },
  { q: "In what year did the Sydney Olympics happen?", answer: 2000, unit: "" },
  { q: "How far away is the Moon on average, in kilometres?", answer: 384400, unit: "km" },
  { q: "How many seconds are in an hour?", answer: 3600, unit: "seconds" },
  { q: "In what year was the Eiffel Tower finished?", answer: 1889, unit: "" },
  { q: "At what temperature does water boil, in degrees Celsius?", answer: 100, unit: "°C" },
  { q: "At what temperature does water freeze, in degrees Fahrenheit?", answer: 32, unit: "°F" },
  { q: "How many dots are on a standard die, all six faces added up?", answer: 21, unit: "dots" },
  { q: "How many balls are in a cricket over?", answer: 6, unit: "balls" },
  { q: "How many players per team are on the field in AFL?", answer: 18, unit: "players" },
  { q: "How many players per side are in rugby union?", answer: 15, unit: "players" },
  { q: "In what year did the Wright brothers make their first flight?", answer: 1903, unit: "" },
  { q: "How many chromosomes are in a typical human cell?", answer: 46, unit: "chromosomes" },
  { q: "How many stars are on the Australian flag?", answer: 6, unit: "stars" },
  { q: "How many stars are on the US flag?", answer: 50, unit: "stars" },
  { q: "How many main Harry Potter books are there?", answer: 7, unit: "books" },
  { q: "How many holes are in a full round of golf?", answer: 18, unit: "holes" },
  { q: "In what year did YouTube launch?", answer: 2005, unit: "" },
  { q: "In what year was Google founded?", answer: 1998, unit: "" },
  { q: "How long is the main arch span of the Sydney Harbour Bridge, in metres?", answer: 503, unit: "metres" },
  { q: "In what year was the first Melbourne Cup run?", answer: 1861, unit: "" },
];

export function pickQuestion(used: number[], randomFn: () => number = Math.random): number {
  let pool = QUESTIONS.map((_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = QUESTIONS.map((_, i) => i);
  return pool[Math.floor(randomFn() * pool.length)];
}

export function parseGuess(raw: string): number | null {
  const s = raw.replace(/[,\s]/g, "");
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : null;
}

export type Wager = 1 | 2 | 3;

export const WAGERS: { value: Wager; label: string }[] = [
  { value: 1, label: "Safe ×1" },
  { value: 2, label: "Sure ×2" },
  { value: 3, label: "All in ×3" },
];

export function roundMultiplier(round: number, rounds: number): number {
  return round + 1 >= rounds ? 2 : 1;
}

// closest guess(es) win 2 * wager * multiplier; the rest lose (wager - 1) * multiplier
export function scoreRound(
  guesses: Record<string, number>,
  wagers: Record<string, Wager>,
  answer: number,
  multiplier: number
): Record<string, number> {
  const dist = Object.entries(guesses).map(([id, g]) => [id, Math.abs(g - answer)] as const);
  const best = Math.min(...dist.map(([, d]) => d));
  return Object.fromEntries(
    dist.map(([id, d]) => {
      const w = wagers[id] ?? 1;
      return [id, d === best ? 2 * w * multiplier : (1 - w) * multiplier];
    })
  );
}

export function formatNum(n: number): string {
  return n.toLocaleString("en-AU", { maximumFractionDigits: 2, useGrouping: Math.abs(n) >= 10000 });
}
