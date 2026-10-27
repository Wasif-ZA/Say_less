"use client";

import { Art } from "@/components/Art";
import { useHead } from "@/hooks/useHead";
import { dealDeck } from "@/lib/head/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function HeadSummaryScreen({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = useHead();
  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const top = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === top);

  return (
    <ScreenWrapper bgClassName="bg-head">
      <div className="text-center pt-14 pb-5 animate-bounceIn">
        <div className="flex justify-center mb-2"><Art name="emote-grin" className="w-24 h-24" /></div>
        <h1 className="font-poster text-[44px] uppercase leading-tight break-words">
          {winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!"}
        </h1>
        <p className="font-semibold mt-2">
          {winners.length === 1
            ? `${top} ${top === 1 ? "word" : "words"} guessed. Big brain energy.`
            : `${winners.map((w) => w.name).join(", ")} tie on ${top}.`}
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

      <div className="flex flex-col gap-3 mt-auto pt-6 animate-fadeInUp stagger-3">
        <button onClick={() => dispatch({ type: "START_GAME", deck: dealDeck(state.categoryId, []) })} className="btn-big btn-glass text-xl">
          PLAY AGAIN
        </button>
        <button
          onClick={() => { dispatch({ type: "FULL_RESET" }); dispatch({ type: "SET_PHASE", phase: "setup" }); }}
          className="btn-big btn-glass text-base"
        >
          Change Players or Category
        </button>
        <button onClick={onExit} className="btn-big btn-ghost text-base">
          Exit to Games
        </button>
      </div>
    </ScreenWrapper>
  );
}
