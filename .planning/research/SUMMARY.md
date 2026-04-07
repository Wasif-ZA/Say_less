# Project Research Summary

**Project:** Imposter Party
**Domain:** Mobile pass-and-play local party social deduction word game
**Researched:** 2026-04-07
**Confidence:** HIGH

## Executive Summary

Imposter Party is a single-device, offline party game in the Spyfall/Undercover genre where one player is secretly the imposter while others share a secret word. The established pattern for building this product is a layered architecture: a pure TypeScript game engine (reducer + engine functions) forms the foundation, React Context + useReducer manages runtime state, and Expo Router drives navigation. This separation keeps all business logic testable and independent of React, while the gesture and animation layer (Reanimated 4 + Gesture Handler 2.28) runs entirely on the UI thread — critical for the swipe-to-reveal mechanic that is the product's primary differentiator.

The recommended approach is to build bottom-up in six dependency tiers: types and data first, engine second, context and hooks third, layout and wrapper components fourth, core interactive components fifth, and screens last. The RevealCard component — a swipe-to-reveal gesture card with role-appropriate visual design, auto-hide at 4 seconds, and AppState background detection — deserves disproportionate investment because it is both the core user delight moment and the most architecturally complex component. Competitive analysis confirms the field consistently fails at exactly this interaction; getting it right is the product's positioning statement.

The most critical risk is role leakage: a player seeing another player's role through back-swipe gestures, app-switcher screenshots, or rapid gesture spam. This must be addressed architecturally from day one — specifically by disabling iOS back-swipe gestures (`gestureEnabled: false`) on all gameplay screens, using `router.replace()` for all post-setup navigation, and subscribing to `AppState` changes to auto-hide the RevealCard. A secondary configuration risk must be resolved before any feature work: the project's `babel.config.js` has both the wrong Reanimated 4 plugin path and is missing the NativeWind v4 required presets — silent styling and animation failures will occur if this is not fixed first.

---

## Key Findings

### Recommended Stack

The installed stack has drifted forward from the CLAUDE.md spec in a superior direction. The project runs Expo SDK 54, React Native 0.81.5, Reanimated 4.1.1, Gesture Handler 2.28, and expo-router 6.0.21 — all stable and production-appropriate. CLAUDE.md's architectural guidance remains valid; only version numbers differ.

The single highest-risk configuration item is the Babel plugin path. Reanimated 4 moved worklets to `react-native-worklets` and requires `"react-native-worklets/plugin"` in babel.config.js. The current project babel.config.js still uses the old path AND is missing the NativeWind v4 required `jsxImportSource: "nativewind"` preset. Both must be corrected before any animation or styling work begins.

**Core technologies:**
- Expo SDK 54 + React Native 0.81.5: Managed workflow, New Architecture enabled by default; no additional setup needed
- expo-router v6: File-based navigation with `router.replace()` for stack management; do not install react-navigation separately
- Reanimated 4.1.1: UI-thread animations via worklets; `useSharedValue`, `useAnimatedStyle`, `withSpring` API unchanged from v3 spec; `damping`/`stiffness` parameters still valid
- Gesture Handler 2.28: `Gesture.Pan()` API for swipe-to-reveal; requires `GestureHandlerRootView` at the absolute app root — not inside a screen
- NativeWind v4.2.1 + Tailwind CSS v3: Utility classes on React Native; do NOT upgrade to NativeWind v5 (pre-release alpha, breaks v4 config entirely)
- expo-haptics 15.0.8: `ImpactFeedbackStyle`, `NotificationFeedbackType` — zero config; Android feedback quality varies by device; always pair with visual feedback
- AsyncStorage 2.2.0: Simple key-value persistence for players, category, timer; wrap all calls in try/catch; design for graceful empty state

### Expected Features

The competitive landscape (Spyfall, Undercover, Imposter Party, Impostor Who?) is crowded but consistently weak at gesture-based reveals, role leak prevention, and UI polish. The positioning opportunity is clear: "The pass-and-play imposter game that actually feels good to hold."

**Must have (table stakes):**
- Single shared device pass-and-play — the genre contract; absence ends the session
- Role reveal with secret word for civilians and imposter identity for imposters — the core mechanic
- Discussion phase with countdown timer — groups require a time boundary; every competitor ships this
- Sequential voting phase with self-vote prevention — the game resolution mechanism
- Winner announcement with imposter reveal — without payoff, the game has no arc
- Player list management: add/remove/rename, 3–10 players — required before any round begins
- Minimum 5 word categories — fewer than 3 feels like a demo
- Play again without full reset — re-entering names kills multi-round sessions
- Persistent player names across app restarts — expected quality signal
- How-to-play reference screen — first-time players need onboarding

**Should have (differentiators):**
- Swipe-to-reveal gesture with heavy haptic at threshold and auto-hide at 4 seconds — no competitor does this; the product's core differentiator
- Role-appropriate visual design on reveal (green glow for civilian, red for imposter) — emotional color coding that competitors skip
- AppState background detection to auto-hide card — no competitor studied has this; directly prevents the genre's biggest trust problem
- Session scoreboard (cumulative wins per player across a session) — keeps groups invested in multi-round play
- Imposter count toggle (1 or 2 imposters, 7+ player gate) — adds replayability at high player counts
- Discussion timer with pause, color shift white/amber/red, and pulse animation below 10 seconds — differentiated from the static timers competitors ship
- Voting confirmation modal — prevents fat-finger misfires in tense moments
- Category Quick Start (random or last used) — reduces setup friction for repeat players
- Imposter win tips on reveal card ("Blend in. Don't get caught.") — reduces rounds ruined by confused first-time imposters
- Staggered entry animations per screen — low complexity, high first-impression quality signal

**Defer (v2+):**
- Custom user-created word categories — high UX complexity; potential paid feature
- Online multiplayer — wrong architecture; App Store reviews for online-capable competitors confirm crashes and 1-star ratings
- AI-generated categories — requires network; breaks offline guarantee
- Achievements, global leaderboards — wrong engagement model for infrequent party sessions
- Sound effects — haptics are superior feedback in party environments; audio adds app size and licensing risk

### Architecture Approach

The architecture is a strict four-layer stack with unidirectional data flow: the navigation layer (Expo Router screens) reads from and dispatches to the context layer (React Context + useReducer), which drives the game engine layer (pure TypeScript with no React imports), which feeds into the persistence layer (AsyncStorage wrappers). No layer reaches upward. The game reducer and engine are pure functions — fully unit-testable. Navigation is never triggered from the reducer; screens observe `phase` changes via `useEffect` and call `router.replace()` in response.

**Major components:**
1. Game Engine (`src/game/`) — pure types, actions, reducer, and engine functions; the testable core; no React imports permitted in this directory
2. GameContext (`src/context/GameContext.tsx`) — two separate contexts (state + dispatch) prevent unnecessary re-renders; bridges engine to component tree
3. RevealCard (`src/components/RevealCard.tsx`) — the only component with significant local animation state; gesture + shared value architecture runs on UI thread; `runOnJS` bridges back to React dispatch
4. Navigation Layer (`app/*.tsx`) — screen components that read game state, dispatch actions, and call `router.replace()`; contain no business logic
5. Persistence Layer (`src/storage/storage.ts`) — the only file that imports AsyncStorage; screens call it as a side effect before dispatching

The gesture/animation architecture for RevealCard is intentionally off the React render path: native gesture events trigger UI-thread worklets that update shared values, which drive animated styles without touching JS state. Only at gesture completion does a `runOnJS` callback fire to update game state. This is required to achieve frame-perfect swipe feel at 60fps.

### Critical Pitfalls

1. **Role leak via iOS back-swipe after router.replace()** — Set `gestureEnabled: false` on every gameplay screen in the Stack layout config; verify on a physical iOS device (Simulator does not reproduce this). Must be addressed in Phase 1 layout config, not retrofitted later.

2. **Worklet callbacks calling React dispatch directly (threading crash)** — Always wrap `dispatch()`, `router.replace()`, and `setState()` inside animation/gesture callbacks with `runOnJS`. Failing to do this crashes on production builds but may silently work in Expo Go.

3. **RevealCard gesture debounce failure (double-advance)** — Gate the Pan gesture with a `useSharedValue<boolean>` `isAnimating` flag and a `useRef` guard on the `ADVANCE_REVEAL` dispatch. Must be built into the initial RevealCard implementation, not added as a patch.

4. **NativeWind conditional className crashing navigation context** — Dynamic template literals in `className` (e.g., `` `border-${isSelected ? 'red' : 'transparent'}` ``) cause "Couldn't find a navigation context" crashes on interactive cards inside navigators. Use static class names; never template literals in className. Confirmed in NativeWind issue #1712.

5. **Timer ticks dispatched to global GameContext** — If the discussion timer decrements `timerSeconds` in global state, every GameContext subscriber re-renders once per second. Keep countdown in local component state via `useCountdown` hook; never dispatch per tick.

---

## Implications for Roadmap

Based on the dependency graph from ARCHITECTURE.md and the feature prioritization from FEATURES.md, the build must proceed bottom-up. The game engine is infrastructure, not a screen. Every subsequent screen builds on top of it. The RevealCard is the creative core and should be built and validated as a standalone component before the reveal screen assembles it.

### Phase 1: Foundation and Configuration

**Rationale:** Configuration errors (Babel plugin, NativeWind presets) cause silent failures that are expensive to debug mid-build. Types and constants establish the contract everything else implements. This work has zero UI but enables everything that follows.

**Delivers:** Corrected `babel.config.js`, all type definitions, action constants, game constants, theme color tokens, word bank JSON data, category registry, root layout with `GestureHandlerRootView` + `GameProvider` + `gestureEnabled: false` on gameplay screens

**Addresses:** All subsequent phases depend on correct configuration and established types

**Avoids:** Reanimated 4 Babel plugin mismatch, NativeWind className processing failures, GestureHandlerRootView placement error (Pitfall 5), iOS back-swipe role leak groundwork (Pitfall 1)

### Phase 2: Game Engine (Pure Logic)

**Rationale:** `assignRoles`, `pickWord`, and `tallyVotes` are pure functions with no UI dependencies. Building them first means every subsequent phase builds on verified, testable logic rather than wiring UI to untested code.

**Delivers:** `src/game/engine.ts`, `src/game/reducer.ts`, `src/storage/storage.ts`

**Addresses:** All game outcomes: role assignment, word selection, vote tallying

**Avoids:** Business logic drifting into screens (Anti-Pattern 1), AsyncStorage in the reducer (Anti-Pattern 2)

**Note:** `assignRoles` accepts optional `randomFn` for deterministic testing; build this from the start, not as a retrofit.

### Phase 3: Context, Hooks, and Shared Infrastructure

**Rationale:** Context and hooks are consumed by every screen. Building them now means screens can be built in any order. The dual-context pattern (state + dispatch separated) must be established here — refactoring it later means touching every screen.

**Delivers:** `src/context/GameContext.tsx` (dual context), `src/hooks/useGame.ts`, `src/hooks/useCountdown.ts`, `src/hooks/useHaptics.ts`

**Addresses:** Global state access, countdown timer isolation, haptic abstraction

**Avoids:** Single monolithic context causing full-tree re-renders (Pitfall 6), timer ticks in global state (Pitfall 13)

### Phase 4: Core Reusable Components

**Rationale:** Components like `ScreenWrapper`, `PrimaryButton`, and `RevealCard` are building blocks for every screen. RevealCard is the most complex component in the project and should be built and validated before the screen that hosts it.

**Delivers:** `ScreenWrapper`, `PrimaryButton`, `CategoryCard`, `PlayerRow`, `PlayerListEditor`, `TimerDisplay`, `VoteCard`, `ScoreBoard`, and critically `RevealCard`

**Addresses:** RevealCard is the primary product differentiator — over-invest here

**Avoids:** Worklet threading crash (Pitfall 3 — use `runOnJS` from the start), gesture debounce failure (Pitfall 2 — build `isAnimating` lock into initial implementation), AppState background detection for role hiding (Pitfall 7), NativeWind conditional className crash on VoteCard and PrimaryButton (Pitfall 4)

**Research flag:** RevealCard gesture implementation is architecturally dense (Reanimated 4 worklets + Gesture Handler Pan + AppState + debounce lock). If the swipe + spring + haptic + AppState combination surfaces unexpected integration issues during implementation, this phase warrants `/gsd-research-phase`.

### Phase 5: Home, Setup, and Pre-Game Screens

**Rationale:** The three setup screens (Home, Category, Players) are simpler than gameplay screens and exercise AsyncStorage persistence that gameplay screens depend on. They also establish the navigation stack structure that prevents role leaks.

**Delivers:** `app/index.tsx`, `app/howtoplay.tsx`, `app/category.tsx`, `app/players.tsx`

**Addresses:** Player list management, category selection, persistence, Quick Start button

**Avoids:** `router.navigate()` vs `replace()` confusion (Pitfall 11 — use `router.push` only for how-to-play modal), duplicate player names producing ambiguous vote results (Pitfall 12 — enforce deduplication on blur here, before the voting phase exists), AsyncStorage silent failure (Pitfall 9 — wrap in try/catch; design graceful empty state)

### Phase 6: Gameplay Screens

**Rationale:** These screens consume the fully built engine, context, and components. They implement the complete game flow. Back-navigation prevention via Stack layout config must already be in place from Phase 1.

**Delivers:** `app/reveal.tsx`, `app/discussion.tsx`, `app/voting.tsx`, `app/summary.tsx`

**Addresses:** Role reveal flow, discussion timer, sequential voting with tie handling, results + scoreboard, play-again loop, full reset

**Avoids:** iOS back-swipe role leak (Pitfall 1 — `gestureEnabled: false` already set in Phase 1), timer dispatched to global state (Pitfall 13 — `useCountdown` is local), flex layout overflow on player-heavy voting grid (Pitfall 14 — voting and discussion are fixed-height; decide scrollability at creation time)

**Implements:** Complete game state machine: `START_ROUND` → `ADVANCE_REVEAL` → end of discussion → `CAST_VOTE` + `ADVANCE_VOTER` → `FINISH_VOTING` → `PLAY_AGAIN` / `FULL_RESET`

### Phase Ordering Rationale

- Configuration before all feature work: babel.config.js errors produce silent failures that are expensive to debug mid-build
- Engine before context: context wraps the reducer; reducer must exist first
- Context before screens: all screens consume context; it must be established before any screen is built
- RevealCard before reveal screen: the component is architecturally complex; the screen is a thin wrapper around it
- Setup screens before gameplay screens: navigation stack and persistence must work before gameplay can start
- `gestureEnabled: false` in Phase 1 layout config: back-swipe prevention is not a retrofit; it must be in `_layout.tsx` from the start

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 4 (RevealCard):** The combination of Reanimated 4 worklet callbacks, Gesture Handler 2.28 Pan gesture, AppState subscription, and `isAnimating` lock is architecturally dense. If any of these APIs have changed between the researched versions and actual behavior, the integration surface is large enough to warrant pre-implementation research.
- **Phase 6 (iOS gestureEnabled):** The active GitHub issue (expo/expo #31614) confirming `gestureEnabled: false` is sometimes not honored on certain Expo Router versions means this must be verified on a physical device immediately after Phase 1 layout work — not deferred to Phase 6.

Phases with standard patterns (skip research):

- **Phase 2 (Game Engine):** Pure TypeScript functions with injected randomness — textbook reducer/engine pattern, no external dependencies, fully unit-testable
- **Phase 3 (Context + Hooks):** Dual-context pattern documented in official React docs; `useCountdown` and `useHaptics` are straightforward wrapper hooks
- **Phase 5 (Setup Screens):** Standard Expo Router + AsyncStorage patterns; no novel integrations

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against installed package.json, official migration guides, and Expo changelogs; version drift from CLAUDE.md spec is forward-compatible |
| Features | HIGH | Competitive analysis across 6+ active App Store apps; table stakes derived from universal presence across all competitors |
| Architecture | HIGH | Official React, Expo Router, Reanimated, and Gesture Handler docs; dual-context pattern sourced from React official docs |
| Pitfalls | HIGH | Critical pitfalls verified against active GitHub issues with issue numbers; API-level pitfalls cross-referenced with official docs |

**Overall confidence:** HIGH

### Gaps to Address

- **babel.config.js correction:** Must be fixed before any development work. Current config has both the wrong Reanimated 4 plugin path and missing NativeWind v4 presets. See STACK.md for the correct config.
- **iOS gestureEnabled reliability:** Pitfall 1 has MEDIUM confidence because the active GitHub issue may be resolved in newer SDK versions. Verify on a physical iOS device immediately after Phase 1 layout implementation.
- **Android haptic quality:** Haptic feedback quality on Android is device-dependent and untestable on emulators. The heavy haptic at reveal threshold is described as "CRITICAL" in CLAUDE.md but will feel different across Android devices. Accept this gap and pair all haptic feedback with visual feedback as a universal requirement.
- **expo-screen-capture:** `usePreventScreenCapture()` for Android screenshot prevention is not currently installed. The AppState auto-hide approach already in spec is the correct mitigation, but this gap should be evaluated during Phase 4 RevealCard work.

---

## Sources

### Primary (HIGH confidence)

- Expo SDK 54 Changelog: https://expo.dev/changelog/sdk-54
- Reanimated 4 Migration Guide: https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/
- Reanimated Compatibility Matrix: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
- GestureHandlerRootView Installation: https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/
- React Native Gesture Handler Troubleshooting: https://docs.swmansion.com/react-native-gesture-handler/docs/guides/troubleshooting/
- NativeWind v4.1 Announcement: https://www.nativewind.dev/blog/announcement-nativewind-v4-1
- NativeWind Platform Quirks: https://www.nativewind.dev/docs/core-concepts/quirks
- Expo Router Navigation Basics: https://docs.expo.dev/router/basics/navigation/
- React — Scaling Up with Reducer and Context: https://react.dev/learn/scaling-up-with-reducer-and-context
- Reanimated runOnJS docs: https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/miscellaneous/runOnJS/
- expo-haptics docs: https://docs.expo.dev/versions/latest/sdk/haptics/

### Secondary (MEDIUM confidence)

- Expo Router iOS gesture issue (active): https://github.com/expo/expo/issues/31614
- Back navigation via router.replace discussion: https://github.com/expo/router/discussions/880
- NativeWind conditional className crash (active): https://github.com/nativewind/nativewind/issues/1712
- Expo Router v4 router.navigate() behavioral change: https://github.com/expo/expo/issues/35212
- Reanimated withTiming callback state update issue: https://github.com/software-mansion/react-native-reanimated/issues/1489
- AsyncStorage data loss after expo publish: https://github.com/expo/expo/issues/11852

### Tertiary (competitive analysis)

- Spyfall App Store: https://apps.apple.com/us/app/spyfall-social-deduction-game/id6748970148
- Undercover Word Party Game: https://apps.apple.com/us/app/undercover-word-party-game/id946882449
- Imposter Party Word Game: https://apps.apple.com/us/app/imposter-party-word-game/id1562982547
- Impostor Who? Party Word Game: https://apps.apple.com/us/app/impostor-who-party-word-game/id6747053346

---
*Research completed: 2026-04-07*
*Ready for roadmap: yes*
