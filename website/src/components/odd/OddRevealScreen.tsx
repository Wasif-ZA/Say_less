"use client";

import { useOdd } from "@/hooks/useOdd";
import { PROMPTS, pickPrompt } from "@/lib/odd/engine";
import type { OddChoice } from "@/lib/odd/types";
import { ScreenWrapper } from "../ScreenWrapper";

export function OddRevealScreen() {
  const { state, dispatch } = useOdd();
  const options = PROMPTS[state.promptIndex];
  const isLast = state.round + 1 >= state.rounds;
  const sideOf = (choice: OddChoice) => state.players.filter((p) => state.picks[p.id] === choice);

  const minority = state.majority === null ? [] : sideOf(state.majority === 0 ? 1 : 0);
  const headline =
    state.majority === null
      ? "Dead even. No points."
      : minority.length === 0
        ? "Hive mind! Everyone scores."
        : `${minority.map((p) => p.name).join(", ")} ${minority.length === 1 ? "is" : "are"} the odd one out`;

  return (
    <ScreenWrapper bgClassName="bg-odd">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Round {state.round + 1} reveal</span>
        <h1 className="font-poster text-[36px] uppercase leading-tight mt-4 break-words">{headline}</h1>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {([0, 1] as const).map((choice, i) => {
          const side = sideOf(choice);
          const winning = state.majority === choice;
          return (
            <div
              key={choice}
              className={`animate-bounceIn stagger-${i + 1} card-surface rounded-[24px] p-5 ${winning ? "bg-go!" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-poster text-[30px] uppercase leading-none break-words">{options[choice]}</h2>
                <span className="badge shrink-0">{side.length}</span>
              </div>
              <p className="font-semibold mt-2 min-h-6">
                {side.length ? side.map((p) => p.name).join(", ") : "Nobody"}
                {winning && " · +1 each"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_ROUND", promptIndex: pickPrompt(state.usedPrompts) })}
          className="btn-big btn-glass text-xl"
        >
          {isLast ? "SEE RESULTS" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
