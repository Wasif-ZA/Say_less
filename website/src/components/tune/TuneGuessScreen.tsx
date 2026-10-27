"use client";

import { useState } from "react";
import { useTune } from "@/hooks/useTune";
import { SPECTRUMS, gameRounds } from "@/lib/tune/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { Dial } from "./Dial";

export function TuneGuessScreen() {
  const { state, dispatch } = useTune();
  const [value, setValue] = useState(50);
  const spectrum = SPECTRUMS[state.spectrumIndex];
  const isFinal = state.round + 1 >= gameRounds(state.players, state.laps, state.bonusRounds);

  return (
    <ScreenWrapper bgClassName="bg-tune">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{isFinal ? "FINAL ROUND · DOUBLE" : "Team, talk it out"}</span>
        {isFinal && <p className="font-poster text-2xl uppercase mt-3">Team, talk it out</p>}
        <h1 className="font-poster text-[48px] uppercase leading-none mt-4 break-words">&ldquo;{state.clue}&rdquo;</h1>
        <p className="text-ink-2 font-semibold mt-3">Argue out loud, then set one needle together</p>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-fadeInUp">
        <Dial spectrum={spectrum} needles={[{ value }]} onChange={setValue} />
      </div>
      <p className="text-ink-2 text-sm text-center mt-3">Drag the dial or the slider.</p>

      <div className="mt-auto pt-6">
        <button onClick={() => dispatch({ type: "LOCK_GUESS", value })} className="btn-big btn-glass text-xl">
          LOCK IT IN
        </button>
      </div>
    </ScreenWrapper>
  );
}
