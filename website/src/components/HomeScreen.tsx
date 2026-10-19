"use client";

import { line, useMountSeed } from "@/lib/lines";
import { Art } from "@/components/Art";
import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { ScreenWrapper } from "./ScreenWrapper";
import { HowToPlayModal } from "./HowToPlayModal";

interface HomeScreenProps {
  onExit?: () => void;
}

export function HomeScreen({ onExit }: HomeScreenProps) {
  const { dispatch } = useGame();
  const [showHTP, setShowHTP] = useState(false);
  const seed = useMountSeed();

  return (
    <ScreenWrapper bgClassName="bg-imposter">
      {onExit && (
        <button 
          onClick={onExit} 
          className="absolute top-6 left-5 text-white/70 hover:text-white transition-colors flex items-center z-10 font-bold"
        >
          ← Back
        </button>
      )}
      <div className="flex flex-col items-center justify-between flex-1 py-16">
        {/* Top spacer */}
        <div />

        {/* Center: Logo */}
        <div className="flex flex-col items-center text-center animate-slideDown">
          <Art name="role-imposter" className="w-40 h-40 mb-4 animate-float" />
          <h1 className="font-poster text-[56px] font-normal uppercase tracking-wide leading-[0.9] drop-shadow-lg">
            IMPOSTER
          </h1>
          <h1 className="font-poster text-[56px] font-normal uppercase tracking-wide leading-[0.9] drop-shadow-lg">
            PARTY
          </h1>
          <p className="font-body text-white/75 text-lg mt-4 max-w-[240px] leading-snug animate-fadeInUp stagger-1">
            {line("imposterHome", seed)}
          </p>
        </div>

        {/* Bottom: Actions */}
        <div className="flex flex-col gap-3 w-full animate-fadeInUp stagger-2">
          <button
            onClick={() => dispatch({ type: "SET_PHASE", phase: "category" })}
            className="btn-big btn-white text-2xl"
          >
            PLAY
          </button>
          <button
            onClick={() => setShowHTP(true)}
            className="btn-big btn-glass text-xl"
            style={{ height: 56 }}
          >
            How to Play
          </button>
        </div>
      </div>
      {showHTP && <HowToPlayModal onClose={() => setShowHTP(false)} />}
    </ScreenWrapper>
  );
}
