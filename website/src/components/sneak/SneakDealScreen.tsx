"use client";

import { useState } from "react";
import { PassCover } from "@/components/PassCover";
import { useSneak } from "@/hooks/useSneak";
import { MISSIONS } from "@/lib/sneak/engine";
import { unlockSound } from "@/lib/sound";
import { ScreenWrapper } from "../ScreenWrapper";

export function SneakDealScreen() {
  const { state } = useSneak();
  return <DealTurn key={`${state.round}-${state.dealTurn}`} />;
}

function DealTurn() {
  const { state, dispatch } = useSneak();
  const [shown, setShown] = useState(false);
  const player = state.players[state.dealTurn];
  const isLast = state.dealTurn + 1 >= state.players.length;

  if (!shown) {
    return (
      <PassCover
        name={player.name}
        role={`Round ${state.round} · Mission ${state.dealTurn + 1} of ${state.players.length}`}
        hint="Your mission is secret. Don't let anyone see the screen."
        onReady={() => setShown(true)}
      />
    );
  }

  function next() {
    if (!isLast) return dispatch({ type: "NEXT_DEAL" });
    unlockSound();
    dispatch({ type: "START_LIVE" });
  }

  return (
    <ScreenWrapper bgClassName="bg-sneak">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{player.name}</span>
        <p className="text-lg font-semibold mt-4">Your secret mission</p>
      </div>

      <div className="flex-1 flex flex-col justify-center py-6">
        <div className="animate-fadeInUp card-surface rounded-[28px] min-h-36 px-6 py-8 font-poster text-[34px] uppercase leading-tight text-center break-words">
          {MISSIONS[state.missions[player.id]]}
        </div>
      </div>

      <button onClick={next} className="btn-big btn-white text-xl">
        {isLast ? "START THE CLOCK" : "GOT IT, HIDE"}
      </button>
      {isLast && <p className="text-center text-white/75 text-sm mt-3">Tapping this starts the timer for everyone.</p>}
    </ScreenWrapper>
  );
}
