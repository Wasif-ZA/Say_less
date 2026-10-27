"use client";

import { useOdd } from "@/hooks/useOdd";
import { PROMPTS, isFinalRound, pickPrompt, rollContrarian } from "@/lib/odd/engine";
import type { OddChoice } from "@/lib/odd/types";
import { ScreenWrapper } from "../ScreenWrapper";

export function OddRevealScreen() {
  const { state, dispatch } = useOdd();
  const options = PROMPTS[state.promptIndex];
  const isLast = isFinalRound(state.round, state.rounds);
  const points = isLast ? 2 : 1;
  const sideOf = (choice: OddChoice) => state.players.filter((p) => state.picks[p.id] === choice);
  const names = (list: { name: string }[]) => list.map((p) => p.name).join(", ");

  const winners = state.majority === null ? [] : sideOf(state.majority);
  const losers = state.majority === null ? [] : sideOf(state.majority === 0 ? 1 : 0);
  let headline: string;
  if (state.majority === null) headline = state.contrarian ? "Nobody dared. No points." : "Dead even. No points.";
  else if (state.contrarian) headline = `${names(winners)} dared to be different`;
  else if (losers.length === 0) headline = "Hive mind! Everyone scores.";
  else headline = `${names(losers)} ${losers.length === 1 ? "is" : "are"} the odd one out`;

  return (
    <ScreenWrapper bgClassName="bg-odd">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">
          {state.contrarian ? "Contrarian round" : `Round ${state.round + 1} reveal`}{isLast ? " · double" : ""}
        </span>
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
                {side.length ? names(side) : "Nobody"}
                {winning && ` · +${points} each`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_ROUND", promptIndex: pickPrompt(state.usedPrompts), contrarian: rollContrarian() })}
          className="btn-big btn-glass text-xl"
        >
          {isLast ? "SEE RESULTS" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
