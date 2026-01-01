import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../src/context/GameContext';
import { RevealCard } from '../src/components/RevealCard';

export default function RevealScreen() {
    const router = useRouter();
    const { players, currentPlayerIndex, nextPlayer, setGameState } = useGame();

    const currentPlayer = players[currentPlayerIndex];

    const handleCardClose = () => {
        const hasMore = nextPlayer();
        if (!hasMore) {
            // All players have seen their roles, move to discussion/timer
            setGameState('DISCUSS');
            router.push('/game');
        }
    };

    if (!currentPlayer) {
        // Safety fallback
        router.replace('/');
        return null;
    }

    return (
        <View className="flex-1">
            {/* Back button overlay */}
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-14 left-6 z-50"
            >
                <Ionicons name="arrow-back" size={32} color="white" />
            </TouchableOpacity>

            {/* The reveal card takes up the full screen */}
            <RevealCard
                player={currentPlayer}
                onClose={handleCardClose}
            />
        </View>
    );
}