# Phase 1: Foundation - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix project configuration (babel, NativeWind), verify and complete the game engine (types, reducer, engine functions), populate word bank data to spec, and ensure persistence and root layout infrastructure are correct. No screens are built in this phase — only the foundation they depend on.

</domain>

<decisions>
## Implementation Decisions

### Babel Configuration
- **D-01:** Update `babel.config.js` to include NativeWind v4 required presets (`nativewind/babel` and `jsxImportSource: "nativewind"`). Research confirmed the current config is missing these and will cause unreliable className processing.
- **D-02:** Verify Reanimated plugin path — research found the project is on Reanimated 4.1 which may need `react-native-worklets/plugin` instead of `react-native-reanimated/plugin`. Check actual installed version and use correct plugin path.

### Word Banks
- **D-03:** Expand all word bank JSON files to match CLAUDE.md spec: places 50+, foods 40+, animals 40+, movies 30+, occupations 30+ words. Current files have only 8-12 words each.

### Code Audit (Existing Code vs Spec)
- **D-04:** Most Phase 1 code already exists and closely matches the CLAUDE.md spec. The approach is audit-and-fix, not rebuild. Specifically verify:
  - `src/game/types.ts` — matches spec (confirmed: complete)
  - `src/game/engine.ts` — assignRoles, pickWord, tallyVotes all present and correct
  - `src/game/reducer.ts` — all 14 action types handled
  - `src/game/actions.ts` — verify exists with action type constants
  - `src/constants/game.ts` — matches spec (confirmed: complete)
  - `src/storage/storage.ts` — matches spec (confirmed: complete)
  - `src/data/categories.ts` — matches spec (confirmed: complete)
  - `src/context/GameContext.tsx` — matches spec (confirmed: complete)
  - `src/hooks/useGame.ts`, `useCountdown.ts`, `useHaptics.ts` — verify match spec
  - `src/theme/colors.ts` — verify matches design tokens
  - `src/types/index.ts` — verify re-exports from game/types
  - `app/_layout.tsx` — matches spec (confirmed: GestureHandlerRootView, GameProvider, gestureEnabled properly set)
  - `tailwind.config.js` — matches spec (confirmed: design tokens present)

### Root Layout
- **D-05:** Root layout is already correctly structured with GestureHandlerRootView as outermost wrapper, GameProvider inside, gestureEnabled: false as default with explicit true only on pre-game screens (index, howtoplay, category, players). No changes needed unless babel fix reveals issues.

### Claude's Discretion
- Word selection within each category — Claude can choose appropriate, diverse words that work well for social deduction guessing
- Whether to add `metro.config.js` withNativeWind wrapper if not already present
- Minor code style adjustments to align with CLAUDE.md conventions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Spec
- `CLAUDE.md` — Complete project specification including game flow, state machine, screen specs, component specs, engine functions, word banks, design tokens, and style guide. This is the authoritative reference for ALL implementation details.

### Game Engine
- `CLAUDE.md` §ENGINE FUNCTIONS — Pure function signatures for assignRoles, pickWord, tallyVotes
- `CLAUDE.md` §GAME STATE (reducer) — Full GameState shape, all 14 action types, reducer rules

### Data
- `CLAUDE.md` §WORD BANKS — Exact word lists for all 5 categories
- `CLAUDE.md` §CATEGORIES REGISTRY — Category type definition and registry code

### Configuration
- `CLAUDE.md` §CONSTANTS — MIN_PLAYERS, MAX_PLAYERS, timer options, storage keys
- `CLAUDE.md` §QUICK START COMMANDS — Dependencies and config file setup

### Research Findings
- `.planning/research/STACK.md` — Babel config fix details, Reanimated 4 migration notes
- `.planning/research/PITFALLS.md` — NativeWind conditional className crash, gestureEnabled iOS issue

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/game/types.ts`: Complete type system — GamePhase, Player, VoteRecord, RoundScore, GameState, GameAction, Category
- `src/game/engine.ts`: All 3 engine functions implemented and correct (assignRoles, pickWord, tallyVotes)
- `src/game/reducer.ts`: Full reducer with all 14 actions, createInitialState helper
- `src/storage/storage.ts`: Typed AsyncStorage wrapper with try/catch error handling
- `src/data/categories.ts`: Category registry with JSON imports
- `src/context/GameContext.tsx`: React Context + useReducer pattern
- `src/constants/game.ts`: All game constants matching spec
- `app/_layout.tsx`: Root layout with correct provider/gesture wrapper structure

### Established Patterns
- Pure game logic in `src/game/` with no React imports
- AsyncStorage wrapped with typed helpers in `src/storage/`
- NativeWind v4 with Tailwind preset in `tailwind.config.js`
- GestureHandlerRootView at root with per-screen gestureEnabled overrides

### Integration Points
- `src/global.css` imported in `app/_layout.tsx` for NativeWind
- Word bank JSONs imported in `src/data/categories.ts`
- GameContext provides state+dispatch to all screens via `useGame` hook

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond matching the CLAUDE.md specification exactly. This phase is about correctness and completeness of the foundation layer.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-07*
