export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const MIN_PLAYERS_FOR_TWO_IMPOSTERS = 7;
export const DEFAULT_TIMER_SECONDS = 120;
export const REVEAL_AUTO_HIDE_MS = 4000;
export const REVEAL_SWIPE_THRESHOLD = -120;

export const TIMER_OPTIONS = [
  { label: "1:00", seconds: 60 },
  { label: "2:00", seconds: 120 },
  { label: "3:00", seconds: 180 },
  { label: "No Timer", seconds: null },
] as const;

export const STORAGE_KEYS = {
  LAST_PLAYERS: "imposter_party_last_players",
  LAST_CATEGORY_ID: "imposter_party_last_category",
  LAST_TIMER: "imposter_party_last_timer",
  SCORES: "imposter_party_scores",
} as const;
