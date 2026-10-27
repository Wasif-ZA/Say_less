"use client";

import { useEffect, useRef } from "react";
import { PlayerListCard } from "@/components/PlayerListCard";
import { SavedCrews } from "@/components/SavedCrews";
import { useHead } from "@/hooks/useHead";
import { LAP_OPTIONS, MIN_HEAD_PLAYERS, TURN_OPTIONS, dealDeck } from "@/lib/head/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { CATEGORIES } from "@/lib/wordbanks";
import { ScreenWrapper } from "../ScreenWrapper";

const HEAD_LAST_PLAYERS = "head_last_players";

function Options<T extends number>({ options, value, label, onPick }: { options: readonly T[]; value: T; label: (v: T) => string; onPick: (v: T) => void }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onPick(o)}
          className={`flex-1 h-12 rounded-full border-[2.5px] border-ink font-bold ${value === o ? "bg-go" : "bg-paper"}`}
        >
          {label(o)}
        </button>
      ))}
    </div>
  );
}

export function HeadSetupScreen() {
  const { state, dispatch } = useHead();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (state.players.length >= MIN_HEAD_PLAYERS) return;
    const saved = loadFromStorage<string[] | null>(HEAD_LAST_PLAYERS, null);
    if (saved && saved.length >= MIN_HEAD_PLAYERS) {
      dispatch({ type: "SET_PLAYERS", names: saved });
    } else {
      for (let i = state.players.length; i < MIN_HEAD_PLAYERS; i++) {
        dispatch({ type: "ADD_PLAYER", name: `Player ${i + 1}` });
      }
    }
  }, [state.players.length, dispatch]);

  function startGame() {
    saveToStorage(HEAD_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME", deck: dealDeck(state.categoryId, []) });
  }

  const count = state.players.length;
  const canStart = count >= MIN_HEAD_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <h1 className="font-display text-3xl font-bold text-center pt-14 mb-6">Head Case Setup</h1>

      <div className="flex-1 pb-28 flex flex-col gap-5 animate-slideUpIn">
        <SavedCrews names={state.players.map((p) => p.name)} onLoad={(names) => dispatch({ type: "SET_PLAYERS", names })} />

        <PlayerListCard
          players={state.players}
          min={MIN_HEAD_PLAYERS}
          onAdd={() => dispatch({ type: "ADD_PLAYER" })}
          onRemove={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
          onRename={(id, name) => dispatch({ type: "RENAME_PLAYER", id, name })}
        />

        <div className="card-surface rounded-[24px] p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Category</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => dispatch({ type: "SET_CATEGORY", categoryId: c.id })}
                className={`rounded-full border-[2.5px] border-ink px-3 py-1.5 text-sm font-bold ${state.categoryId === c.id ? "bg-go" : "bg-paper"}`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-[24px] p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Turn length</h2>
            <Options options={TURN_OPTIONS} value={state.turnSeconds} label={(s) => `${s}s`} onPick={(seconds) => dispatch({ type: "SET_TURN_SECONDS", seconds })} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Turns each</h2>
            <Options options={LAP_OPTIONS} value={state.laps} label={(l) => `${l}`} onPick={(laps) => dispatch({ type: "SET_LAPS", laps })} />
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
