"use client";

import { useState } from "react";
import { PassCover } from "@/components/PassCover";
import { useGuess } from "@/hooks/useGuess";
import { QUESTIONS, parseGuess } from "@/lib/guess/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function GuessPickScreen() {
  const { state } = useGuess();
  return <GuessTurn key={`${state.round}-${state.guessTurn}`} />;
}

function GuessTurn() {
  const { state, dispatch } = useGuess();
  const [shown, setShown] = useState(false);
  const [text, setText] = useState("");
  const guesser = state.players[state.guessTurn];
  const question = QUESTIONS[state.questionIndex];
  const value = parseGuess(text);

  if (!shown) {
    return (
      <PassCover
        name={guesser.name}
        role={`Round ${state.round + 1} of ${state.rounds} · Guess ${state.guessTurn + 1} of ${state.players.length}`}
        hint="Guess in secret. Closest to the real number scores."
        onReady={() => setShown(true)}
      />
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-guess">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{guesser.name}</span>
        <h1 className="font-poster text-[30px] uppercase leading-tight mt-4 break-words">{question.q}</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 py-6">
        <input
          type="text"
          inputMode="decimal"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="0"
          aria-label="Your guess"
          className="card-surface rounded-[28px] w-full px-6 py-6 text-center font-poster text-[56px] leading-none"
        />
        {question.unit && <p className="text-center font-semibold text-lg">{question.unit}</p>}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => value !== null && dispatch({ type: "GUESS", playerId: guesser.id, value })}
          disabled={value === null}
          className={`btn-big btn-glass text-2xl ${value === null ? "opacity-30 pointer-events-none" : ""}`}
        >
          LOCK IN
        </button>
      </div>
    </ScreenWrapper>
  );
}
