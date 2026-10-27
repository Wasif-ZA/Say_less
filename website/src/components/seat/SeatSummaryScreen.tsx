"use client";

import { Art } from "@/components/Art";
import { useSeat } from "@/hooks/useSeat";
import { PROMPTS, pickPrompt } from "@/lib/seat/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function SeatSummaryScreen({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useSeat();
  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const top = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === top);
  const titled = state.players.filter((p) => p.titles.length > 0);

  return (
    <ScreenWrapper bgClassName="bg-seat">
      <div className="text-center pt-14 pb-5 animate-bounceIn">
        <div className="flex justify-center mb-2"><Art name="emote-shock" className="w-24 h-24" /></div>
        <h1 className="font-poster text-[44px] uppercase leading-tight break-words">
          {winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!"}
        </h1>
        <p className="font-semibold mt-2">
          {winners.length === 1
            ? `Best room reader: ${top} of ${state.rounds}.`
            : `Best room readers: ${winners.map((w) => w.name).join(", ")} on ${top}.`}
        </p>
      </div>

      <div className="card-surface rounded-[24px] p-5 animate-fadeInUp stagger-2">
        <h2 className="font-display text-xl font-bold mb-2">Final scores</h2>
        <div className="ruled flex flex-col">
          {ranked.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <span className="w-7 font-bold">{i + 1}.</span>
              <span className="flex-1 font-semibold truncate">{p.name}</span>
              <span className="font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      {titled.length > 0 && (
        <div className="card-surface rounded-[24px] p-5 mt-4 animate-fadeInUp stagger-3">
          <h2 className="font-display text-xl font-bold mb-2">Titles</h2>
          <div className="ruled flex flex-col">
            {titled.map((p) => (
              <div key={p.id} className="py-2.5">
                <p className="font-bold">{p.name}</p>
                <ul className="text-[15px] leading-snug mt-1 list-disc pl-5">
                  {p.titles.map((t, i) => (
                    <li key={i}>Most likely to {PROMPTS[t]}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto pt-6 animate-fadeInUp stagger-4">
        <button onClick={() => dispatch({ type: "START_GAME", promptIndex: pickPrompt([]) })} className="btn-big btn-glass text-xl">
          PLAY AGAIN
        </button>
        <button
          onClick={() => { dispatch({ type: "FULL_RESET" }); dispatch({ type: "SET_PHASE", phase: "setup" }); }}
          className="btn-big btn-glass text-base"
        >
          Change Players
        </button>
        <button onClick={onExit} className="btn-big btn-ghost text-base">
          Exit to Games
        </button>
      </div>
    </ScreenWrapper>
  );
}
