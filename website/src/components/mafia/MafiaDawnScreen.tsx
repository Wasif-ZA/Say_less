"use client";

import { useMafia } from "@/hooks/useMafia";
import { ROLE_META } from "./roleMeta";

export function MafiaDawnScreen() {
  const { state, dispatch } = useMafia();
  const result = state.nightResult;
  const victim = result?.killedId
    ? state.players.find((p) => p.id === result.killedId)
    : undefined;

  const gameOver = state.winner !== null;

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounceIn flex flex-col items-center gap-5">
        <p className="font-display font-bold text-white/40 tracking-widest uppercase text-base">
          ☀️ Morning — Night {state.round}
        </p>

        {victim && !result?.saved ? (
          <>
            <div className="text-[80px]">☠️</div>
            <h2 className="font-display text-[40px] font-bold leading-tight">
              {victim.name} was killed in the night
            </h2>
            <div className="bg-white/8 border border-white/10 rounded-2xl px-6 py-4">
              <p className="font-display text-xl font-bold">
                They were {ROLE_META[victim.role].emoji}{" "}
                <span className={ROLE_META[victim.role].colorClass}>
                  {ROLE_META[victim.role].label}
                </span>
              </p>
            </div>
          </>
        ) : result?.saved ? (
          <>
            <div className="text-[80px]">🩺</div>
            <h2 className="font-display text-[40px] font-bold leading-tight text-accent-green">
              The Doctor made a save!
            </h2>
            <p className="font-body text-white/40 text-base max-w-[280px]">
              The Mafia struck — but their target pulled through. No one died tonight.
            </p>
          </>
        ) : (
          <>
            <div className="text-[80px]">😮‍💨</div>
            <h2 className="font-display text-[40px] font-bold leading-tight">
              No one died tonight
            </h2>
          </>
        )}

        {!gameOver && (
          <p className="font-body text-white/40 text-base max-w-[280px]">
            Time to talk. Who&apos;s acting sus?
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-[#ff1b6b] to-transparent flex justify-center">
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: gameOver ? "summary" : "day" })}
          className="btn-big btn-white text-2xl max-w-lg w-full"
        >
          {gameOver ? "SEE RESULTS" : "START DISCUSSION"}
        </button>
      </div>
    </div>
  );
}
