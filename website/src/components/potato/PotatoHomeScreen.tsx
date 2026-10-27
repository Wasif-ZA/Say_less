"use client";

import { Art } from "@/components/Art";
import { usePotato } from "@/hooks/usePotato";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🥔", text: "The phone is the potato. A prompt pops up, like \"Name a fruit\"" },
  { emoji: "🗣️", text: "Say an answer, tap Pass, hand the phone on" },
  { emoji: "🔥", text: "A secret fuse goes off any time. Holding the phone? You get burnt" },
  { emoji: "🏆", text: "Fewest burns at the end wins" },
];

export function PotatoHomeScreen() {
  const { dispatch } = usePotato();

  return (
    <ScreenWrapper bgClassName="bg-potato">
      <div className="flex flex-col items-center text-center pt-14 animate-fadeInUp">
        <Art name="sticker-timer" className="w-32 h-32 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[60px] uppercase leading-[0.9]">
          Hot<br />Potato
        </h1>
        <p className="text-lg mt-3 max-w-[280px] font-semibold">Say it fast. Pass it faster.</p>
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
