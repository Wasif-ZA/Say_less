"use client";

import { useState } from "react";
import { useSneak } from "@/hooks/useSneak";
import { MISSIONS } from "@/lib/sneak/engine";
import type { SneakResult } from "@/lib/sneak/types";
import { ScreenWrapper } from "../ScreenWrapper";

const CHOICE = "flex-1 min-h-11 px-2 rounded-full border-[2.5px] border-ink font-bold text-sm";

export function SneakDebriefScreen() {
  const { state, dispatch } = useSneak();
  const [bustOpen, setBustOpen] = useState<string[]>([]);
  const allSet = state.players.every((p) => state.results[p.id]);

  const set = (playerId: string, result: SneakResult | null) => dispatch({ type: "SET_RESULT", playerId, result });

  function openBust(id: string) {
    setBustOpen((o) => (o.includes(id) ? o : [...o, id]));
    if (state.results[id]?.kind !== "busted") set(id, null);
  }

  function pickOther(id: string, kind: "done" | "failed") {
    setBustOpen((o) => o.filter((x) => x !== id));
    set(id, { kind });
  }

  return (
    <ScreenWrapper bgClassName="bg-sneak">
      <div className="pt-14 text-center animate-slideDown">
        <h1 className="font-poster text-[40px] uppercase leading-none">Time&apos;s up</h1>
        <p className="font-semibold mt-3">Reveal your missions. How did each one go?</p>
      </div>

      <div className="flex flex-col gap-3 py-6 pb-28">
        {state.players.map((p) => {
          const r = state.results[p.id];
          const open = bustOpen.includes(p.id) || r?.kind === "busted";
          return (
            <div key={p.id} className="card-surface rounded-[24px] p-4 animate-fadeInUp">
              <span className="clip-label">{p.name}</span>
              <p className="font-semibold mt-3">{MISSIONS[state.missions[p.id]]}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => pickOther(p.id, "done")} className={`${CHOICE} ${r?.kind === "done" ? "bg-go" : "bg-paper"}`}>
                  Pulled it off
                </button>
                <button onClick={() => openBust(p.id)} className={`${CHOICE} ${open ? "bg-hot" : "bg-paper"}`}>
                  Busted by...
                </button>
                <button onClick={() => pickOther(p.id, "failed")} className={`${CHOICE} ${r?.kind === "failed" ? "bg-go" : "bg-paper"}`}>
                  Didn&apos;t do it
                </button>
              </div>
              {open && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {state.players.filter((o) => o.id !== p.id).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => set(p.id, { kind: "busted", by: o.id })}
                      className={`px-3 h-10 rounded-full border-[2.5px] border-ink font-bold text-sm ${r?.kind === "busted" && r.by === o.id ? "bg-go" : "bg-paper"}`}
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 pointer-events-none flex justify-center">
        <button
          onClick={() => dispatch({ type: "FINISH_DEBRIEF" })}
          disabled={!allSet}
          className={`btn-big btn-white text-2xl max-w-lg pointer-events-auto ${allSet ? "" : "opacity-30 pointer-events-none"}`}
        >
          SEE RESULTS
        </button>
      </div>
    </ScreenWrapper>
  );
}
