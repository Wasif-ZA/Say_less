"use client";

import { useHead } from "@/hooks/useHead";
import { dealDeck, streakBonus } from "@/lib/head/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function HeadTurnEndScreen() {
  const { state, dispatch } = useHead();
  const guesser = state.players[state.turn % state.players.length];
  const got = state.results.filter((r) => r.got).length;
  const bonus = streakBonus(state.results);
  const isLast = state.turn + 1 >= state.players.length * state.laps;

  return (
    <ScreenWrapper bgClassName="bg-head">
      <div className="text-center pt-14 pb-5 animate-bounceIn">
        <span className="clip-label">Time&apos;s up</span>
        <h1 className="font-poster text-[48px] uppercase leading-none mt-4 break-words">{guesser.name}</h1>
        <p className="text-xl font-bold mt-2">{got} {got === 1 ? "word" : "words"} guessed</p>
        {bonus > 0 && <span className="badge mt-2">🔥 +{bonus} streak bonus</span>}
      </div>

      <div className="card-surface rounded-[24px] p-5 animate-fadeInUp stagger-2">
        {state.results.length === 0 ? (
          <p className="text-ink-2">No words this turn.</p>
        ) : (
          <div className="ruled flex flex-col">
            {state.results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 py-2 ${r.got ? "" : "opacity-50"}`}>
                <span className="flex-1 font-semibold truncate">{r.word}</span>
                <span className="font-bold">{r.got ? "✓" : "skipped"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_TURN", deck: dealDeck(state.categoryId, state.usedWords) })}
          className="btn-big btn-glass text-xl"
        >
          {isLast ? "SEE RESULTS" : "NEXT PLAYER"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
