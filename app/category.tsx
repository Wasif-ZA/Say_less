import React, { useEffect, useMemo, useRef } from "react";
import { Animated, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GridBackground } from "../src/components/GridBackground";
import { CATEGORIES } from "../src/data/categories";
import { useGame } from "../src/context/GameContext";
import { useHaptics } from "../src/hooks/useHaptics";
import { getItem, setItem } from "../src/storage/storage";
import { STORAGE_KEYS } from "../src/constants/game";
import type { Category } from "../src/game/types";

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

export default function CategorySelect() {
  const router = useRouter();
  const { dispatch } = useGame();
  const haptics = useHaptics();

  const handleSelectCategory = (categoryId: string) => {
    haptics.light();
    dispatch({ type: "SET_CATEGORY", categoryId });
    setItem(STORAGE_KEYS.LAST_CATEGORY_ID, categoryId);
    router.push("/players");
  };

  const handleQuickStart = async () => {
    haptics.light();
    const lastId = await getItem<string>(STORAGE_KEYS.LAST_CATEGORY_ID);
    const cat = lastId
      ? CATEGORIES.find((c) => c.id === lastId) || CATEGORIES[0]
      : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    handleSelectCategory(cat.id);
  };

  const renderCard = ({ item, index }: { item: Category; index: number }) => (
    <CategoryCard
      item={item}
      index={index}
      onPress={() => handleSelectCategory(item.id)}
    />
  );

  return (
    <GridBackground>
      <View className="flex-1">
        <View className="px-6 pt-6 pb-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              className="w-12 h-12 items-center justify-center rounded-2xl bg-white/10 border border-white/15"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <View className="items-center">
              <Text className="text-white/60 font-nunito font-bold uppercase tracking-[0.22em] text-xs">
                Choose a theme
              </Text>
              <Text className="text-white font-fredoka text-3xl tracking-tight">
                Categories
              </Text>
            </View>
            <View className="w-12" />
          </View>
        </View>

        <FlatList
          data={CATEGORIES}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="mb-2">
              <QuickStartButton onPress={handleQuickStart} />
            </View>
          }
        />
      </View>
    </GridBackground>
  );
}

function QuickStartButton({ onPress }: { onPress: () => void }) {
  const press = usePressScale(0.98);
  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className="w-full bg-white/10 border border-white/15 rounded-2xl py-4 flex-row items-center justify-center gap-2"
      >
        <Ionicons name="shuffle" size={20} color="white" />
        <Text className="text-white font-fredoka text-lg">Quick Start</Text>
      </Pressable>
    </Animated.View>
  );
}

function CategoryCard({
  item,
  index,
  onPress,
}: {
  item: Category;
  index: number;
  onPress: () => void;
}) {
  const press = usePressScale(0.96);
  const accent = useMemo(() => {
    const palette = ["#7C5CFF", "#FF2D55", "#22C55E", "#F59E0B", "#06B6D4"];
    return palette[index % palette.length];
  }, [index]);

  return (
    <Animated.View style={press.style} className="flex-1">
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className="rounded-2xl overflow-hidden"
      >
        <View className="bg-black/30 backdrop-blur-xl rounded-2xl p-5 items-center border border-white/10 min-h-[140px] justify-center">
          <Text style={{ fontSize: 44 }} className="mb-2">
            {item.emoji}
          </Text>
          <Text className="text-white font-fredoka text-lg text-center">
            {item.name}
          </Text>
          <View
            style={{ backgroundColor: accent }}
            className="mt-2 px-2 py-0.5 rounded-full opacity-80"
          >
            <Text className="text-white font-nunito text-[10px] font-bold">
              {item.words.length} words
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
