import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GridBackground } from '../src/components/GridBackground';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../src/constants/categories';
import { useGame } from '../src/context/GameContext';
import { Category } from '../src/types';

export default function CategorySelect() {
    const router = useRouter();
    const { updateSettings } = useGame();

    const handleSelectCategory = (categoryId: string) => {
        updateSettings({ category: categoryId });
        router.push('/lobby');
    };

    const renderCard = ({ item }: { item: Category }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleSelectCategory(item.id)}
            className="w-full bg-game-dark rounded-[32px] p-6 mb-5 flex-row items-center relative overflow-hidden h-40 border border-white/5 shadow-game"
        >
            {/* Left: Text Content */}
            <View className="flex-1 pr-4 z-10">
                <View className="flex-row items-center mb-1">
                    <Text className="text-white font-fredoka text-2xl mr-2 tracking-wide">
                        {item.name}
                    </Text>
                </View>
                <Text className="text-gray-400 font-nunito text-sm leading-5">
                    {item.description}
                </Text>
            </View>

            {/* Right: Visuals */}
            <View className="w-28 h-28 justify-center items-center">
                <Text style={{ fontSize: 70 }}>{item.emoji}</Text>
            </View>

            {/* Background Glow Effect */}
            <View className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-12" />
        </TouchableOpacity>
    );

    return (
        <GridBackground>
            {/* Header */}
            <View className="px-6 pt-6 pb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={32} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-fredoka text-3xl">Categories</Text>
                <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={32} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={CATEGORIES}
                renderItem={renderCard}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </GridBackground>
    );
}