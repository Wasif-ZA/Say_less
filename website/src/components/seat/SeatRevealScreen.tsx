"use client";

import { useSeat } from "@/hooks/useSeat";
import { PROMPTS, canAccuse, pickPrompt, tally } from "@/lib/seat/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function SeatRevealScreen() {
  const { state, dispatch } = useSeat();
  const isLast = state.round + 1 >= state.rounds;
  const { counts } = tally(state.votes, state.players.map((p) => p.id));
  const ranked = [...state.players].sort((a, b) => counts[b.id] - counts[a.id]);
  const seated = state.players.filter((p) => state.top.includes(p.id));
  const accuse = canAccuse(state.votes, state.top);
  const max = counts[state.top[0]] || 1;

  return (
    <ScreenWrapper bgClassName="bg-seat">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Round {state.round + 1} reveal</span>
        <p className="text-lg font-semibold mt-4">Most likely to {PROMPTS[state.promptIndex]}</p>
        <h1 className="font-poster text-[36px] uppercase leading-tight mt-2 break-words">
          {seated.map((p) => p.name).join(" & ")} takes the hot seat
        </h1>
      </div>

      <div className="card-surface rounded-[24px] p-5 mt-6 animate-bounceIn">
        <div className="flex flex-col gap-3">
          {ranked.map((p) => {
            const hot = state.top.includes(p.id);
            const gain = state.top.includes(state.votes[p.id]);
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between gap-3 font-semibold">
                  <span className="truncate">{p.name}{hot && " 🔥"}</span>
                  <span className="shrink-0">{counts[p.id]} vote{counts[p.id] === 1 ? "" : "s"}{gain && <span className="badge ml-2">+{isLast ? 2 : 1}</span>}</span>
                </div>
                <div className="h-4 mt-1 rounded-full border-[2.5px] border-ink bg-paper overflow-hidden">
                  <div className={`h-full ${hot ? "bg-go" : "bg-ink"}`} style={{ width: `${(counts[p.id] / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() =>
            accuse
              ? dispatch({ type: "SET_PHASE", phase: "accuse" })
              : dispatch({ type: "NEXT_ROUND", promptIndex: pickPrompt(state.usedPrompts) })
          }
          className="btn-big btn-glass text-xl"
        >
          {accuse ? "HOT SEAT: GUESS A VOTER" : isLast ? "SEE RESULTS" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
