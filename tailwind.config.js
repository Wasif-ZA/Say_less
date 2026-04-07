module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "surface-900": "#0F0F1A",
        "surface-800": "#1A1A2E",
        "surface-700": "#252540",
        "surface-600": "#30304D",

        "accent-red": "#FF3B5C",
        "accent-blue": "#4A9EFF",
        "accent-green": "#34D399",
        "accent-amber": "#FBBF24",
        "accent-purple": "#A78BFA",

        "text-secondary": "#A1A1B5",
        "text-muted": "#6B6B80",

        // Keep legacy colors for GridBackground
        "game-pink": "#FF4757",
        "game-red": "#FF0033",
        "game-dark": "#1E1C2A",
        "game-blue": "#2E86DE",
        "game-gold": "#FFD700",
      },
      fontFamily: {
        fredoka: ["Fredoka_700Bold"],
        "fredoka-medium": ["Fredoka_500Medium"],
        nunito: ["Nunito_700Bold"],
        "nunito-semibold": ["Nunito_600SemiBold"],
      },
    },
  },
  plugins: [],
};
