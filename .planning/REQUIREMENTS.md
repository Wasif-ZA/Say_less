# Requirements: Imposter Party

**Defined:** 2026-04-07
**Core Value:** The reveal moment — swiping to see your role — must feel delightful, smooth, and secure (no role leaks)

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FNDN-01**: Babel config correctly configured for Reanimated 4 and NativeWind v4
- [ ] **FNDN-02**: Root layout wraps app in GestureHandlerRootView and GameProvider
- [ ] **FNDN-03**: Dark theme design tokens (surface-900 through 600, accent colors) available via NativeWind
- [ ] **FNDN-04**: Back navigation blocked (gestureEnabled: false) on all gameplay screens (reveal through summary)

### Game Engine

- [ ] **ENGN-01**: assignRoles correctly assigns 1 or 2 imposters randomly, rest civilian
- [ ] **ENGN-02**: pickWord selects random word from category, avoids repeats within session
- [ ] **ENGN-03**: tallyVotes counts votes, determines elimination (null on tie), determines winner
- [ ] **ENGN-04**: Game reducer handles all 14 action types as pure function with no side effects
- [ ] **ENGN-05**: Game types defined (Player, VoteRecord, RoundScore, GameState, GameAction, GamePhase)

### Data

- [ ] **DATA-01**: 5 word bank categories with JSON files (places 50+, foods 40+, animals 40+, movies 30+, occupations 30+)
- [ ] **DATA-02**: Category registry maps category IDs to names, emojis, and word arrays

### Persistence

- [ ] **PRST-01**: Player names persist across app restarts via AsyncStorage
- [ ] **PRST-02**: Last selected category persists across app restarts
- [ ] **PRST-03**: Timer setting persists across app restarts

### Player Management

- [ ] **PLYR-01**: User can add players (up to 10 max)
- [ ] **PLYR-02**: User can remove players from the list
- [ ] **PLYR-03**: User can rename players inline with auto-focus
- [ ] **PLYR-04**: Empty player names revert to "Player N" on blur
- [ ] **PLYR-05**: Duplicate names auto-append numeric suffix
- [ ] **PLYR-06**: Start Round disabled when fewer than 3 players
- [ ] **PLYR-07**: Imposter count toggle (1 or 2), 2 imposters requires 7+ players

### Role Reveal

- [ ] **RVRL-01**: RevealCard shows player name in hidden state with "swipe to reveal" hint
- [ ] **RVRL-02**: Swipe up gesture (threshold -120px) reveals role with spring animation
- [ ] **RVRL-03**: Civilian sees category emoji + secret word in green-bordered card
- [ ] **RVRL-04**: Imposter sees spy emoji + "YOU ARE THE IMPOSTER" in red-bordered card
- [ ] **RVRL-05**: Card auto-hides after 4 seconds
- [ ] **RVRL-06**: Haptics fire on gesture start (light), threshold cross (heavy), and dismiss (selection)
- [ ] **RVRL-07**: Sequential reveal: each player sees their role, then passes device to next player
- [ ] **RVRL-08**: After last player reveals, auto-navigates to discussion screen

### Discussion

- [ ] **DISC-01**: Countdown timer displays in large format with minutes:seconds
- [ ] **DISC-02**: Timer color shifts: white > 30s, amber < 30s, red < 10s
- [ ] **DISC-03**: Timer pulse animation when < 10 seconds
- [ ] **DISC-04**: Pause/resume button freezes and unfreezes countdown
- [ ] **DISC-05**: Timer auto-navigates to voting when it reaches 0 with haptic warning
- [ ] **DISC-06**: "No Timer" mode shows elapsed time counting up with manual end button
- [ ] **DISC-07**: Timer picker offers 1:00, 2:00, 3:00, and No Timer options (default 2:00)

### Voting

- [ ] **VOTE-01**: Sequential voting: one player votes at a time with "Pass to [Name]" prompt
- [ ] **VOTE-02**: Player sees all other players as vote targets (cannot vote for self)
- [ ] **VOTE-03**: Tap to select, confirm dialog before casting vote
- [ ] **VOTE-04**: After all players vote, tallies are computed and winner determined
- [ ] **VOTE-05**: Voting tie results in no elimination (imposter wins scenario)

### Summary

- [ ] **SUMM-01**: Winner announcement: "Town Wins!" (green) or "Imposter Wins!" (red)
- [ ] **SUMM-02**: Imposter identity and secret word revealed
- [ ] **SUMM-03**: Vote breakdown shows who voted for whom
- [ ] **SUMM-04**: Cumulative scoreboard tracks wins per player across rounds
- [ ] **SUMM-05**: Play Again button starts new round with same players
- [ ] **SUMM-06**: Change Category button returns to category selection
- [ ] **SUMM-07**: New Game button fully resets to home screen

### Polish

- [ ] **PLSH-01**: Entry animations on all screens (FadeInDown, FadeInUp with stagger)
- [ ] **PLSH-02**: Haptic feedback on all interactive elements per haptics pattern guide
- [ ] **PLSH-03**: Button press animation (scale to 0.96 with spring)
- [ ] **PLSH-04**: Home screen with title, subtitle, Start Game and How to Play buttons

### How to Play

- [ ] **HELP-01**: How to Play modal accessible from home screen
- [ ] **HELP-02**: 5-step scannable instruction list explaining game rules
- [ ] **HELP-03**: Dismissible via X button or swipe down

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Custom Content

- **CSTM-01**: User can create custom word banks
- **CSTM-02**: User can create custom categories

### Gameplay Variants

- **GVAR-01**: Configurable reveal auto-hide duration
- **GVAR-02**: Multiple game modes (e.g., timed rounds, speed rounds)
- **GVAR-03**: Sound effects and background music

### Security

- **SECU-01**: Screen capture prevention on reveal screen (expo-screen-capture)
- **SECU-02**: AppState background detection auto-hides reveal card

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online multiplayer / networking | 100% offline single-device game by design |
| User accounts / authentication | No identity system needed for local party game |
| Backend / database | All data is local via AsyncStorage |
| Redux / Zustand / external state mgmt | Context + useReducer is sufficient for this scope |
| Lottie / heavy animation libraries | Reanimated 3/4 handles all animation needs |
| Unit tests / E2E tests | Manual QA sufficient for MVP |
| OAuth / social login | No accounts needed |
| In-app purchases / monetization | Deferred to post-MVP |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated by roadmapper) | | |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 0
- Unmapped: 40

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after initial definition*
