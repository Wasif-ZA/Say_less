import React, { useState } from "react";
import { TextInput, View, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
    containerClassName?: string;
}

export function Input({ containerClassName = "", ...props }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View
            className={[
                "w-full rounded-full border px-6 py-4 mb-3", // Pill shape
                // Deep purple background like the screenshots (#1e1b2e)
                "bg-[#1e1b2e]",
                isFocused ? "border-white/40" : "border-white/10",
                containerClassName,
            ].join(" ")}
        >
            <TextInput
                {...props}
                placeholderTextColor="rgba(255,255,255,0.4)"
                className="text-white text-xl font-nunito font-bold" // Increased size for legibility
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
            />
        </View>
    );
}