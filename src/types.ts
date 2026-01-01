export type Player = {
    id: string;
    name: string;
    role?: 'civ' | 'imposter';
    word?: string;
    isEliminated?: boolean;
};

export type GameState = 'LOBBY' | 'REVEAL' | 'DISCUSS' | 'VOTE' | 'SUMMARY';

export type GameSettings = {
    imposterCount: number;
    roundDuration: number; // in seconds
    category: string;
};

export type Category = {
    id: string;
    name: string;
    emoji: string;
    words: string[];
    description?: string;
};
