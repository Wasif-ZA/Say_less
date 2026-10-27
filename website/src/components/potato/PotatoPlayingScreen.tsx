"use client";

import { useEffect, useRef, useState } from "react";
import { usePotato } from "@/hooks/usePotato";
import { PROMPTS } from "@/lib/potato/engine";

const PASS_LOCK_MS = 350;

export function PotatoPlayingScreen() {
  const { state, dispatch } = usePotato();
  const [hurry, setHurry] = useState(false);
  const lastPass = useRef(0);
  const holder = state.players[state.holderIndex];
  const next = state.players[(state.holderIndex + 1) % state.players.length];

  useEffect(() => {
    const boom = setTimeout(() => dispatch({ type: "EXPLODE" }), state.fuseMs);
    const fast = setTimeout(() => setHurry(true), state.fuseMs * 0.7);
    return () => { clearTimeout(boom); clearTimeout(fast); };
  }, [state.fuseMs, dispatch]);

  function pass() {
    const now = Date.now();
    if (now - lastPass.current < PASS_LOCK_MS) return;
    lastPass.current = now;
    dispatch({ type: "PASS" });
  }

  return (
    <div className="bg-potato fixed inset-0 flex flex-col select-none">
      <div className="max-w-lg mx-auto w-full px-5 pt-20 text-center">
        <p className="font-semibold">{PROMPTS[state.promptIndex]}</p>
        <p className="text-sm font-semibold mt-6 opacity-80">Holding the potato</p>
        <h1 key={holder.id} className="font-poster text-[64px] uppercase leading-none mt-1 break-words animate-bounceIn">
          {holder.name}
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div
          className="animate-tick text-[120px] leading-none"
          style={{ animationDuration: hurry ? "0.35s" : "1s" }}
          aria-hidden
        >
          🥔
        </div>
      </div>

      <button
        onClick={pass}
        className="mx-5 mb-8 h-40 rounded-[32px] border-[3px] border-ink bg-paper text-ink shadow-[5px_5px_0_#0b0d12] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#0b0d12] transition-transform max-w-lg sm:mx-auto sm:w-full"
      >
        <span className="block font-poster text-[48px] uppercase leading-none">Said it! Pass</span>
        <span className="block font-semibold mt-2">to {next.name} →</span>
      </button>
    </div>
  );
}
