---
phase: 1
slug: foundation
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-07
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Foundation phase.
> Phase 1 builds NO screens. This contract establishes the design token system that all
> subsequent phases (2–4) must consume without deviation. The tokens are already implemented
> in `tailwind.config.js` and `src/theme/colors.ts` — this document codifies them as the
> authoritative reference.

---

## Design System

| Property | Value | Source |
|----------|-------|--------|
| Tool | none (NativeWind v4 + custom tokens) | CLAUDE.md stack rules — shadcn not applicable to React Native |
| Preset | not applicable | React Native project; shadcn gate does not apply |
| Component library | none (hand-rolled per CLAUDE.md spec) | CLAUDE.md stack rules |
| Icon library | @expo/vector-icons — MaterialCommunityIcons | CLAUDE.md §STACK |
| Font (display/title) | Fredoka — 700Bold, 500Medium | tailwind.config.js + _layout.tsx |
| Font (body/UI) | Nunito — 700Bold, 600SemiBold | tailwind.config.js + _layout.tsx |

**Registry safety gate:** Not applicable. No shadcn, no third-party component registries.

---

## Spacing Scale

Declared values (all multiples of 4). NativeWind Tailwind spacing units apply directly.

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| xs | 4px | `p-1` / `gap-1` | Icon gaps, inline padding |
| sm | 8px | `p-2` / `gap-2` | Compact element spacing |
| md | 16px | `p-4` / `gap-4` | Default element spacing, `px-4` body content |
| screen | 20px | `px-5` | Screen horizontal padding (all screens) |
| lg | 24px | `p-6` / `gap-6` | Card padding (`p-5` = 20px is used for cards) |
| xl | 32px | `p-8` / `gap-8` | Section gaps |
| 2xl | 48px | `p-12` | Major section breaks |
| 3xl | 64px | `p-16` | Page-level vertical spacing |

**Exceptions:**
- Screen horizontal padding: `px-5` (20px) — matches CLAUDE.md §DESIGN TOKENS
- Card padding: `p-5` (20px) — matches CLAUDE.md §DESIGN TOKENS
- Button height: `h-14` (56px) — touch target, not a spacing token
- Card minimum height: `min-h-[120px]` — component constraint, not a spacing token

---

## Typography

Two font families with two weights each. No other fonts are permitted.

| Role | Font Family | Tailwind Class | Size | Weight | Line Height | Usage |
|------|-------------|---------------|------|--------|-------------|-------|
| Timer | Nunito | `font-nunito text-7xl tabular-nums` | 72px | 700 Bold | 1.0 (no wrap) | DiscussionScreen countdown |
| Display / Title | Fredoka | `font-fredoka text-4xl tracking-tight` | 36px | 700 Bold | 1.2 | HomeScreen title, winner announcement |
| Heading | Nunito | `font-nunito text-2xl` | 24px | 700 Bold | 1.2 | Screen headings, section titles |
| Subheading | Nunito | `font-nunito-semibold text-lg` | 18px | 600 SemiBold | 1.3 | Card names, imposter reveal text |
| Body | Nunito | `font-nunito-semibold text-base` | 16px | 600 SemiBold | 1.5 | Descriptions, player names, instructions |
| Caption | Nunito | `font-nunito text-sm` | 14px | 400 Regular* | 1.4 | Word count badges, version numbers, hints |

*Note: Nunito 400 Regular is not loaded in `_layout.tsx`. Caption text should use `text-secondary` color with `font-nunito-semibold` at reduced opacity, or load `Nunito_400Regular` in Phase 2 if needed. Default to `Nunito_600SemiBold` for all body-level and below text.

**Declared sizes: 14, 16, 18, 24, 36, 72** (6 sizes; timer is a special case)
**Declared weights: 600 SemiBold (body/UI) + 700 Bold (headings/display)**

---

## Color

Source: `tailwind.config.js` and `src/theme/colors.ts`. All tokens verified present.

### Surface Palette (60% dominant)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| surface-900 | `#0F0F1A` | `bg-surface-900` | App background — all screens |
| surface-800 | `#1A1A2E` | `bg-surface-800` | Category cards, player list backgrounds |
| surface-700 | `#252540` | `bg-surface-700` | Elevated cards (RevealCard, CategoryCard, VoteCard) |
| surface-600 | `#30304D` | `bg-surface-600` | Input backgrounds, toggle inactive |

**60% rule:** Every screen's background is `surface-900`. Cards layer `surface-700` over it. Inputs sit on `surface-600`.

### Secondary Palette (30%)

Surface-800 and surface-700 together form the 30% secondary layer — card backgrounds, list rows, navigation-adjacent containers.

### Accent Palette (10%) — Reserved-for list

| Token | Hex | Tailwind Class | Reserved For |
|-------|-----|---------------|-------------|
| accent-red | `#FF3B5C` | `text-accent-red` / `border-accent-red` | Primary CTA button, imposter role reveal border glow, destructive actions, imposter identity text, "Imposter Wins!" announcement |
| accent-blue | `#4A9EFF` | `text-accent-blue` / `border-accent-blue` | Civilian role, secondary CTA (Play Again), selected category border, info states |
| accent-green | `#34D399` | `text-accent-green` / `border-accent-green` | Town wins announcement, civilian card border glow, success haptic confirmation |
| accent-amber | `#FBBF24` | `text-accent-amber` | Timer color when < 30 seconds remaining |
| accent-purple | `#A78BFA` | `text-accent-purple` | Decorative only — background grid, non-interactive visual detail |

**Accent is NOT used for:** generic text, card backgrounds, dividers, or any element not explicitly listed above.

### Text Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| text-primary | `#FFFFFF` | `text-white` | All primary readable text |
| text-secondary | `#A1A1B5` | `text-text-secondary` | Supporting labels, captions, subtitles |
| text-muted | `#6B6B80` | `text-text-muted` | Disabled states, version numbers, lowest-priority text |

### Semantic / Destructive

| Purpose | Token | Hex |
|---------|-------|-----|
| Destructive actions | accent-red | `#FF3B5C` |
| Timer warning (< 30s) | accent-amber | `#FBBF24` |
| Timer danger (< 10s) | text inherited from `text-accent-red` interpolation | `#FF3B5C` |

---

## Root Layout Contract

Phase 1 delivers the root layout. These constraints are locked for all phases.

| Contract | Value | Requirement |
|----------|-------|-------------|
| Outermost wrapper | `GestureHandlerRootView style={{ flex: 1 }}` | Required for Gesture Handler 2.28 |
| State provider | `GameProvider` wraps `Stack` | FNDN-02 |
| Status bar | `StatusBar style="light"` | Dark theme — light icons on surface-900 |
| Default screen animation | `animation: "fade_from_bottom"` | Consistent transition feel |
| Default gesture | `gestureEnabled: false` | Back-swipe blocked globally — FNDN-04 |
| Pre-game screens (gesture on) | `index`, `howtoplay`, `category`, `players` — `gestureEnabled: true` | Back navigation allowed before game starts |
| Gameplay screens (gesture off) | `reveal`, `discussion`, `voting`, `summary` — `gestureEnabled: false` | No role leak via back-swipe — FNDN-04 |
| How to Play presentation | `presentation: "modal"` on `howtoplay` screen | HELP-03 |

---

## Copywriting Contract

Phase 1 has no user-facing copy (no screens are built). This section establishes the copy rules that Phase 2–4 must follow, sourced from CLAUDE.md.

| Element | Copy |
|---------|------|
| App tagline | "Find the imposter. Trust no one." |
| Primary CTA (HomeScreen) | "Start Game" |
| Secondary CTA (HomeScreen) | "How to Play" |
| Empty state — no players | "Need at least 3 players" |
| Empty state — player list empty | "Add players to get started" |
| Error state — start blocked | "Need at least 3 players to start a round" |
| 2-imposter blocked | "2 imposters requires 7+ players" |
| Destructive: remove player | No confirmation dialog. Immediate delete with swipe gesture. Medium haptic as feedback. |
| Destructive: vote cast | "Vote for [Name]?" with Confirm / Cancel buttons before dispatch |
| Destructive: full reset | "New Game" button — immediate dispatch FULL_RESET, no confirmation dialog |

---

## Component Inventory

Components required by Phase 1 (root layout only). No UI components are built in this phase — they belong to Phases 2–4.

| Component | File | Phase 1 Role |
|-----------|------|-------------|
| RootLayout | `app/_layout.tsx` | Already complete. Wraps app in GestureHandlerRootView + GameProvider. Loads Fredoka and Nunito fonts. |
| ScreenWrapper | `src/components/ScreenWrapper.tsx` | NOT built in Phase 1. Used starting Phase 2. Spec: SafeAreaView + `bg-surface-900 flex-1` + optional `scrollable` + optional `padded` (default `px-5 py-4`). |

---

## Animation Baseline

Established in Phase 1 (via Reanimated 4 config fix). Phases 2–4 implement these.

| Pattern | API | Config |
|---------|-----|--------|
| Screen entry | Reanimated `entering` prop — `FadeInDown` / `FadeInUp` | `duration(500).springify()` |
| Staggered list items | `FadeInUp.delay(index * 100).springify()` | Per item |
| Button press | `withSpring` scale `0.96` on pressIn → `1.0` on pressOut | Very fast, no perceptible delay |
| RevealCard gesture | `useSharedValue` + `useAnimatedStyle` + `Gesture.Pan()` | `withSpring({ damping: 15, stiffness: 150 })` |
| Timer pulse (< 10s) | `useAnimatedStyle` looping scale `1.0 → 1.05 → 1.0` | Reanimated `withRepeat` |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| None | Not applicable | Not applicable — no shadcn, no third-party registries |

Phase 1 uses zero external component registries. All components are hand-rolled per CLAUDE.md spec. Registry safety gate is not applicable for this project (React Native — shadcn is web-only).

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending

---

## Source Traceability

| Decision | Source |
|----------|--------|
| All color tokens | `tailwind.config.js` (verified) + `src/theme/colors.ts` (verified) |
| Font families and weights | `tailwind.config.js` fontFamily + `app/_layout.tsx` useFonts (verified) |
| Spacing conventions | CLAUDE.md §DESIGN TOKENS |
| Typography scale | CLAUDE.md §DESIGN TOKENS |
| Root layout contract | `app/_layout.tsx` (verified complete — RESEARCH.md) |
| gestureEnabled pattern | CLAUDE.md §NAVIGATION MAPPING + FNDN-04 requirement |
| Accent reserved-for list | CLAUDE.md §SCREEN SPECIFICATIONS (imposter red, civilian blue, town-win green) |
| Copy strings | CLAUDE.md §SCREEN SPECIFICATIONS (each screen section) |
| Animation configs | CLAUDE.md §ANIMATION GUIDELINES |
