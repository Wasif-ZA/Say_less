"use client";

import { useEffect, useState } from "react";
import { useSneak } from "@/hooks/useSneak";
import { beep } from "@/lib/sound";

export function SneakLiveScreen() {
  const { state, dispatch } = useSneak();
  const total = state.minutes * 60;
  const [timeLeft, setTimeLeft] = useState(total);
  const [isPaused, setIsPaused] = useState(false);
  const done = timeLeft <= 0;

  useEffect(() => {
    if (isPaused || done) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [isPaused, done]);

  useEffect(() => {
    if (!done) return;
    [0, 250, 500].forEach((ms) => setTimeout(() => beep(), ms));
    navigator.vibrate?.(400);
    dispatch({ type: "SET_PHASE", phase: "debrief" });
  }, [done, dispatch]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = timeLeft < 10;
  const isWarning = timeLeft < 30 && !isUrgent;
  const barColor = isUrgent ? "bg-hot" : isWarning ? "bg-accent-orange" : "bg-go";

  return (
    <div className="fixed inset-0 bg-sneak flex flex-col px-5"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex-1 flex flex-col justify-center animate-bounceIn">
        <p className="text-[15px] font-bold uppercase tracking-[0.08em] opacity-75">
          {isPaused ? "Paused" : isUrgent ? "Last seconds" : "Missions live"}
        </p>
        <span className={`block text-[88px] font-bold tabular-nums leading-none tracking-tight mt-1 ${isUrgent && !isPaused ? "animate-pulse" : ""}`}>
          {timeStr}
        </span>
        <div className="mt-6 h-6 w-full rounded-full border-[2.5px] border-ink bg-paper overflow-hidden">
          <div className={`h-full ${barColor} border-r-[2.5px] border-ink transition-[width] duration-1000 ease-linear`} style={{ width: `${(timeLeft / total) * 100}%` }} />
        </div>
        <p className="mt-6 text-base leading-snug max-w-sm opacity-90">
          Pull off your mission without anyone noticing. Think someone&apos;s on a mission? Call it out loud. Guess it right and their mission is busted.
        </p>
      </div>

      <div className="w-full pb-5 flex flex-col gap-3 max-w-lg mx-auto animate-fadeInUp stagger-2">
        <button onClick={() => setIsPaused((p) => !p)} className="btn-big btn-glass text-lg" style={{ height: 56 }}>
          {isPaused ? "▶  Resume" : "⏸  Pause"}
        </button>
        <button onClick={() => dispatch({ type: "SET_PHASE", phase: "debrief" })} className="btn-big btn-white text-2xl">
          End early
        </button>
      </div>
    </div>
  );
}
