# Domain Pitfalls

**Domain:** Mobile pass-and-play party social deduction game (React Native + Expo)
**Researched:** 2026-04-07
**Overall Confidence:** HIGH (verified against official docs and active GitHub issues)

---

## Critical Pitfalls

Mistakes that cause rewrites, security failures, or permanently broken UX.

---

### Pitfall 1: Role Leak via iOS Back-Swipe Gesture After router.replace()

**What goes wrong:** Even after calling `router.replace("/reveal")` to remove the players screen from history, iOS users can still trigger a back-swipe that slides the previous screen back into view — exposing a different player's role or the setup screen. `router.replace()` does not always fully clear the gesture-recognized stack on iOS.

**Why it happens:** Expo Router v4 wraps React Navigation's Stack navigator. On iOS, the native back-swipe gesture reads from the underlying navigation state, which may retain entries even after `replace()`. There is an active GitHub issue (expo/expo #31614) confirming `gestureEnabled: false` is sometimes not honored on iOS in certain Expo Router versions.

**Consequences:** One player can swipe back and see another player's role (civilian word or imposter status). This destroys the game's core mechanic. It is the single worst possible failure mode for this project.

**Prevention:**
1. Set `gestureEnabled: false` explicitly on every gameplay screen (reveal, discussion, voting, summary) in the Stack layout:
   ```tsx
   <Stack.Screen name="reveal" options={{ gestureEnabled: false, headerShown: false }} />
   ```
2. Additionally, use `router.replace()` (not `router.push()`) for all post-players transitions so the stack entry count stays minimal.
3. For extra insurance, wrap the RevealCard content in an AppState listener that auto-hides when the app moves to `"background"` or `"inactive"` — this covers the scenario where someone fast-switches to another app and back before the card auto-hides.
4. Test on a physical iOS device specifically — the iOS Simulator does not reproduce swipe gesture behavior reliably.

**Detection:** On a physical iPhone, navigate to the reveal screen and attempt a left-edge swipe. If the players screen slides in, the gesture is not blocked. Also test immediately after role is revealed.

**Phase to address:** Phase implementing the RoleRevealScreen and Expo Router layout config. Must be verified before any subsequent screen work.

**Confidence:** MEDIUM — `gestureEnabled: false` is documented and works in most cases; the iOS edge case is reported in active GitHub issues but may be fixed in newer SDK versions. Always verify on device.

---

### Pitfall 2: RevealCard Role Content Visible During Gesture Threshold Crossing (Debounce Failure)

**What goes wrong:** If a player rapidly taps or swipes the RevealCard multiple times (e.g., tapping twice quickly before the reveal animation completes), the gesture state machine can be interrupted mid-animation. The card may snap to a partially-revealed state that shows content to the next player, or the `onDismissed` callback fires multiple times — causing `ADVANCE_REVEAL` to dispatch twice and skipping a player.

**Why it happens:** React Native Gesture Handler's `enabled` prop only takes effect at gesture *start* (when a finger first touches the screen), not during an ongoing gesture. Rapid sequential gestures bypass the lock unless the gesture is explicitly disabled while an animation is in progress using a shared value flag.

**Consequences:** A player is skipped entirely (never sees their role), or `currentRevealIndex` gets out of sync with `players.length`, causing a crash or premature navigation to the discussion screen.

**Prevention:**
1. Use a `useSharedValue<boolean>(false)` named `isAnimating` that is set to `true` at gesture start and `false` only after the dismiss animation completes.
2. Gate the gesture with `.enabled(derived(isAnimating, (v) => !v))` or wrap in an `if (isAnimating.value) return;` early exit in the `onBegin` callback.
3. Gate the `ADVANCE_REVEAL` dispatch so it only fires once per lifecycle: set a ref `const hasAdvanced = useRef(false)` and flip it before dispatching.
4. The `onDismissed` prop on RevealCard should only call the parent callback once — prevent double-fire with the same ref pattern.

**Detection:** Rapidly tap the RevealCard during its animation. Check that `currentRevealIndex` increments by exactly 1 per player.

**Phase to address:** RevealCard implementation phase. Must be built alongside the debounce lock, not added later.

**Confidence:** HIGH — documented in React Native Gesture Handler troubleshooting docs.

---

### Pitfall 3: Worklet Callback Calling React State Directly (Threading Crash)

**What goes wrong:** Animation completion callbacks in Reanimated 3 (e.g., the callback inside `withSpring()` or `withTiming()`) run on the UI thread. If you call `dispatch(ADVANCE_REVEAL)` or `router.replace("/discussion")` directly inside these callbacks, React Native throws: `"Tried to synchronously call function from a different thread"`.

**Why it happens:** Reanimated worklets execute on the UI thread, but React's `dispatch` and Expo Router's `router.replace` are JavaScript thread operations. Direct calls across threads crash at runtime.

**Consequences:** App crashes silently or with a cryptic native error. Common discovery: works in Expo Go during dev, crashes on standalone build.

**Prevention:** Always wrap JS-thread calls inside Reanimated callbacks with `runOnJS`:
```typescript
withSpring(0, { damping: 15 }, runOnJS(onDismissed));
```
Never call `dispatch()`, `router.replace()`, or `setState()` directly inside a worklet callback. The rule: if the function came from React or a navigation library, it needs `runOnJS`.

**Detection:** Any animation that should trigger navigation or state dispatch. Test on a release build — dev mode is more forgiving.

**Phase to address:** Any phase touching RevealCard or timer animation with state-changing callbacks.

**Confidence:** HIGH — documented in official Reanimated docs and active GitHub issues (software-mansion/react-native-reanimated #1489, #5555).

---

### Pitfall 4: NativeWind Conditional className Crashing Navigation Context

**What goes wrong:** Using a template literal or ternary in `className` on a `Pressable` or `TouchableOpacity` while inside a navigation context causes a crash: `"Couldn't find a navigation context"`. NativeWind's runtime processing of dynamic class names interferes with React Context propagation down the component tree.

**Why it happens:** NativeWind v4 processes `className` dynamically at runtime. When the class string is dynamic (not statically analyzable), NativeWind triggers a re-evaluation that can disrupt the context tree in ways that cause navigation context to be missing for child components.

**Consequences:** Buttons inside screens randomly crash the app when their conditional style changes — specifically when the `className` value changes between renders (e.g., a selected/unselected VoteCard, or a disabled/enabled PrimaryButton).

**Prevention:**
1. Prefer declaring both states explicitly rather than toggling:
   ```tsx
   // BAD
   className={`border-2 ${isSelected ? 'border-accent-red' : 'border-transparent'}`}

   // GOOD
   className="border-2 border-transparent data-[selected=true]:border-accent-red"
   // OR use two static classNames via React.memo'd sub-components
   ```
2. When dynamic classes are unavoidable, test specifically on the affected component inside a navigator to catch this early.
3. If a crash occurs and conditional className is present, try replacing with a static `style` prop as a fallback.

**Detection:** Crash with "navigation context" error message on a component that uses conditional `className`. If removing the ternary fixes it, this is the culprit.

**Phase to address:** All phases that build interactive card components (CategoryCard, VoteCard, PrimaryButton).

**Confidence:** HIGH — confirmed in active NativeWind GitHub issue #1712.

---

### Pitfall 5: GestureHandlerRootView Not at True App Root (Gesture Dead Zones)

**What goes wrong:** If `GestureHandlerRootView` is placed inside the navigator (e.g., inside a screen component or layout wrapper below the root) rather than wrapping the absolute root, gestures on some screens silently fail. The RevealCard swipe never fires, giving the impression of an animation bug when it is actually a setup bug.

**Why it happens:** Gesture Handler requires all composed gestures to be mounted under the same `GestureHandlerRootView`. Any gesture mounted outside the root view is ignored. Relations between gestures (e.g., simultaneous gestures, exclusive gestures) also only work within the same root.

**Consequences:** The RevealCard swipe gesture does nothing. No error is thrown — it just doesn't work. Also occurs in Modals, which need their own `GestureHandlerRootView` wrapper around Modal content.

**Prevention:**
- In `app/_layout.tsx`, wrap the entire app with `GestureHandlerRootView` as the outermost component:
  ```tsx
  export default function RootLayout() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GameProvider>
          <Stack />
        </GameProvider>
      </GestureHandlerRootView>
    );
  }
  ```
- Never nest `GestureHandlerRootView` inside a screen or component. One instance at root only.

**Detection:** RevealCard swipe registers no gesture events. Add a `console.log` inside `onBegin` to confirm the gesture fires at all.

**Phase to address:** Root layout setup phase (_layout.tsx). Fix before any gesture work begins.

**Confidence:** HIGH — explicitly documented in React Native Gesture Handler official docs.

---

## Moderate Pitfalls

---

### Pitfall 6: Single Monolithic GameContext Causing Full-Tree Re-renders

**What goes wrong:** Every state change — including `currentRevealIndex` incrementing on each player reveal — re-renders every component subscribed to the GameContext. In a 10-player game, the timer ticking every second causes 10 re-renders per second across the entire component tree if the context is consumed broadly.

**Why it happens:** React Context does not support selective subscription. Any change to the context value object triggers all consumers.

**Consequences:** Janky countdown timer animation, dropped frames during the discussion screen, sluggish voting list.

**Prevention:**
1. Separate the dispatch function into its own context so components that only call dispatch (not read state) do not re-render on state changes.
2. Wrap the GameContext `value` prop with `useMemo` keyed to the parts of state that actually change:
   ```tsx
   const contextValue = useMemo(() => ({ state, dispatch }), [state]);
   ```
3. The `TimerDisplay` and `RevealCard` components should derive local state via `useGame()` only for the fields they need, and use `React.memo` to prevent re-renders when irrelevant fields change.
4. Keep `useCountdown` as a local hook inside `DiscussionScreen` — do not push timer ticks into the global GameContext. Manage countdown in component-local state.

**Detection:** Add `console.log("render")` to `RevealCard` and observe how many times it renders while the timer is counting.

**Phase to address:** GameContext implementation phase and DiscussionScreen phase.

**Confidence:** HIGH — well-documented React Context limitation.

---

### Pitfall 7: AppState Not Monitored During RevealCard — Role Visible on Lock Screen Notification

**What goes wrong:** When the phone receives a notification or the user double-taps the home button to see the app switcher while the RevealCard is in its "revealed" state, the card content remains visible. On iOS, the app switcher shows a live screenshot of the app. On Android, the recent apps view shows the current screen.

**Why it happens:** React Native does not automatically obscure or blur screen content when the app becomes inactive or goes to the background unless explicitly handled.

**Consequences:** A player who peeks at the app switcher while another player is viewing their role can see the word or imposter status.

**Prevention:**
1. Subscribe to `AppState.addEventListener("change", handler)` inside `RevealCard` (or in the `RoleRevealScreen`).
2. When AppState transitions to `"background"` or `"inactive"`, immediately reset the card to its hidden state:
   ```typescript
   AppState.addEventListener("change", (nextState) => {
     if (nextState !== "active") {
       // snap card back to hidden via shared value
       cardTranslateY.value = withSpring(0);
     }
   });
   ```
3. Remove the listener in the cleanup function of the `useEffect`.

**Detection:** Reveal a role on a physical device, then press the home button or receive a notification. Check if the revealed content is visible in the app switcher.

**Phase to address:** RevealCard implementation phase.

**Confidence:** HIGH — AppState API is well-documented; this is a known pattern for secure content screens.

---

### Pitfall 8: expo-haptics Silent Failure on Android Without Proper API Level Targeting

**What goes wrong:** Haptic feedback calls succeed (no errors thrown) but produce no perceptible feedback on Android devices, especially for the `impactAsync` patterns that are central to the reveal experience.

**Why it happens:** Android's legacy `Vibrator` API produces weak, buzzy vibration rather than the crisp tap feedback of iOS's Taptic Engine. The `performAndroidHapticsAsync` method (targeting API 31+) provides feedback comparable to iOS, but `impactAsync` on older Android uses the legacy Vibrator system service, which may feel wrong or be imperceptible on some devices. Additionally, `expo-haptics` does nothing if the device doesn't support haptics and will not throw an error — the call silently no-ops.

**Consequences:** The reveal moment feels flat on Android. The heavy haptic at the reveal threshold — described in CLAUDE.md as "CRITICAL" — may not register at all.

**Prevention:**
1. Wrap all haptic calls in try/catch to handle the silent no-op gracefully without crashes.
2. Accept that Android haptics will feel different from iOS — do not design UX where haptics are the *only* feedback (pair with visual feedback for every important moment).
3. Test haptics specifically on Android physical devices (not emulators — emulators do not support haptics).
4. The iOS Simulator also does not support haptics — all haptic testing requires physical devices.

**Detection:** Run the reveal flow on a physical Android device and observe whether haptics feel responsive at the swipe threshold.

**Phase to address:** RevealCard phase and any phase where haptic feedback is described as critical to the experience.

**Confidence:** HIGH — confirmed in expo-haptics official documentation.

---

### Pitfall 9: AsyncStorage Silently Losing Data After Expo OTA Update (expo publish)

**What goes wrong:** Player names and category selections persisted with AsyncStorage are wiped after an OTA update is published via `expo publish`. This is an active known issue in Expo managed workflow — data is lost when a new JS bundle is downloaded and loaded.

**Why it happens:** On certain Expo managed workflow configurations, the AsyncStorage data path can be cleared or become inaccessible after an OTA bundle swap, depending on the native build version.

**Consequences:** Returning players find their saved names gone after the developer pushes an update. Not catastrophic for a party game (players re-enter names), but surprising and unprofessional.

**Prevention:**
1. Always wrap `getItem` and `setItem` in try/catch — never let AsyncStorage failures crash the app.
2. Design the PlayerSetup screen to function correctly with no persisted state (graceful degradation).
3. For MVP, this is low risk since OTA updates are infrequent. Just ensure the empty-state UX (defaulting to "Player 1", "Player 2", etc.) works well.

**Detection:** Use `expo publish` to push an update, then reopen the app and check if persisted players still appear.

**Phase to address:** Persistence implementation phase (PlayerSetup screen).

**Confidence:** MEDIUM — reported in Expo GitHub issues (#11852) but behavior may vary by SDK version.

---

### Pitfall 10: NativeWind Text Color Not Inheriting into Text Children of View

**What goes wrong:** Applying a text color class (`text-white`, `text-accent-red`) to a `View` component has no effect on child `Text` components. Developers coming from web Tailwind expect color to cascade, but React Native does not cascade styles.

**Why it happens:** React Native's style system does not cascade properties across component boundaries except for a small subset (font styles when explicitly inherited). Text color on a `View` is silently ignored.

**Consequences:** Text appears in the wrong color or default black, which is invisible on the dark background. Debugging is slow because no error is thrown.

**Prevention:**
- Always apply text color classes directly to `Text` components, never to wrapper `View` components.
- In NativeWind, `text-*` utilities on `View` components are silently dropped. Move them to the nearest `Text` node.

**Detection:** Screen renders with invisible text (black text on dark background). Inspect by temporarily changing `surface-900` to a light color to make the text visible.

**Phase to address:** All UI phases — establish this rule from the first component.

**Confidence:** HIGH — documented in NativeWind official docs under "Platform Differences".

---

## Minor Pitfalls

---

### Pitfall 11: Expo Router v4 router.navigate() Behavior Changed from v3

**What goes wrong:** If any code uses `router.navigate("/reveal")` expecting it to replace the current screen (as it did in v3), it now pushes a new entry onto the stack. In v4, `router.navigate()` is an alias for `router.push()`.

**Prevention:** Always use `router.replace()` for all post-setup screen transitions in the game flow. Reserve `router.push()` only for modal overlays like how-to-play.

**Confidence:** HIGH — confirmed in Expo GitHub issue #35212.

---

### Pitfall 12: Duplicate Player Names Producing Ambiguous Vote Results

**What goes wrong:** If two players are named "Alex", `tallyVotes` counts votes by `targetId` correctly, but the Summary screen displays "Alex → voted for Alex" for both — making it impossible to read who voted for whom.

**Prevention:** The PlayerSetup screen must auto-append a numeric suffix on blur when a duplicate name is detected. This is specified in CLAUDE.md but easy to skip. Implement it before the voting screen, not after.

**Confidence:** HIGH — logic consequence, no external source needed.

---

### Pitfall 13: Timer Dispatch into Global State Causes Every Screen to Re-render Each Second

**What goes wrong:** If `timerSeconds` in the global GameContext is decremented every second by dispatching an action, every component subscribed to GameContext re-renders once per second for the entire duration of the discussion phase.

**Prevention:** Do not decrement `timerSeconds` in the reducer. Manage the countdown entirely in local component state inside `DiscussionScreen` using the `useCountdown` hook. Only dispatch navigation (to voting) when the timer reaches zero. The global state holds the *configured* timer duration, not the live countdown value.

**Confidence:** HIGH — established React performance pattern.

---

### Pitfall 14: Flex Layout Collapse When scrollable={false} and Content Overflows

**What goes wrong:** NativeWind's `flex-1` on `ScreenWrapper` works correctly, but on screens with dynamic content (PlayerSetup with 10 players), the content overflows off-screen without a `ScrollView`. Adding a `ScrollView` late can break layout if the outer containers don't also use correct flex dimensions.

**Prevention:** Decide at component creation time whether a screen is scrollable or fixed-height. PlayerSetup and CategorySelect should be `scrollable={true}` from the start.

**Confidence:** HIGH — React Native Flexbox limitation, documented in NativeWind platform differences.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Root layout (_layout.tsx) | GestureHandlerRootView not at true root | Wrap entire app at root, verify before any gesture work |
| RevealCard implementation | Worklet callbacks calling dispatch directly | Use runOnJS for all React state updates from animation callbacks |
| RevealCard implementation | Rapid gesture spam double-advancing reveal index | Lock gesture with isAnimating shared value and useRef guard |
| RevealCard implementation | Role visible in app switcher | Subscribe to AppState, auto-hide on "inactive"/"background" |
| Expo Router layout config | iOS back-swipe leaking previous screen | Set gestureEnabled: false on all post-setup screens; verify on physical device |
| GameContext implementation | Single large context re-rendering on timer ticks | Keep countdown in local hook; separate dispatch context |
| VoteCard / PrimaryButton | Conditional className crashing navigation context | Use static class names; avoid template literals in className |
| PlayerSetup screen | Duplicate names in vote summary | Enforce deduplication on blur, before voting phase exists |
| DiscussionScreen | Timer ticking into global state | Local useCountdown hook, never dispatch per-tick |
| Persistence (AsyncStorage) | Silent null returns and OTA wipes | Wrap in try/catch; design for graceful empty state |
| Android testing | Haptics silent no-op | Test on physical Android device; pair haptics with visual feedback |

---

## Sources

- React Native Gesture Handler troubleshooting: https://docs.swmansion.com/react-native-gesture-handler/docs/guides/troubleshooting/
- Expo Router iOS gesture issue (active): https://github.com/expo/expo/issues/31614
- Expo Router v4 navigate breaking change: https://github.com/expo/expo/issues/35212
- Expo Router replace still allows swipe back: https://github.com/expo/router/discussions/880
- Expo Router gestureEnabled documentation: https://docs.expo.dev/router/advanced/stack/
- NativeWind quirks and platform differences: https://www.nativewind.dev/docs/core-concepts/quirks
- NativeWind conditional className navigation crash issue: https://github.com/nativewind/nativewind/issues/1712
- NativeWind troubleshooting guide: https://www.nativewind.dev/docs/getting-started/troubleshooting
- Reanimated runOnJS documentation: https://docs.swmansion.com/react-native-reanimated/docs/2.x/api/miscellaneous/runOnJS/
- Reanimated withTiming callback state update issue: https://github.com/software-mansion/react-native-reanimated/issues/1489
- expo-haptics official documentation: https://docs.expo.dev/versions/latest/sdk/haptics/
- expo-haptics non-supported platforms issue: https://github.com/expo/expo/issues/19141
- AsyncStorage data loss after expo publish: https://github.com/expo/expo/issues/11852
- React Context performance optimization: https://www.tenxdeveloper.com/blog/optimizing-react-context-performance
- NativeWind v4 setup guide (Expo SDK 52+): https://dev.to/aramoh3ni/taming-the-beast-a-foolproof-nativewind-react-native-setup-v52-2025-4dd8
