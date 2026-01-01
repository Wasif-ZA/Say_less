import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Player } from "../types";
import { useGame } from "../context/GameContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AUTO_HIDE_DELAY = 5000; // 5 seconds

interface RevealCardProps {
    player: Player;
    onClose: () => void;
}

export const RevealCard = ({ player, onClose }: RevealCardProps) => {
    const translateY = useSharedValue(0);
    const revealed = useSharedValue(false);
    const { currentCategory } = useGame();

    // Determines visual style based on role
    const isImposter = player.role === "imposter";

    // Background Colors
    const revealColor = isImposter ? "#FF2D55" : "#2ECC71";

    // Different haptics for different roles
    const triggerHaptic = () => {
        if (isImposter) {
            // Heavy impact for imposter - more dramatic
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
            // Success notification for civilian
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    // Auto-hide after reveal for security
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // We'll use an interval to check the revealed state
        const checkInterval = setInterval(() => {
            if (revealed.value) {
                timeout = setTimeout(() => {
                    onClose();
                }, AUTO_HIDE_DELAY);
                clearInterval(checkInterval);
            }
        }, 100);

        return () => {
            clearInterval(checkInterval);
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            // Only allow dragging UP
            translateY.value = Math.min(event.translationY, 0);
        })
        .onEnd(() => {
            if (translateY.value < -SCREEN_HEIGHT * 0.15) {
                // Threshold reached - reveal!
                revealed.value = true;
                translateY.value = withSpring(-SCREEN_HEIGHT, { damping: 20, stiffness: 90 });
                runOnJS(triggerHaptic)();
            } else {
                // Reset
                translateY.value = withSpring(0);
            }
        });

    // The Blue "Cover" Card
    const coverStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View className="flex-1 overflow-hidden relative bg-black">

            {/* 1. THE REVEAL LAYER (Underneath) */}
            <View
                style={{ backgroundColor: revealColor }}
                className="absolute inset-0 items-center justify-center px-8 z-0"
            >
                {/* Imposter Icon / Civilian Icon */}
                <Ionicons
                    name={isImposter ? "skull" : "people"}
                    size={100}
                    color="rgba(0,0,0,0.2)"
                />

                <Text className="text-black/50 text-lg font-bold uppercase tracking-widest mt-6 mb-2">
                    {isImposter ? "SECRET ROLE" : "SECRET WORD"}
                </Text>

                {isImposter ? (
                    <View className="items-center">
                        <Text className="text-white font-fredoka text-6xl shadow-sm text-center">
                            IMPOSTER
                        </Text>
                        <Text className="text-white/70 font-nunito text-base mt-4 text-center px-8">
                            Blend in. Don't over-explain.
                        </Text>
                    </View>
                ) : (
                    <View className="items-center">
                        <Text className="text-white font-fredoka text-5xl text-center mb-2">
                            {player.word}
                        </Text>
                        {currentCategory && (
                            <View className="flex-row items-center mt-2 bg-black/20 px-4 py-2 rounded-full">
                                <Text className="text-white/90 font-nunito text-base">
                                    {currentCategory.emoji} {currentCategory.name}
                                </Text>
                            </View>
                        )}
                        <Text className="text-white/80 font-nunito font-bold text-xl uppercase tracking-wide mt-4">
                            CIVILIAN
                        </Text>
                    </View>
                )}

                <View className="absolute bottom-12 w-full px-8">
                    <Text
                        onPress={onClose}
                        className="text-white font-fredoka text-xl text-center bg-black/20 py-4 rounded-full overflow-hidden"
                    >
                        TAP TO CONTINUE
                    </Text>
                </View>
            </View>

            {/* 2. THE BLUE "PASS" LAYER (On Top) */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[coverStyle]}
                    className="absolute inset-0 bg-[#4A90E2] z-10 items-center justify-center"
                >
                    {/* Character / Avatar Placeholder */}
                    <View className="mb-12 rotate-6">
                        <Text style={{ fontSize: 120 }}>🤫</Text>
                    </View>

                    <Text className="text-white font-fredoka text-5xl mb-2 text-center shadow-sm">
                        {player.name}
                    </Text>

                    <Text className="text-white/80 font-nunito text-lg font-bold">
                        Pass the phone to {player.name}
                    </Text>

                    {/* Bottom Swipe UI */}
                    <View className="absolute bottom-16 items-center w-full">
                        <Text className="text-white font-fredoka text-2xl mb-2">
                            Swipe up to reveal
                        </Text>
                        <Text className="text-white font-fredoka text-xl mb-6">
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