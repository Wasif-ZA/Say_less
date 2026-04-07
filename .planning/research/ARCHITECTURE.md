# Architecture Patterns

**Domain:** Pass-and-play mobile party social deduction game
**Project:** Imposter Party
**Researched:** 2026-04-07
**Confidence:** HIGH (official docs + verified patterns)

---

## Recommended Architecture

Imposter Party uses a layered architecture with four distinct tiers that communicate in one direction: data flows down from game engine through context into screens and components. No layer reaches upward into a layer above it.

```
┌─────────────────────────────────────────────────────────┐
│  NAVIGATION LAYER (Expo Router)                         │
│  app/_layout.tsx — GestureHandlerRootView + GameProvider│
│  app/*.tsx — Screen components (Expo Router pages)      │
└───────────────────────────┬─────────────────────────────┘
                            │ reads phase, dispatches actions
┌───────────────────────────▼─────────────────────────────┐
│  CONTEXT LAYER (React Context + useReducer)             │
│  src/context/GameContext.tsx — state + dispatch         │
│  src/hooks/useGame.ts — consumer shortcut               │
└───────────────────────────┬─────────────────────────────┘
                            │ calls pure functions, produces next state
┌───────────────────────────▼─────────────────────────────┐
│  GAME ENGINE LAYER (pure TypeScript)                    │
│  src/game/reducer.ts — handles all GameAction types     │
│  src/game/engine.ts — assignRoles, pickWord, tallyVotes │
│  src/game/actions.ts — action type constants            │
│  src/game/types.ts — GameState, Player, VoteRecord      │
└───────────────────────────┬─────────────────────────────┘
                            │ persists / loads across sessions
┌───────────────────────────▼─────────────────────────────┐
│  PERSISTENCE LAYER (AsyncStorage)                       │
│  src/storage/storage.ts — typed get/set/remove wrappers │
└─────────────────────────────────────────────────────────┘
```

### What runs where

| Layer | React? | Async? | Side effects? |
|-------|--------|--------|---------------|
| Navigation (screens) | YES | YES (via hooks) | YES (navigation, haptics) |
| Context | YES | NO | NO (pure dispatch model) |
| Game Engine | NO | NO | NO (pure functions only) |
| Persistence | NO | YES | YES (AsyncStorage I/O) |

---

## Component Boundaries

### Root Layout (`app/_layout.tsx`)

**Responsibility:** Set up providers that must exist above all screens.

**Must contain:**
- `GestureHandlerRootView` with `style={{ flex: 1 }}` — required at root for gesture recognition across all screens (HIGH confidence, official RNGH docs)
- `GameProvider` wrapping all routes — provides game state and dispatch to every screen
- `SafeAreaProvider` — standard Expo managed workflow requirement

**Communicates with:** All child screens via GameContext. Does not read game state itself.

---

### GameContext (`src/context/GameContext.tsx`)

**Responsibility:** Bridge between the pure reducer and React's component tree. Single source of truth for all runtime game state.

**Pattern:** Two separate contexts exported — one for state, one for dispatch — so components that only dispatch do not re-render when state changes. (HIGH confidence, React official docs pattern.)

```typescript
// Two contexts, not one
export const GameStateContext = createContext<GameState>(initialState);
export const GameDispatchContext = createContext<Dispatch<GameAction>>(() => {});
```

**Communicates with:**
- Inward: `src/game/reducer.ts` via `useReducer`
- Outward: all screens via `useGame` hook and direct context consumption

**Does NOT:** Import AsyncStorage, trigger navigation, or call engine functions directly. Those happen in the reducer (engine) and screen components (navigation/storage).

---

### Game Engine (`src/game/`)

**Responsibility:** All logic that determines what happens in the game. Zero React dependencies. Zero side effects.

| File | What it owns |
|------|-------------|
| `types.ts` | All TypeScript interfaces: `GameState`, `Player`, `VoteRecord`, `RoundScore`, `GamePhase`, `GameAction` |
| `actions.ts` | Action type string constants + typed action creators |
| `reducer.ts` | Pure state transition function `(state, action) => newState`. Calls engine functions on `START_ROUND` and `FINISH_VOTING`. |
| `engine.ts` | `assignRoles()`, `pickWord()`, `tallyVotes()` — pure functions accepting optional `randomFn` for testability |

**Critical constraint:** No file in `src/game/` may import from React, Expo, or any library. This is what makes the engine unit-testable and keeps it decoupled from platform concerns.

**Communicates with:** Only `GameContext` (which calls `useReducer(reducer, initialState)`). No screen imports the reducer or engine directly.

---

### Screens (`app/*.tsx`)

Each screen is a leaf consumer. Screens read game state, dispatch actions, and trigger navigation. They do not contain business logic.

| Screen | Reads from state | Dispatches | Navigates |
|--------|-----------------|------------|-----------|
| `index.tsx` | nothing | nothing | push `/category` |
| `category.tsx` | nothing game-state | `SET_CATEGORY` | push `/players` |
| `players.tsx` | `players`, `imposterCount`, `timerSeconds` | `SET_PLAYERS`, `SET_TIMER`, `SET_IMPOSTER_COUNT`, `START_ROUND` | replace `/reveal` |
| `reveal.tsx` | `players`, `currentRevealIndex`, `secretWord`, `categoryId` | `ADVANCE_REVEAL` | replace `/discussion` |
| `discussion.tsx` | `timerSeconds`, `categoryId` | nothing | replace `/voting` |
| `voting.tsx` | `players`, `currentVoterIndex`, `votes` | `CAST_VOTE`, `ADVANCE_VOTER`, `FINISH_VOTING` | replace `/summary` |
| `summary.tsx` | `roundScores`, `votes`, `players`, `secretWord` | `PLAY_AGAIN`, `SET_PHASE`, `FULL_RESET` | replace `/reveal` or `/category` or `/` |

**Back navigation design:** All gameplay screens (reveal through summary) use `router.replace()`. This removes the previous screen from the navigation stack entirely. A player who tries to swipe back from the voting screen lands on the home screen — not the reveal screen. This is the core role-leak prevention mechanism. (MEDIUM confidence — verified via Expo Router discussions that `router.replace` achieves this.)

---

### Reusable Components (`src/components/`)

Components are pure presentational + local animation. They receive all data as props and call callback props for events. They do not read from GameContext.

| Component | Inputs | Outputs | Animation layer |
|-----------|--------|---------|----------------|
| `RevealCard` | `playerName`, `role`, `secretWord`, `categoryEmoji`, callbacks | `onRevealed`, `onDismissed` | YES — Gesture + Reanimated |
| `CategoryCard` | `id`, `name`, `emoji`, `wordCount`, `isSelected` | `onPress` | Press scale (Reanimated) |
| `PlayerListEditor` | `players` array | add/remove/rename callbacks | Stagger fade-in |
| `PlayerRow` | player object | edit/delete callbacks | Swipe-to-delete (Reanimated) |
| `PrimaryButton` | `title`, `onPress`, `variant`, `color`, `disabled` | `onPress` | Press scale (Reanimated) |
| `TimerDisplay` | `seconds`, `isRunning` | none (display only) | Color + pulse (Reanimated) |
| `VoteCard` | player, `isSelected` | `onPress` | Border highlight |
| `ScoreBoard` | `roundScores`, `players` | none | Stagger fade-in |
| `ScreenWrapper` | `children`, `scrollable`, `padded` | none | none |

**Exception:** `RevealCard` is the only component that owns significant local animation state (via `useSharedValue`). All other components delegate animation to simple entering/exiting props.

---

### Gesture + Animation Layer (RevealCard)

This is architecturally separate from the React state tree. Gesture and animation state lives in Reanimated shared values that run on the UI thread and bypass React reconciliation entirely.

```
User gesture event (native thread)
    ↓
Gesture.Pan() handler (UI thread worklet)
    ↓
useSharedValue updates (UI thread)
    ↓
useAnimatedStyle re-derives (UI thread)
    ↓
Native view update (no JS bridge, no React render)
    ↓
onRevealed callback (back to JS thread, triggers React dispatch)
```

**Why this matters:** The swipe reveal must feel instantaneous. Any path through React state or JS bridge would introduce visible lag at 60fps. The shared value / worklet architecture keeps the gesture entirely on the native UI thread until the user has completed the reveal — only then does a JS callback fire to update game state. (HIGH confidence, Reanimated official docs.)

**GestureHandlerRootView requirement:** All gesture detection requires the component tree to have a `GestureHandlerRootView` ancestor. This must live in `app/_layout.tsx` — not in individual screens — because gesture relations are scoped to the nearest root view. (HIGH confidence, RNGH official docs.)

---

### Persistence Layer (`src/storage/`)

**Responsibility:** Isolated async I/O. Only file that imports AsyncStorage.

**Pattern:** Thin typed wrappers around AsyncStorage with JSON serialization. Screens call storage functions inside `useEffect` on mount (load) and in event handlers before dispatch (save). The game reducer itself is never async — persistence is a side effect that screens manage independently.

```
Screen mount → getItem(LAST_PLAYERS) → populate local state → user edits
Screen "Start" press → setItem(LAST_PLAYERS) → dispatch START_ROUND → navigate
```

**What is persisted:**
- `LAST_PLAYERS` — restored on `players.tsx` mount (pre-fills player list)
- `LAST_CATEGORY_ID` — restored on `category.tsx` mount (no auto-select, just awareness)
- `LAST_TIMER` — restored on `players.tsx` mount (restores timer setting)
- `SCORES` — cumulative round scores (future use, write on summary)

**What is NOT persisted:** In-progress game state (roles, votes, current phase). Closing the app mid-game is a reset. This is intentional for a party game where sessions are short.

---

### Data Flow Summary

```
AsyncStorage (load on mount)
       ↓
Screen local state (player names, category selection, timer)
       ↓
User interaction → dispatch(action)
       ↓
GameContext reducer → new GameState
       ↓
Screen reads updated GameState → triggers router.replace(nextRoute)
       ↓
Next screen reads slice of GameState it needs
```

Side data flow for animations (does not touch GameState):
```
User gesture → Reanimated shared values → animated styles → native view
                                               ↓ (on threshold)
                                       onRevealed() callback
                                               ↓
                                    dispatch(ADVANCE_REVEAL)
```

---

## Patterns to Follow

### Pattern 1: State Machine Phase Guards

The game phase is the canonical source of navigation truth. Screens should not independently decide what to render based on multiple state flags — they check `phase` from GameState and navigate accordingly.

```typescript
// In a screen's useEffect
useEffect(() => {
  if (phase !== "reveal") {
    router.replace("/");  // defensive guard — phase mismatch means corrupt state
  }
}, [phase]);
```

**When:** Any screen that should only be visible in a specific game phase.

### Pattern 2: Dual Context Consumption

Read state and dispatch from separate contexts. This prevents unnecessary re-renders in components that only dispatch.

```typescript
// Only re-renders when state changes
function ScoreDisplay() {
  const { roundScores } = useGame();
  // ...
}

// Only re-renders if dispatch reference changes (it won't)
function VoteButton() {
  const dispatch = useGameDispatch();
  // ...
}
```

### Pattern 3: Worklet-First Gesture Callbacks

All gesture event handlers (onBegin, onChange, onEnd) must be worklets running on the UI thread. Call JS-thread functions (dispatch, navigation) only after gesture completion, via `runOnJS`.

```typescript
const gesture = Gesture.Pan()
  .onUpdate((e) => {
    // runs on UI thread — no React calls here
    translateY.value = e.translationY;
  })
  .onEnd(() => {
    if (translateY.value < REVEAL_SWIPE_THRESHOLD) {
      runOnJS(onRevealed)();  // back to JS thread only when done
    }
  });
```

### Pattern 4: Pure Engine Functions with Injected Randomness

Engine functions accept an optional `randomFn` parameter. This makes them deterministic in tests without mocking globals.

```typescript
// Production call (uses Math.random)
assignRoles(players, 1)

// Test call (deterministic)
assignRoles(players, 1, () => 0.5)
```

### Pattern 5: Screen-Owned Persistence Side Effects

Screens are responsible for their own persistence reads and writes. No persistence logic in the reducer or context provider.

```typescript
// category.tsx
useEffect(() => {
  getItem<string>(STORAGE_KEYS.LAST_CATEGORY_ID).then(setLastCategory);
}, []);

const handleSelect = (id: string) => {
  setItem(STORAGE_KEYS.LAST_CATEGORY_ID, id);  // persist first
  dispatch({ type: "SET_CATEGORY", categoryId: id });  // then update state
  router.push("/players");
};
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Game Logic in Screen Components

**What goes wrong:** Business rules (min players, role assignment, vote tallying) drift into screen-level code. This cannot be tested, gets duplicated, and produces inconsistent behavior across screens.

**Instead:** All game logic lives in `src/game/engine.ts`. Screens only dispatch actions and react to state changes.

### Anti-Pattern 2: AsyncStorage in the Reducer

**What goes wrong:** The reducer becomes async, requiring middleware or complex effect handling. It also makes the reducer impure and untestable.

**Instead:** Screens save to AsyncStorage as a side effect before or after dispatching. The reducer stays synchronous and pure.

### Anti-Pattern 3: Navigation in the Reducer or Context

**What goes wrong:** The reducer imports Expo Router's `router`, creating a circular dependency between navigation and state. Side effects in reducers also break time-travel debugging.

**Instead:** Screens observe `phase` changes via `useEffect` and call `router.replace()` in response. The reducer only updates `phase` — it never navigates.

### Anti-Pattern 4: Single Context for State + Dispatch

**What goes wrong:** Every component that calls `useGame()` to dispatch an action also subscribes to all state updates. A player count change re-renders the vote button.

**Instead:** Separate `GameStateContext` and `GameDispatchContext`. Components that only dispatch don't subscribe to state.

### Anti-Pattern 5: React State for Animation Values

**What goes wrong:** Gesture pan position stored in `useState` — every pixel of movement triggers a React re-render. The swipe feels laggy and stuttery.

**Instead:** Use `useSharedValue` for all animation/gesture state. Only call `setState` or `dispatch` at gesture boundaries (start, end, threshold crossed).

### Anti-Pattern 6: Navigating Forward with `router.push` During Gameplay

**What goes wrong:** Using `push` instead of `replace` after the reveal phase leaves screens in the navigation stack. A player can swipe back from the voting screen to the reveal screen, seeing another player's role.

**Instead:** `router.replace()` for all transitions after the players screen. The stack contains at most: home → category → players → [current gameplay screen].

---

## Scalability Considerations

This is an offline party game with no backend. Scalability means "handles edge cases gracefully" not "handles load."

| Concern | Current scope | Extension path |
|---------|--------------|----------------|
| Word banks | 5 categories, JSON files | Add more JSON files + category registry entry |
| Player count | 3–10 players | Increase MAX_PLAYERS constant, verify vote grid layout |
| Round scoring | Cumulative in GameState | Currently ephemeral per session; persist scores for tournament play |
| Custom words | Not in MVP | Could add player-entered words array to CategoryState |
| Game variants | Single variant | Phase enum extensible; reducer handles new phases with new action types |

---

## Suggested Build Order

Dependencies flow bottom-up. Build the engine before the UI that consumes it.

### Tier 1 — Foundation (no dependencies)

1. `src/game/types.ts` — All types. Everything else imports from here.
2. `src/game/actions.ts` — Action constants. Reducer imports these.
3. `src/data/wordbanks/*.json` — Raw data. Engine imports these.
4. `src/data/categories.ts` — Category registry. Engine + screens import this.
5. `src/constants/game.ts` — Constants. Everything references these.
6. `src/theme/colors.ts` — Design tokens. All components reference these.

### Tier 2 — Engine (depends on Tier 1)

7. `src/game/engine.ts` — Pure functions. Depends on types + data.
8. `src/game/reducer.ts` — Pure reducer. Depends on engine + actions + types.
9. `src/storage/storage.ts` — AsyncStorage wrappers. No game dependencies.

### Tier 3 — Context + Hooks (depends on Tier 2)

10. `src/context/GameContext.tsx` — Provider + two contexts. Imports reducer.
11. `src/hooks/useGame.ts` — Context shortcut hooks.
12. `src/hooks/useCountdown.ts` — Timer hook. Independent of game state.
13. `src/hooks/useHaptics.ts` — Haptics wrapper. No game state dependency.

### Tier 4 — Layout + Wrapper (depends on Tier 3)

14. `app/_layout.tsx` — Root layout with GestureHandlerRootView + GameProvider.
15. `src/components/ScreenWrapper.tsx` — SafeArea + base styles.
16. `src/components/PrimaryButton.tsx` — Reusable CTA. Uses useHaptics.

### Tier 5 — Core Interactive Components (depends on Tier 4)

17. `src/components/RevealCard.tsx` — Most complex component. Depends on gesture handler + Reanimated + useHaptics.
18. `src/components/CategoryCard.tsx` — Simpler card. Depends on PrimaryButton patterns.
19. `src/components/PlayerRow.tsx` — Swipeable row. Depends on gesture handler.
20. `src/components/PlayerListEditor.tsx` — Composes PlayerRow.
21. `src/components/TimerDisplay.tsx` — Countdown display. Depends on useCountdown.
22. `src/components/VoteCard.tsx` — Vote target card.
23. `src/components/ScoreBoard.tsx` — Results display.

### Tier 6 — Screens (depends on Tier 5 + all hooks)

24. `app/index.tsx` — Home. Simplest screen.
25. `app/howtoplay.tsx` — Modal. Static content.
26. `app/category.tsx` — Category select. Reads storage on mount.
27. `app/players.tsx` — Player setup. Reads + writes storage.
28. `app/reveal.tsx` — Role reveal. Composes RevealCard.
29. `app/discussion.tsx` — Timer screen. Composes TimerDisplay.
30. `app/voting.tsx` — Sequential voting. Composes VoteCard.
31. `app/summary.tsx` — Results. Composes ScoreBoard.

---

## Sources

- [Handling Gestures — React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/) (HIGH confidence — official docs)
- [GestureHandlerRootView — RNGH Installation](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/) (HIGH confidence — official docs)
- [Scaling Up with Reducer and Context — React](https://react.dev/learn/scaling-up-with-reducer-and-context) (HIGH confidence — official React docs)
- [Building NeonCity: Mobile Game with Expo](https://expo.dev/blog/mobile-game-development-with-expo) (HIGH confidence — Expo official blog)
- [Expo Router Navigation Basics](https://docs.expo.dev/router/basics/navigation/) (HIGH confidence — official Expo docs)
- [Back Navigation Prevention — Expo Router Discussions](https://github.com/expo/router/discussions/880) (MEDIUM confidence — community discussion with team input)
- [React Native Gesture Handler: Swipe Examples](https://blog.logrocket.com/react-native-gesture-handler-tutorial-examples/) (MEDIUM confidence — verified against official docs)
