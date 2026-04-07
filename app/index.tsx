import React, { useMemo, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GridBackground } from "../src/components/GridBackground";
import { useHaptics } from "../src/hooks/useHaptics";

function usePressScale(pressedScale = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: pressedScale,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };
  return { style: { transform: [{ scale }] }, onPressIn, onPressOut };
}

function PrimaryCTA({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const press = usePressScale(0.98);
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className="w-full rounded-[28px] overflow-hidden"
        android_ripple={{ color: "rgba(0,0,0,0.08)" }}
      >
        <View className="absolute -inset-6 bg-[#FF2D55]/25 blur-2xl" />
        <View className="bg-white px-6 py-5 rounded-[28px] flex-row items-center justify-center gap-3 shadow-xl shadow-black/25">
          <Ionicons name={icon} size={26} color="#FF2D55" />
          <Text className="text-[#FF2D55] font-fredoka text-2xl tracking-wide">
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function GhostCTA({ title, onPress }: { title: string; onPress: () => void }) {
  const press = usePressScale(0.985);
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className="w-full rounded-[28px] overflow-hidden"
      >
        <View className="bg-white/10 border border-white/15 backdrop-blur-xl px-6 py-4 rounded-[28px] items-center">
          <Text className="text-white font-nunito text-base font-bold">
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function Home() {
  const router = useRouter();
  const haptics = useHaptics();
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <GridBackground>
      <View className="flex-1 px-6 pt-10 pb-10">
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <Text className="text-white font-fredoka text-7xl tracking-tight">
              SAY LESS
            </Text>
            <View className="mt-4 bg-black/35 border border-white/15 backdrop-blur-xl px-4 py-2 rounded-full">
              <Text className="text-white/80 font-nunito font-bold uppercase tracking-[0.22em] text-xs">
                One phone &bull; One imposter &bull; One word
              </Text>
            </View>
            <Text className="text-white/55 font-nunito text-sm mt-5 text-center leading-5 max-w-[320px]">
              Pass the phone. Reveal your secret. Keep a straight face.
            </Text>
          </View>
        </View>

        <View className="w-full gap-4">
          <PrimaryCTA
            title="PLAY"
            icon="play"
            onPress={() => {
              haptics.light();
              router.push("/category");
            }}
          />
          <GhostCTA
            title="How to Play"
            onPress={() => {
              haptics.light();
              router.push("/howtoplay");
            }}
          />
        </View>

        <Text className="text-white/45 font-nunito text-xs mt-7 text-center">
          v1.0.0
        </Text>
      </View>
    </GridBackground>
  );
}
