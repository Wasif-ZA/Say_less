"use client";

import { useEffect, useRef } from "react";
import { PlayerListCard } from "@/components/PlayerListCard";
import { SavedCrews } from "@/components/SavedCrews";
import { usePotato } from "@/hooks/usePotato";
import { MIN_POTATO_PLAYERS, ROUND_OPTIONS, dealPotato } from "@/lib/potato/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";

const POTATO_LAST_PLAYERS = "potato_last_players";

export function PotatoSetupScreen() {
  const { state, dispatch } = usePotato();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (state.players.length >= MIN_POTATO_PLAYERS) return;
    const saved = loadFromStorage<string[] | null>(POTATO_LAST_PLAYERS, null);
    if (saved && saved.length >= MIN_POTATO_PLAYERS) {
      dispatch({ type: "SET_PLAYERS", names: saved });
    } else {
      for (let i = state.players.length; i < MIN_POTATO_PLAYERS; i++) {
        dispatch({ type: "ADD_PLAYER", name: `Player ${i + 1}` });
      }
    }
  }, [state.players.length, dispatch]);

  function startGame() {
    saveToStorage(POTATO_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME", deal: dealPotato([]) });
  }

  const count = state.players.length;
  const canStart = count >= MIN_POTATO_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <h1 className="font-display text-3xl font-bold text-center pt-14 mb-6">Hot Potato Setup</h1>

      <div className="flex-1 pb-28 flex flex-col gap-5 animate-slideUpIn">
        <SavedCrews names={state.players.map((p) => p.name)} onLoad={(names) => dispatch({ type: "SET_PLAYERS", names })} />

        <PlayerListCard
          players={state.players}
          min={MIN_POTATO_PLAYERS}
          onAdd={() => dispatch({ type: "ADD_PLAYER" })}
          onRemove={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
          onRename={(id, name) => dispatch({ type: "RENAME_PLAYER", id, name })}
        />

        <div className="card-surface rounded-[24px] p-5">
          <h2 className="font-display text-2xl font-bold">Rounds</h2>
          <p className="text-ink-2 text-sm mb-4">One explosion per round</p>
          <div className="flex gap-2">
            {ROUND_OPTIONS.map((rounds) => (
              <button
                key={rounds}
                onClick={() => dispatch({ type: "SET_ROUNDS", rounds })}
                className={`flex-1 h-12 rounded-full border-[2.5px] border-ink font-bold ${state.rounds === rounds ? "bg-go" : "bg-paper"}`}
              >
                {rounds}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-cream pointer-events-none flex justify-center">
        <button
          onClick={startGame}
          disabled={!canStart}
          className={`btn-big btn-red text-2xl max-w-lg pointer-events-auto ${canStart ? "" : "opacity-30 pointer-events-none"}`}
        >
          START · {count} PLAYERS
        </button>
      </div>
    </ScreenWrapper>
  );
}
