import { Stack } from "expo-router";
import "../src/global.css";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "../src/context/GameContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Fredoka_700Bold,
  Fredoka_500Medium,
} from "@expo-google-fonts/fredoka";
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
            animation: "fade_from_bottom",
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="index" options={{ gestureEnabled: true }} />
          <Stack.Screen name="howtoplay" options={{ presentation: "modal", gestureEnabled: true }} />
          <Stack.Screen name="category" options={{ gestureEnabled: true }} />
          <Stack.Screen name="players" options={{ gestureEnabled: true }} />
          <Stack.Screen name="reveal" options={{ gestureEnabled: false }} />
          <Stack.Screen name="discussion" options={{ gestureEnabled: false }} />
          <Stack.Screen name="voting" options={{ gestureEnabled: false }} />
          <Stack.Screen name="summary" options={{ gestureEnabled: false }} />
        </Stack>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
