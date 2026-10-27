"use client";

import { useEffect, useRef } from "react";
import { PlayerListCard } from "@/components/PlayerListCard";
import { SavedCrews } from "@/components/SavedCrews";
import { useSneak } from "@/hooks/useSneak";
import { MIN_SNEAK_PLAYERS, TIMER_OPTIONS, dealMissions } from "@/lib/sneak/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";

const SNEAK_LAST_PLAYERS = "sneak_last_players";

export function SneakSetupScreen() {
  const { state, dispatch } = useSneak();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (state.players.length >= MIN_SNEAK_PLAYERS) return;
    const saved = loadFromStorage<string[] | null>(SNEAK_LAST_PLAYERS, null);
    if (saved && saved.length >= MIN_SNEAK_PLAYERS) {
      dispatch({ type: "SET_PLAYERS", names: saved });
    } else {
      for (let i = state.players.length; i < MIN_SNEAK_PLAYERS; i++) {
        dispatch({ type: "ADD_PLAYER", name: `Player ${i + 1}` });
      }
    }
  }, [state.players.length, dispatch]);

  function startGame() {
    saveToStorage(SNEAK_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME", missions: dealMissions(state.players.map((p) => p.id), []) });
  }

  const count = state.players.length;
  const canStart = count >= MIN_SNEAK_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <h1 className="font-display text-3xl font-bold text-center pt-14 mb-6">Sneaky Setup</h1>

      <div className="flex-1 pb-28 flex flex-col gap-5 animate-slideUpIn">
        <SavedCrews names={state.players.map((p) => p.name)} onLoad={(names) => dispatch({ type: "SET_PLAYERS", names })} />

        <PlayerListCard
          players={state.players}
          min={MIN_SNEAK_PLAYERS}
          onAdd={() => dispatch({ type: "ADD_PLAYER" })}
          onRemove={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
          onRename={(id, name) => dispatch({ type: "RENAME_PLAYER", id, name })}
        />

        <div className="card-surface rounded-[24px] p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Timer</h2>
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => dispatch({ type: "SET_MINUTES", minutes })}
                className={`flex-1 h-12 rounded-full border-[2.5px] border-ink font-bold ${state.minutes === minutes ? "bg-go" : "bg-paper"}`}
              >
                {minutes} min
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
