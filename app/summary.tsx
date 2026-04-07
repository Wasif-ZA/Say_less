import React, { useMemo, useRef } from "react";
import { Animated, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GridBackground } from "../src/components/GridBackground";
import { useGame } from "../src/context/GameContext";
import { useHaptics } from "../src/hooks/useHaptics";
import { tallyVotes } from "../src/game/engine";

function usePressScale(pressedScale = 0.98) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, { toValue: pressedScale, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  return { style: { transform: [{ scale }] }, onPressIn, onPressOut };
}

export default function SummaryScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const haptics = useHaptics();

  const result = useMemo(
    () => tallyVotes(state.votes, state.players),
    [state.votes, state.players]
  );

  const imposters = state.players.filter((p) => p.role === "imposter");
  const imposterNames = imposters.map((p) => p.name).join(" & ");

  // Fire haptic on mount based on result
  React.useEffect(() => {
    if (result.townWins) {
      haptics.success();
    } else {
      haptics.error();
    }
  }, []);

  const handlePlayAgain = () => {
    haptics.light();
    dispatch({ type: "PLAY_AGAIN" });
    router.replace("/reveal");
  };

  const handleChangeCategory = () => {
    haptics.light();
    dispatch({ type: "SET_PHASE", phase: "category" });
    router.replace("/category");
  };

  const handleNewGame = () => {
    haptics.light();
    dispatch({ type: "FULL_RESET" });
    router.replace("/");
  };

  const playAgainPress = usePressScale(0.98);
  const categoryPress = usePressScale(0.985);
  const newGamePress = usePressScale(0.985);

  return (
    <GridBackground variant={result.townWins ? "cool" : "danger"}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner Announcement */}
        <View className="items-center mb-6">
          {result.townWins ? (
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={56} color="#34D399" />
              <Text className="text-[#34D399] text-3xl font-fredoka uppercase tracking-tight mt-2">
                Town Wins!
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text style={{ fontSize: 50 }}>
                {"\u{1F575}\u{FE0F}"}
              </Text>
              <Text className="text-[#FF3B5C] text-3xl font-fredoka uppercase tracking-tight mt-2">
                Imposter Wins!
              </Text>
            </View>
          )}
        </View>

        {/* Imposter Reveal */}
        <View
          className={`mx-1 mb-4 p-5 rounded-2xl border ${
            result.townWins
              ? "bg-[#34D399]/10 border-[#34D399]/30"
              : "bg-[#FF3B5C]/10 border-[#FF3B5C]/30"
          }`}
        >
          <Text className="text-white/60 font-nunito text-xs uppercase tracking-widest text-center mb-1">
            The Imposter{imposters.length > 1 ? "s were" : " was"}
          </Text>
          <Text className="text-white font-fredoka text-2xl text-center">
            {imposterNames}
          </Text>
        </View>

        {/* Secret Word Reveal */}
        <View className="mx-1 mb-6 p-5 rounded-2xl border bg-white/5 border-white/10">
          <Text className="text-white/60 font-nunito text-xs uppercase tracking-widest text-center mb-1">
            The word was
          </Text>
          <Text className="text-white font-fredoka text-2xl text-center">
            {state.secretWord}
          </Text>
        </View>

        {/* Vote Breakdown */}
        {result.eliminatedId === null && state.votes.length > 0 && (
          <View className="mx-1 mb-4 p-4 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/30">
            <Text className="text-[#FBBF24] font-nunito font-bold text-sm text-center">
              It's a tie! No one was eliminated.
            </Text>
          </View>
        )}

        <View className="mx-1 mb-6">
          <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-3">
            Vote Breakdown
          </Text>
          {state.votes.map((vote, i) => {
            const voter = state.players.find((p) => p.id === vote.voterId);
            const target = state.players.find((p) => p.id === vote.targetId);
            return (
              <View
                key={i}
                className="flex-row items-center py-2 border-b border-white/5"
              >
                <Text className="text-white font-nunito font-bold flex-1">
                  {voter?.name}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/70 font-nunito flex-1 text-right">
                  {target?.name}
                </Text>
              </View>
            );
          })}
          {state.votes.length === 0 && (
            <Text className="text-white/40 font-nunito text-sm text-center">
              No votes were cast.
            </Text>
          )}
        </View>

        {/* Scoreboard */}
        {state.roundScores.length > 0 && (
          <View className="mx-1 mb-6">
            <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-3">
              Scoreboard
            </Text>
            <View className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <View className="flex-row py-2 px-4 border-b border-white/10">
                <Text className="text-white/40 font-nunito text-xs flex-1">
                  Round
                </Text>
                <Text className="text-white/40 font-nunito text-xs w-20 text-center">
                  Winner
                </Text>
              </View>
              {state.roundScores.map((score, i) => (
                <View
                  key={i}
                  className="flex-row py-2 px-4 border-b border-white/5"
                >
                  <Text className="text-white font-nunito font-bold flex-1">
                    Round {score.round}
                  </Text>
                  <Text
                    className={`font-nunito font-bold w-20 text-center ${
                      score.winningSide === "town"
                        ? "text-[#34D399]"
                        : "text-[#FF3B5C]"
                    }`}
                  >
                    {score.winningSide === "town" ? "Town" : "Imposter"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3 mt-2">
          <Animated.View style={playAgainPress.style}>
            <Pressable
              onPress={handlePlayAgain}
              onPressIn={playAgainPress.onPressIn}
              onPressOut={playAgainPress.onPressOut}
              className="w-full bg-[#4A9EFF] rounded-[24px] py-5 items-center justify-center"
            >
              <Text className="text-white font-fredoka text-xl uppercase tracking-wide">
                Play Again
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={categoryPress.style}>
            <Pressable
              onPress={handleChangeCategory}
              onPressIn={categoryPress.onPressIn}
              onPressOut={categoryPress.onPressOut}
              className="w-full bg-white/10 border border-white/15 rounded-[24px] py-4 items-center justify-center"
            >
              <Text className="text-white font-fredoka text-lg">
                Change Category
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={newGamePress.style}>
            <Pressable
              onPress={handleNewGame}
              onPressIn={newGamePress.onPressIn}
              onPressOut={newGamePress.onPressOut}
              className="w-full py-3 items-center justify-center"
            >
              <Text className="text-white/60 font-nunito text-base">
                New Game
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </GridBackground>
  );
}
