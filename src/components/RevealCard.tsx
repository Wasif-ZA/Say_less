import React, { useEffect, useCallback } from "react";
import { View, Text, Dimensions, AppState } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { REVEAL_AUTO_HIDE_MS, REVEAL_SWIPE_THRESHOLD } from "../constants/game";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface RevealCardProps {
  playerName: string;
  role: "civilian" | "imposter";
  secretWord: string;
  categoryEmoji: string;
  onRevealed: () => void;
  onDismissed: () => void;
}

export const RevealCard = ({
  playerName,
  role,
  secretWord,
  categoryEmoji,
  onRevealed,
  onDismissed,
}: RevealCardProps) => {
  const translateY = useSharedValue(0);
  const isRevealed = useSharedValue(false);
  const isLocked = useSharedValue(false);
  const hasTriggeredHaptic = useSharedValue(false);

  const isImposter = role === "imposter";
  const revealColor = isImposter ? "#FF3B5C" : "#34D399";

  const handleReveal = useCallback(() => {
    onRevealed();
  }, [onRevealed]);

  const handleDismiss = useCallback(() => {
    Haptics.selectionAsync();
    onDismissed();
  }, [onDismissed]);

  // Auto-hide after reveal
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const check = setInterval(() => {
      if (isRevealed.value && !isLocked.value) {
        isLocked.value = true;
        timeout = setTimeout(() => {
          handleDismiss();
        }, REVEAL_AUTO_HIDE_MS);
        clearInterval(check);
      }
    }, 100);
    return () => {
      clearInterval(check);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Hide card on app background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active" && isRevealed.value) {
        handleDismiss();
      }
    });
    return () => sub.remove();
  }, []);

  const fireStartHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const fireThresholdHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (isRevealed.value) return;
      hasTriggeredHaptic.value = false;
      runOnJS(fireStartHaptic)();
    })
    .onUpdate((event) => {
      if (isRevealed.value) return;
      translateY.value = Math.min(event.translationY, 0);

      if (
        translateY.value < REVEAL_SWIPE_THRESHOLD &&
        !hasTriggeredHaptic.value
      ) {
        hasTriggeredHaptic.value = true;
        runOnJS(fireThresholdHaptic)();
      }
    })
    .onEnd(() => {
      if (isRevealed.value) return;

      if (translateY.value < REVEAL_SWIPE_THRESHOLD) {
        isRevealed.value = true;
        translateY.value = withSpring(-SCREEN_HEIGHT, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(handleReveal)();
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const revealOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, REVEAL_SWIPE_THRESHOLD],
      [0, 1]
    ),
  }));

  return (
    <View className="flex-1 overflow-hidden relative bg-black">
      {/* Reveal Layer (underneath) */}
      <Animated.View
        style={[
          revealOpacity,
          { backgroundColor: isImposter ? "#1a0008" : "#0a1a14" },
        ]}
        className="absolute inset-0 items-center justify-center px-8 z-0"
      >
        <View
          style={{ borderColor: revealColor }}
          className="absolute inset-4 rounded-3xl border-2 opacity-30"
        />

        {isImposter ? (
          <View className="items-center">
            <Text style={{ fontSize: 80 }}>
              {"\u{1F575}\u{FE0F}"}
            </Text>
            <Text
              style={{ color: "#FF3B5C" }}
              className="font-fredoka text-4xl mt-4 text-center"
            >
              YOU ARE THE IMPOSTER
            </Text>
            <Text className="text-white/70 font-nunito text-base mt-4 text-center px-8">
              Blend in. Don't get caught.
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <Text style={{ fontSize: 60 }}>{categoryEmoji}</Text>
            <Text className="text-white/60 font-nunito font-bold text-sm mt-4 uppercase tracking-widest">
              Your word is
            </Text>
            <Text className="text-white font-fredoka text-4xl mt-2 text-center">
              {secretWord}
            </Text>
          </View>
        )}

        <View className="absolute bottom-12 w-full px-8">
          <Text
            onPress={handleDismiss}
            className="text-white font-fredoka text-xl text-center bg-white/10 py-4 rounded-full overflow-hidden"
          >
            TAP TO CONTINUE
          </Text>
        </View>
      </Animated.View>

      {/* Cover Card (on top, slides away) */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={coverStyle}
          className="absolute inset-0 bg-[#4A90E2] z-10 items-center justify-center"
        >
          <View className="mb-12 rotate-6">
            <Text style={{ fontSize: 120 }}>
              {"\u{1F92B}"}
            </Text>
          </View>

          <Text className="text-white font-fredoka text-5xl mb-2 text-center">
            {playerName}
          </Text>
          <Text className="text-white/80 font-nunito text-lg font-bold">
            Pass the phone to {playerName}
          </Text>

          <View className="absolute bottom-16 items-center w-full">
            <Text className="text-white font-fredoka text-2xl mb-2">
              Swipe up to reveal
            </Text>
            <Text className="text-white/80 font-fredoka text-xl mb-6">
              the secret word
            </Text>
            <View className="bg-black/10 p-4 rounded-full">
              <Ionicons name="chevron-up" size={40} color="white" />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
