"use client";

import { useState } from "react";
import { useTune } from "@/hooks/useTune";
import { SPECTRUMS, guessersFor, psychicFor } from "@/lib/tune/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { Dial } from "./Dial";
import { PassCover } from "./PassCover";

export function TuneGuessScreen() {
  const { state } = useTune();
  const guesser = guessersFor(state.players, state.round)[state.guessTurn];
  return <GuessTurn key={guesser.id} />;
}

function GuessTurn() {
  const { state, dispatch } = useTune();
  const [shown, setShown] = useState(false);
  const [value, setValue] = useState(50);
  const guessers = guessersFor(state.players, state.round);
  const guesser = guessers[state.guessTurn];
  const psychic = psychicFor(state.players, state.round);
  const spectrum = SPECTRUMS[state.spectrumIndex];

  if (!shown) {
    return (
      <PassCover
        name={guesser.name}
        role={`Guess ${state.guessTurn + 1} of ${guessers.length}`}
        hint="Set your needle in secret. No looking at anyone else's."
        onReady={() => setShown(true)}
      />
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-tune">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{guesser.name}</span>
        <p className="text-ink-2 font-semibold mt-4">{psychic.name}&apos;s clue</p>
        <h1 className="font-poster text-[48px] uppercase leading-none mt-1 break-words">&ldquo;{state.clue}&rdquo;</h1>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-fadeInUp">
        <Dial spectrum={spectrum} needles={[{ value }]} onChange={setValue} />
      </div>
      <p className="text-ink-2 text-sm text-center mt-3">Drag the dial or the slider.</p>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "LOCK_GUESS", playerId: guesser.id, value })}
          className="btn-big btn-glass text-xl"
        >
          LOCK IT IN
        </button>
      </div>
    </ScreenWrapper>
  );
}
