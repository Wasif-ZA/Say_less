"use client";

import { Art } from "@/components/Art";
import { usePotato } from "@/hooks/usePotato";
import { dealPotato } from "@/lib/potato/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function PotatoSummaryScreen({ onExit }: { onExit: () => void }) {
  const { state, dispatch } = usePotato();
  const ranked = [...state.players].sort((a, b) => a.burns - b.burns);
  const best = ranked[0]?.burns ?? 0;
  const winners = ranked.filter((p) => p.burns === best);
  const worst = ranked[ranked.length - 1];

  return (
    <ScreenWrapper bgClassName="bg-potato">
      <div className="text-center pt-14 pb-5 animate-bounceIn">
        <div className="flex justify-center mb-2"><Art name="emote-grin" className="w-24 h-24" /></div>
        <h1 className="font-poster text-[44px] uppercase leading-tight break-words">
          {winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!"}
        </h1>
        <p className="font-semibold mt-2">
          {winners.length === 1
            ? `Only ${best} ${best === 1 ? "burn" : "burns"}. Cool under pressure.`
            : `${winners.map((w) => w.name).join(" and ")} tie on ${best} ${best === 1 ? "burn" : "burns"}.`}
          {worst && worst.burns > best && ` ${worst.name} is extra crispy.`}
        </p>
      </div>

      <div className="card-surface rounded-[24px] p-5 animate-fadeInUp stagger-2">
        <h2 className="font-display text-xl font-bold mb-2">Burns</h2>
        <div className="ruled flex flex-col">
          {ranked.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <span className="w-7 font-bold">{i + 1}.</span>
              <span className="flex-1 font-semibold truncate">{p.name}</span>
              <span className="font-bold">{p.burns}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-6 animate-fadeInUp stagger-3">
        <button onClick={() => dispatch({ type: "START_GAME", deal: dealPotato([]) })} className="btn-big btn-glass text-xl">
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
