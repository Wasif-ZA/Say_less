"use client";

import { Art } from "@/components/Art";
import { useSneak } from "@/hooks/useSneak";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🤫", text: "Pass the phone round. Everyone gets a secret mission" },
  { emoji: "⏱️", text: "Start the clock and mingle. Pull your mission off without anyone noticing" },
  { emoji: "🕵️", text: "Think someone's on a mission? Call it out. Guess right and their mission is busted" },
  { emoji: "🏆", text: "Pulled it off +2. Busted someone +1. Most points wins" },
];

export function SneakHomeScreen() {
  const { dispatch } = useSneak();

  return (
    <ScreenWrapper bgClassName="bg-sneak">
      <div className="flex flex-col items-center text-center pt-14 animate-fadeInUp">
        <Art name="sticker-shh" className="w-32 h-32 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[60px] uppercase leading-[0.9]">Sneaky</h1>
        <p className="text-lg mt-3 max-w-[280px] font-semibold">Everyone has a secret mission. Don&apos;t get caught.</p>
      </div>

      <div className="flex flex-col gap-2 mt-8 animate-fadeInUp stagger-2">
        {RULES.map((rule) => (
          <div key={rule.text} className="card-surface rounded-[20px] px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{rule.emoji}</span>
            <p className="text-[15px] leading-snug">{rule.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <button onClick={() => dispatch({ type: "SET_PHASE", phase: "setup" })} className="btn-big btn-glass text-2xl">
          START GAME
        </button>
      </div>
    </ScreenWrapper>
  );
}
