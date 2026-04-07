# Imposter Party

## What This Is

A mobile-only local party social deduction game where players share a single device, passing it around. Everyone gets a secret word except the imposter, who must bluff their way through a discussion round. Players then vote to identify the imposter. Built with React Native + Expo for iOS and Android, fully offline with no backend.

## Core Value

The reveal moment — swiping to see your role (civilian with the secret word, or imposter) — must feel delightful, smooth, and secure (no role leaks). If everything else is rough but the reveal card is perfect, the game works.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Full 8-screen game flow: home, category select, player setup, role reveal, discussion timer, voting, summary
- [ ] RevealCard with swipe-to-reveal gesture, haptic feedback, auto-hide, and role-appropriate visuals
- [ ] 5 word bank categories (places, foods, animals, movies, occupations) with 30-50 words each
- [ ] Player management: add/remove/rename players (3-10), persist across sessions
- [ ] Discussion timer with countdown, pause, color shifts, and auto-advance
- [ ] Sequential voting with self-vote prevention and tie handling
- [ ] Summary screen with winner announcement, vote breakdown, scoreboard, and play-again/reset options
- [ ] Imposter count toggle (1 or 2 imposters, 2 requires 7+ players)
- [ ] AsyncStorage persistence for players, category, and timer settings
- [ ] Dark theme with polished design tokens and NativeWind styling
- [ ] Entry animations (Reanimated 3) and haptic feedback throughout
- [ ] Back navigation blocked during active gameplay (reveal through summary)

### Out of Scope

- Backend / database / network calls — 100% offline local game
- OAuth / accounts / user profiles — no identity system needed
- Real-time multiplayer / networking — single shared device only
- Redux / Zustand / external state management — Context + useReducer only
- Lottie or heavy animation libraries — Reanimated 3 only
- Unit tests / E2E tests — manual QA for MVP

## Context

- Existing codebase has initial game feature committed (player cards, reveal mechanics, game screens, core logic)
- Stack is locked: Expo SDK 52+, TypeScript strict, NativeWind v4, Reanimated 3, Expo Router v4
- File-based routing in `app/` directory, pure game logic in `src/game/`
- Design is dark-themed with specific color tokens (surface-900 through 600, accent colors)
- The game is a pass-and-play party game — UX must prevent accidental role leaks

## Constraints

- **Tech stack**: React Native + Expo managed workflow — no ejecting, no bare workflow
- **Styling**: NativeWind v4 only — no styled-components, no emotion
- **State**: React Context + useReducer only — no external state libraries
- **Navigation**: Expo Router v4 only — no react-navigation
- **Offline**: 100% local, no network calls, no backend
- **Platform**: iOS + Android via Expo

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single shared device (pass-and-play) | Simplest multiplayer model for party game, no networking complexity | -- Pending |
| NativeWind v4 over StyleSheet | Tailwind utility classes for rapid UI development, consistent with web mental model | -- Pending |
| Pure game engine functions | Testable logic separated from React, enables future unit testing | -- Pending |
| Expo Router file-based routing | Convention over configuration, simpler mental model than react-navigation | -- Pending |
| router.replace() during gameplay | Prevents back-swipe from leaking roles during active rounds | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-07 after initialization*
