"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { ScreenWrapper } from "./ScreenWrapper";
import { HowToPlayModal } from "./HowToPlayModal";

export function HomeScreen() {
  const { dispatch } = useGame();
  const [showHTP, setShowHTP] = useState(false);

  return (
    <ScreenWrapper bgClassName="bg-grid-pattern">
      <div className="flex flex-col items-center justify-between flex-1 py-16">
        {/* Top spacer */}
        <div />

        {/* Center: Logo */}
        <div className="flex flex-col items-center text-center animate-slideDown">
          <div className="text-[110px] drop-shadow-2xl mb-4 animate-float">🕵️</div>
          <h1 className="font-display text-[56px] font-bold tracking-wide leading-[0.9] drop-shadow-lg">
            IMPOSTER
          </h1>
          <h1 className="font-display text-[56px] font-bold tracking-wide leading-[0.9] drop-shadow-lg">
            PARTY
          </h1>
          <p className="font-body text-white/60 text-lg mt-4 max-w-[240px] leading-snug animate-fadeInUp stagger-1">
            Find the imposter. Trust no one.
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
