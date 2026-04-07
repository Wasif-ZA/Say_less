"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { getCategoryById } from "@/lib/wordbanks";

export function DiscussionScreen() {
  const { state, dispatch } = useGame();
  const [timeLeft, setTimeLeft] = useState(state.timerSeconds || 0);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  // Pick background based on urgency
  const bgColor = isUrgent
    ? "bg-gradient-to-b from-red-950 to-black"
    : isWarning
      ? "bg-gradient-to-b from-orange-950 to-black"
      : "bg-solid-black";

  const textColor = isUrgent ? "text-accent-red" : isWarning ? "text-accent-orange" : "text-white";

  // Progress ratio
  const total = state.timerSeconds || 1;
  const progress = noTimer ? 1 : timeLeft / total;
  const circumference = 2 * Math.PI * 120;

  return (
    <div className={`fixed inset-0 ${bgColor} text-white flex flex-col items-center justify-between transition-colors duration-1000`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Top: Category pill */}
      <div className="pt-12 animate-slideDown">
        <div className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full">
          <span className="text-xl">{category?.emoji}</span>
          <span className="font-display font-bold text-base">{category?.name}</span>
        </div>
      </div>

      {/* Center: Timer */}
      <div className="flex flex-col items-center gap-2 animate-bounceIn">
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* SVG ring */}
          {!noTimer && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
              {/* Track */}
              <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              {/* Progress */}
              <circle
                cx="128" cy="128" r="120"
                fill="none"
                stroke={isUrgent ? "#ff3366" : isWarning ? "#ff9500" : "rgba(255,255,255,0.25)"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          )}

          {/* Time text */}
          <span className={`font-display text-[80px] font-bold tabular-nums leading-none ${textColor} transition-colors duration-700 ${isUrgent && !isPaused ? "animate-pulse" : ""}`}>
            {timeStr}
          </span>
        </div>

        <p className="text-white/30 font-body text-sm mt-2">
          {noTimer ? "Time elapsed" : isPaused ? "Paused" : "Discuss!"}
        </p>
      </div>

      {/* Bottom: Controls */}
      <div className="w-full px-5 pb-8 flex flex-col gap-3 max-w-lg mx-auto animate-fadeInUp stagger-2">
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
          VOTE
        </button>
      </div>
    </div>
  );
}
