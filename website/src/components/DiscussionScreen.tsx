"use client";

import { line, useMountSeed } from "@/lib/lines";
import { useEffect, useRef, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { getCategoryById } from "@/lib/wordbanks";

export function DiscussionScreen() {
  const { state, dispatch } = useGame();
  const [timeLeft, setTimeLeft] = useState(state.timerSeconds || 0);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const seed = useMountSeed();
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const noTimer = state.timerSeconds === 0;
  const category = getCategoryById(state.categoryId || "");

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (noTimer) {
        setElapsed((e) => e + 1);
      } else {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            dispatch({ type: "SET_PHASE", phase: "voting" });
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, noTimer, dispatch]);

  const displayTime = noTimer ? elapsed : timeLeft;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = !noTimer && timeLeft < 10;
  const isWarning = !noTimer && timeLeft < 30 && !isUrgent;

  const total = state.timerSeconds || 1;
  const progress = noTimer ? 1 : timeLeft / total;
  const barColor = isUrgent ? "bg-hot" : isWarning ? "bg-accent-orange" : "bg-go";

  return (
    <div className="fixed inset-0 bg-imposter flex flex-col px-5"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="pt-10 animate-slideDown">
        <span className="badge bg-paper text-ink px-4! py-1! text-[15px]!">{category?.emoji} {category?.name}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center animate-bounceIn">
        <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-ink-2">
          {noTimer ? "Time elapsed" : isPaused ? "Paused" : isUrgent ? "Last seconds" : line("discuss", seed)}
        </p>
        <span className={`block text-[88px] font-bold tabular-nums leading-none tracking-tight mt-1 ${isUrgent && !isPaused ? "animate-pulse" : ""}`}>
          {timeStr}
        </span>
        {!noTimer && (
          <div className="mt-6 h-6 w-full rounded-full border-[2.5px] border-ink bg-paper overflow-hidden">
            <div className={`h-full ${barColor} border-r-[2.5px] border-ink transition-[width] duration-1000 ease-linear`} style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>

      {/* Bottom: Controls */}
      <div className="w-full pb-5 flex flex-col gap-3 max-w-lg mx-auto animate-fadeInUp stagger-2">
        {!noTimer && (
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="btn-big btn-glass text-lg"
            style={{ height: 56 }}
          >
            {isPaused ? "▶  Resume" : "⏸  Pause"}
          </button>
        )}
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "voting" })}
          className="btn-big btn-white text-2xl"
        >
          Vote
        </button>
      </div>
    </div>
  );
}
