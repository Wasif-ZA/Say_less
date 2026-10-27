"use client";

import { useGuess } from "@/hooks/useGuess";
import { QUESTIONS, formatNum, pickQuestion } from "@/lib/guess/engine";
import { ScreenWrapper } from "../ScreenWrapper";

export function GuessRevealScreen() {
  const { state, dispatch } = useGuess();
  const { q, answer, unit } = QUESTIONS[state.questionIndex];
  const isLast = state.round + 1 >= state.rounds;

  const rows = state.players
    .map((p) => ({ p, guess: state.guesses[p.id], gap: Math.abs(state.guesses[p.id] - answer) }))
    .sort((a, b) => a.gap - b.gap);
  const bullseye = rows.filter((r) => r.gap === 0);

  return (
    <ScreenWrapper bgClassName="bg-guess">
      <div className="pt-14 text-center animate-slideDown">
        <span className="clip-label">Round {state.round + 1} reveal</span>
        <p className="font-semibold mt-4">{q}</p>
        <h1 className="font-poster text-[64px] leading-none mt-2 break-words">{formatNum(answer)}</h1>
        {unit && <p className="font-semibold text-lg">{unit}</p>}
        {bullseye.length > 0 && (
          <p className="font-poster text-2xl uppercase mt-2">Bullseye! {bullseye.map((r) => r.p.name).join(", ")}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {rows.map(({ p, guess, gap }, i) => {
          const pts = state.gained[p.id] ?? 0;
          return (
            <div
              key={p.id}
              className={`animate-bounceIn stagger-${Math.min(i + 1, 6)} card-surface rounded-[24px] px-5 py-4 flex items-center gap-3 ${pts === 3 ? "bg-go!" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-[15px]">
                  {formatNum(guess)} · {gap === 0 ? "exact" : `off by ${formatNum(gap)}`}
                </p>
              </div>
              <span className="badge shrink-0">{pts ? `+${pts}` : "0"}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => dispatch({ type: "NEXT_ROUND", questionIndex: pickQuestion(state.usedQuestions) })}
          className="btn-big btn-glass text-xl"
        >
          {isLast ? "SEE RESULTS" : "NEXT ROUND"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
