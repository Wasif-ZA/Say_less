"use client";

import { useState } from "react";
import { useMafia } from "@/hooks/useMafia";
import { alivePlayers } from "@/lib/mafia/engine";
import { ScreenWrapper } from "../ScreenWrapper";
import { AVATAR_BG } from "./roleMeta";

export function MafiaDayScreen() {
  const { state, dispatch } = useMafia();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const alive = alivePlayers(state.players);
  const selectedPlayer = alive.find((p) => p.id === selectedId);

  if (confirming && selectedPlayer) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5 text-center animate-bounceIn">
          <div className="text-[80px]">⚖️</div>
          <h2 className="font-display text-[36px] font-bold leading-tight">
            Eliminate<br />{selectedPlayer.name}?
          </h2>
          <p className="font-body text-white/40 text-base max-w-[260px]">
            The town has spoken. No take-backs.
          </p>
        </div>
        <div className="flex gap-3 w-full max-w-sm mt-10 animate-fadeInUp stagger-2">
          <button onClick={() => setConfirming(false)} className="btn-big btn-glass text-lg flex-1" style={{ height: 60 }}>
            Back
          </button>
          <button
            onClick={() => dispatch({ type: "DAY_VOTE", targetId: selectedPlayer.id })}
            className="btn-big btn-red text-lg flex-1"
            style={{ height: 60 }}
          >
            Eliminate
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-grid-pattern">
      {/* Header */}
      <div className="pt-4 pb-4 text-center animate-slideDown">
        <p className="font-display font-bold text-white/40 tracking-widest uppercase text-sm mb-1">
          ☀️ Day {state.round}
        </p>
        <h1 className="font-display text-[38px] font-bold tracking-wide drop-shadow-lg leading-tight">
          Who&apos;s the<br />Mafia?
        </h1>
        <p className="font-body text-white/50 mt-2 text-base">
          Debate, then tap the player everyone agrees on
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-40 scrollbar-hide">
        <div className="grid grid-cols-2 gap-3 animate-fadeInUp stagger-1">
          {alive.map((player, i) => {
            const isSelected = selectedId === player.id;
            return (
              <button
                key={player.id}
                onClick={() => setSelectedId(isSelected ? null : player.id)}
                className={`card-surface rounded-[24px] p-5 flex flex-col items-center gap-3 active:scale-[0.97] transition-all min-h-[120px] justify-center border ${
                  isSelected
                    ? "border-accent-red bg-accent-red/15 shadow-[0_0_40px_rgba(255,51,102,0.2)]"
                    : "border-white/10"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold shadow-lg transition-colors ${
                  isSelected ? "bg-accent-red" : AVATAR_BG[i % AVATAR_BG.length]
                }`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-display font-bold text-white text-[15px] text-center leading-tight">
                  {player.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => dispatch({ type: "DAY_VOTE", targetId: null })}
          className="w-full mt-4 border border-dashed border-white/15 rounded-2xl py-3.5 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors font-body font-semibold text-sm active:scale-[0.98]"
        >
          🤷 Skip — nobody gets eliminated
        </button>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#ff1b6b] to-transparent pointer-events-none flex justify-center">
        <button
          onClick={() => selectedId && setConfirming(true)}
          className={`btn-big btn-white text-2xl max-w-lg pointer-events-auto transition-opacity ${selectedId ? "" : "opacity-30 pointer-events-none"}`}
        >
          {selectedId ? `VOTE OUT ${selectedPlayer?.name?.toUpperCase()}` : "SELECT A PLAYER"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
