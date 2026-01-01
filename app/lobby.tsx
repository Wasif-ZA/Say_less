import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GridBackground } from '../src/components/GridBackground';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../src/context/GameContext';
import { Player } from '../src/types';

export default function Lobby() {
    const router = useRouter();
    const { players, addPlayer, removePlayer, renamePlayer, startGame } = useGame();

    const handleContinue = () => {
        startGame(); // Assigns roles and sets up game
        router.push('/reveal');
    };

    const renderPlayer = ({ item, index }: { item: Player, index: number }) => (
        <View className="w-full bg-game-dark rounded-full h-[72px] flex-row items-center px-6 mb-3 border border-white/5">
            {/* Player Icon/Number */}
            <View className="mr-4">
                <Ionicons name="person" size={20} color="rgba(255,255,255,0.3)" />
            </View>

            {/* Input */}
            <TextInput
                className="flex-1 text-white font-nunito text-xl font-bold pt-1"
                value={item.name}
                onChangeText={(t) => renamePlayer(item.id, t)}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor="rgba(255,255,255,0.3)"
            />

            {/* Delete Action */}
            {players.length > 3 && (
                <TouchableOpacity onPress={() => removePlayer(item.id)}>
                    <Ionicons name="close" size={24} color="#FF4757" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <GridBackground>
            <View className="flex-1 px-6 pt-6">

                {/* Header */}
                <View className="flex-row items-center justify-center mb-8 relative">
                    <TouchableOpacity onPress={() => router.back()} className="absolute left-0">
                        <Ionicons name="arrow-back" size={32} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-fredoka text-3xl">Players</Text>
                    <TouchableOpacity className="absolute right-0">
                        <Ionicons name="settings-sharp" size={28} color="white" />
                    </TouchableOpacity>
                </View>

                {/* List */}
                <FlatList
                    data={players}
                    renderItem={renderPlayer}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

                {/* Footer Actions */}
                <View className="mb-8 w-full flex-row items-center space-x-3">
                    <TouchableOpacity
                        onPress={addPlayer}
                        className="flex-1 bg-game-dark h-[72px] rounded-full items-center justify-center border-2 border-dashed border-white/20"
                    >
                        <Text className="text-white/50 font-fredoka text-lg">Add player</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={addPlayer}
                        className="w-[72px] h-[72px] bg-game-dark rounded-full items-center justify-center border border-white/10"
                    >
                        <Ionicons name="add" size={32} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Main CTA */}
                <TouchableOpacity
                    onPress={handleContinue}
                    className="w-full bg-white rounded-[24px] py-5 items-center justify-center mb-4 shadow-game"
                >
                    <Text className="text-game-pink font-fredoka text-2xl uppercase">Continue</Text>
                </TouchableOpacity>
            </View>
        </GridBackground>
    );
}