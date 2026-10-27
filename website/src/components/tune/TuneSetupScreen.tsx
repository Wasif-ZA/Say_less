"use client";

import { useEffect, useRef, useState } from "react";
import { SavedCrews } from "@/components/SavedCrews";
import { useTune } from "@/hooks/useTune";
import { LAP_OPTIONS, MIN_TUNE_PLAYERS, dealRound } from "@/lib/tune/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";

const TUNE_LAST_PLAYERS = "tune_last_players";

export function TuneSetupScreen() {
  const { state, dispatch } = useTune();
  const initialized = useRef(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (state.players.length >= MIN_TUNE_PLAYERS) return;
    const saved = loadFromStorage<string[] | null>(TUNE_LAST_PLAYERS, null);
    if (saved && saved.length >= MIN_TUNE_PLAYERS) {
      dispatch({ type: "SET_PLAYERS", names: saved });
    } else {
      for (let i = state.players.length; i < MIN_TUNE_PLAYERS; i++) {
        dispatch({ type: "ADD_PLAYER", name: `Player ${i + 1}` });
      }
    }
  }, [state.players.length, dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editingId]);

  function handleRename(id: string, rawName: string) {
    let name = rawName.trim();
    if (!name) name = `Player ${state.players.findIndex((p) => p.id === id) + 1}`;
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
    saveToStorage(TUNE_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME", deal: dealRound([]) });
  }

  const count = state.players.length;
  const canStart = count >= MIN_TUNE_PLAYERS;
  const canRemove = count > MIN_TUNE_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <h1 className="font-display text-3xl font-bold text-center pt-14 mb-6">On the Dial Setup</h1>

      <div className="flex-1 pb-28 flex flex-col gap-5 animate-slideUpIn">
        <SavedCrews names={state.players.map((p) => p.name)} onLoad={(names) => dispatch({ type: "SET_PLAYERS", names })} />

        <div className="card-surface rounded-[24px] p-5">
          <h2 className="font-display text-2xl font-bold">Players</h2>
          <p className="text-ink-2 text-sm mb-4">{count} players · minimum {MIN_TUNE_PLAYERS}</p>
          <div className="flex flex-col gap-2">
            {state.players.map((player, i) => (
              <div key={player.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 border-[1.5px] border-ink/15">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-tangerine border-[2.5px] border-ink">
                  {i + 1}
                </div>
                {editingId === player.id ? (
                  <input
                    ref={inputRef}
                    defaultValue={player.name}
                    onBlur={(e) => handleRename(player.id, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    className="flex-1 min-w-0 bg-mint font-semibold rounded-xl px-3 py-1.5 text-[15px]"
                    maxLength={20}
                  />
                ) : (
                  <button onClick={() => setEditingId(player.id)} className="flex-1 text-left font-semibold text-[15px] truncate">
                    {player.name}
                  </button>
                )}
                {canRemove && (
                  <button
                    onClick={() => dispatch({ type: "REMOVE_PLAYER", id: player.id })}
                    aria-label={`Remove ${player.name}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-lg active:scale-95"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => dispatch({ type: "ADD_PLAYER" })}
            className="w-full mt-3 border-2 border-dashed border-ink/30 rounded-2xl py-3 font-semibold text-sm active:scale-[0.98]"
          >
            + Add Player
          </button>
        </div>

        <div className="card-surface rounded-[24px] p-5">
          <h2 className="font-display text-2xl font-bold">Game length</h2>
          <p className="text-ink-2 text-sm mb-4">
            Everyone is the Psychic {state.laps} {state.laps === 1 ? "time" : "times"} · {count * state.laps} rounds
          </p>
          <div className="flex gap-2">
            {LAP_OPTIONS.map((laps) => (
              <button
                key={laps}
                onClick={() => dispatch({ type: "SET_LAPS", laps })}
                className={`flex-1 h-12 rounded-full border-[2.5px] border-ink font-bold ${state.laps === laps ? "bg-go" : "bg-paper"}`}
              >
                {laps}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-cream pointer-events-none flex justify-center">
        <button
          onClick={startGame}
          disabled={!canStart}
          className={`btn-big btn-white text-2xl max-w-lg pointer-events-auto ${canStart ? "" : "opacity-30 pointer-events-none"}`}
        >
          START · {count} PLAYERS
        </button>
      </div>
    </ScreenWrapper>
  );
}
