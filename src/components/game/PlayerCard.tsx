import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlayerCardProps {
    title: string;
    subtitle: string;
    icon?: string; // Emoji char
    color?: string; // Icon bg color
    locked?: boolean;
    onPress?: () => void;
}

export function PlayerCard({
    title,
    subtitle,
    icon = "🎲",
    color = "#FF3366",
    locked = false,
    onPress
}: PlayerCardProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className="w-full bg-[#1e1b2e] rounded-[32px] p-5 mb-4 flex-row items-center border border-white/5 relative overflow-hidden"
        >
            {/* Left Content */}
            <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-1">
                    <Text className="text-white font-fredoka text-2xl mr-2">
                        {title}
                    </Text>
                    {locked && <Ionicons name="lock-closed" size={16} color="#666" />}
                </View>
                <Text className="text-white/50 font-nunito text-sm leading-5">
                    {subtitle}
                </Text>
            </View>

            {/* Right Visual (Emoji/Icon) */}
            <View className="w-24 h-24 items-center justify-center relative">
                {/* Decorative Circle behind */}
                <View
                    style={{ backgroundColor: color, opacity: 0.2 }}
                    className="absolute w-20 h-20 rounded-full"
                />
                <Text style={{ fontSize: 60 }}>{icon}</Text>
            </View>

            {/* Star Badge (optional styling touch from screenshots) */}
            {!locked && (
                <View className="absolute top-4 right-4">
                    <Ionicons name="star" size={16} color="#FFD700" />
                </View>
            )}
        </TouchableOpacity>
    );
}