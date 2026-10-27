"use client";

import { Art } from "@/components/Art";
import { useSeat } from "@/hooks/useSeat";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🪑", text: "Each round is a \"Who is most likely to...\" prompt" },
  { emoji: "🤫", text: "Pass the phone round. Vote for anyone, yourself included" },
  { emoji: "🔥", text: "Most votes takes the hot seat and wins the title" },
  { emoji: "🎯", text: "Voted for the hot seat? You read the room: 1 point (2 in the final round)" },
  { emoji: "🕵️", text: "Alone in the hot seat? Guess who voted for you: 2 points (4 in the final round)" },
];

export function SeatHomeScreen() {
  const { dispatch } = useSeat();

  return (
    <ScreenWrapper bgClassName="bg-seat">
      <div className="flex flex-col items-center text-center pt-14 animate-fadeInUp">
        <Art name="sticker-vote" className="w-32 h-32 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[60px] uppercase leading-[0.9]">
          Hot<br />Seat
        </h1>
        <p className="text-lg mt-3 max-w-[280px] font-semibold">Who is most likely to...? Your friends decide.</p>
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
