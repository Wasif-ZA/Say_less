import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export const ScreenContainer = ({ children, className = "", noPadding = false }: ScreenContainerProps) => {
    return (
        <SafeAreaView className={`flex-1 ${className}`}>
            <View className={`flex-1 ${noPadding ? "" : "px-6 py-4"}`}>{children}</View>
        </SafeAreaView>
    );
};
