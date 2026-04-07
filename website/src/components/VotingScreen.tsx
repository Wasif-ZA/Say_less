"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { ScreenWrapper } from "./ScreenWrapper";

const AVATAR_BG = [
  "bg-blue-500", "bg-orange-500", "bg-pink-500", "bg-emerald-500",
  "bg-violet-500", "bg-amber-500", "bg-cyan-500", "bg-rose-500",
  "bg-indigo-500", "bg-teal-500",
];

export function VotingScreen() {
  const { state, dispatch } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const selectedPlayer = state.players.find((p) => p.id === selectedId);

  function confirmElimination() {
    if (!selectedId) return;
    dispatch({ type: "ELIMINATE_PLAYER", targetId: selectedId });
  }

  // Confirmation overlay
  if (confirming && selectedPlayer) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5 text-center animate-bounceIn">
          <div className="text-[80px]">🤔</div>
          <h2 className="font-display text-[36px] font-bold leading-tight">
            Eliminate<br />{selectedPlayer.name}?
          </h2>
          <p className="font-body text-white/40 text-base max-w-[260px]">
            Final answer. No take-backs.
          </p>
        </div>
        <div className="flex gap-3 w-full max-w-sm mt-10 animate-fadeInUp stagger-2">
          <button onClick={() => setConfirming(false)} className="btn-big btn-glass text-lg flex-1" style={{ height: 60 }}>
            Back
          </button>
          <button onClick={confirmElimination} className="btn-big btn-red text-lg flex-1" style={{ height: 60 }}>
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
        <h1 className="font-display text-[38px] font-bold tracking-wide drop-shadow-lg leading-tight">
          Who&apos;s the<br />Imposter?
        </h1>
        <p className="font-body text-white/50 mt-2 text-base">
          Tap the player everyone agrees on
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        <div className="grid grid-cols-2 gap-3 animate-fadeInUp stagger-1">
          {state.players.map((player, i) => {
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
