# Technology Stack

**Project:** Imposter Party
**Researched:** 2026-04-07
**Confidence:** HIGH (verified against installed package.json, official docs, and migration guides)

---

## Reality Check: Stack Drift from CLAUDE.md

CLAUDE.md describes Expo SDK 52, Reanimated 3, and expo-router v4. The actual installed stack has drifted forward:

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

This is not a problem — the newer stack is superior. The CLAUDE.md spec should be treated as describing intent, not pinned versions. All API guidance in CLAUDE.md remains valid with minor exceptions noted below.

---

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

---

## Critical Configuration Notes

### Babel Plugin — Reanimated 4 Change

**This is the most likely source of silent bugs or warnings.**

Reanimated 4 moved worklets to `react-native-worklets`. The Babel plugin path changed:

- **Old (Reanimated 3):** `"react-native-reanimated/plugin"` in babel.config.js
- **New (Reanimated 4):** `"react-native-worklets/plugin"` in babel.config.js

The project's current `babel.config.js` still uses the old plugin path (`"react-native-reanimated/plugin"`). This will log a warning but continue working "for the foreseeable future" per the official migration guide. Fix it when convenient:

```js
// babel.config.js — correct for Reanimated 4
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-worklets/plugin", // was: "react-native-reanimated/plugin"
    ],
  };
};
```

Do NOT add both `react-native-worklets/plugin` AND `react-native-reanimated/plugin` — this causes a duplicate plugin error.

### NativeWind v4 Babel + Metro Configuration

NativeWind v4 requires two babel configuration entries:
- `jsxImportSource: "nativewind"` in `babel-preset-expo`
- `"nativewind/babel"` in the presets array

The current `babel.config.js` has neither. This means className may work for basic classes (Metro is doing partial transform) but complex/dynamic classes may not work correctly. The metro.config.js does use `withNativeWind` correctly.

Correct babel.config.js for NativeWind v4 + Reanimated 4:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-worklets/plugin"],
  };
};
```

### withSpring API Change (Reanimated 4)

CLAUDE.md specifies `damping: 15, stiffness: 150` for the RevealCard spring. This config still works in Reanimated 4. The only breaking changes are:
- `restDisplacementThreshold` and `restSpeedThreshold` removed (replaced by `energyThreshold`)
- `duration` in withSpring is now "perceptual duration" — divide by 1.5 if migrating timed springs

The `damping`/`stiffness`/`mass` parameters are unchanged.

### GestureHandlerRootView

Must wrap the root layout. Already implemented correctly in `app/_layout.tsx` with:
```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
```

Without this, `GestureDetector` components will silently fail.

### NativeWind className on Third-Party Components

NativeWind v4 `className` only works on React Native core components (`View`, `Text`, `Pressable`, etc.) and components that call `cssInterop()`. It does NOT work on arbitrary third-party components. For any third-party component, apply styles via `style` prop with extracted values.

### Color in View vs Text (NativeWind limitation)

`View` components do not cascade color. A `className="text-white"` on a `View` does NOT propagate to child `Text`. Always put text color classes on the `Text` component directly.

### Hot Reload and New Style Classes

When adding a brand-new Tailwind class for the first time, hot reload may not pick it up. Full reload (`r` in Expo CLI) or cache clear (`npx expo start --clear`) is required.

---

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

---

## What NOT to Install

| Package | Reason |
|---------|--------|
| react-navigation | Already provided via expo-router's internals. Installing separately causes version conflicts. |
| redux / zustand / jotai | Overkill. Context + useReducer handles this state machine. |
| styled-components / emotion | Not compatible with NativeWind v4 transformer pipeline. |
| lottie-react-native | Requires native module and dev client. Reanimated handles everything needed. |
| nativewind@5 or tailwindcss@4 | v5 is pre-release; v4+tailwind3 is the stable pairing for this project. |
| react-native-worklets/plugin AND react-native-reanimated/plugin together | Causes duplicate plugin error in Reanimated 4. Use only worklets/plugin. |

---

## Installation Reference

For a clean install or adding new packages, always use `npx expo install` to get version-compatible packages:

```bash
# Navigation / routing (already installed)
npx expo install expo-router

# Gestures + animations (already installed)
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets

# Styling (already installed)
npm install nativewind@^4.2.1 tailwindcss@^3.4

# Storage (already installed)
npx expo install @react-native-async-storage/async-storage

# Optional: screen capture protection for reveal screen
npx expo install expo-screen-capture
```

Note on `expo-screen-capture`: Not currently installed but worth considering for the RoleRevealScreen. `usePreventScreenCapture()` hook prevents screenshots/recordings on Android (FLAG_SECURE). On iOS, screenshot prevention is not possible at the OS level, but auto-hiding the card on AppState background change (already specified in CLAUDE.md) is the correct mitigation.

---

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
