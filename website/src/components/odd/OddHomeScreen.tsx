"use client";

import { Art } from "@/components/Art";
import { useOdd } from "@/hooks/useOdd";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🤔", text: "Each round is a this or that, like Beach or Mountains" },
  { emoji: "🤫", text: "Pass the phone round. Everyone picks in secret" },
  { emoji: "👥", text: "Picked what most people picked? You score a point" },
  { emoji: "🙃", text: "The odd one out gets nothing. Most points wins" },
];

export function OddHomeScreen() {
  const { dispatch } = useOdd();

  return (
    <ScreenWrapper bgClassName="bg-odd">
      <div className="flex flex-col items-center text-center pt-14 animate-fadeInUp">
        <Art name="sticker-vote" className="w-32 h-32 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[60px] uppercase leading-[0.9]">
          Odd One<br />Out
        </h1>
        <p className="text-lg mt-3 max-w-[280px] font-semibold">Think like your friends. Don&apos;t be the weird one.</p>
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
