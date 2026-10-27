"use client";

import { useTune } from "@/hooks/useTune";
import { SPECTRUMS, dealRound, gameRounds } from "@/lib/tune/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { Dial } from "./Dial";

export function TuneRevealScreen() {
  const { state, dispatch } = useTune();
  const spectrum = SPECTRUMS[state.spectrumIndex];
  const isLast = state.round + 1 >= gameRounds(state.players, state.laps, state.bonusRounds);

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Round {state.round + 1} reveal</span>
        <h1 className="font-poster text-[40px] uppercase leading-none mt-4 break-words">&ldquo;{state.clue}&rdquo;</h1>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-bounceIn">
        <Dial spectrum={spectrum} target={state.target} needles={[{ value: state.guess }]} />
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-5 text-center animate-fadeInUp stagger-2">
        {state.roundBonus && <p className="font-poster text-2xl uppercase mb-2">Bullseye! Bonus round</p>}
        <p className="font-display text-3xl font-bold">+{state.roundPoints} this round</p>
        <p className="text-ink-2 font-semibold mt-1">Team total: {state.teamScore}</p>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_ROUND", deal: dealRound(state.usedSpectra) })}
          className="btn-big btn-white text-xl"
        >
          {isLast ? "SEE FINAL SCORE" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
