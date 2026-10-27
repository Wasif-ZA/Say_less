"use client";

import { useState } from "react";
import { Art } from "@/components/Art";
import { useTune } from "@/hooks/useTune";
import { ScreenWrapper } from "../ScreenWrapper";

const RULES = [
  { emoji: "🎯", text: "Each round one player is the Psychic. Only they see where the target sits on the dial" },
  { emoji: "🤐", text: "Say less: the Psychic gives one short clue, then hides the target and passes the phone" },
  { emoji: "🗣️", text: "Everyone else is one team. Argue it out loud, then set one needle together" },
  { emoji: "🏅", text: "Bullseye scores 4, close scores 3 or 2. All points go to the team" },
  { emoji: "🎁", text: "A bullseye earns a free bonus round, up to 3 per game. The final round counts double" },
  { emoji: "🏆", text: "Everyone is Psychic the same number of times. Beat your best team score" },
];

export function TuneHomeScreen() {
  const { dispatch } = useTune();
  const [showRules, setShowRules] = useState(false);

  if (showRules) {
    return (
      <ScreenWrapper bgClassName="bg-tune">
        <div className="flex items-center justify-between pt-14 mb-6">
          <h1 className="font-display text-3xl font-bold">How to Play</h1>
          <button
            onClick={() => setShowRules(false)}
            aria-label="Close rules"
            className="w-10 h-10 rounded-full border-[2.5px] border-ink bg-paper text-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-3 animate-fadeInUp">
          {RULES.map((rule) => (
            <div key={rule.text} className="card-surface rounded-[24px] p-4 flex items-center gap-4">
              <span className="text-3xl">{rule.emoji}</span>
              <p className="text-[15px] leading-snug">{rule.text}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-2 text-sm text-center mt-5 leading-relaxed">
          Example: the dial runs Cold to Hot. The target is far right. The Psychic says &quot;Lava&quot;.
        </p>
        <div className="mt-auto pt-6">
          <button
            onClick={() => { setShowRules(false); dispatch({ type: "SET_PHASE", phase: "setup" }); }}
            className="btn-big btn-glass text-xl"
          >
            GOT IT, LET&apos;S PLAY
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-tune">
      <div className="flex flex-col items-center justify-center flex-1 text-center animate-fadeInUp">
        <Art name="emote-spark" className="w-36 h-36 mb-2 animate-float" />
        <h1 className="animate-maskIn font-poster text-[56px] uppercase leading-[0.9]">
          On the<br />Dial
        </h1>
        <p className="text-ink-2 text-lg mt-3 max-w-[280px] font-semibold">
          One clue. One dial. How well do you know each other?
        </p>
        <div className="flex flex-col gap-3 w-full max-w-sm mt-12">
          <button onClick={() => dispatch({ type: "SET_PHASE", phase: "setup" })} className="btn-big btn-glass text-2xl">
            START GAME
          </button>
          <button onClick={() => setShowRules(true)} className="btn-big btn-ghost text-lg">
            How to Play
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
