import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameSettings, GameState, Category } from '../types';
import { assignRoles, generateInitialPlayers } from '../utils/gameLogic';
import { CATEGORIES } from '../constants/categories';

interface GameContextType {
    players: Player[];
    settings: GameSettings;
    gameState: GameState;
    currentCategory: Category | null;
    currentPlayerIndex: number;
    addPlayer: () => void;
    removePlayer: (id: string) => void;
    renamePlayer: (id: string, name: string) => void;
    updateSettings: (newSettings: Partial<GameSettings>) => void;
    startGame: (categoryId?: string) => void;
    setGameState: (state: GameState) => void;
    nextPlayer: () => boolean; // Returns true if there are more players
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>(generateInitialPlayers(4));
    const [settings, setSettings] = useState<GameSettings>({
        imposterCount: 1,
        roundDuration: 120, // 2 minutes
        category: 'places',
    });
    const [gameState, setGameState] = useState<GameState>('LOBBY');
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const addPlayer = () => {
        setPlayers((prev) => [
            ...prev,
            { id: Date.now().toString(), name: `Player ${prev.length + 1}` },
        ]);
    };

    const removePlayer = (id: string) => {
        if (players.length <= 3) return; // Minimum players
        setPlayers((prev) => prev.filter((p) => p.id !== id));
    };

    const renamePlayer = (id: string, name: string) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name } : p))
        );
    };

    const updateSettings = (newSettings: Partial<GameSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const startGame = (categoryId?: string) => {
        const catId = categoryId || settings.category;
        const category = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
        setCurrentCategory(category);

        const assignedPlayers = assignRoles(players, settings.imposterCount, category);
        setPlayers(assignedPlayers);
        setCurrentPlayerIndex(0); // Reset to first player

        setGameState('REVEAL');
    };

    const nextPlayer = () => {
        if (currentPlayerIndex < players.length - 1) {
            setCurrentPlayerIndex(prev => prev + 1);
            return true; // More players remaining
        }
        return false; // No more players
    };

    const resetGame = () => {
        setGameState('LOBBY');
        setCurrentPlayerIndex(0);
        // Clear roles
        setPlayers((prev) => prev.map((p) => ({ ...p, role: undefined, word: undefined })));
    };

    return (
        <GameContext.Provider
            value={{
                players,
                settings,
                gameState,
                currentCategory,
                currentPlayerIndex,
                addPlayer,
                removePlayer,
                renamePlayer,
                updateSettings,
                startGame,
                setGameState,
                nextPlayer,
                resetGame,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
