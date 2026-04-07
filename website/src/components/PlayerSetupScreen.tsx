"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { MIN_PLAYERS, MAX_PLAYERS, STORAGE_KEYS } from "@/lib/constants";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "./ScreenWrapper";

const AVATAR_BG = [
  "bg-blue-500", "bg-orange-500", "bg-pink-500", "bg-emerald-500",
  "bg-violet-500", "bg-amber-500", "bg-cyan-500", "bg-rose-500",
  "bg-indigo-500", "bg-teal-500",
];

export function PlayerSetupScreen() {
  const { state, dispatch } = useGame();
  const initialized = useRef(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (state.players.length < MIN_PLAYERS) {
      const saved = loadFromStorage<string[] | null>(STORAGE_KEYS.LAST_PLAYERS, null);
      if (saved && saved.length >= MIN_PLAYERS) {
        saved.forEach((name) => dispatch({ type: "ADD_PLAYER", name }));
      } else {
        const toAdd = MIN_PLAYERS - state.players.length;
        for (let i = 0; i < toAdd; i++) {
          dispatch({ type: "ADD_PLAYER", name: `Player ${i + 1}` });
        }
      }
    }
  }, [state.players.length, dispatch]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  function startRound() {
    saveToStorage(STORAGE_KEYS.LAST_PLAYERS, state.players.map((p) => p.name));
    saveToStorage(STORAGE_KEYS.LAST_TIMER, state.timerSeconds);
    dispatch({ type: "START_ROUND" });
  }

  function handleRename(id: string, rawName: string) {
    let name = rawName.trim();
    if (!name) {
      const idx = state.players.findIndex((p) => p.id === id);
      name = `Player ${idx + 1}`;
    }
    // Dedupe
    const others = state.players.filter((p) => p.id !== id);
    if (others.some((p) => p.name === name)) {
      let s = 2;
      while (others.some((p) => p.name === `${name} ${s}`)) s++;
      name = `${name} ${s}`;
    }
    dispatch({ type: "RENAME_PLAYER", id, name });
    setEditingId(null);
  }

  function adjustImposter(amount: number) {
    const next = state.imposterCount + amount;
    if (next >= 1 && next <= 2) {
      dispatch({ type: "SET_IMPOSTER_COUNT", count: next as 1 | 2 });
    }
  }

  function adjustTimer(amountSec: number) {
    const next = Math.max(30, Math.min(300, state.timerSeconds + amountSec));
    dispatch({ type: "SET_TIMER", seconds: next });
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const canAdd = state.players.length < MAX_PLAYERS;
  const canRemove = state.players.length > MIN_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-grid-pattern">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "category" })}
          className="text-white text-3xl font-bold w-10 h-10 flex items-center justify-center active:scale-95 transition-transform"
        >
          ‹
        </button>
        <h1 className="font-display text-3xl font-bold tracking-wide drop-shadow-md">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide flex flex-col gap-5 animate-slideUpIn">

        {/* Players — name list */}
        <div className="card-surface rounded-[28px] p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold">Players</h2>
              <p className="font-body text-white/40 text-sm">{state.players.length}/{MAX_PLAYERS}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {state.players.map((player, i) => (
              <div key={player.id} className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-2.5">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0 ${AVATAR_BG[i % AVATAR_BG.length]}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>

                {/* Name — tap to edit */}
                {editingId === player.id ? (
                  <input
                    ref={inputRef}
                    defaultValue={player.name}
                    onBlur={(e) => handleRename(player.id, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    className="flex-1 bg-white/10 text-white font-body font-semibold rounded-xl px-3 py-1.5 text-[15px]"
                    maxLength={20}
                  />
                ) : (
                  <button
                    onClick={() => setEditingId(player.id)}
                    className="flex-1 text-left font-body font-semibold text-white text-[15px] truncate"
                  >
                    {player.name}
                  </button>
                )}

                {/* Delete */}
                {canRemove && (
                  <button
                    onClick={() => dispatch({ type: "REMOVE_PLAYER", id: player.id })}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/60 hover:bg-white/10 transition-colors active:scale-95 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add player */}
          {canAdd && (
            <button
              onClick={() => dispatch({ type: "ADD_PLAYER" })}
              className="w-full mt-3 border border-dashed border-white/15 rounded-2xl py-3 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors font-body font-semibold text-sm active:scale-[0.98]"
            >
              + Add Player
            </button>
          )}
        </div>

        {/* Hints toggle */}
        <div className="card-surface rounded-[28px] p-6 border border-white/10">
          <h2 className="font-display text-2xl font-bold mb-1">Imposter Hints</h2>
          <p className="font-body text-white/40 text-sm mb-4">Should imposters see the category?</p>
          <div className="bg-white/5 rounded-full flex p-1 h-14">
            <button
              onClick={() => dispatch({ type: "SET_HINTS", enabled: false })}
              className={`flex-1 rounded-full font-display font-bold text-base transition-all ${
                !state.hintsEnabled ? "bg-white text-black shadow-sm" : "text-white/40"
              }`}
            >
              Off
            </button>
            <button
              onClick={() => dispatch({ type: "SET_HINTS", enabled: true })}
              className={`flex-1 rounded-full font-display font-bold text-base transition-all ${
                state.hintsEnabled ? "bg-white text-black shadow-sm" : "text-white/40"
              }`}
            >
              On
            </button>
          </div>
        </div>

        {/* Imposters */}
        <div className="card-surface rounded-[28px] p-6 border border-white/10">
          <h2 className="font-display text-2xl font-bold mb-1">Imposters</h2>
          <p className="font-body text-white/40 text-sm mb-5">How many secret imposters?</p>
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => adjustImposter(-1)}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-2xl font-bold text-white/50">−</span>
            </button>
            <span className="font-display text-4xl font-bold w-8 text-center">{state.imposterCount}</span>
            <button
              onClick={() => adjustImposter(1)}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-2xl font-bold text-white/50">+</span>
            </button>
          </div>
        </div>

        {/* Round Duration */}
        <div className="card-surface rounded-[28px] p-6 border border-white/10">
          <h2 className="font-display text-2xl font-bold mb-1">Round Duration</h2>
          <p className="font-body text-white/40 text-sm mb-5">How long to discuss?</p>
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => adjustTimer(-30)}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-2xl font-bold text-white/50">−</span>
            </button>
            <span className="font-display text-3xl font-bold w-16 text-center">{formatTime(state.timerSeconds)}</span>
            <button
              onClick={() => adjustTimer(30)}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-2xl font-bold text-white/50">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#ff1b6b] to-transparent pointer-events-none flex justify-center">
        <button onClick={startRound} className="btn-big btn-white text-2xl max-w-lg pointer-events-auto">
          PLAY <span className="text-black/30 mx-2">|</span> <span className="text-lg font-body font-semibold">{state.players.length} Players</span>
        </button>
      </div>
    </ScreenWrapper>
  );
}
