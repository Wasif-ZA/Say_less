"use client";

import { Art } from "@/components/Art";
import { useGuess } from "@/hooks/useGuess";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🔢", text: "Each round is a trivia question with a number for an answer" },
  { emoji: "🤫", text: "Pass the phone round. Everyone locks in a guess in secret" },
  { emoji: "🎯", text: "Closest guess wins the round. Ties all win" },
  { emoji: "🎲", text: "Bet on yourself: All in triples your win but costs you points if someone is closer. Safe never loses" },
  { emoji: "🏆", text: "The last round counts double. Most points wins" },
];

export function GuessHomeScreen() {
  const { dispatch } = useGuess();

  return (
    <ScreenWrapper bgClassName="bg-guess">
      <div className="flex flex-col items-center text-center pt-14 animate-fadeInUp">
        <Art name="emote-spark" className="w-32 h-32 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[60px] uppercase leading-[0.9]">
          Rough<br />Guess
        </h1>
        <p className="text-lg mt-3 max-w-[280px] font-semibold">Nobody knows the answer. Get closest.</p>
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
