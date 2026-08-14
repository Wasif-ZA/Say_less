"use client";

import { useEffect, useRef, useState } from "react";
import { useMafia } from "@/hooks/useMafia";
import { MIN_MAFIA_PLAYERS, maxMafiaFor, recommendedMafiaFor } from "@/lib/mafia/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";
import { AVATAR_BG } from "./roleMeta";

const MAFIA_LAST_PLAYERS = "mafia_last_players";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="bg-white/5 rounded-full flex p-1 h-12 w-36 shrink-0">
      <button
        onClick={() => onChange(false)}
        className={`flex-1 rounded-full font-display font-bold text-sm transition-all ${
          !enabled ? "bg-white text-black shadow-sm" : "text-white/40"
        }`}
      >
        Off
      </button>
      <button
        onClick={() => onChange(true)}
        className={`flex-1 rounded-full font-display font-bold text-sm transition-all ${
          enabled ? "bg-white text-black shadow-sm" : "text-white/40"
        }`}
      >
        On
      </button>
    </div>
  );
}

export function MafiaSetupScreen() {
  const { state, dispatch } = useMafia();
  const initialized = useRef(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (state.players.length < MIN_MAFIA_PLAYERS) {
      const saved = loadFromStorage<string[] | null>(MAFIA_LAST_PLAYERS, null);
      if (saved && saved.length >= MIN_MAFIA_PLAYERS) {
        saved.forEach((name) => dispatch({ type: "ADD_PLAYER", name }));
      } else {
        const toAdd = MIN_MAFIA_PLAYERS - state.players.length;
        for (let i = 0; i < toAdd; i++) {
          dispatch({ type: "ADD_PLAYER", name: `Player ${state.players.length + i + 1}` });
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

  function handleRename(id: string, rawName: string) {
    let name = rawName.trim();
    if (!name) {
      const idx = state.players.findIndex((p) => p.id === id);
      name = `Player ${idx + 1}`;
    }
    const others = state.players.filter((p) => p.id !== id);
    if (others.some((p) => p.name === name)) {
      let s = 2;
      while (others.some((p) => p.name === `${name} ${s}`)) s++;
      name = `${name} ${s}`;
    }
    dispatch({ type: "RENAME_PLAYER", id, name });
    setEditingId(null);
  }

  function startGame() {
    saveToStorage(MAFIA_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME" });
  }

  const maxMafia = maxMafiaFor(state.players.length);
  const recommended = recommendedMafiaFor(state.players.length);
  const canStart = state.players.length >= MIN_MAFIA_PLAYERS;
  const canRemove = state.players.length > MIN_MAFIA_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-grid-pattern">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "home" })}
          className="text-white text-3xl font-bold w-10 h-10 flex items-center justify-center active:scale-95 transition-transform"
        >
          ‹
        </button>
        <h1 className="font-display text-3xl font-bold tracking-wide drop-shadow-md">Mafia Setup</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide flex flex-col gap-5 animate-slideUpIn">

        {/* Players */}
        <div className="card-surface rounded-[28px] p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold">Players</h2>
              <p className="font-body text-white/40 text-sm">
                {state.players.length} players · minimum {MIN_MAFIA_PLAYERS}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {state.players.map((player, i) => (
              <div key={player.id} className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0 ${AVATAR_BG[i % AVATAR_BG.length]}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>

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

          <button
            onClick={() => dispatch({ type: "ADD_PLAYER" })}
            className="w-full mt-3 border border-dashed border-white/15 rounded-2xl py-3 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors font-body font-semibold text-sm active:scale-[0.98]"
          >
            + Add Player
          </button>
        </div>

        {/* Mafia count */}
        <div className="card-surface rounded-[28px] p-6 border border-white/10">
          <h2 className="font-display text-2xl font-bold mb-1">🔪 Mafia</h2>
          <p className="font-body text-white/40 text-sm mb-5">
            How many? Suggested: {recommended} for {state.players.length} players
          </p>
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => dispatch({ type: "SET_MAFIA_COUNT", count: state.mafiaCount - 1 })}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="text-2xl font-bold text-white/50">−</span>
            </button>
            <span className="font-display text-4xl font-bold w-8 text-center">{state.mafiaCount}</span>
            <button
              onClick={() => dispatch({ type: "SET_MAFIA_COUNT", count: state.mafiaCount + 1 })}
              className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform ${
                state.mafiaCount >= maxMafia ? "opacity-30" : ""
              }`}
            >
              <span className="text-2xl font-bold text-white/50">+</span>
            </button>
          </div>
        </div>

        {/* Special roles */}
        <div className="card-surface rounded-[28px] p-6 border border-white/10 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">🕵️ Detective</h2>
              <p className="font-body text-white/40 text-sm">Investigates one player each night</p>
            </div>
            <Toggle enabled={state.detectiveEnabled} onChange={(v) => dispatch({ type: "SET_DETECTIVE", enabled: v })} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">🩺 Doctor</h2>
              <p className="font-body text-white/40 text-sm">Can save a life each night</p>
            </div>
            <Toggle enabled={state.doctorEnabled} onChange={(v) => dispatch({ type: "SET_DOCTOR", enabled: v })} />
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#ff1b6b] to-transparent pointer-events-none flex justify-center">
        <button
          onClick={startGame}
          className={`btn-big btn-white text-2xl max-w-lg pointer-events-auto ${canStart ? "" : "opacity-30 pointer-events-none"}`}
        >
          DEAL ROLES <span className="text-black/30 mx-2">|</span>{" "}
          <span className="text-lg font-body font-semibold">{state.players.length} Players</span>
        </button>
      </div>
    </ScreenWrapper>
  );
}
