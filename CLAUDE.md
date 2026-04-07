# CLAUDE.md — Imposter Party

> This file is the single source of truth for Claude Code CLI when working on this project.
> Read this ENTIRE file before making any changes. Follow every instruction precisely.

---

## PROJECT IDENTITY

- **Name**: Imposter Party
- **Type**: Mobile-only local party social deduction game (single shared device, passed around)
- **Tagline**: "Find the imposter. Trust no one."
- **Platform**: iOS + Android via Expo
- **Stage**: MVP (version 1.0)

---

## STACK (mandatory — do not deviate)

| Layer | Technology | Version Constraint |
|---|---|---|
| Framework | React Native + Expo (managed workflow) | SDK 52+ |
| Language | TypeScript | strict mode enabled |
| Styling | NativeWind v4 | Tailwind 3.4+ |
| Animations | React Native Reanimated 3 | ~3.16 |
| Gestures | React Native Gesture Handler | ~2.20 |
| Haptics | expo-haptics | ~14.0 |
| Persistence | @react-native-async-storage/async-storage | 2.x |
| Navigation | Expo Router v4 | file-based routing in `app/` |
| Icons | @expo/vector-icons (MaterialCommunityIcons) | bundled with Expo |

### Stack Rules

- Do NOT install react-navigation — use Expo Router exclusively.
- Do NOT use any state management library (no Redux, Zustand, Jotai). Use React Context + useReducer.
- Do NOT use styled-components or emotion — NativeWind only.
- Do NOT use Lottie or any heavy animation library — Reanimated 3 handles everything.
- Do NOT add a backend, database, or network calls. This is 100% offline/local.

---

## FOLDER STRUCTURE (exact)

```
imposter-party/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout (GestureHandlerRootView, GameProvider)
│   ├── index.tsx                 # HomeScreen
│   ├── how-to-play.tsx           # HowToPlayScreen (modal)
│   ├── category.tsx              # CategorySelectScreen
│   ├── players.tsx               # PlayerSetupScreen
│   ├── reveal.tsx                # RoleRevealScreen
│   ├── discussion.tsx            # DiscussionScreen
│   ├── voting.tsx                # VotingScreen
│   └── summary.tsx               # SummaryScreen
├── src/
│   ├── components/
│   │   ├── RevealCard.tsx        # Core swipe-to-reveal card (Reanimated + Gesture)
│   │   ├── CategoryCard.tsx      # Tappable category selection card
│   │   ├── PlayerListEditor.tsx  # Add/remove/rename player list
│   │   ├── PlayerRow.tsx         # Single player row (swipe to delete, tap to rename)
│   │   ├── PrimaryButton.tsx     # Reusable CTA button with haptics
│   │   ├── TimerDisplay.tsx      # Big countdown timer component
│   │   ├── VoteCard.tsx          # Player card for voting tap target
│   │   ├── ScoreBoard.tsx        # Per-player win/loss tally
│   │   └── ScreenWrapper.tsx     # SafeArea + dark bg wrapper
│   ├── context/
│   │   └── GameContext.tsx        # React Context + useReducer for game state
│   ├── data/
│   │   ├── categories.ts         # Category registry (id, name, emoji, words key)
│   │   └── wordbanks/
│   │       ├── places.json       # 50+ words
│   │       ├── foods.json        # 40+ words
│   │       ├── animals.json      # 40+ words
│   │       ├── movies.json       # 30+ words (stub: fewer words ok)
│   │       └── occupations.json  # 30+ words (stub: fewer words ok)
│   ├── game/
│   │   ├── reducer.ts            # Game state reducer (pure function)
│   │   ├── actions.ts            # Action type constants + action creators
│   │   ├── engine.ts             # Pure functions: assignRoles, pickWord, tallyVotes
│   │   └── types.ts              # GameState, GamePhase, GameAction, Player, Role types
│   ├── storage/
│   │   └── storage.ts            # AsyncStorage helpers (get/set with JSON + typing)
│   ├── constants/
│   │   └── game.ts               # MIN_PLAYERS, MAX_PLAYERS, timer options, etc.
│   ├── theme/
│   │   └── colors.ts             # Named color tokens (surface, accent, etc.)
│   ├── hooks/
│   │   ├── useGame.ts            # Shortcut hook for GameContext
│   │   ├── useCountdown.ts       # Timer hook with pause/resume
│   │   └── useHaptics.ts         # Wrapper hook for haptic patterns
│   └── types/
│       └── index.ts              # Shared app-wide types (re-exports from game/types)
├── assets/
│   └── icon.png                  # Placeholder app icon
├── global.css                    # NativeWind Tailwind directives
├── tailwind.config.js            # NativeWind/Tailwind config
├── babel.config.js               # Babel: nativewind + reanimated plugins
├── metro.config.js               # Metro: withNativeWind wrapper
├── app.config.ts                 # Expo config
├── tsconfig.json                 # TypeScript strict config
├── package.json
└── CLAUDE.md                     # This file
```

### Folder Rules

- Every `.tsx` file in `app/` is a screen (Expo Router page).
- Every file in `src/components/` is a reusable component. No screen logic inside components.
- `src/game/` contains ONLY pure functions and types. No React imports. No side effects.
- `src/storage/` is the only place that imports AsyncStorage.
- `src/context/` is the only place that creates React Context.

---

## GAME FLOW (state machine)

### Phases (in order)

```
home → category → players → reveal → discussion → voting → summary
                                                              ↓
                                                     (play again) → reveal
                                                     (change category) → category
                                                     (full reset) → home
```

### GamePhase enum

```typescript
type GamePhase =
  | "home"
  | "category"
  | "players"
  | "reveal"
  | "discussion"
  | "voting"
  | "summary";
```

### Navigation mapping

| Phase | Route | Transition |
|---|---|---|
| home | `/` (index) | — |
| category | `/category` | push |
| players | `/players` | push |
| reveal | `/reveal` | replace (no back) |
| discussion | `/discussion` | replace (no back) |
| voting | `/voting` | replace (no back) |
| summary | `/summary` | replace (no back) |

**Important**: After players screen, all subsequent screens use `router.replace()` — the user must NOT be able to swipe back during gameplay (would leak roles).

---

## GAME STATE (reducer)

### Full GameState shape

```typescript
interface Player {
  id: string;           // nanoid or uuid — keep short, e.g. "p1", "p2"
  name: string;
  role: "civilian" | "imposter" | null;  // null before assignment
}

interface VoteRecord {
  voterId: string;      // who cast the vote
  targetId: string;     // who they voted for
}

interface RoundScore {
  round: number;
  winningSide: "town" | "imposter";
  imposterIds: string[];
  eliminatedId: string | null;  // null if tie
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  categoryId: string | null;
  secretWord: string | null;
  imposterCount: 1 | 2;
  currentRevealIndex: number;       // which player is revealing (0-based)
  timerSeconds: number | null;      // null = no timer
  votes: VoteRecord[];
  currentVoterIndex: number;        // which player is voting (0-based)
  roundScores: RoundScore[];
  roundNumber: number;
}
```

### Actions (exhaustive list)

```typescript
type GameAction =
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_PLAYERS"; players: Player[] }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_CATEGORY"; categoryId: string }
  | { type: "SET_IMPOSTER_COUNT"; count: 1 | 2 }
  | { type: "START_ROUND" }            // triggers role assignment + word pick
  | { type: "ADVANCE_REVEAL" }         // currentRevealIndex++
  | { type: "SET_TIMER"; seconds: number | null }
  | { type: "CAST_VOTE"; voterId: string; targetId: string }
  | { type: "ADVANCE_VOTER" }          // currentVoterIndex++
  | { type: "FINISH_VOTING" }          // tally + determine winner
  | { type: "PLAY_AGAIN" }             // same players, re-deal
  | { type: "FULL_RESET" };            // back to home defaults
```

### Reducer Rules

- `START_ROUND`:
  1. Call `assignRoles(players, imposterCount)` → updated players with roles
  2. Call `pickWord(categoryId)` → secretWord
  3. Set `currentRevealIndex = 0`, `votes = []`, `currentVoterIndex = 0`
  4. Set `phase = "reveal"`
- `FINISH_VOTING`:
  1. Call `tallyVotes(votes, players)` → determine who got most votes
  2. Compare with imposter IDs
  3. Push to `roundScores`
  4. Set `phase = "summary"`
- `PLAY_AGAIN`:
  1. Reset roles to null, clear votes, increment roundNumber
  2. Set `phase = "reveal"` (re-run START_ROUND logic)
- The reducer is a PURE FUNCTION. No async. No side effects. No imports from React.

---

## SCREEN SPECIFICATIONS

### 1. HomeScreen (`app/index.tsx`)

**Layout**: Centered content, dark background.

**Elements**:
- App logo/title: "IMPOSTER PARTY" in large bold text with a subtle glow or accent color
- Subtitle: "Find the imposter. Trust no one."
- **Start Game** button (PrimaryButton, accent-red, full width) → navigates to `/category`
- **How to Play** button (ghost/outline style) → navigates to `/how-to-play` as modal
- Bottom: version number, small and dim

**Animations**:
- Title fades in + slides down on mount (Reanimated `FadeInDown`)
- Buttons stagger in after title (200ms delay each)

**Haptics**: Light impact on button press.

---

### 2. HowToPlayScreen (`app/how-to-play.tsx`)

**Presentation**: Modal (use Expo Router modal group or `presentation: "modal"` in layout).

**Content** (scrollable):
1. "Everyone gets a secret word — except the Imposter"
2. "Take turns describing the word without saying it"
3. "Listen carefully — the Imposter is faking it"
4. "Vote on who you think the Imposter is"
5. "If the Imposter is caught, the town wins!"

Each step: number badge + short text. Keep it scannable.

**Close**: X button top-right or swipe down to dismiss.

---

### 3. CategorySelectScreen (`app/category.tsx`)

**Layout**: Scrollable grid (2 columns) of CategoryCard components.

**Categories to show** (5 total):
| id | name | emoji | status |
|---|---|---|---|
| places | Places | 🌍 | Full (50+ words) |
| foods | Foods | 🍕 | Full (40+ words) |
| animals | Animals | 🐾 | Full (40+ words) |
| movies | Movies | 🎬 | Stub (30 words) |
| occupations | Occupations | 💼 | Stub (30 words) |

**Elements**:
- Section title: "Pick a Category"
- **Quick Start** button at top: picks random category (or last used if available)
- Grid of CategoryCards (2 col, gap-3)
- Each card: emoji (large), name, word count badge

**Behavior**:
- Tap card → dispatch `SET_CATEGORY` → navigate to `/players`
- Quick Start → pick random or lastCategoryId from storage → same flow
- On mount: load `lastCategoryId` from AsyncStorage

**Haptics**: Light impact on card tap.

---

### 4. PlayerSetupScreen (`app/players.tsx`)

**Layout**: Player list + controls at bottom.

**Elements**:
- Title: "Players" with player count badge (e.g., "4/10")
- PlayerListEditor component showing all current players
- Each row: player name (tappable to edit), delete button (X icon)
- **Add Player** button (if count < MAX_PLAYERS)
- Imposter count toggle: "1 Imposter" / "2 Imposters" (2 disabled unless players >= 7)
- Timer picker: segmented control [1:00, 2:00, 3:00, No Timer] (default 2:00)
- **Start Round** button (disabled if players < MIN_PLAYERS)

**Behavior**:
- On mount: load `lastPlayers` from AsyncStorage, populate list
- Adding player: appends "Player N" where N = list length + 1
- Renaming: inline TextInput, auto-focus, blur to confirm
- Empty name on blur → revert to "Player N"
- Duplicate names → auto-append number suffix
- On Start Round:
  1. Persist players to AsyncStorage
  2. Persist timerSeconds to AsyncStorage
  3. Dispatch `SET_PLAYERS`, `SET_TIMER`, `SET_IMPOSTER_COUNT`
  4. Dispatch `START_ROUND`
  5. `router.replace("/reveal")`

**Haptics**: Selection on toggle changes. Light on add. Medium on delete.

---

### 5. RoleRevealScreen (`app/reveal.tsx`)

**This is the CORE DELIGHT screen. Spend the most effort here.**

**Layout**: Full screen, single RevealCard centered.

**Flow**:
1. Show "Pass to [Player Name]" instruction at top
2. RevealCard in center (hidden state: shows player's name on back, "Tap & hold to peek" hint)
3. Player swipes card up to reveal:
   - **Civilian**: Shows category emoji + "Your word is:" + **secret word** in large text
   - **Imposter**: Shows 🕵️ + "YOU ARE THE IMPOSTER" in red + tip: "Blend in. Don't get caught."
4. Card auto-hides after 4 seconds
5. After hide: show "Next Player" button (or auto-advance after 1.5s delay)
6. After last player: navigate to `/discussion`

**RevealCard Component Spec**:
```
Props:
  playerName: string
  role: "civilian" | "imposter"
  secretWord: string       // only shown if civilian
  categoryEmoji: string
  onRevealed: () => void   // called when reveal animation completes
  onDismissed: () => void  // called when card re-hides

State:
  hidden (default) → revealed → hidden (auto or tap)

Gesture: Vertical pan (swipe up)
  - Track translateY with useSharedValue
  - Threshold: -120px to trigger reveal
  - When threshold crossed: snap to revealed state, lock gesture
  - animatedStyle: interpolate translateY to scale, opacity, rotation

Animation:
  - Hidden → Revealed: card flips/slides up, content fades in (300ms spring)
  - Revealed → Hidden: card slides back, content fades out (200ms)
  - Use withSpring for snappy feel, damping: 15, stiffness: 150

Haptics (CRITICAL):
  - onStart of pan: Haptics.impactAsync(ImpactFeedbackStyle.Light) — ONCE per gesture
  - threshold crossed: Haptics.impactAsync(ImpactFeedbackStyle.Heavy)
  - dismiss: Haptics.selectionAsync()

Visual:
  - Card: rounded-3xl, bg-surface-700, shadow-2xl, min-h-[400px], w-[85%]
  - Hidden state: player name centered, subtle "↑ Swipe to reveal" text, pulsing arrow animation
  - Revealed/Civilian: green border glow, word in white bold 32px
  - Revealed/Imposter: red border glow, "IMPOSTER" in accent-red bold 36px
```

**Screen-level logic**:
- Read `currentRevealIndex` from game state
- Get current player from `players[currentRevealIndex]`
- On dismissed: dispatch `ADVANCE_REVEAL`
- If `currentRevealIndex >= players.length`: `router.replace("/discussion")`

---

### 6. DiscussionScreen (`app/discussion.tsx`)

**Layout**: Timer-dominant, minimal.

**Elements**:
- Category badge at top (emoji + name only — NO secret word)
- Giant countdown timer in center (TimerDisplay component)
  - Format: "2:00" → "1:59" → ... → "0:00"
  - Color shifts: white > 30s, amber < 30s, red < 10s
  - Pulse animation when < 10s
- **Pause** button (toggles to Resume)
- **End Discussion** button → navigate to `/voting`

**Timer "No timer" mode**:
- Show elapsed time counting UP instead (stopwatch style)
- Only "End Discussion" button, no pause

**Behavior**:
- Timer auto-starts on mount
- When timer hits 0: auto-navigate to `/voting` with a vibration burst
- Pause freezes the countdown

**Haptics**:
- Timer reaching 0: Haptics.notificationAsync(NotificationFeedbackType.Warning)
- Pause/resume: Haptics.selectionAsync()

---

### 7. VotingScreen (`app/voting.tsx`)

**Layout**: Sequential voting (one player at a time).

**Flow**:
1. Show "Pass to [Current Voter Name]" + "Who is the Imposter?"
2. Grid of VoteCard components (all OTHER players — voter cannot vote for self)
3. Tap a card to cast vote
4. Confirm: "Vote for [Target]?" with Confirm/Cancel
5. On confirm: dispatch `CAST_VOTE`, then `ADVANCE_VOTER`
6. Next voter, repeat
7. After last voter: dispatch `FINISH_VOTING` → `router.replace("/summary")`

**VoteCard**:
- Shows player name
- Tap to select (highlight border)
- Selected state: accent-red border, checkmark overlay

**Haptics**: Medium impact on vote confirm. Selection on tap.

---

### 8. SummaryScreen (`app/summary.tsx`)

**Layout**: Results-focused, celebratory.

**Elements**:
- Winner announcement:
  - Town wins: "🎉 Town Wins!" in green
  - Imposter wins: "🕵️ Imposter Wins!" in red
- Imposter reveal: "The Imposter was: [Name(s)]"
- Secret word reveal: "The word was: [Word]"
- Vote breakdown: list showing "Player A → voted for Player B" for each vote
- Scoreboard: table of all players with cumulative wins
- **Play Again** button (PrimaryButton, accent-blue) → dispatch PLAY_AGAIN → `/reveal`
- **Change Category** button (outline) → dispatch SET_PHASE("category") → `/category`
- **New Game** button (ghost) → dispatch FULL_RESET → `/`

**Animations**:
- Winner text: scale up + bounce (entering animation)
- Vote list: stagger fade in
- Imposter name(s): dramatic reveal with delay

**Haptics**: Notification success on town win. Notification error on imposter win.

---

## COMPONENT SPECIFICATIONS

### PrimaryButton

```typescript
interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outline" | "ghost";
  color?: "red" | "blue" | "green" | "amber";
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: "light" | "medium" | "heavy" | "none";
}
```

- Default: filled, red, medium haptic
- Animated press state: scale to 0.96 on press (Reanimated)
- Disabled: 50% opacity, no haptics

### CategoryCard

```typescript
interface CategoryCardProps {
  id: string;
  name: string;
  emoji: string;
  wordCount: number;
  isSelected?: boolean;
  onPress: () => void;
}
```

- Card: rounded-2xl, bg-surface-700, p-5
- Emoji: text-5xl centered
- Name: text-lg font-semibold white
- Word count badge: small pill, "50 words"
- Selected: accent-blue border-2
- Press animation: slight scale down

### ScreenWrapper

```typescript
interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;       // wraps in ScrollView if true
  padded?: boolean;           // default px-5 py-4
}
```

- SafeAreaView + bg-surface-900 + flex-1
- Handles keyboard avoiding on screens with inputs

---

## ENGINE FUNCTIONS (`src/game/engine.ts`)

All functions are PURE. No side effects. No randomness from Date — accept optional seed for testability.

### `assignRoles`

```typescript
function assignRoles(
  players: Player[],
  imposterCount: 1 | 2,
  randomFn?: () => number    // default Math.random
): Player[]
```

- Returns new array with roles assigned
- Exactly `imposterCount` players get "imposter", rest get "civilian"
- Validate: imposterCount === 2 requires players.length >= 7

### `pickWord`

```typescript
function pickWord(
  categoryId: string,
  usedWords?: string[],       // avoid repeats within session
  randomFn?: () => number
): string
```

- Loads word bank for categoryId
- Picks random word not in usedWords
- If all used, resets (picks any)

### `tallyVotes`

```typescript
interface VoteTally {
  playerId: string;
  playerName: string;
  voteCount: number;
}

interface VotingResult {
  tallies: VoteTally[];               // sorted desc by voteCount
  eliminatedId: string | null;        // null if tie
  imposterIds: string[];
  townWins: boolean;
}

function tallyVotes(
  votes: VoteRecord[],
  players: Player[]
): VotingResult
```

- Count votes per target
- If single highest: that player is eliminated
- If tie at top: eliminatedId = null (no elimination)
- townWins = eliminatedId is in imposterIds

---

## WORD BANKS

### `src/data/wordbanks/places.json`

Provide at least 50 entries. Mix of well-known and varied locations:

```json
[
  "Airport", "Beach", "Library", "Hospital", "Museum",
  "Casino", "Zoo", "Gym", "Church", "Prison",
  "School", "University", "Farm", "Bakery", "Bank",
  "Aquarium", "Theater", "Stadium", "Submarine", "Spaceship",
  "Volcano", "Desert", "Jungle", "Castle", "Lighthouse",
  "Supermarket", "Restaurant", "Amusement Park", "Ski Resort", "Cruise Ship",
  "Pyramid", "Haunted House", "Observatory", "Train Station", "Fire Station",
  "Bowling Alley", "Movie Theater", "Nightclub", "Wedding", "Funeral Home",
  "Car Wash", "Laundromat", "Pet Store", "Dentist", "Barbershop",
  "Construction Site", "Oil Rig", "Space Station", "North Pole", "Treehouse"
]
```

### `src/data/wordbanks/foods.json`

```json
[
  "Pizza", "Sushi", "Tacos", "Pasta", "Burger",
  "Ice Cream", "Chocolate", "Pancakes", "Steak", "Salad",
  "Ramen", "Curry", "Fried Chicken", "Hot Dog", "Waffles",
  "Croissant", "Donut", "Lobster", "Pho", "Burrito",
  "Dim Sum", "Fish and Chips", "Gelato", "Pretzel", "Nachos",
  "Cheesecake", "Popcorn", "Spaghetti", "French Fries", "Avocado Toast",
  "Kebab", "Pad Thai", "Tiramisu", "Miso Soup", "Cornbread",
  "Gumbo", "Falafel", "Ceviche", "Samosa", "Baklava"
]
```

### `src/data/wordbanks/animals.json`

```json
[
  "Elephant", "Penguin", "Dolphin", "Eagle", "Tiger",
  "Giraffe", "Octopus", "Kangaroo", "Panda", "Shark",
  "Chameleon", "Flamingo", "Sloth", "Hedgehog", "Parrot",
  "Wolf", "Whale", "Cobra", "Gorilla", "Jellyfish",
  "Peacock", "Bat", "Koala", "Cheetah", "Seahorse",
  "Toucan", "Armadillo", "Platypus", "Manta Ray", "Firefly",
  "Polar Bear", "Red Panda", "Owl", "Crocodile", "Hummingbird",
  "Moose", "Scorpion", "Pufferfish", "Axolotl", "Starfish"
]
```

### `src/data/wordbanks/movies.json` (stub)

```json
[
  "Titanic", "Jaws", "Avatar", "Shrek", "Frozen",
  "Batman", "Jurassic Park", "Finding Nemo", "The Matrix", "Toy Story",
  "Harry Potter", "Star Wars", "The Lion King", "Spider-Man", "Rocky",
  "Ghostbusters", "Back to the Future", "Forrest Gump", "Gladiator", "Inception",
  "Up", "Coco", "Moana", "Aliens", "Grease",
  "Jeopardy", "Braveheart", "Aladdin", "Terminator", "Ratatouille"
]
```

### `src/data/wordbanks/occupations.json` (stub)

```json
[
  "Doctor", "Firefighter", "Astronaut", "Chef", "Pilot",
  "Detective", "Teacher", "Lifeguard", "Magician", "Dentist",
  "Plumber", "Surgeon", "Farmer", "Mechanic", "Lawyer",
  "Clown", "DJ", "Barber", "Spy", "Zookeeper",
  "Archaeologist", "Park Ranger", "Librarian", "Bus Driver", "Florist",
  "Tattoo Artist", "Meteorologist", "Blacksmith", "Referee", "Beekeeper"
]
```

---

## CATEGORIES REGISTRY (`src/data/categories.ts`)

```typescript
import type { Category } from "@/game/types";

import placesWords from "./wordbanks/places.json";
import foodsWords from "./wordbanks/foods.json";
import animalsWords from "./wordbanks/animals.json";
import moviesWords from "./wordbanks/movies.json";
import occupationsWords from "./wordbanks/occupations.json";

export const CATEGORIES: Category[] = [
  { id: "places", name: "Places", emoji: "🌍", words: placesWords },
  { id: "foods", name: "Foods", emoji: "🍕", words: foodsWords },
  { id: "animals", name: "Animals", emoji: "🐾", words: animalsWords },
  { id: "movies", name: "Movies", emoji: "🎬", words: moviesWords },
  { id: "occupations", name: "Occupations", emoji: "💼", words: occupationsWords },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
```

---

## CONSTANTS (`src/constants/game.ts`)

```typescript
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
```

---

## PERSISTENCE (`src/storage/storage.ts`)

Thin typed wrapper around AsyncStorage:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
```

### What to persist and when:

| Data | Key | When to save | When to load |
|---|---|---|---|
| Player names | LAST_PLAYERS | On "Start Round" press | PlayerSetup mount |
| Category ID | LAST_CATEGORY_ID | On category select | CategorySelect mount |
| Timer setting | LAST_TIMER | On "Start Round" press | PlayerSetup mount |

---

## HAPTICS PATTERN GUIDE (`src/hooks/useHaptics.ts`)

```typescript
import * as Haptics from "expo-haptics";

export function useHaptics() {
  return {
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    selection: () => Haptics.selectionAsync(),
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  };
}
```

### When to fire haptics:

| Event | Pattern |
|---|---|
| Button press | light |
| Card tap / selection | selection |
| Role reveal threshold | heavy |
| Card dismiss | selection |
| Vote confirm | medium |
| Timer expires | warning |
| Town wins | success |
| Imposter wins | error |
| Add player | light |
| Remove player | medium |
| Toggle imposter count | selection |
| Timer option change | selection |

---

## ANIMATION GUIDELINES

### Entry animations (per screen)

Use Reanimated's `entering` prop on Animated components:

```typescript
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

// Title entering
<Animated.Text entering={FadeInDown.duration(500).springify()}>

// Staggered list items
<Animated.View entering={FadeInUp.delay(index * 100).springify()}>
```

### RevealCard animations

- Use `useAnimatedStyle` + `useSharedValue` for gesture tracking
- Spring config: `{ damping: 15, stiffness: 150 }`
- Interpolate translateY to:
  - Opacity of hidden content (1 → 0)
  - Opacity of revealed content (0 → 1)
  - Scale of card (1 → 1.02 on reveal, subtle)
  - Border color (transparent → green/red glow)

### Countdown timer

- When < 10s: `useAnimatedStyle` pulsing scale 1.0 → 1.05 → 1.0 (loop)
- Color transition: white → amber → red via interpolateColor

### Button press

- `withSpring` scale to 0.96 on pressIn, back to 1 on pressOut
- Duration: very fast (no delay feeling)

---

## DESIGN TOKENS (NativeWind / Tailwind)

### Colors (in tailwind.config.js extend)

```
surface-900: "#0F0F1A"    // app background
surface-800: "#1A1A2E"    // card background
surface-700: "#252540"    // elevated card
surface-600: "#30304D"    // input backgrounds

accent-red:    "#FF3B5C"  // imposter, danger, primary CTA
accent-blue:   "#4A9EFF"  // civilian, info, secondary CTA
accent-green:  "#34D399"  // success, town wins
accent-amber:  "#FBBF24"  // warning, timer low
accent-purple: "#A78BFA"  // decorative

text-primary:    white
text-secondary:  "#A1A1B5"
text-muted:      "#6B6B80"
```

### Typography scale

```
Title:     text-4xl font-extrabold tracking-tight
Heading:   text-2xl font-bold
Subhead:   text-lg font-semibold
Body:      text-base font-normal
Caption:   text-sm text-secondary
Timer:     text-7xl font-bold tabular-nums (use monospace for countdown)
```

### Spacing

- Screen padding: px-5
- Card padding: p-5
- Section gap: gap-4
- Button height: h-14
- Card min height: min-h-[120px]

---

## EDGE CASES (handle all of these)

1. **Players < 3**: Disable "Start Round" button, show helper text "Need at least 3 players"
2. **Players < 7 with 2 imposters selected**: Auto-revert to 1 imposter, show brief toast/note
3. **Empty player name**: On blur, revert to "Player N" where N is their position
4. **Duplicate names**: On blur, auto-append " (2)", " (3)" etc.
5. **All words used in session**: Reset used words list, allow repeats
6. **Timer "No Timer" mode**: Show elapsed time counting up, only manual "End Discussion"
7. **Voting tie**: No elimination. Summary says "It's a tie! No one was eliminated." Still reveal imposter.
8. **Single imposter gets zero votes**: Imposter wins. Summary: "The Imposter escaped!"
9. **Back navigation during game**: Disabled (use `router.replace` for reveal→discussion→voting→summary)
10. **App backgrounded during reveal**: Auto-hide card on AppState change to "background"
11. **Rapid gesture spam on RevealCard**: Debounce — lock gesture after reveal until dismiss completes

---

## TESTING NOTES (for future, not MVP)

- `src/game/engine.ts`: Unit testable (pure functions)
- `src/game/reducer.ts`: Unit testable (pure function)
- Components: Snapshot testable (no side effects in render)

For MVP: focus on manual QA. Ensure:
- [ ] Full flow works: home → category → players → reveal all → discuss → vote all → summary
- [ ] Play Again works: summary → new reveal round
- [ ] Persistence: close app → reopen → last players + category restored
- [ ] Imposter count: 2 imposters only available when 7+ players
- [ ] Timer: all 4 options work including No Timer
- [ ] RevealCard: swipe, auto-hide, haptics, no role leak
- [ ] Voting: can't vote for self, ties handled

---

## STYLE GUIDE FOR CLAUDE CODE

When generating code, follow these rules:

1. **Imports**: Use `@/` path alias for all src/ imports. Group: React → RN → Expo → Libraries → Local.
2. **Components**: Functional components only. Use `const X: React.FC<Props>` or plain function.
3. **Hooks**: Prefix with `use`. Put custom hooks in `src/hooks/`.
4. **Types**: Export from `src/game/types.ts`. Re-export from `src/types/index.ts` if shared.
5. **No `any`**: Use `unknown` if truly needed. Prefer explicit types.
6. **NativeWind**: Use `className` prop (NativeWind v4 syntax). No `styled()` wrapper.
7. **Comments**: Only where logic is non-obvious. No "// render the component" type comments.
8. **File length**: Keep under 200 lines. Extract sub-components if growing.
9. **Error handling**: Wrap AsyncStorage calls in try/catch. Silently fail with defaults.
10. **Console**: No console.log in production code. Use `__DEV__ && console.log(...)` if needed during dev.

---

## QUICK START COMMANDS

```bash
# Create project
npx create-expo-app imposter-party --template blank-typescript
cd imposter-party

# Install dependencies
npx expo install nativewind tailwindcss react-native-reanimated react-native-gesture-handler @react-native-async-storage/async-storage expo-haptics react-native-safe-area-context react-native-screens expo-router expo-linking expo-constants expo-status-bar @expo/vector-icons react-native-svg

# Generate config files
npx tailwindcss init

# Run
npx expo start
```

---

## FINAL CHECKLIST

Before considering the MVP complete, every item must pass:

- [ ] All 8 screens render without crash
- [ ] Full game loop completes (home → ... → summary → play again)
- [ ] RevealCard has smooth swipe, haptics on 3 events, auto-hide at 4s
- [ ] Timer counts down, pauses, and auto-advances at 0
- [ ] Voting prevents self-voting, handles ties
- [ ] AsyncStorage persists players, category, timer across app restarts
- [ ] No secret word leaks outside RevealCard reveal state
- [ ] Dark theme looks polished on both iOS and Android
- [ ] No TypeScript errors (strict mode)
- [ ] No `any` types in codebase
- [ ] Back navigation blocked during active game (reveal through summary)
- [ ] Min/max player counts enforced in UI
- [ ] 2 imposter mode only when 7+ players

---

*This document is complete. Build the entire project from this specification.*

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Imposter Party**

A mobile-only local party social deduction game where players share a single device, passing it around. Everyone gets a secret word except the imposter, who must bluff their way through a discussion round. Players then vote to identify the imposter. Built with React Native + Expo for iOS and Android, fully offline with no backend.

**Core Value:** The reveal moment — swiping to see your role (civilian with the secret word, or imposter) — must feel delightful, smooth, and secure (no role leaks). If everything else is rough but the reveal card is perfect, the game works.

### Constraints

- **Tech stack**: React Native + Expo managed workflow — no ejecting, no bare workflow
- **Styling**: NativeWind v4 only — no styled-components, no emotion
- **State**: React Context + useReducer only — no external state libraries
- **Navigation**: Expo Router v4 only — no react-navigation
- **Offline**: 100% local, no network calls, no backend
- **Platform**: iOS + Android via Expo
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Reality Check: Stack Drift from CLAUDE.md
| Component | CLAUDE.md Says | Actually Installed |
|-----------|---------------|-------------------|
| Expo SDK | 52+ | 54.0.30 |
| React Native | 0.76 | 0.81.5 |
| react-native-reanimated | ~3.16 | ~4.1.1 |
| react-native-gesture-handler | ~2.20 | ~2.28.0 |
| expo-router | v4 | ~6.0.21 |
| expo-haptics | ~14.0 | ~15.0.8 |
| @react-native-async-storage/async-storage | 2.x | 2.2.0 |
| NativeWind | v4 | ^4.2.1 |
| react-native-worklets | (not listed) | 0.5.1 |
## Recommended Stack (Actual Installed Versions)
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Expo SDK | ~54.0.30 | Managed workflow, build toolchain | Stable, supports New Architecture, all packages compatible |
| React Native | 0.81.5 | Native runtime | Bundled with Expo 54, New Architecture enabled by default |
| TypeScript | ~5.9.2 | Type safety | Strict mode enforced; `unknown` over `any` |
| expo-router | ~6.0.21 | File-based navigation | Convention-over-config; no react-navigation needed |
### Animations + Gestures
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-native-reanimated | ~4.1.1 | UI-thread animations | Reanimated 4 runs fully on the JS/Hermes VM via react-native-worklets; no bridge crossing. `withSpring`, `withTiming`, `useSharedValue`, `useAnimatedStyle`, layout animations all still work — same API as v3 with minor `withSpring` parameter changes. |
| react-native-gesture-handler | ~2.28.0 | Gesture recognition | `Gesture.Pan()` API for swipe-to-reveal card; must wrap app in `GestureHandlerRootView` |
| react-native-worklets | 0.5.1 | Reanimated 4 dependency | Required by Reanimated 4; provides worklet runtime |
### Styling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| NativeWind | ^4.2.1 | Tailwind utility classes on React Native | v4 is production-stable; v5 is pre-release alpha on Tailwind CSS v4. Do NOT upgrade to v5 for this project. |
| tailwindcss | ^3.4.19 | CSS engine for NativeWind v4 | NativeWind v4 requires Tailwind CSS v3, NOT v4 |
### Haptics + Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| expo-haptics | ~15.0.8 | Tactile feedback | Bundled with Expo; `ImpactFeedbackStyle`, `NotificationFeedbackType` — no config needed |
| @react-native-async-storage/async-storage | 2.2.0 | Offline persistence | Typed JSON wrapper; persists players, category, timer across app restarts |
### UI + Icons
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @expo/vector-icons | ^15.0.3 | Icons (MaterialCommunityIcons) | Bundled with Expo, no extra native modules |
| expo-linear-gradient | ~15.0.8 | Gradient backgrounds | Expo-native, zero config |
| @expo-google-fonts/fredoka | ^0.4.1 | Display font (Fredoka Bold) | Used for game titles and large headings |
| @expo-google-fonts/nunito | ^0.4.2 | Body font (Nunito) | Used for body and UI text |
| react-native-safe-area-context | ~5.6.0 | Safe area insets | Required by Expo Router for proper layout |
| react-native-screens | ~4.16.0 | Native screen optimization | Required by Expo Router; improves memory and transitions |
## Critical Configuration Notes
### Babel Plugin — Reanimated 4 Change
- **Old (Reanimated 3):** `"react-native-reanimated/plugin"` in babel.config.js
- **New (Reanimated 4):** `"react-native-worklets/plugin"` in babel.config.js
### NativeWind v4 Babel + Metro Configuration
- `jsxImportSource: "nativewind"` in `babel-preset-expo`
- `"nativewind/babel"` in the presets array
### withSpring API Change (Reanimated 4)
- `restDisplacementThreshold` and `restSpeedThreshold` removed (replaced by `energyThreshold`)
- `duration` in withSpring is now "perceptual duration" — divide by 1.5 if migrating timed springs
### GestureHandlerRootView
### NativeWind className on Third-Party Components
### Color in View vs Text (NativeWind limitation)
### Hot Reload and New Style Classes
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Navigation | Expo Router v6 | react-navigation | Expo Router is file-based, convention-over-config; react-navigation requires manual stack setup and is the underlying dependency already |
| State | Context + useReducer | Zustand, Jotai, Redux | This is a local party game with a finite, predictable state machine. External state libraries add bundle weight and complexity without benefit |
| Styling | NativeWind v4 | StyleSheet API | NativeWind provides consistent design token enforcement and utility-class speed; raw StyleSheet is verbose and error-prone for dark theme consistency |
| Styling | NativeWind v4 | NativeWind v5 | v5 is alpha-only as of April 2026, requires Tailwind CSS v4, and breaks v4 configuration entirely |
| Animation | Reanimated 4 | Lottie | Lottie requires a native module and large JSON animation files. Reanimated handles all required animations (swipe, spring, color transition, stagger) with smaller footprint |
| Storage | AsyncStorage | expo-sqlite/kv-store | kv-store is a newer drop-in replacement with sync APIs, but AsyncStorage 2.2.0 is stable and sufficient for simple key-value persistence in this app |
| Fonts | expo-google-fonts | custom font files | expo-google-fonts is zero-config; custom fonts require asset bundling and manual loading |
## What NOT to Install
| Package | Reason |
|---------|--------|
| react-navigation | Already provided via expo-router's internals. Installing separately causes version conflicts. |
| redux / zustand / jotai | Overkill. Context + useReducer handles this state machine. |
| styled-components / emotion | Not compatible with NativeWind v4 transformer pipeline. |
| lottie-react-native | Requires native module and dev client. Reanimated handles everything needed. |
| nativewind@5 or tailwindcss@4 | v5 is pre-release; v4+tailwind3 is the stable pairing for this project. |
| react-native-worklets/plugin AND react-native-reanimated/plugin together | Causes duplicate plugin error in Reanimated 4. Use only worklets/plugin. |
## Installation Reference
# Navigation / routing (already installed)
# Gestures + animations (already installed)
# Styling (already installed)
# Storage (already installed)
# Optional: screen capture protection for reveal screen
## Sources
- Expo SDK 54 Changelog: https://expo.dev/changelog/sdk-54
- React Native 0.77 with Expo SDK 52 (context): https://expo.dev/changelog/2025-01-21-react-native-0.77
- Reanimated 4 Compatibility Matrix: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
- Reanimated 3 to 4 Migration Guide: https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/
- NativeWind v4.1 Announcement: https://www.nativewind.dev/blog/announcement-nativewind-v4-1
- NativeWind v4 Troubleshooting: https://www.nativewind.dev/docs/getting-started/troubleshooting
- NativeWind v5 Migration from v4: https://www.nativewind.dev/v5/guides/migrate-from-v4
- Expo Router Navigation Docs: https://docs.expo.dev/router/basics/navigation/
- Expo Gesture Handler Docs: https://docs.expo.dev/versions/latest/sdk/gesture-handler/
- React Native Gesture Handler Pan Gesture: https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/
- expo-screen-capture Docs: https://docs.expo.dev/versions/latest/sdk/screen-capture/
- Expo AsyncStorage Docs: https://docs.expo.dev/versions/latest/sdk/async-storage/
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
