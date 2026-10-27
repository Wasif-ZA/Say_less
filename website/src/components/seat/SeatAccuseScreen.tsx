"use client";

import { useSeat } from "@/hooks/useSeat";
import { pickPrompt } from "@/lib/seat/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function SeatAccuseScreen() {
  const { state, dispatch } = useSeat();
  const isLast = state.round + 1 >= state.rounds;
  const seated = state.players.find((p) => p.id === state.top[0]);
  const guess = state.players.find((p) => p.id === state.accuse?.guessId);
  if (!seated) return null;

  return (
    <ScreenWrapper bgClassName="bg-seat">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{isLast ? "FINAL ROUND Â· DOUBLE" : `Round ${state.round + 1}`}</span>
        <h1 className="font-poster text-[34px] uppercase leading-tight mt-4 break-words">
          {state.accuse && guess
            ? state.accuse.hit
              ? `Busted! ${guess.name} voted for you`
              : "Wrong! Your secret haters stay hidden"
            : `${seated.name}, who put you here?`}
        </h1>
        {state.accuse?.hit && <p className="badge mt-3">+{isLast ? 4 : 2}</p>}
      </div>

      {!state.accuse && (
        <div className="grid grid-cols-2 gap-3 py-6">
          {state.players
            .filter((p) => p.id !== seated.id)
            .map((p, i) => (
              <button
                key={p.id}
                onClick={() => dispatch({ type: "ACCUSE", guessId: p.id })}
                className={`animate-fadeInUp stagger-${Math.min(i + 1, 6)} card-surface rounded-[20px] min-h-20 px-3 py-4 font-poster text-2xl uppercase leading-none break-words active:translate-x-0.5 active:translate-y-0.5`}
              >
                {p.name}
              </button>
            ))}
        </div>
      )}

      {state.accuse && (
        <div className="mt-auto pt-6">
          <button
            onClick={() => dispatch({ type: "NEXT_ROUND", promptIndex: pickPrompt(state.usedPrompts) })}
            className="btn-big btn-glass text-xl"
          >
            {isLast ? "SEE RESULTS" : "NEXT ROUND"}
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
