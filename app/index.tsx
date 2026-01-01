import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { GridBackground } from "../src/components/GridBackground";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
    const router = useRouter();

    return (
        <GridBackground>
            <View className="flex-1 items-center justify-center p-6">

                {/* Brand */}
                <View className="items-center mb-16">
                    <Text className="text-white font-fredoka text-7xl tracking-tight">
                        SAY LESS
                    </Text>
                    <View className="mt-3 bg-white/10 border border-white/10 px-4 py-2 rounded-full">
                        <Text className="text-white/80 font-nunito font-bold uppercase tracking-[0.22em] text-xs">
                            One phone • One imposter • One word
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full gap-4">
                    <TouchableOpacity
                        onPress={() => router.push("/category")}
                        activeOpacity={0.9}
                        className="bg-white w-full py-5 rounded-3xl items-center shadow-xl shadow-black/20 flex-row justify-center space-x-3"
                    >
                        <Ionicons name="play" size={28} color="#FF3366" />
                        <Text className="text-pop-pink font-fredoka text-2xl">PLAY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/design-system")}
                        activeOpacity={0.9}
                        className="bg-white/10 w-full py-4 rounded-3xl items-center border border-white/10"
                    >
                        <Text className="text-white font-nunito text-base font-bold">
                            How to Play (soon)
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white/50 font-nunito text-sm mt-12">
                    v1.0.0 • Say Less
                </Text>
            </View>
        </GridBackground>
    );
}
