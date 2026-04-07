import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GridBackground } from "../src/components/GridBackground";
import { useGame } from "../src/context/GameContext";
import { useHaptics } from "../src/hooks/useHaptics";
import { getItem, setItem } from "../src/storage/storage";
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  MIN_PLAYERS_FOR_TWO_IMPOSTERS,
  TIMER_OPTIONS,
  STORAGE_KEYS,
  DEFAULT_TIMER_SECONDS,
} from "../src/constants/game";
import type { Player } from "../src/game/types";

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

export default function PlayerSetup() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const haptics = useHaptics();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    (async () => {
      const savedPlayers = await getItem<Array<{ id: string; name: string }>>(
        STORAGE_KEYS.LAST_PLAYERS
      );
      if (savedPlayers && savedPlayers.length >= MIN_PLAYERS) {
        dispatch({
          type: "SET_PLAYERS",
          players: savedPlayers.map((p) => ({ ...p, role: null })),
        });
      }
      const savedTimer = await getItem<number | null>(STORAGE_KEYS.LAST_TIMER);
      if (savedTimer !== null) {
        dispatch({ type: "SET_TIMER", seconds: savedTimer });
      }
    })();
  }, []);

  const handleAddPlayer = () => {
    if (state.players.length >= MAX_PLAYERS) return;
    haptics.light();
    dispatch({ type: "ADD_PLAYER", name: `Player ${state.players.length + 1}` });
  };

  const handleRemovePlayer = (id: string) => {
    if (state.players.length <= MIN_PLAYERS) return;
    haptics.medium();
    dispatch({ type: "REMOVE_PLAYER", id });
  };

  const handleRenamePlayer = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      const idx = state.players.findIndex((p) => p.id === id);
      dispatch({ type: "RENAME_PLAYER", id, name: `Player ${idx + 1}` });
      return;
    }
    let finalName = trimmed;
    const dupes = state.players.filter(
      (p) => p.id !== id && p.name === trimmed
    );
    if (dupes.length > 0) {
      finalName = `${trimmed} (2)`;
    }
    dispatch({ type: "RENAME_PLAYER", id, name: finalName });
  };

  const handleImposterCount = (count: 1 | 2) => {
    haptics.selection();
    dispatch({ type: "SET_IMPOSTER_COUNT", count });
  };

  const handleTimerChange = (seconds: number | null) => {
    haptics.selection();
    dispatch({ type: "SET_TIMER", seconds });
  };

  const handleStartRound = async () => {
    haptics.medium();
    await setItem(
      STORAGE_KEYS.LAST_PLAYERS,
      state.players.map((p) => ({ id: p.id, name: p.name }))
    );
    await setItem(STORAGE_KEYS.LAST_TIMER, state.timerSeconds);
    dispatch({ type: "START_ROUND" });
    router.replace("/reveal");
  };

  const canHaveTwoImposters =
    state.players.length >= MIN_PLAYERS_FOR_TWO_IMPOSTERS;
  const canStart = state.players.length >= MIN_PLAYERS;

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "No Timer";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
    <View className="w-full bg-black/30 backdrop-blur-xl rounded-3xl h-[74px] flex-row items-center px-5 mb-3 border border-white/10">
      <View className="mr-4 w-10 h-10 rounded-2xl bg-white/10 border border-white/10 items-center justify-center">
        <Text className="text-white font-fredoka text-lg">{index + 1}</Text>
      </View>
      <TextInput
        className="flex-1 text-white font-nunito text-lg font-bold pt-1"
        value={item.name}
        onChangeText={(t) =>
          dispatch({ type: "RENAME_PLAYER", id: item.id, name: t })
        }
        onBlur={() => handleRenamePlayer(item.id, item.name)}
        placeholder={`Player ${index + 1}`}
        placeholderTextColor="rgba(255,255,255,0.3)"
      />
      {state.players.length > MIN_PLAYERS && (
        <Pressable
          onPress={() => handleRemovePlayer(item.id)}
          hitSlop={10}
          className="w-10 h-10 rounded-2xl bg-[#FF2D55]/10 border border-[#FF2D55]/30 items-center justify-center"
        >
          <Ionicons name="close" size={22} color="#FF2D55" />
        </Pressable>
      )}
    </View>
  );

  return (
    <GridBackground>
      <View className="flex-1">
        {/* Header */}
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
                Setup
              </Text>
              <Text className="text-white font-fredoka text-3xl tracking-tight">
                Players
              </Text>
            </View>
            <Pressable
              onPress={() => setShowSettings(!showSettings)}
              hitSlop={10}
              className="w-12 h-12 items-center justify-center rounded-2xl bg-white/10 border border-white/15"
            >
              <Ionicons name="settings-sharp" size={22} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Settings Summary Chips */}
        <View className="flex-row justify-center gap-3 px-6 mb-2">
          <View className="bg-white/10 px-3 py-1.5 rounded-full flex-row items-center">
            <Ionicons name="timer-outline" size={14} color="white" />
            <Text className="text-white/80 font-nunito text-xs ml-1.5">
              {formatDuration(state.timerSeconds)}
            </Text>
          </View>
          <View className="bg-white/10 px-3 py-1.5 rounded-full flex-row items-center">
            <Ionicons name="skull-outline" size={14} color="#FF2D55" />
            <Text className="text-white/80 font-nunito text-xs ml-1.5">
              {state.imposterCount} Imposter
              {state.imposterCount > 1 ? "s" : ""}
            </Text>
          </View>
          <View className="bg-white/10 px-3 py-1.5 rounded-full">
            <Text className="text-white/80 font-nunito text-xs">
              {state.players.length}/{MAX_PLAYERS}
            </Text>
          </View>
        </View>

        {/* Settings Panel (inline toggle) */}
        {showSettings && (
          <View className="mx-6 mb-3 p-4 bg-black/40 rounded-2xl border border-white/10">
            {/* Timer */}
            <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-3">
              Round Duration
            </Text>
            <View className="flex-row gap-2 mb-4">
              {TIMER_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.label}
                  onPress={() => handleTimerChange(opt.seconds)}
                  className={`flex-1 py-3 rounded-xl items-center border ${
                    state.timerSeconds === opt.seconds
                      ? "bg-[#7C5CFF] border-[#7C5CFF]"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <Text
                    className={`font-fredoka text-sm ${
                      state.timerSeconds === opt.seconds
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Imposter Count */}
            <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-3">
              Imposters
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleImposterCount(1)}
                className={`flex-1 py-3 rounded-xl items-center border ${
                  state.imposterCount === 1
                    ? "bg-[#FF2D55] border-[#FF2D55]"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <Text
                  className={`font-fredoka text-lg ${
                    state.imposterCount === 1 ? "text-white" : "text-white/60"
                  }`}
                >
                  1
                </Text>
              </Pressable>
              <Pressable
                onPress={() => canHaveTwoImposters && handleImposterCount(2)}
                disabled={!canHaveTwoImposters}
                className={`flex-1 py-3 rounded-xl items-center border ${
                  state.imposterCount === 2
                    ? "bg-[#FF2D55] border-[#FF2D55]"
                    : canHaveTwoImposters
                    ? "bg-white/5 border-white/10"
                    : "bg-white/5 border-white/5 opacity-40"
                }`}
              >
                <Text
                  className={`font-fredoka text-lg ${
                    state.imposterCount === 2 ? "text-white" : "text-white/60"
                  }`}
                >
                  2
                </Text>
              </Pressable>
            </View>
            {!canHaveTwoImposters && (
              <Text className="text-white/40 font-nunito text-xs mt-2 text-center">
                Need {MIN_PLAYERS_FOR_TWO_IMPOSTERS}+ players for 2 imposters
              </Text>
            )}
          </View>
        )}

        {/* Player List */}
        <View className="flex-1 px-6">
          <View className="mb-4">
            <Text className="text-white/65 font-nunito text-sm leading-5">
              Add at least{" "}
              <Text className="text-white font-nunito font-bold">
                {MIN_PLAYERS} players
              </Text>
              . Then pass the phone so everyone can reveal in secret.
            </Text>
          </View>
          <FlatList
            data={state.players}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 170 }}
          />
        </View>

        {/* Footer */}
        <FooterActions
          onAdd={handleAddPlayer}
          onContinue={handleStartRound}
          canAdd={state.players.length < MAX_PLAYERS}
          disabled={!canStart}
        />
      </View>
    </GridBackground>
  );
}

function FooterActions({
  onAdd,
  onContinue,
  canAdd,
  disabled,
}: {
  onAdd: () => void;
  onContinue: () => void;
  canAdd: boolean;
  disabled: boolean;
}) {
  const addPress = usePressScale(0.985);
  const goPress = usePressScale(0.98);

  return (
    <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4">
      <View className="bg-black/35 backdrop-blur-xl border border-white/10 rounded-[28px] p-4">
        <View className="flex-row items-center gap-3">
          <Animated.View style={addPress.style} className="flex-1">
            <Pressable
              onPress={onAdd}
              disabled={!canAdd}
              onPressIn={addPress.onPressIn}
              onPressOut={addPress.onPressOut}
              className={`h-[64px] rounded-[22px] items-center justify-center border-2 border-dashed ${
                canAdd ? "border-white/20 bg-white/5" : "border-white/10 bg-white/5 opacity-40"
              }`}
            >
              <Text className="text-white/70 font-fredoka text-lg">
                Add suspect
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={addPress.style}>
            <Pressable
              onPress={onAdd}
              disabled={!canAdd}
              onPressIn={addPress.onPressIn}
              onPressOut={addPress.onPressOut}
              className={`w-[64px] h-[64px] rounded-[22px] items-center justify-center bg-white/10 border border-white/15 ${
                !canAdd ? "opacity-40" : ""
              }`}
            >
              <Ionicons name="add" size={30} color="white" />
            </Pressable>
          </Animated.View>
        </View>

        <View className="h-3" />

        <Animated.View style={goPress.style}>
          <Pressable
            onPress={onContinue}
            disabled={disabled}
            onPressIn={goPress.onPressIn}
            onPressOut={goPress.onPressOut}
            className={`h-[64px] rounded-[22px] items-center justify-center overflow-hidden ${
              disabled ? "bg-white/20" : "bg-white"
            }`}
          >
            {!disabled && (
              <View className="absolute -inset-6 bg-[#FF2D55]/25 blur-2xl" />
            )}
            <Text
              className={`font-fredoka text-xl uppercase tracking-wide ${
                disabled ? "text-white/55" : "text-[#FF2D55]"
              }`}
            >
              {disabled ? `Need ${MIN_PLAYERS} players` : "Continue"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
