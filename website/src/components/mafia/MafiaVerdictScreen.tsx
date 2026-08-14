"use client";

import { useMafia } from "@/hooks/useMafia";
import { ROLE_META } from "./roleMeta";

export function MafiaVerdictScreen() {
  const { state, dispatch } = useMafia();
  const eliminated = state.lastEliminatedId
    ? state.players.find((p) => p.id === state.lastEliminatedId)
    : undefined;

  const gameOver = state.winner !== null;
  const caughtMafia = eliminated?.role === "mafia";

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounceIn flex flex-col items-center gap-5">
        {state.lastVoteSkipped || !eliminated ? (
          <>
            <div className="text-[80px]">🤷</div>
            <h2 className="font-display text-[40px] font-bold leading-tight">
              The town couldn&apos;t decide
            </h2>
            <p className="font-body text-white/40 text-base max-w-[280px]">
              No one was eliminated. The Mafia lives another night...
            </p>
          </>
        ) : (
          <>
            <div className="text-[80px]">{caughtMafia ? "🎯" : "😱"}</div>
            <h2 className="font-display text-[40px] font-bold leading-tight">
              {eliminated.name} was voted out
            </h2>
            <div className="bg-white/8 border border-white/10 rounded-2xl px-6 py-4">
              <p className="font-display text-xl font-bold">
                They were {ROLE_META[eliminated.role].emoji}{" "}
                <span className={ROLE_META[eliminated.role].colorClass}>
                  {ROLE_META[eliminated.role].label}
                </span>
              </p>
            </div>
            <p className="font-body text-white/40 text-base max-w-[280px]">
              {caughtMafia ? "Great catch! One less Mafia in town." : "Oops... they were innocent."}
            </p>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-[#ff1b6b] to-transparent flex justify-center">
        <button
          onClick={() => dispatch({ type: "CONTINUE_AFTER_VERDICT" })}
          className="btn-big btn-white text-2xl max-w-lg w-full"
        >
          {gameOver ? "SEE RESULTS" : `BEGIN NIGHT ${state.round + 1}`}
        </button>
      </div>
    </div>
  );
}
