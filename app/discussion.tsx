import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { GridBackground } from "../src/components/GridBackground";
import { useGame } from "../src/context/GameContext";
import { getCategoryById } from "../src/data/categories";
import { useHaptics } from "../src/hooks/useHaptics";

function usePressScale(pressedScale = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, { toValue: pressedScale, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  return { style: { transform: [{ scale }] }, onPressIn, onPressOut };
}

export default function DiscussionScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const haptics = useHaptics();
  const category = state.categoryId ? getCategoryById(state.categoryId) : null;

  const hasTimer = state.timerSeconds !== null && state.timerSeconds > 0;
  const [timeLeft, setTimeLeft] = useState(state.timerSeconds || 0);
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (hasTimer) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            haptics.warning();
            setTimeout(() => {
              dispatch({ type: "SET_PHASE", phase: "voting" });
              router.replace("/voting");
            }, 1500);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, hasTimer]);

  // Haptic tick when < 5s
  useEffect(() => {
    if (hasTimer && isActive && timeLeft > 0 && timeLeft <= 5) {
      haptics.selection();
    }
  }, [timeLeft]);

  const accent = useMemo(() => {
    if (!hasTimer) return "#FFFFFF";
    if (timeLeft < 10) return "#FF3B5C";
    if (timeLeft < 30) return "#FBBF24";
    return "#FFFFFF";
  }, [timeLeft, hasTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleEndDiscussion = () => {
    haptics.medium();
    dispatch({ type: "SET_PHASE", phase: "voting" });
    router.replace("/voting");
  };

  const pausePress = usePressScale(0.985);
  const votePress = usePressScale(0.98);

  return (
    <GridBackground variant="danger">
      <View className="flex-1 items-center justify-center px-6 pt-10 pb-10">
        {/* Category Badge */}
        {category && (
          <View className="absolute top-16">
            <View className="bg-black/35 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/15 flex-row items-center gap-2">
              <Text style={{ fontSize: 18 }}>{category.emoji}</Text>
              <Text className="text-white/70 text-xs font-nunito font-bold uppercase tracking-[0.22em]">
                {category.name}
              </Text>
            </View>
          </View>
        )}

        <View className="items-center mb-10">
          <View className="bg-black/35 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 mb-8">
            <Text className="text-white/70 text-xs font-nunito font-bold uppercase tracking-[0.22em]">
              {hasTimer ? "Discussion Phase" : "Stopwatch"}
            </Text>
          </View>

          <View className="w-64 h-64 rounded-full border-4 border-white/10 items-center justify-center">
            <View
              style={{ borderColor: accent }}
              className="absolute inset-2 rounded-full border-2 opacity-35"
            />

            {hasTimer && timeLeft < 10 && (
              <View
                style={{ backgroundColor: accent }}
                className="absolute -inset-10 opacity-20 blur-3xl"
              />
            )}

            <Text
              style={{ color: accent }}
              className="text-8xl font-fredoka tracking-tight"
            >
              {hasTimer ? formatTime(timeLeft) : formatTime(elapsed)}
            </Text>

            {hasTimer && timeLeft > 0 && timeLeft <= 10 && (
              <Text className="text-white/55 font-nunito font-bold text-xs mt-3 uppercase tracking-[0.22em]">
                Hurry
              </Text>
            )}
          </View>

          {hasTimer && timeLeft === 0 && (
            <Text className="text-[#FF3B5C] font-nunito font-bold text-xl mt-4">
              TIME UP
            </Text>
          )}
        </View>

        <View className="w-full gap-3 absolute bottom-10 left-0 px-6">
          {hasTimer && (
            <Animated.View style={pausePress.style}>
              <Pressable
                onPress={() => {
                  haptics.selection();
                  setIsActive(!isActive);
                }}
                onPressIn={pausePress.onPressIn}
                onPressOut={pausePress.onPressOut}
                className="w-full bg-black/35 backdrop-blur-xl border border-white/20 rounded-[24px] py-5 items-center justify-center"
              >
                <Text className="text-white font-fredoka text-xl">
                  {isActive ? "Pause clock" : "Resume"}
                </Text>
              </Pressable>
            </Animated.View>
          )}

          <Animated.View style={votePress.style}>
            <Pressable
              onPress={handleEndDiscussion}
              onPressIn={votePress.onPressIn}
              onPressOut={votePress.onPressOut}
              className="w-full bg-white rounded-[24px] py-5 items-center justify-center overflow-hidden"
            >
              <View className="absolute -inset-6 bg-[#FF2D55]/25 blur-2xl" />
              <Text className="text-[#FF2D55] font-fredoka text-xl uppercase tracking-wide">
                End Discussion
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </GridBackground>
  );
}
