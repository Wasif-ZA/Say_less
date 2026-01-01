import { Player, Category } from '../types';

export const assignRoles = (players: Player[], imposterCount: number, category: Category): Player[] => {
    const shuffledPlayers = [...players];
    // Simple shuffle
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }

    // Select random word
    const secretWord = category.words[Math.floor(Math.random() * category.words.length)];

    return shuffledPlayers.map((player, index) => {
        const isImposter = index < imposterCount;
        return {
            ...player,
            role: (isImposter ? 'imposter' : 'civ') as Player['role'],
            word: isImposter ? undefined : secretWord,
        };
    }).sort((a, b) => a.id.localeCompare(b.id)); // Restore order if needed or keep shuffled? usually players pass device so order matters. 
    // keeping shuffled order for reveal order is fun, or we can just randomize roles on the original list.
    // Implementation plan says "randomly assigns".
};

export const generateInitialPlayers = (count: number = 3): Player[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: String(i + 1),
        name: `Player ${i + 1}`,
    }));
};
