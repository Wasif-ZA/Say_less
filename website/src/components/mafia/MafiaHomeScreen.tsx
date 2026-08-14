"use client";

import { useState } from "react";
import { useMafia } from "@/hooks/useMafia";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🌙", text: "Every night the Mafia secretly picks a victim" },
  { emoji: "🩺", text: "The Doctor can save a life, the Detective can investigate" },
  { emoji: "☀️", text: "Each morning the town wakes up and debates" },
  { emoji: "🗳️", text: "Vote to eliminate the player you suspect" },
  { emoji: "🏆", text: "Town wins by voting out all Mafia. Mafia wins by outnumbering the town" },
];

interface MafiaHomeScreenProps {
  onExit: () => void;
}

export function MafiaHomeScreen({ onExit }: MafiaHomeScreenProps) {
  const { dispatch } = useMafia();
  const [showRules, setShowRules] = useState(false);

  if (showRules) {
    return (
      <ScreenWrapper bgClassName="bg-dark-immersive">
        <div className="flex items-center justify-between pt-2 mb-6">
          <h1 className="font-display text-3xl font-bold tracking-wide drop-shadow-md">How to Play</h1>
          <button
            onClick={() => setShowRules(false)}
            className="w-10 h-10 rounded-full bg-white/10 text-white text-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-3 animate-fadeInUp">
          {RULES.map((rule, i) => (
            <div key={i} className="card-surface border border-white/10 rounded-[20px] p-4 flex items-center gap-4">
              <span className="text-3xl">{rule.emoji}</span>
              <p className="font-body text-white/80 text-[15px] leading-snug">{rule.text}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-white/35 text-sm text-center mt-5 leading-relaxed">
          One phone, passed around. Everyone takes a turn at night — even civilians —
          so nobody can tell who&apos;s doing what. 🤫
        </p>
        <div className="mt-auto pt-6">
          <button
            onClick={() => { setShowRules(false); dispatch({ type: "SET_PHASE", phase: "setup" }); }}
            className="btn-big btn-white text-xl w-full"
          >
            GOT IT — LET&apos;S PLAY
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-dark-immersive">
      <div className="flex flex-col items-center justify-center flex-1 text-center animate-fadeInUp">
        <div className="text-[90px] mb-2 drop-shadow-[0_0_40px_rgba(255,51,102,0.35)]">🌃</div>
        <h1 className="font-display text-[56px] font-bold tracking-wide drop-shadow-lg leading-none">
          MAFIA
        </h1>
        <p className="font-body text-white/50 text-lg mt-3 max-w-[280px]">
          The town sleeps. The Mafia doesn&apos;t.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm mt-12">
          <button
            onClick={() => dispatch({ type: "SET_PHASE", phase: "setup" })}
            className="btn-big btn-red text-2xl"
          >
            START GAME
          </button>
          <button onClick={() => setShowRules(true)} className="btn-big btn-glass text-lg">
            How to Play
          </button>
          <button onClick={onExit} className="btn-big btn-ghost text-base">
            ‹ Back to Games
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
