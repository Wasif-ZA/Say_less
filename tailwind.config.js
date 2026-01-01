// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // The background gradient colors
        'game-pink': '#FF4757',
        'game-red': '#FF0033',

        // The Card/Input background (Deep Blue/Purple)
        'game-dark': '#1E1C2A',

        // Accents
        'game-blue': '#2E86DE', // For specific roles
        'game-gold': '#FFD700', // For stars
        'game-overlay': 'rgba(0,0,0,0.4)',
      },
      fontFamily: {
        fredoka: ['Fredoka_700Bold'],
        nunito: ['Nunito_700Bold'], // Using Bold for body to match game feel
      },
      boxShadow: {
        'game': '0 4px 0px 0px rgba(0,0,0,0.2)', // The "Hard" shadow seen in games
      }
    },
  },
  plugins: [],
};