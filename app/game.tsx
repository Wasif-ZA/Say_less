import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { GridBackground } from "../src/components/GridBackground";
import { useGame } from "../src/context/GameContext";
import * as Haptics from "expo-haptics";

export default function GameScreen() {
    const router = useRouter();
    const { settings, setGameState } = useGame();

    const [timeLeft, setTimeLeft] = useState(settings.roundDuration);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleEndRound = () => {
        setGameState("VOTE");
        router.push("/summary");
    };

    return (
        <GridBackground variant="danger">
            <View className="flex-1 items-center justify-center px-6 pt-10 pb-10">
                <View className="items-center mb-16">
                    <View className="bg-white/5 px-4 py-1 rounded-full border border-white/15 mb-8">
                        <Text className="text-white/70 text-xs font-nunito font-bold uppercase tracking-[0.22em]">
                            Interrogation Phase
                        </Text>
                    </View>

                    <Text
                        className={`text-8xl font-fredoka tracking-tight ${timeLeft < 10
                                ? "text-[#FF2D55] shadow-xl shadow-[#FF2D55]/30"
                                : "text-white"
                            }`}
                    >
                        {formatTime(timeLeft)}
                    </Text>

                    {timeLeft === 0 && (
                        <Text className="text-[#FF2D55] font-nunito font-bold text-xl mt-4">
                            TIME UP
                        </Text>
                    )}
                </View>

                <View className="w-full gap-3 absolute bottom-10 left-0 px-6">
                    <TouchableOpacity
                        onPress={() => setIsActive(!isActive)}
                        activeOpacity={0.9}
                        className="w-full bg-black/30 border border-white/20 rounded-[24px] py-5 items-center justify-center"
                    >
                        <Text className="text-white font-fredoka text-xl">
                            {isActive ? "Pause clock" : "Resume"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleEndRound}
                        activeOpacity={0.9}
                        className="w-full bg-white rounded-[24px] py-5 items-center justify-center shadow-game"
                    >
                        <Text className="text-[#FF2D55] font-fredoka text-xl uppercase">
                            Call vote
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GridBackground>
    );
}