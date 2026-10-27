import type { PotatoDeal } from "./types";

export const MIN_POTATO_PLAYERS = 3;
export const ROUND_OPTIONS = [3, 5, 7] as const;
export const MIN_FUSE_MS = 15000;
export const MAX_FUSE_MS = 45000;

export const PROMPTS: string[] = [
  "Name a fruit",
  "Name an animal",
  "Name a colour",
  "Name a country",
  "Name a pizza topping",
  "Name something in a kitchen",
  "Name a sport",
  "Name a TV show",
  "Name a breakfast food",
  "Name something cold",
  "Name something with wheels",
  "Name a job",
  "Name a body part",
  "Name something you wear",
  "Name a dessert",
  "Name a musical instrument",
  "Name something in a bathroom",
  "Name a vegetable",
  "Name a famous singer",
  "Name a fast food chain",
  "Name a city",
  "Name something at the beach",
  "Name a car brand",
  "Name something that flies",
  "Name a board or card game",
  "Name a superhero",
  "Name an app on your phone",
  "Name something in a school bag",
  "Name a drink",
  "Name a sea creature",
  "Name a Disney movie",
  "Name something you find in a park",
  "Name a snack",
  "Name a holiday or festival",
  "Name something soft",
  "Name a type of shoe",
  "Name a bird",
  "Name a cartoon character",
  "Name something you plug in",
  "Name something at a party",
  "Name a word that rhymes with cat",
  "Name something round",
  "Name a dog breed",
  "Name a video game",
  "Name something in the sky",
  "Name a spice or sauce",
  "Name something you do in the morning",
  "Name a shop at the mall",
  "Name a planet or thing in space",
  "Name something that is yellow",
];

export function dealPotato(used: number[], randomFn: () => number = Math.random): PotatoDeal {
  let pool = PROMPTS.map((_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = PROMPTS.map((_, i) => i);
  const promptIndex = pool[Math.floor(randomFn() * pool.length)];
  const fuseMs = MIN_FUSE_MS + Math.floor(randomFn() * (MAX_FUSE_MS - MIN_FUSE_MS));
  return { promptIndex, fuseMs };
}
