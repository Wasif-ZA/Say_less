import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { GridBackground } from "../src/components/GridBackground";
import { Ionicons } from "@expo/vector-icons";

const STEPS = [
  {
    icon: "\u{1F46B}",
    title: "Gather Your Friends",
    description: "3-10 players, one phone. Everyone sits in a circle.",
  },
  {
    icon: "\u{1F3AF}",
    title: "Pick a Category",
    description: "Choose from Places, Foods, Animals, Movies, or Occupations.",
  },
  {
    icon: "\u{1F92B}",
    title: "Get Your Secret Role",
    description:
      'Swipe up to reveal. Civilians see the word, the Imposter sees "IMPOSTER".',
  },
  {
    icon: "\u{1F5E3}\u{FE0F}",
    title: "Discuss & Describe",
    description: "Take turns describing the word. The Imposter must bluff!",
  },
  {
    icon: "\u{1F5F3}\u{FE0F}",
    title: "Vote to Eliminate",
    description:
      "When time runs out, vote for who you think the Imposter is.",
  },
  {
    icon: "\u{1F389}",
    title: "Reveal & Win",
    description:
      "Town wins if they catch the Imposter. Imposter wins if they survive!",
  },
];

export default function HowToPlayScreen() {
  const router = useRouter();

  return (
    <GridBackground>
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-white font-fredoka text-3xl">How to Play</Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Ionicons name="close" size={22} color="white" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {STEPS.map((step, index) => (
            <View
              key={index}
              className="bg-black/30 backdrop-blur-xl rounded-3xl p-5 mb-4 border border-white/10"
            >
              <View className="flex-row items-center mb-2">
                <Text style={{ fontSize: 32 }} className="mr-3">
                  {step.icon}
                </Text>
                <View className="flex-1">
                  <Text className="text-white/50 font-nunito text-xs uppercase tracking-widest">
                    Step {index + 1}
                  </Text>
                  <Text className="text-white font-fredoka text-xl">
                    {step.title}
                  </Text>
                </View>
              </View>
              <Text className="text-white/70 font-nunito text-base leading-6">
                {step.description}
              </Text>
            </View>
          ))}

          <View className="bg-[#A78BFA]/20 rounded-3xl p-5 mt-2 border border-[#A78BFA]/30">
            <Text className="text-[#A78BFA] font-fredoka text-lg mb-2">
              Pro Tips
            </Text>
            <Text className="text-white/70 font-nunito text-sm leading-5">
              {"\u2022"} Don't be too specific - the Imposter will copy you!
              {"\n"}
              {"\u2022"} Watch for hesitation and vague answers{"\n"}
              {"\u2022"} Imposters: ask questions to learn the word!
            </Text>
          </View>
        </ScrollView>
      </View>
    </GridBackground>
  );
}
