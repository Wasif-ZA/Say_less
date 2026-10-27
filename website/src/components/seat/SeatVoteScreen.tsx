"use client";

import { useState } from "react";
import { PassCover } from "@/components/PassCover";
import { useSeat } from "@/hooks/useSeat";
import { PROMPTS } from "@/lib/seat/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function SeatVoteScreen() {
  const { state } = useSeat();
  return <VoteTurn key={`${state.round}-${state.voteTurn}`} />;
}

function VoteTurn() {
  const { state, dispatch } = useSeat();
  const [shown, setShown] = useState(false);
  const voter = state.players[state.voteTurn];
  const isLast = state.round + 1 >= state.rounds;

  if (!shown) {
    return (
      <PassCover
        name={voter.name}
        role={`${isLast ? "FINAL ROUND · DOUBLE" : `Round ${state.round + 1} of ${state.rounds}`} · Vote ${state.voteTurn + 1} of ${state.players.length}`}
        hint="Vote in secret. Who will the room pick?"
        onReady={() => setShown(true)}
      />
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-seat">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">{voter.name}</span>
        {isLast && <p className="badge mt-3">FINAL ROUND · DOUBLE</p>}
        <p className="text-lg font-semibold mt-4">Who is most likely to...</p>
        <h1 className="font-poster text-[34px] uppercase leading-tight mt-2 break-words">{PROMPTS[state.promptIndex]}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 py-6">
        {state.players.map((p, i) => (
          <button
            key={p.id}
            onClick={() => dispatch({ type: "VOTE", voterId: voter.id, targetId: p.id })}
            className={`animate-fadeInUp stagger-${Math.min(i + 1, 6)} card-surface rounded-[20px] min-h-20 px-3 py-4 font-poster text-2xl uppercase leading-none break-words active:translate-x-0.5 active:translate-y-0.5`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );
}
