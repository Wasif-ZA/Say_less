"use client";

import { useState } from "react";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

const KEY = "say_less_crews";
const MAX_CREWS = 6;

function isDefaultName(name: string) {
  return /^Player \d+$/.test(name.trim());
}

export function SavedCrews({ names, onLoad }: { names: string[]; onLoad: (names: string[]) => void }) {
  const [crews, setCrews] = useState<string[][]>(() => loadFromStorage<string[][]>(KEY, []));

  const realNames = names.filter((n) => !isDefaultName(n));
  const current = names.join("|").toLowerCase();
  const alreadySaved = crews.some((c) => c.join("|").toLowerCase() === current);
  const canSave = realNames.length >= 2 && !alreadySaved;

  function persist(next: string[][]) {
    setCrews(next);
    saveToStorage(KEY, next);
  }

  return (
    <div className="card-surface rounded-[20px] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[20px] font-bold">Saved crews</h2>
        <button
          onClick={() => canSave && persist([names, ...crews].slice(0, MAX_CREWS))}
          disabled={!canSave}
          className={`badge px-3! py-1! bg-go ${canSave ? "" : "opacity-40"}`}
        >
          {alreadySaved ? "Saved" : "Save crew"}
        </button>
      </div>
      {crews.length === 0 ? (
        <p className="text-[14px] text-ink-2">Type your friends&apos; names, then save them. Next time it is one tap.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {crews.map((crew, i) => (
            <div key={crew.join("|")} className="flex items-stretch gap-2">
              <button
                onClick={() => onLoad(crew)}
                className="flex-1 text-left rounded-[14px] border-[2.5px] border-ink bg-paper px-3 py-2.5 active:translate-x-0.5 active:translate-y-0.5 shadow-[3px_3px_0_#0b0d12] active:shadow-[1px_1px_0_#0b0d12]"
              >
                <span className="block text-[15px] font-bold truncate">{crew.join(", ")}</span>
                <span className="block text-[12px] text-ink-2">{crew.length} players · tap to fill</span>
              </button>
              <button
                onClick={() => persist(crews.filter((_, j) => j !== i))}
                aria-label={`Delete crew ${crew.join(", ")}`}
                className="w-11 rounded-[14px] border-[2.5px] border-ink text-[20px] font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
