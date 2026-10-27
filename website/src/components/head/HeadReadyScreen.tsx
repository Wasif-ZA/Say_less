"use client";

import { useHead } from "@/hooks/useHead";
import { getCategoryById } from "@/lib/wordbanks";
import { unlockSound } from "@/lib/sound";
import { ScreenWrapper } from "../ScreenWrapper";

export function HeadReadyScreen() {
  const { state, dispatch } = useHead();
  const guesser = state.players[state.turn % state.players.length];
  const category = getCategoryById(state.categoryId);

  return (
    <ScreenWrapper bgClassName="bg-head">
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 animate-fadeInUp">
        <span className="clip-label">Turn {state.turn + 1} of {state.players.length * state.laps}</span>
        <p className="text-lg font-semibold mt-2">Pass the phone to</p>
        <h1 className="font-poster text-[60px] uppercase leading-none break-words px-4">{guesser.name}</h1>
        <p className="badge mt-2">{category?.emoji} {category?.name}</p>
        <p className="text-lg font-semibold mt-4 max-w-[300px]">
          Tap start, then hold the phone on your forehead, screen facing out. You get {state.turnSeconds} seconds.
        </p>
      </div>
      <button onClick={() => { unlockSound(); dispatch({ type: "BEGIN_TURN" }); }} className="btn-big btn-glass text-2xl mt-6">
        START
      </button>
    </ScreenWrapper>
  );
}
