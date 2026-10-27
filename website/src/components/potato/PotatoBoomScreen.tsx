"use client";

import { useEffect } from "react";
import { Art } from "@/components/Art";
import { usePotato } from "@/hooks/usePotato";
import { dealPotato } from "@/lib/potato/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function PotatoBoomScreen() {
  const { state, dispatch } = usePotato();
  const burnt = state.players[state.holderIndex];
  const isLast = state.round + 1 >= state.rounds;

  useEffect(() => {
    navigator.vibrate?.([400, 100, 400]);
  }, []);

  return (
    <ScreenWrapper bgClassName="bg-ink">
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 animate-bounceIn">
        <Art name="emote-skull" className="w-32 h-32" />
        <h1 className="font-poster text-[80px] uppercase leading-none text-accent-red">Boom!</h1>
        <p className="text-xl font-semibold">
          <span className="text-accent-orange">{burnt.name}</span> got burnt
        </p>
        <p className="text-white/75">{state.passes} {state.passes === 1 ? "pass" : "passes"} this round</p>
      </div>

      <div className="card-surface rounded-[24px] p-5 animate-fadeInUp stagger-2">
        <div className="ruled flex flex-col">
          {state.players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2">
              <span className="flex-1 font-semibold truncate">{p.name}</span>
              <span className="font-bold">{"🔥".repeat(p.burns) || "0"}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: "NEXT_ROUND", deal: dealPotato(state.usedPrompts) })}
        className="btn-big btn-red text-xl mt-6"
      >
        {isLast ? "SEE RESULTS" : "NEXT ROUND"}
      </button>
    </ScreenWrapper>
  );
}
