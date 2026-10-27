"use client";

import { useTune } from "@/hooks/useTune";
import { SPECTRUMS, dealRound, guessersFor, psychicFor } from "@/lib/tune/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { Dial } from "./Dial";

const NEEDLE_COLORS = ["#2b4bdb", "#0b0d12", "#7a3cff", "#1f8a4c", "#c2187a", "#5a4a00"];

export function TuneRevealScreen() {
  const { state, dispatch } = useTune();
  const psychic = psychicFor(state.players, state.round);
  const guessers = guessersFor(state.players, state.round);
  const spectrum = SPECTRUMS[state.spectrumIndex];
  const isLast = state.round + 1 >= state.players.length * state.laps;

  const needles = guessers.map((g, i) => ({
    value: state.guesses[g.id],
    label: g.name.slice(0, 8),
    color: NEEDLE_COLORS[i % NEEDLE_COLORS.length],
  }));

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Round {state.round + 1} reveal</span>
        <h1 className="font-poster text-[40px] uppercase leading-none mt-4 break-words">&ldquo;{state.clue}&rdquo;</h1>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-bounceIn">
        <Dial spectrum={spectrum} target={state.target} needles={needles} />
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-5 animate-fadeInUp stagger-2">
        <div className="ruled flex flex-col">
          {guessers.map((g, i) => (
            <div key={g.id} className="flex items-center gap-3 py-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: NEEDLE_COLORS[i % NEEDLE_COLORS.length] }} />
              <span className="flex-1 font-semibold truncate">{g.name}</span>
              <span className="font-bold">+{state.roundPoints[g.id]}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 py-2.5">
            <span className="text-sm">🔮</span>
            <span className="flex-1 font-semibold truncate">{psychic.name} (Psychic)</span>
            <span className="font-bold">+{state.roundPoints[psychic.id]}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_ROUND", deal: dealRound(state.usedSpectra) })}
          className="btn-big btn-white text-xl"
        >
          {isLast ? "SEE FINAL SCORES" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
