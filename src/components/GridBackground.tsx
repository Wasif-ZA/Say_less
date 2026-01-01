import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type GridBackgroundVariant = "dark" | "primary" | "icon" | "danger" | "blue" | "cool";

interface GridBackgroundProps {
    variant?: GridBackgroundVariant;
    children: React.ReactNode;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
    variant = "dark",
    children,
}) => {
    // Exact gradient from screenshots
    const getColors = () => {
        switch (variant) {
            case "primary":
            case "blue":
            case "cool":
                return ["#4facfe", "#00f2fe"] as const;
            case "danger":
                return ["#FF2D55", "#8F001A"] as const; // Very dark red end for contrast
            case "dark":
            default:
                return ["#FF5E78", "#FF004D"] as const; // Lighter Pink -> Dark Red
        }
    };

    const colors = getColors();

    const backgroundClass =
        (variant === "primary" || variant === "blue" || variant === "cool")
            ? "bg-indigo-950"
            : variant === "danger"
                ? "bg-[#1B0205]"
                : "bg-black";

    return (
        <View className={backgroundClass}>
            {/* 1. Base Gradient */}
            <LinearGradient
                colors={colors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            {/* 2. Sharp Grid Pattern */}
            {/* We create a grid using repeating views. This is cleaner than opacity hacks. */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <View style={styles.gridContainer}>
                    {/* Vertical Lines */}
                    {Array.from({ length: Math.floor(width / 40) + 1 }).map((_, i) => (
                        <View key={`v-${i}`} style={[styles.line, styles.vLine, { left: i * 40 }]} />
                    ))}
                    {/* Horizontal Lines */}
                    {Array.from({ length: Math.floor(height / 40) + 1 }).map((_, i) => (
                        <View key={`h-${i}`} style={[styles.line, styles.hLine, { top: i * 40 }]} />
                    ))}
                </View>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 1,
        opacity: 0.15, // Subtle white lines
    },
    line: {
        position: 'absolute',
        backgroundColor: 'white',
    },
    vLine: {
        width: 1,
        height: '100%',
    },
    hLine: {
        height: 1,
        width: '100%',
    }
});