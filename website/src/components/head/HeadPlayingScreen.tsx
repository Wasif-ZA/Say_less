"use client";

import { useEffect, useRef, useState } from "react";
import { useHead } from "@/hooks/useHead";
import { COUNTDOWN_SECONDS, currentStreak } from "@/lib/head/engine";
import { beep } from "@/lib/sound";

const TAP_LOCK_MS = 300;

export function HeadPlayingScreen() {
  const { state, dispatch } = useHead();
  const [startAt] = useState(() => Date.now());
  const [now, setNow] = useState(startAt);
  const [flash, setFlash] = useState<"got" | "skip" | null>(null);
  const lastTap = useRef(0);

  const elapsed = Math.floor((now - startAt) / 1000);
  const countdown = COUNTDOWN_SECONDS - elapsed;
  const timeLeft = Math.max(0, COUNTDOWN_SECONDS + state.turnSeconds - elapsed);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown > 0 || timeLeft > 0) return;
    navigator.vibrate?.(400);
    dispatch({ type: "END_TURN" });
  }, [countdown, timeLeft, dispatch]);

  useEffect(() => {
    if (countdown > 0 || timeLeft > 5) return;
    beep(timeLeft === 0 ? 440 : 990, timeLeft === 0 ? 500 : 90);
  }, [countdown, timeLeft]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 250);
    return () => clearTimeout(t);
  }, [flash]);

  function answer(got: boolean) {
    const now = Date.now();
    if (countdown > 0 || now - lastTap.current < TAP_LOCK_MS) return;
    lastTap.current = now;
    setFlash(got ? "got" : "skip");
    navigator.vibrate?.(got ? 60 : [30, 40, 30]);
    beep(got ? 1320 : 330, 70);
    dispatch({ type: "ANSWER", got });
  }

  const bg = flash === "got" ? "bg-paper" : flash === "skip" ? "bg-hot" : "bg-head";
  const got = state.results.filter((r) => r.got).length;
  const streak = currentStreak(state.results);

  return (
    <div className={`fixed inset-0 select-none text-ink transition-colors duration-150 ${bg}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        {countdown > 0 ? (
          <>
            <p className="text-xl font-bold">On your forehead!</p>
            <p key={countdown} className="font-poster text-[140px] leading-none animate-bounceIn">{countdown}</p>
          </>
        ) : (
          <>
            <p className="font-poster text-[40px] leading-none tabular-nums">{timeLeft}</p>
            <h1 key={state.deckPos} className="font-poster text-[64px] uppercase leading-[0.95] mt-6 break-words animate-bounceIn">
              {state.deck[state.deckPos]}
            </h1>
            <p className="font-bold mt-6">{got} guessed</p>
            {streak >= 2 && <p key={streak} className="font-poster text-3xl uppercase mt-2 animate-bounceIn">🔥 {streak} in a row</p>}
          </>
        )}
      </div>

      <div className="absolute inset-0 flex">
        <button onClick={() => answer(false)} aria-label="Skip" className="flex-1 flex items-end justify-start p-6 pb-10 font-bold">
          ← Skip
        </button>
        <button onClick={() => answer(true)} aria-label="Got it" className="flex-1 flex items-end justify-end p-6 pb-10 font-bold">
          Got it →
        </button>
      </div>
    </div>
  );
}
