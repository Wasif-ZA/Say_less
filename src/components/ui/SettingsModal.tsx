import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../../context/GameContext";
import {
  TIMER_OPTIONS,
  MIN_PLAYERS_FOR_TWO_IMPOSTERS,
} from "../../constants/game";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ visible, onClose }: SettingsModalProps) => {
  const { state, dispatch } = useGame();

  const [duration, setDuration] = useState<number | null>(state.timerSeconds);
  const [imposterCount, setImposterCount] = useState<1 | 2>(
    state.imposterCount
  );

  const canHaveTwoImposters =
    state.players.length >= MIN_PLAYERS_FOR_TWO_IMPOSTERS;

  const handleSave = () => {
    dispatch({ type: "SET_TIMER", seconds: duration });
    dispatch({ type: "SET_IMPOSTER_COUNT", count: imposterCount });
    onClose();
  };

  const handleImposterChange = (count: 1 | 2) => {
    if (count === 2 && !canHaveTwoImposters) return;
    setImposterCount(count);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/70 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-[#1A1825] rounded-t-[32px] px-6 pt-6 pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-white font-fredoka text-2xl">Settings</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </Pressable>
          </View>

          <View className="mb-8">
            <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-4">
              Round Duration
            </Text>
            <View className="flex-row gap-3">
              {TIMER_OPTIONS.map((option) => (
                <Pressable
                  key={option.label}
                  onPress={() => setDuration(option.seconds)}
                  className={`flex-1 py-4 rounded-2xl items-center border ${
                    duration === option.seconds
                      ? "bg-[#7C5CFF] border-[#7C5CFF]"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <Text
                    className={`font-fredoka text-lg ${
                      duration === option.seconds
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-white/60 font-nunito font-bold text-xs uppercase tracking-widest mb-4">
              Number of Imposters
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => handleImposterChange(1)}
                className={`flex-1 py-4 rounded-2xl items-center border ${
                  imposterCount === 1
                    ? "bg-[#FF2D55] border-[#FF2D55]"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <Text
                  className={`font-fredoka text-xl ${
                    imposterCount === 1 ? "text-white" : "text-white/60"
                  }`}
                >
                  1
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleImposterChange(2)}
                disabled={!canHaveTwoImposters}
                className={`flex-1 py-4 rounded-2xl items-center border ${
                  imposterCount === 2
                    ? "bg-[#FF2D55] border-[#FF2D55]"
                    : canHaveTwoImposters
                    ? "bg-white/5 border-white/10"
                    : "bg-white/5 border-white/5 opacity-40"
                }`}
              >
                <Text
                  className={`font-fredoka text-xl ${
                    imposterCount === 2 ? "text-white" : "text-white/60"
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

          <Pressable
            onPress={handleSave}
            className="w-full bg-white rounded-2xl py-5 items-center"
          >
            <Text className="text-[#FF2D55] font-fredoka text-xl uppercase">
              Save
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
