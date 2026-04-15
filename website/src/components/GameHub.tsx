"use client";

import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter") => void;
}

export function GameHub({ onSelectGame }: GameHubProps) {
  return (
    <ScreenWrapper bgClassName="bg-dark-immersive">
      <div className="flex flex-col items-center justify-center flex-1 py-10 w-full animate-fadeInUp">
        <h1 className="font-display text-[56px] font-bold tracking-wide drop-shadow-lg mb-2">
          SAY LESS
        </h1>
        <p className="font-body text-white/50 text-lg mb-10">
          Pick a game to play
        </p>

        <div className="flex flex-col gap-5 w-full">
          {/* Imposter Party Card */}
          <button
            onClick={() => onSelectGame("imposter")}
            className="relative flex flex-col items-start p-6 w-full rounded-[16px] overflow-hidden shadow-xl transition-all duration-200 active:scale-95 hover:scale-[1.02]"
            style={{ backgroundColor: "#1E1E2E", minHeight: "140px" }}
          >
            <div className="text-4xl mb-2">🕵️</div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-2xl font-bold text-white">IMPOSTER PARTY</h2>
              <span className="bg-white/10 text-white/70 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1">Pass & Play</span>
            </div>
            <p className="text-white/70 text-left text-sm mt-auto w-full">
              Find the imposter.<br />
              Trust no one.<br />
              <span className="opacity-60 text-xs mt-1 block">3-10 players</span>
            </p>
          </button>

        </div>
      </div>
    </ScreenWrapper>
  );
}
