import type { Category } from "../game/types";

import placesWords from "./wordbanks/places.json";
import foodsWords from "./wordbanks/foods.json";
import animalsWords from "./wordbanks/animals.json";
import moviesWords from "./wordbanks/movies.json";
import occupationsWords from "./wordbanks/occupations.json";

export const CATEGORIES: Category[] = [
  { id: "places", name: "Places", emoji: "\u{1F30D}", words: placesWords },
  { id: "foods", name: "Foods", emoji: "\u{1F355}", words: foodsWords },
  { id: "animals", name: "Animals", emoji: "\u{1F43E}", words: animalsWords },
  { id: "movies", name: "Movies", emoji: "\u{1F3AC}", words: moviesWords },
  { id: "occupations", name: "Occupations", emoji: "\u{1F4BC}", words: occupationsWords },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
