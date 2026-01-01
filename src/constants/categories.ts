import { Category } from '../types';

export const CATEGORIES: Category[] = [
    {
        id: 'places',
        name: 'Places',
        emoji: '🌍',
        description: 'Cities, countries, and locations from around the world.',
        words: ['Tokyo', 'Paris', 'Beach', 'Cinema', 'Hospital', 'Library', 'School', 'Gym', 'Mars', 'Pyramids', 'Airport', 'Museum', 'Jungle', 'Desert'],
    },
    {
        id: 'animals',
        name: 'Animals',
        emoji: '🦁',
        description: 'From wild beasts to cute pets, how well do you know nature?',
        words: ['Lion', 'Elephant', 'Shark', 'Eagle', 'Panda', 'Snake', 'Dragon', 'Unicorn', 'Dolphin', 'Penguin', 'Tiger', 'Gorilla'],
    },
    {
        id: 'food',
        name: 'Food',
        emoji: '🍕',
        description: 'Delicious dishes, ingredients, and cuisines.',
        words: ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ice Cream', 'Curry', 'Salad', 'Ramen', 'Steak', 'Pancakes', 'Cheesecake'],
    },
    {
        id: 'sports',
        name: 'Sports',
        emoji: '⚽',
        description: 'From the pitch to the court, test your sports knowledge.',
        words: ['Football', 'Basketball', 'Tennis', 'Golf', 'Swimming', 'Boxing', 'Surfing', 'Skiing', 'Cricket', 'Rugby', 'Volleyball', 'Skateboarding'],
    },
    {
        id: 'spicy',
        name: 'Spicy',
        emoji: '🌶️',
        description: 'Chaotic, meme-worthy, and slightly unhinged topics.',
        words: ['Ghosting', 'Situationship', 'Red Flag', 'Main Character', 'Side Quest', 'NPC Energy', 'Ick', 'Beige Flag', 'Delulu', 'Rizz', 'Slay', 'Touch Grass'],
    },
];
