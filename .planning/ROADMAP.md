# Roadmap: Imposter Party

## Overview

Build a complete offline pass-and-play social deduction party game from configuration through gameplay. The project proceeds in four phases: establish a correct, typed foundation; build the pre-game screens that set up a round; build the reveal and discussion screens that form the game's emotional core; then complete the voting and summary screens that close the loop and invite replay.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Config, types, game engine, data, and persistence infrastructure
- [ ] **Phase 2: Pre-Game Screens** - Home, How to Play, Category Select, and Player Setup screens
- [ ] **Phase 3: Reveal & Discussion** - Role reveal card and discussion timer screens
- [ ] **Phase 4: Voting, Summary & Polish** - Voting, summary screens, and final polish pass

## Phase Details

### Phase 1: Foundation
**Goal**: The project builds and runs correctly with all game logic verified, data loaded, and persistence ready before any screen is built.
**Depends on**: Nothing (first phase)
**Requirements**: FNDN-01, FNDN-02, FNDN-03, FNDN-04, ENGN-01, ENGN-02, ENGN-03, ENGN-04, ENGN-05, DATA-01, DATA-02, PRST-01, PRST-02, PRST-03
**Success Criteria** (what must be TRUE):
  1. App launches on a device/simulator with no red-screen errors and NativeWind styles apply correctly
  2. Role assignment produces exactly 1 or 2 imposters with all other players as civilians
  3. Word picker returns a word from the correct category and avoids repeating words within a session
  4. Vote tally correctly identifies the eliminated player or returns null on a tie and determines the winning side
  5. Players, category, and timer saved to AsyncStorage on a prior session load correctly on the next app launch
**Plans**: TBD

### Phase 2: Pre-Game Screens
**Goal**: A player can start the app, learn the rules, pick a category, configure players and timer, and launch a round.
**Depends on**: Phase 1
**Requirements**: PLYR-01, PLYR-02, PLYR-03, PLYR-04, PLYR-05, PLYR-06, PLYR-07, HELP-01, HELP-02, HELP-03, PLSH-04
**Success Criteria** (what must be TRUE):
  1. User can add, remove, and rename players and see validation (min 3, max 10, no empty names, no duplicate names)
  2. "Start Round" button is disabled with a visible explanation when fewer than 3 players are present
  3. 2-imposter toggle is disabled unless 7 or more players are in the list
  4. User can open a How to Play modal from the home screen and dismiss it
  5. User can select a category and the selection persists as the default on next app launch
**Plans**: TBD
**UI hint**: yes

### Phase 3: Reveal & Discussion
**Goal**: Each player can privately see their role and the secret word (or imposter identity), and the group can discuss with a visible countdown timer.
**Depends on**: Phase 2
**Requirements**: RVRL-01, RVRL-02, RVRL-03, RVRL-04, RVRL-05, RVRL-06, RVRL-07, RVRL-08, DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISC-06, DISC-07
**Success Criteria** (what must be TRUE):
  1. Swiping up on the reveal card shows the correct role content (word for civilians, imposter alert for the imposter) with no role leaking to other players via back-swipe or app-switcher
  2. The card auto-hides after 4 seconds and the device fires a heavy haptic when the swipe threshold is crossed
  3. Sequential reveal walks through all players and then automatically navigates to discussion
  4. Countdown timer displays in large format, shifts color (white → amber → red) as time decreases, pulses below 10 seconds, and auto-advances to voting at zero
  5. "No Timer" mode counts elapsed time up and requires manual end
**Plans**: TBD
**UI hint**: yes

### Phase 4: Voting, Summary & Polish
**Goal**: Players can vote one at a time, see a winner announcement with full round breakdown, and choose to play again or reset — all with polished animations and haptics.
**Depends on**: Phase 3
**Requirements**: VOTE-01, VOTE-02, VOTE-03, VOTE-04, VOTE-05, SUMM-01, SUMM-02, SUMM-03, SUMM-04, SUMM-05, SUMM-06, SUMM-07, PLSH-01, PLSH-02, PLSH-03
**Success Criteria** (what must be TRUE):
  1. Each player votes sequentially with a confirmation step; a player cannot vote for themselves
  2. Voting ties result in no elimination and the imposter winning, shown correctly on the summary screen
  3. Summary screen announces the winner with the correct color (green for town, red for imposter) and reveals the imposter's name and the secret word
  4. Scoreboard tracks cumulative wins across rounds and Play Again starts a new round without re-entering players
  5. Every screen has a visible entry animation and every interactive element fires the correct haptic pattern
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/TBD | Not started | - |
| 2. Pre-Game Screens | 0/TBD | Not started | - |
| 3. Reveal & Discussion | 0/TBD | Not started | - |
| 4. Voting, Summary & Polish | 0/TBD | Not started | - |
