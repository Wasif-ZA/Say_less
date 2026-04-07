# Feature Landscape

**Domain:** Mobile pass-and-play local party social deduction word game
**Researched:** 2026-04-07
**Comparable Apps:** Spyfall (App Store id6748970148), Undercover Word Party Game (id946882449), Imposter Party Word Game (id1562982547), Impostor Who? (id6747053346), Triple Agent, Wolvesville Classic

---

## Table Stakes

Features users expect from any pass-and-play social deduction word game. Missing = product feels broken or amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Single shared device (pass-and-play) | Core genre contract — no WiFi required, just a phone in a circle | Low | Every competing app supports this; absence ends the session |
| Role reveal with hidden content | The entire genre depends on a secret role assignment that only the holder sees | Medium | Must be immune to shoulder-surfing and accidental peeking; this is the trust moment |
| Secret word for civilians, blank for imposter | Standard Spyfall/Undercover mechanic; players expect to receive something and deceive based on it | Low | Imposter receiving "IMPOSTER" instead of the word is universally expected |
| Discussion phase | Free-form conversation period where imposter blends in; every comparable game has this | Low | Timer is table stakes; "no timer" mode is expected too |
| Voting phase | Sequential or simultaneous vote to identify the imposter; needed to resolve the round | Medium | Pass-and-play sequential voting is the single-device way to handle this |
| Winner announcement + imposter reveal | Satisfying resolution; who was it, was the vote right? | Low | Without reveal, the game has no payoff |
| Player list management (add / remove / rename) | Obvious necessity — groups vary, names differ | Low | 3–10 players is standard range across all competitive apps |
| Minimum 3 categories of words | Players tire of repetition quickly; one category equals one play session | Low | Spyfall ships 27 locations; Undercover ships many topic decks; fewer than 3 feels like a demo |
| Countdown timer for discussion | Groups argue indefinitely without one; every competing app includes it | Low | Color shift (green → amber → red) and auto-advance are expected polish |
| Results / vote breakdown | Players want to see who voted for whom; post-game debrief is part of the fun | Low | Simple list is sufficient |
| Play again without full reset | Same group, new round; having to re-enter 8 names is brutal | Low | Critical for multi-round sessions |
| Persistent player names | Reopening app and re-entering players kills the experience | Low | AsyncStorage is fine; no backend required |
| How-to-play / rules reference | First-time players need onboarding; no physical rulebook exists | Low | A scrollable screen beats nothing; absence causes confusion at first session |

---

## Differentiators

Features that elevate the product above the crowded field. Not universally expected, but create word-of-mouth and loyalty when executed well.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Swipe-to-reveal gesture with haptics | Tactile, theatrical role reveal creates a "delightful moment" that pass-and-play apps rarely nail. Spyfall uses a plain tap; Undercover just shows the card. The swipe + heavy haptic at threshold + auto-hide at 4s is genuinely novel. | High | This is Imposter Party's core differentiator per PROJECT.md — it is worth over-investing here |
| Role-appropriate visual design on reveal (green glow for civilian, red for imposter) | Most apps show identical cards with different text. Color-coded emotional response (safety vs dread) adds theatrical tension. | Medium | Reinforces deception; imposter sees red = primal danger signal |
| Auto-hide after 4 seconds + AppState background detection | Prevents shoulder-surfing without player discipline. No competing app studied had this. | Medium | Directly addresses the genre's biggest trust problem |
| Session scoreboard (cumulative wins across rounds) | Undercover shows real-time ranking; Impostor Who? has XP/levels. A simple tally of "rounds won" per player across a play session (not persistent ladder) keeps the group invested across multiple rounds. | Medium | Must distinguish from online leaderboards — this is local session tracking only |
| Imposter count toggle (1 or 2 imposters) | Undercover has "Mr. White" (a third role variant) to add complexity. Two-imposter mode with a 7+ player gate increases replayability at higher player counts. | Low | Most single-device apps offer only one imposter |
| Discussion timer with pause + color shift + pulse animation | Standard timers exist everywhere; the animated, pulsing red countdown below 10s triggers genuine urgency. Undercover's timer is functional but static. | Medium | Small UX investment, outsized emotional effect |
| Category Quick Start (last used or random) | Reduces setup friction from 3 taps to 1 for repeat players. | Low | Addresses the "just start the game already" problem |
| Staggered entry animations per screen | Spyfall's 2024 redesign added animations and was praised for it. A polished dark UI with spring animations signals quality at first launch. | Low | Low complexity, high first-impression value |
| Imposter win tips on reveal card | When the imposter sees their card, showing "Blend in. Don't get caught." reduces the new-player confusion of "what do I even do?" | Low | Reduces rounds ruined by a confused first-time imposter |
| Voting confirmation modal | Prevents fat-finger misfires in tense moments. Competing apps often omit this. | Low | Small trust investment, high frustration prevention |

---

## Anti-Features

Features to explicitly NOT build for MVP. Each has been deliberately excluded from CLAUDE.md scope.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Online multiplayer / networking | Doubles the architectural surface area. Requires backend, rooms, latency handling, reconnection logic. Zero benefit for a local party game. Imposter Party Word Game ships it and their 1-star reviews are almost entirely about crashes and disconnections. | Pass-and-play is the entire value prop |
| User accounts / profiles / global leaderboards | Adds friction before the first game (sign-up wall). Wrong audience — these are casual party players, not competitive ranked players. Impostor Who? has global XP/levels; it reads as bloat for one-night party use. | Session-local scoreboard is sufficient |
| AI-generated custom word categories | Imposter.ai uses this as a subscription upsell ($X/month). Heavy lift, requires network. Breaks offline guarantee. | Ship with 5 high-quality curated categories; add more in future updates |
| Voice chat / in-game communication system | Among Us is frequently criticized for lack of built-in voice chat — but the alternative for pass-and-play is that players are in the same room, talking. A built-in chat system is solving the wrong problem. | Players talk out loud; this is a feature, not a bug |
| Tutorial walkthrough wizard (multi-step interactive) | Onboarding tutorials add build complexity and most party players skip them. "How to Play" screen is the right level of investment. | A static scrollable How-to-Play modal is sufficient |
| Custom word bank editing (user-created categories) | High UX complexity (text input, persistence, validation, word count enforcement). Divides attention from core flow polish. Several competing apps list this as a premium feature — signal that it monetizes, not that it's expected. | Defer to post-MVP; can be unlocked as a paid feature |
| Sound effects / background music | Adds app size, licensing risk, ambient noise at parties is already present. Haptics are a better party-room feedback channel than audio. | Use haptics exclusively |
| Animated characters / mascots / lore | Jackbox succeeds with theme and personality, but Jackbox is a premium product with writers. For MVP, visual polish via dark theme + color tokens is sufficient. | Dark theme + typography + accent color system carries the visual identity |
| Achievements / badges | Engagement loop mechanism for daily-use apps. Party games have a fundamentally different engagement model — infrequent, intense sessions. Badges are ignored. | Session scoreboard provides the right level of competition |
| Game replay / session history logs | AsyncStorage is fine for last-used settings, not for full game history. Adds storage complexity for zero party-table value. | Vote breakdown on summary screen is sufficient post-game review |

---

## Feature Dependencies

```
Player list management → Session scoreboard (scoreboard needs stable player IDs)
Player list management → Imposter count toggle (2-imposter gate requires knowing player count)
Role assignment engine → Role reveal card (card reads from game state set by engine)
Role reveal (all players done) → Discussion timer (can only start discussion after all reveals)
Discussion timer end → Voting phase (auto-advance or manual End Discussion)
Voting phase (all votes cast) → Summary screen (requires all VoteRecords)
Summary screen → Play Again → Role reveal (re-runs START_ROUND)
Category selection → Word bank → Role assignment (pickWord needs categoryId)
AsyncStorage persistence → Player list management (mount-time load of last players)
AsyncStorage persistence → Category Quick Start (load lastCategoryId)
```

---

## MVP Recommendation

Prioritize (in order of build dependency):

1. **Game engine (pure functions)** — assignRoles, pickWord, tallyVotes. Everything else is UI on top of this.
2. **Player list management** — Must exist before any round can start. Include persistence.
3. **Role reveal card (RevealCard)** — The core differentiator. Swipe gesture, haptics, auto-hide, role-appropriate visuals. Over-invest here.
4. **Discussion timer** — Simple countdown with pause and color shift. Auto-advance at 0.
5. **Sequential voting** — Self-vote prevention, confirmation modal, tie handling.
6. **Summary screen** — Winner announcement, imposter reveal, vote breakdown, play-again flow.
7. **Category selection + word banks** — 5 categories at ship; Quick Start button.
8. **Session scoreboard** — Cumulative wins tally displayed on summary. Low complexity, high multi-round value.
9. **How-to-play modal** — Last to build; doesn't block gameplay.

**Defer post-MVP:**
- Custom word banks: Complexity is high; ships as a potential paid feature later
- Two additional word categories: Can add more JSON files without code changes
- Haptic pattern tuning: Functional haptics ship in MVP; micro-tuning is post-ship polish

---

## Competitive Positioning Summary

The crowded field (Spyfall, Undercover, Imposter Party, Impostor Who?) universally ships:
- Role assignment + word reveal
- Discussion + voting
- Play again

The field consistently fails at:
- **Role reveal UX** — Most use a plain card tap, no gesture, no haptic, no auto-hide. A swipe gesture with heavy haptic + auto-hide is genuinely differentiated.
- **Role leak prevention** — No competing app studied has AppState background detection to hide cards.
- **Animation polish on dark theme** — The 2024 Spyfall redesign was praised specifically for UI quality signals. The market responds to polish.
- **Offline reliability** — Apps with online features get destroyed in reviews for crashes. 100% offline is a feature, not a limitation.

The positioning is: "The pass-and-play imposter game that actually feels good to hold."

---

## Sources

- [Spyfall App Store listing](https://apps.apple.com/us/app/spyfall-social-deduction-game/id6748970148)
- [SpyFall: Find the Spy (Google Play)](https://play.google.com/store/apps/details?id=io.github.maxcriser.spyfall&hl=en_US)
- [Undercover Word Party Game — How to Play rules](https://www.yanstarstudio.com/undercover-how-to-play)
- [Undercover App Store listing](https://apps.apple.com/us/app/undercover-word-party-game/id946882449)
- [Imposter Party Word Game — App Store](https://apps.apple.com/us/app/imposter-party-word-game/id1562982547)
- [Impostor Who? Party Word Game — App Store](https://apps.apple.com/us/app/impostor-who-party-word-game/id6747053346)
- [Fakit - Imposter (custom categories feature)](https://mwm.ai/apps/fakit-imposter/6756240120)
- [imposter.ai (AI categories subscription)](https://spark.mwm.ai/en/apps/imposter-ai/6754861642)
- [Jackbox design principles (Built In Chicago)](https://www.builtinchicago.org/articles/jackbox-games-design-party-pack)
- [Critical Play: Spyfall — Mechanics of Magic](https://mechanicsofmagic.com/2024/04/08/critical-play-spyfall-28/)
- [Designing Games with Hidden Roles (MINIFINITI)](https://minifiniti.com/blogs/game-talk/designing-games-hidden-roles)
- [Werewolf Mafia Party Game — App Store](https://apps.apple.com/us/app/werewolf-mafia-impostor-game/id6740009341)
- [Triple Agent — App Store](https://apps.apple.com/us/app/triple-agent/id1247445624)
