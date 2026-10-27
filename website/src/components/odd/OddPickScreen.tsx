"use client";

import { useState } from "react";
import { PassCover } from "@/components/PassCover";
import { useOdd } from "@/hooks/useOdd";
import { PROMPTS, isFinalRound } from "@/lib/odd/engine";
import type { OddChoice } from "@/lib/odd/types";
import { ScreenWrapper } from "../ScreenWrapper";

export function OddPickScreen() {
  const { state } = useOdd();
  return <PickTurn key={`${state.round}-${state.pickTurn}`} />;
}

function PickTurn() {
  const { state, dispatch } = useOdd();
  const [shown, setShown] = useState(false);
  const picker = state.players[state.pickTurn];
  const options = PROMPTS[state.promptIndex];
  const final = isFinalRound(state.round, state.rounds);
  const twist = [state.contrarian && "Contrarian round", final && "Double points"].filter(Boolean).join(" · ");

  if (!shown) {
    return (
      <PassCover
        name={picker.name}
        role={twist || `Round ${state.round + 1} of ${state.rounds} · Pick ${state.pickTurn + 1} of ${state.players.length}`}
        hint={state.contrarian ? "Twist! This round the smaller side scores. Pick what fewest people will pick." : "Pick in secret. What will everyone else choose?"}
        onReady={() => setShown(true)}
      />
    );
  }

  const pick = (choice: OddChoice) => dispatch({ type: "PICK", playerId: picker.id, choice });

  return (
    <ScreenWrapper bgClassName="bg-odd">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{picker.name}</span>
        <p className="text-lg font-semibold mt-4">
          {state.contrarian ? "Contrarian! Pick the one fewest people will pick" : "Pick the one most people will pick"}
        </p>
        {twist && <span className="badge mt-2 bg-hot">{twist}</span>}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 py-6">
        <button
          onClick={() => pick(0)}
          className="animate-fadeInUp stagger-1 card-surface rounded-[28px] min-h-36 px-6 py-8 font-poster text-[40px] uppercase leading-none active:translate-x-0.5 active:translate-y-0.5"
        >
          {options[0]}
        </button>
        <p className="text-center font-poster text-2xl" aria-hidden>or</p>
        <button
          onClick={() => pick(1)}
          className="animate-fadeInUp stagger-2 card-surface rounded-[28px] min-h-36 px-6 py-8 font-poster text-[40px] uppercase leading-none active:translate-x-0.5 active:translate-y-0.5"
        >
          {options[1]}
        </button>
      </div>
    </ScreenWrapper>
  );
}
