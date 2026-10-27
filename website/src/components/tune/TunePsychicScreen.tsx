"use client";

import { useState } from "react";
import { useTune } from "@/hooks/useTune";
import { SPECTRUMS, psychicFor } from "@/lib/tune/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { Dial } from "./Dial";
import { PassCover } from "./PassCover";

export function TunePsychicScreen() {
  const { state, dispatch } = useTune();
  const [shown, setShown] = useState(false);
  const [clue, setClue] = useState("");
  const psychic = psychicFor(state.players, state.round);
  const spectrum = SPECTRUMS[state.spectrumIndex];
  const total = state.players.length * state.laps;

  if (!shown) {
    return (
      <PassCover
        name={psychic.name}
        role={`Round ${state.round + 1} of ${total} · Psychic`}
        hint="Only the Psychic looks. Everyone else, eyes off the screen."
        onReady={() => setShown(true)}
      />
    );
  }

  const ready = clue.trim().length > 0;

  return (
    <ScreenWrapper bgClassName="bg-tune">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Psychic · {psychic.name}</span>
        <p className="text-ink-2 font-semibold mt-4">The target is here. Give a clue that lands on it.</p>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-fadeInUp">
        <Dial spectrum={spectrum} target={state.target} />
      </div>

      <div className="mt-6 animate-fadeInUp stagger-2">
        <label htmlFor="clue" className="block font-bold text-lg mb-2">Your clue</label>
        <input
          id="clue"
          value={clue}
          onChange={(e) => setClue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && ready) dispatch({ type: "SET_CLUE", clue }); }}
          maxLength={40}
          autoComplete="off"
          placeholder="Say less. A word or two."
          className="w-full rounded-2xl border-[2.5px] border-ink bg-paper px-4 py-3 text-lg font-semibold placeholder:text-ink-2/60"
        />
        <p className="text-ink-2 text-sm mt-2">Say it out loud too. Then hit hide before you pass the phone.</p>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "SET_CLUE", clue })}
          disabled={!ready}
          className={`btn-big btn-glass text-xl ${ready ? "" : "opacity-40"}`}
        >
          HIDE THE TARGET
        </button>
      </div>
    </ScreenWrapper>
  );
}
