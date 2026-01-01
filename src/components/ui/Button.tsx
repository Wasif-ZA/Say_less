import React from "react";
import { Text, TouchableOpacity, View, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "dark" | "icon" | "danger" | "secondary" | "outline";
    iconName?: keyof typeof Ionicons.glyphMap;
    // className is already covered by TouchableOpacityProps? No, usually native-wind or react-native doesn't have className in standard props unless configured. But here it is passed explicitly.
    className?: string;
    textClassName?: string;
}

export function Button({ onPress, title, variant = "primary", iconName, className, textClassName, ...props }: ButtonProps) {

    // 1. Primary: White background, Pink text (The "Play" button)
    if (variant === "primary") {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                className={`w-full bg-white rounded-[24px] py-5 items-center justify-center shadow-game ${className}`}
                {...props}
            >
                <Text className={`text-game-pink font-fredoka text-2xl uppercase tracking-wide ${textClassName}`}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    // New: Danger Variant
    if (variant === "danger") {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                className={`w-full bg-[#FF2D55] rounded-[24px] py-5 items-center justify-center shadow-game ${className}`}
                {...props}
            >
                <Text className={`text-white font-fredoka text-2xl uppercase tracking-wide ${textClassName}`}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    // 2. Dark: Dark Purple background (The Settings buttons)
    if (variant === "dark") {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                className={`w-full bg-game-dark rounded-[24px] p-6 mb-4 ${className}`}
                {...props}
            >
                <View className="flex-row justify-between items-center mb-2">
                    <Text className={`text-white font-fredoka text-xl ${textClassName}`}>{title}</Text>
                    {iconName && <Ionicons name={iconName} size={24} color="white" />}
                </View>
                {/* Simulated content for the "Settings" look - Only show if it's meant to be a settings button? 
                    For now, leaving as is to avoid breaking lobby, but users of variant="dark" elsewhere (like game.tsx) might get this extra UI. 
                */}
                <View className="flex-row items-center justify-center space-x-4 mt-2">
                    <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                        <Ionicons name="remove" size={24} color="white" />
                    </View>
                    <Text className="text-white font-fredoka text-2xl">1</Text>
                    <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center">
                        <Ionicons name="add" size={24} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // Fallback?
    return null;
}