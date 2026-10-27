"use client";

import { useEffect, useRef } from "react";
import { PlayerListCard } from "@/components/PlayerListCard";
import { SavedCrews } from "@/components/SavedCrews";
import { useTune } from "@/hooks/useTune";
import { LAP_OPTIONS, MIN_TUNE_PLAYERS, dealRound } from "@/lib/tune/engine";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "../ScreenWrapper";

const TUNE_LAST_PLAYERS = "tune_last_players";

export function TuneSetupScreen() {
  const { state, dispatch } = useTune();
  const initialized = useRef(false);

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

  function startGame() {
    saveToStorage(TUNE_LAST_PLAYERS, state.players.map((p) => p.name));
    dispatch({ type: "START_GAME", deal: dealRound([]) });
  }

  const count = state.players.length;
  const canStart = count >= MIN_TUNE_PLAYERS;

  return (
    <ScreenWrapper bgClassName="bg-hub">
      <h1 className="font-display text-3xl font-bold text-center pt-14 mb-6">On the Dial Setup</h1>

      <div className="flex-1 pb-28 flex flex-col gap-5 animate-slideUpIn">
        <SavedCrews names={state.players.map((p) => p.name)} onLoad={(names) => dispatch({ type: "SET_PLAYERS", names })} />

        <PlayerListCard
          players={state.players}
          min={MIN_TUNE_PLAYERS}
          onAdd={() => dispatch({ type: "ADD_PLAYER" })}
          onRemove={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
          onRename={(id, name) => dispatch({ type: "RENAME_PLAYER", id, name })}
        />

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
