import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { GridBackground } from "../src/components/GridBackground";
import { Button } from "../src/components/ui/Button";
import { useGame } from "../src/context/GameContext";
import { Ionicons } from "@expo/vector-icons";

export default function SummaryScreen() {
    const router = useRouter();
    const { players, resetGame } = useGame();

    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const imposter = players.find((p) => p.role === "imposter");

    const handleVote = () => {
        if (!selectedPlayerId) return;
        setIsRevealed(true);
    };

    const handlePlayAgain = () => {
        resetGame();
        router.dismissAll();
        router.replace('/');
    };

    const renderPlayer = ({ item }: { item: any }) => (
        <TouchableOpacity
            disabled={isRevealed}
            onPress={() => setSelectedPlayerId(item.id)}
            className={`flex-row items-center p-4 rounded-2xl mb-3 border ${
                selectedPlayerId === item.id
                    ? "bg-white/10 border-[#7C5CFF] shadow-sm shadow-[#7C5CFF]/30"
                    : "bg-white/5 border-white/10"
            }`}
        >
            <View
                className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                    selectedPlayerId === item.id ? "bg-[#7C5CFF]" : "bg-white/10"
                }`}
            >
                <Text className="text-white font-fredoka text-lg">
                    {item.name.charAt(0)}
                </Text>
            </View>

            <Text
                className={`text-lg font-nunito font-semibold flex-1 ${
                    selectedPlayerId === item.id ? "text-white" : "text-white/70"
                }`}
            >
                {item.name}
            </Text>

            {isRevealed && (
                item.role === "imposter" ? (
                    <View className="bg-[#FF2D55]/10 px-3 py-1 rounded-full border border-[#FF2D55]/60">
                        <Text className="text-[#FF2D55] text-xs font-nunito font-bold tracking-[0.18em]">
                            IMPOSTER
                        </Text>
                    </View>
                ) : (
                    <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/40">
                        <Text className="text-emerald-400 text-xs font-nunito font-bold tracking-[0.18em]">
                            CIVILIAN
                        </Text>
                    </View>
                )
            )}

            {!isRevealed && selectedPlayerId === item.id && (
                <Ionicons name="finger-print" size={24} color="#7C5CFF" />
            )}
        </TouchableOpacity>
    );

    return (
        <GridBackground variant={isRevealed ? "cool" : "danger"}>
            <View className="flex-1 px-6 pt-6 pb-8">
                <View className="items-center mb-6">
                    <Text className="text-xs font-nunito font-bold text-white/60 uppercase tracking-[0.22em] mb-2">
                        {isRevealed ? "Mission Report" : "Elimination Protocol"}
                    </Text>
                    <Text className="text-3xl font-fredoka text-white tracking-tight">
                        {isRevealed ? "Game Over" : "Vote to eliminate"}
                    </Text>
                </View>

                {isRevealed && (
                    <View
                        className={`mx-1 mb-8 p-6 rounded-2xl border ${
                            selectedPlayerId === imposter?.id
                                ? "bg-emerald-500/10 border-emerald-500/40"
                                : "bg-[#FF2D55]/10 border-[#FF2D55]/40"
                        }`}
                    >
                        {selectedPlayerId === imposter?.id ? (
                            <View className="items-center">
                                <Ionicons
                                    name="checkmark-circle"
                                    size={40}
                                    color="#10b981"
                                    style={{ marginBottom: 8 }}
                                />
                                <Text className="text-emerald-400 text-2xl font-fredoka uppercase tracking-tight">
                                    Town Victory
                                </Text>
                            </View>
                        ) : (
                            <View className="items-center">
                                <Ionicons
                                    name="warning"
                                    size={40}
                                    color="#f43f5e"
                                    style={{ marginBottom: 8 }}
                                />
                                <Text className="text-[#FF2D55] text-2xl font-fredoka uppercase tracking-tight">
                                    Imposter Wins
                                </Text>
                            </View>
                        )}
                        <Text className="text-white/70 mt-2 text-center text-sm font-nunito">
                            The Imposter was {" "}
                            <Text className="text-white font-nunito font-bold">{imposter?.name}</Text>
                        </Text>
                    </View>
                )}

                <FlatList
                    data={players}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPlayer}
                    className="flex-1 px-1"
                    showsVerticalScrollIndicator={false}
                />

                <View className="pt-6">
                    {!isRevealed ? (
                        <Button
                            title="Confirm vote"
                            onPress={handleVote}
                            disabled={!selectedPlayerId}
                            variant="danger"
                        />
                    ) : (
                        <Button
                            title="Play again"
                            onPress={handlePlayAgain}
                            variant="primary"
                            className="bg-white"
                            textClassName="text-black"
                        />
                    )}
                </View>
            </View>
        </GridBackground>
    );
}