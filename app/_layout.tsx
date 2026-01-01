import { Stack } from "expo-router";
import "../src/global.css";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "../src/context/GameContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, Fredoka_700Bold, Fredoka_500Medium } from "@expo-google-fonts/fredoka";
import { Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Fredoka_700Bold,
        Fredoka_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
    });

    if (!fontsLoaded) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GameProvider>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "fade",
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="category" />
                    <Stack.Screen name="lobby" />
                    <Stack.Screen name="reveal" />
                    <Stack.Screen name="game" />
                    <Stack.Screen name="summary" />
                </Stack>
            </GameProvider>
        </GestureHandlerRootView>
    );
}
