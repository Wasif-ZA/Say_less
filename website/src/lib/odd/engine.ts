import type { OddChoice } from "./types";

export const MIN_ODD_PLAYERS = 3;
export const ROUND_OPTIONS = [5, 8, 10] as const;

export const PROMPTS: [string, string][] = [
  ["Beach", "Mountains"],
  ["Pizza", "Burgers"],
  ["Cats", "Dogs"],
  ["Morning person", "Night owl"],
  ["Sweet", "Salty"],
  ["Call", "Text"],
  ["Summer", "Winter"],
  ["Movie at home", "Movie at the cinema"],
  ["Tea", "Coffee"],
  ["Fly", "Be invisible"],
  ["Sneakers", "Slides"],
  ["Books", "Podcasts"],
  ["City break", "Road trip"],
  ["Pancakes", "Waffles"],
  ["Big party", "Small dinner"],
  ["Rain", "Sunshine"],
  ["Chocolate", "Chips"],
  ["Past", "Future"],
  ["Shower at night", "Shower in the morning"],
  ["Hot chips", "Wedges"],
  ["Rollercoaster", "Ferris wheel"],
  ["Spotify", "YouTube"],
  ["Spicy", "Mild"],
  ["Save money", "Spend it"],
  ["Window seat", "Aisle seat"],
  ["Breakfast", "Dinner"],
  ["Plan everything", "Wing it"],
  ["Ocean", "Pool"],
  ["Horror movie", "Comedy"],
  ["Sunrise", "Sunset"],
  ["Ice cream", "Cake"],
  ["Hoodie", "Jacket"],
  ["Uber Eats", "Cook at home"],
  ["Online shopping", "In-store"],
  ["Mac and cheese", "Fried rice"],
  ["Superpower", "A billion dollars"],
  ["Dance", "Sing"],
  ["Camping", "Hotel"],
  ["Car", "Train"],
  ["Lollies", "Chocolate"],
  ["Know the future", "Change the past"],
  ["Live in the city", "Live in the country"],
  ["Socks with slides", "No socks ever"],
  ["Group chat", "One on one"],
  ["Early to the party", "Fashionably late"],
  ["Burrito", "Kebab"],
  ["Talk to animals", "Speak every language"],
  ["Gaming", "Sport"],
  ["Paper books", "E-reader"],
  ["Pineapple on pizza", "Never"],
];

export function pickPrompt(used: number[], randomFn: () => number = Math.random): number {
  let pool = PROMPTS.map((_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = PROMPTS.map((_, i) => i);
  return pool[Math.floor(randomFn() * pool.length)];
}

// null when the vote splits evenly
export function majorityOf(picks: OddChoice[]): OddChoice | null {
  const ones = picks.filter((p) => p === 1).length;
  const zeros = picks.length - ones;
  if (ones === zeros) return null;
  return ones > zeros ? 1 : 0;
}
