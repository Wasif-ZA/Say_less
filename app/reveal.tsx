import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../src/context/GameContext";
import { RevealCard } from "../src/components/RevealCard";
import { getCategoryById } from "../src/data/categories";

export default function RevealScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();

  const currentPlayer = state.players[state.currentRevealIndex];
  const category = state.categoryId ? getCategoryById(state.categoryId) : null;

  if (!currentPlayer || !category) {
    router.replace("/");
    return null;
  }

  const handleRevealed = () => {
    // card was revealed - nothing to do yet
  };

  const handleDismissed = () => {
    const nextIndex = state.currentRevealIndex + 1;
    dispatch({ type: "ADVANCE_REVEAL" });

    if (nextIndex >= state.players.length) {
      dispatch({ type: "SET_PHASE", phase: "discussion" });
      router.replace("/discussion");
    }
  };

  return (
    <View className="flex-1">
      <RevealCard
        playerName={currentPlayer.name}
        role={currentPlayer.role || "civilian"}
        secretWord={state.secretWord || ""}
        categoryEmoji={category.emoji}
        onRevealed={handleRevealed}
        onDismissed={handleDismissed}
      />
    </View>
  );
}
