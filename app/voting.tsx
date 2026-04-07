import React, { useRef, useState } from "react";
import { Animated, FlatList, Modal, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GridBackground } from "../src/components/GridBackground";
import { useGame } from "../src/context/GameContext";
import { useHaptics } from "../src/hooks/useHaptics";
import type { Player } from "../src/game/types";

function usePressScale(pressedScale = 0.985) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, { toValue: pressedScale, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };
  return { style: { transform: [{ scale }] }, onPressIn, onPressOut };
}

export default function VotingScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const haptics = useHaptics();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentVoter = state.players[state.currentVoterIndex];
  if (!currentVoter) {
    dispatch({ type: "FINISH_VOTING" });
    router.replace("/summary");
    return null;
  }

  const votableePlayers = state.players.filter(
    (p) => p.id !== currentVoter.id
  );

  const handleSelectPlayer = (id: string) => {
    haptics.selection();
    setSelectedId(id);
  };

  const handleConfirmVote = () => {
    if (!selectedId) return;
    haptics.medium();
    dispatch({ type: "CAST_VOTE", voterId: currentVoter.id, targetId: selectedId });
    dispatch({ type: "ADVANCE_VOTER" });

    const nextIndex = state.currentVoterIndex + 1;
    if (nextIndex >= state.players.length) {
      dispatch({ type: "FINISH_VOTING" });
      router.replace("/summary");
    } else {
      setSelectedId(null);
      setShowConfirm(false);
    }
  };

  const selectedPlayer = state.players.find((p) => p.id === selectedId);

  const renderVoteCard = ({ item }: { item: Player }) => {
    const selected = selectedId === item.id;
    return (
      <VoteCard
        player={item}
        selected={selected}
        onPress={() => handleSelectPlayer(item.id)}
      />
    );
  };

  const goPress = usePressScale(0.98);

  return (
    <GridBackground>
      <View className="flex-1 px-6 pt-6 pb-8">
        {/* Header */}
        <View className="items-center mb-2">
          <Text className="text-xs font-nunito font-bold text-white/60 uppercase tracking-[0.22em] mb-1">
            Pass to
          </Text>
          <Text className="text-3xl font-fredoka text-white tracking-tight">
            {currentVoter.name}
          </Text>
          <Text className="text-white/60 font-nunito text-sm mt-1">
            Who is the Imposter?
          </Text>
          <View className="bg-white/10 px-3 py-1 rounded-full mt-2">
            <Text className="text-white/60 font-nunito text-xs">
              Vote {state.currentVoterIndex + 1} of {state.players.length}
            </Text>
          </View>
        </View>

        {/* Player List */}
        <FlatList
          data={votableePlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderVoteCard}
          className="flex-1 mt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Vote Button */}
        <View className="absolute bottom-8 left-6 right-6">
          <Animated.View style={goPress.style}>
            <Pressable
              onPress={() => {
                if (selectedId) setShowConfirm(true);
              }}
              disabled={!selectedId}
              onPressIn={goPress.onPressIn}
              onPressOut={goPress.onPressOut}
              className={`h-[64px] rounded-[22px] items-center justify-center overflow-hidden ${
                selectedId ? "bg-white" : "bg-white/20"
              }`}
            >
              {selectedId && (
                <View className="absolute -inset-6 bg-[#FF2D55]/25 blur-2xl" />
              )}
              <Text
                className={`font-fredoka text-xl uppercase tracking-wide ${
                  selectedId ? "text-[#FF2D55]" : "text-white/55"
                }`}
              >
                {selectedId
                  ? `Vote for ${selectedPlayer?.name}`
                  : "Select a player"}
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirm(false)}
        >
          <Pressable
            className="flex-1 bg-black/70 items-center justify-center"
            onPress={() => setShowConfirm(false)}
          >
            <Pressable
              className="bg-[#1A1A2E] rounded-3xl p-6 mx-8 w-[85%] items-center border border-white/10"
              onPress={(e) => e.stopPropagation()}
            >
              <Ionicons name="warning" size={40} color="#FF3B5C" />
              <Text className="text-white font-fredoka text-xl mt-3 text-center">
                Vote for {selectedPlayer?.name}?
              </Text>
              <Text className="text-white/60 font-nunito text-sm mt-2 text-center">
                This cannot be undone.
              </Text>
              <View className="flex-row gap-3 mt-6 w-full">
                <Pressable
                  onPress={() => setShowConfirm(false)}
                  className="flex-1 py-4 rounded-2xl items-center border border-white/10 bg-white/5"
                >
                  <Text className="text-white font-fredoka text-lg">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmVote}
                  className="flex-1 py-4 rounded-2xl items-center bg-[#FF3B5C]"
                >
                  <Text className="text-white font-fredoka text-lg">
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </GridBackground>
  );
}

function VoteCard({
  player,
  selected,
  onPress,
}: {
  player: Player;
  selected: boolean;
  onPress: () => void;
}) {
  const press = usePressScale(selected ? 0.99 : 0.985);

  return (
    <Animated.View style={press.style}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        className={`flex-row items-center p-4 rounded-2xl mb-3 border overflow-hidden ${
          selected
            ? "bg-white/10 border-[#FF3B5C] shadow-lg shadow-[#FF3B5C]/20"
            : "bg-white/5 border-white/10"
        }`}
      >
        {selected && (
          <View className="absolute -inset-6 bg-[#FF3B5C]/10 blur-2xl" />
        )}

        <View
          className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
            selected ? "bg-[#FF3B5C]" : "bg-white/10"
          }`}
        >
          <Text className="text-white font-fredoka text-lg">
            {player.name.charAt(0)}
          </Text>
        </View>

        <Text
          className={`text-lg font-nunito font-semibold flex-1 ${
            selected ? "text-white" : "text-white/70"
          }`}
        >
          {player.name}
        </Text>

        {selected && (
          <Ionicons name="checkmark-circle" size={24} color="#FF3B5C" />
        )}
      </Pressable>
    </Animated.View>
  );
}
