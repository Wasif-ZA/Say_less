"use client";

import { usePotato } from "@/hooks/usePotato";
import { PROMPTS } from "@/lib/potato/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function PotatoReadyScreen() {
  const { state, dispatch } = usePotato();
  const starter = state.players[state.holderIndex];

  return (
    <ScreenWrapper bgClassName="bg-potato">
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 animate-fadeInUp">
        <span className="clip-label">Round {state.round + 1} of {state.rounds}</span>
        <p className="text-lg font-semibold mt-2">This round</p>
        <div className="card-surface rounded-[24px] px-6 py-8 w-full">
          <h1 className="font-poster text-[44px] uppercase leading-none">{PROMPTS[state.promptIndex]}</h1>
        </div>
        <p className="text-lg font-semibold mt-4 max-w-[300px]">
          {starter.name} goes first. No repeats. Stall too long and the group can make you pass.
        </p>
      </div>
      <button onClick={() => dispatch({ type: "LIGHT_FUSE" })} className="btn-big btn-glass text-2xl mt-6">
        🔥 LIGHT THE FUSE
      </button>
    </ScreenWrapper>
  );
}
