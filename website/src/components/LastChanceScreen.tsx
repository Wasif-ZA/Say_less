"use client";

import { useState } from "react";
import { Art } from "@/components/Art";
import { useGame } from "@/hooks/useGame";
import { ScreenWrapper } from "./ScreenWrapper";

export function LastChanceScreen() {
  const { state, dispatch } = useGame();
  const [shown, setShown] = useState(false);
  const caught = state.players.find((p) => p.id === state.roundScores[state.roundScores.length - 1]?.eliminatedId);

  return (
    <ScreenWrapper bgClassName="bg-imposter">
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 animate-fadeInUp">
        <span className="clip-label">Caught!</span>
        <Art name="role-imposter" className="w-28 h-28" />
        <h1 className="font-poster text-[48px] uppercase leading-[0.95] break-words">
          {caught?.name ?? "Imposter"}, last chance
        </h1>
        <p className="text-[17px] font-semibold max-w-[300px] text-ink-2">
          Say your guess for the secret word out loud. Get it right and you steal the win.
        </p>
        {shown && (
          <div className="card-surface rounded-[24px] px-6 py-5 w-full animate-bounceIn">
            <p className="text-xs uppercase tracking-widest font-bold">The word was</p>
            <p className="font-poster text-[40px] uppercase leading-none mt-1 break-words">{state.secretWord}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-6">
        {shown ? (
          <div className="flex gap-3">
            <button onClick={() => dispatch({ type: "IMPOSTER_GUESS", correct: false })} className="btn-big btn-glass text-lg flex-1">
              Missed
            </button>
            <button onClick={() => dispatch({ type: "IMPOSTER_GUESS", correct: true })} className="btn-big btn-red text-lg flex-1">
              Got it
            </button>
          </div>
        ) : (
          <button onClick={() => setShown(true)} className="btn-big btn-white text-xl">
            THEY GUESSED. SHOW THE WORD
          </button>
        )}
      </div>
    </ScreenWrapper>
  );
}
