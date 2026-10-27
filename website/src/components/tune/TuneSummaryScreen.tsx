"use client";

import { useEffect, useState } from "react";
import { Art } from "@/components/Art";
import { useTune } from "@/hooks/useTune";
import { dealRound, gameRounds, maxScore, verdictFor } from "@/lib/tune/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";

const BEST_KEY = "tune_best";

export function TuneSummaryScreen({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useTune();
  const count = String(state.players.length);
  const max = maxScore(gameRounds(state.players, state.laps, state.bonusRounds));
  const [isNewBest] = useState(
    () => state.teamScore > (loadFromStorage<Record<string, number>>(BEST_KEY, {})[count] ?? 0)
  );

  useEffect(() => {
    if (!isNewBest) return;
    saveToStorage(BEST_KEY, { ...loadFromStorage<Record<string, number>>(BEST_KEY, {}), [count]: state.teamScore });
  }, [isNewBest, count, state.teamScore]);

  return (
    <ScreenWrapper bgClassName="bg-tune">
      <div className="text-center pt-14 pb-5 animate-bounceIn">
        <div className="flex justify-center mb-2"><Art name="emote-spark" className="w-24 h-24" /></div>
        <h1 className="font-poster text-[44px] uppercase leading-tight break-words">{verdictFor(state.teamScore, max)}</h1>
        <p className="text-ink-2 font-semibold mt-2">
          {state.teamScore} out of {max} points
        </p>
        {isNewBest && <p className="font-poster text-2xl uppercase mt-3">New best!</p>}
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6 animate-fadeInUp stagger-3">
        <button onClick={() => dispatch({ type: "START_GAME", deal: dealRound([]) })} className="btn-big btn-glass text-xl">
          PLAY AGAIN
        </button>
        <button
          onClick={() => { dispatch({ type: "FULL_RESET" }); dispatch({ type: "SET_PHASE", phase: "setup" }); }}
          className="btn-big btn-glass text-base"
        >
          Change Players
        </button>
        <button onClick={onExit} className="btn-big btn-ghost text-base">
          Exit to Games
        </button>
      </div>
    </ScreenWrapper>
  );
}
