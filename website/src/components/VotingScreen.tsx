"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { ScreenWrapper } from "./ScreenWrapper";


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
      <div className="fixed inset-0 bg-imposter grid grid-rows-[auto_1fr_auto] px-5 pt-14 pb-5">
        <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-ink-2">Final vote</p>
        <div className="flex flex-col justify-center animate-maskIn">
          <h2 className="font-poster text-[64px] leading-[0.92] uppercase break-words text-balance">
            Vote out {selectedPlayer.name}?
          </h2>
          <p className="text-[17px] font-semibold mt-4 text-ink-2 max-w-[300px]">
            Their role is revealed straight after. No take-backs.
          </p>
        </div>
        <div className="flex gap-3 w-full max-w-lg mx-auto">
          <button onClick={() => setConfirming(false)} className="btn-big btn-glass text-lg flex-1">
            Cancel
          </button>
          <button onClick={confirmElimination} className="btn-big btn-red text-lg flex-1">
            Eliminate
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScreenWrapper bgClassName="bg-imposter">
      {/* Header */}
      <div className="pt-4 pb-4 text-center animate-slideDown">
        <h1 className="font-poster text-[38px] font-normal uppercase tracking-wide drop-shadow-lg leading-tight">
          Who&apos;s the<br />Imposter?
        </h1>
        <p className="font-body text-white/75 mt-2 text-base">
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
                className={`card-surface rounded-[24px] p-5 flex flex-col items-center gap-3 active:scale-[0.97] transition-all min-h-[120px] justify-center border-[3px] ${
                  isSelected
                    ? "bg-go! text-ink border-ink"
                    : "border-transparent"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold transition-colors ${
                  isSelected ? "bg-ink text-paper" : "bg-paper border-[2.5px] border-ink"
                }`}>
                  {isSelected ? "✓" : i + 1}
                </div>
                <span className={`font-display font-bold text-[15px] text-center leading-tight ${isSelected ? "text-ink" : "text-white"}`}>
                  {player.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-imposter pointer-events-none flex justify-center">
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
