"use client";

import { useRef, useState, useCallback } from "react";
import { useGame } from "@/hooks/useGame";
import { getCategoryById, getHintForWord } from "@/lib/wordbanks";

type RevealPhase = "hidden" | "revealing" | "revealed" | "hiding";

export function RoleRevealScreen() {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<RevealPhase>("hidden");
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const showFirstPlayer = state.currentRevealIndex >= state.players.length;
  const startYRef = useRef(0);
  const lockedRef = useRef(false);

  const player = state.players[state.currentRevealIndex];
  const category = getCategoryById(state.categoryId || "");

  // Randomly pick a civilian to go first (stable for the round)
  const [firstPlayer] = useState(() => {
    const civilians = state.players.filter((p) => p.role === "civilian");
    return civilians[Math.floor(Math.random() * civilians.length)];
  });

  // Advance to next player
  const advance = useCallback(() => {
    lockedRef.current = false;
    dispatch({ type: "ADVANCE_REVEAL" });
    setPhase("hidden");
    setDragY(0);
  }, [dispatch]);

  // Hide the secret immediately, then hand over
  const dismiss = useCallback(() => {
    if (phase !== "revealed") return;
    setPhase("hiding");
    setTimeout(advance, 250);
  }, [phase, advance]);

  function triggerReveal() {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPhase("revealing");
    setTimeout(() => setPhase("revealed"), 300);
  }

  function onDown(clientY: number) {
    if (phase !== "hidden") return;
    setIsDragging(true);
    startYRef.current = clientY;
  }

  function onMove(clientY: number) {
    if (!isDragging || phase !== "hidden") return;
    const delta = Math.min(0, clientY - startYRef.current);
    setDragY(delta);
    if (delta <= -150) {
      setIsDragging(false);
      triggerReveal();
    }
  }

  function onUp() {
    if (!isDragging) return;
    setIsDragging(false);
    setDragY(0);
  }

  if (showFirstPlayer) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-imposter flex flex-col px-5 pt-14 pb-5">
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-bounceIn">
          <div className="card-surface tape rounded-[20px] px-8 pt-8 pb-7 w-full max-w-sm -rotate-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-2">Goes first</p>
            <h2 className="font-poster text-[56px] leading-none uppercase mt-2 break-words text-balance">{firstPlayer?.name}</h2>
          </div>
          <p className="text-[16px] font-semibold mt-8 max-w-[280px] text-ink-2">Describe the word without saying it.</p>
        </div>
        <button onClick={() => dispatch({ type: "SET_PHASE", phase: "discussion" })} className="btn-big btn-white text-xl max-w-lg w-full mx-auto">
          Start discussion
        </button>
      </div>
    );
  }

  if (!player) return null;

  const isCivilian = player.role === "civilian";

  let coverTranslateY = dragY;
  let coverTransition = isDragging ? "none" : "transform 0.25s cubic-bezier(0.16,1,0.3,1)";
  if (phase === "revealing" || phase === "revealed") {
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
  }
  if (phase === "hiding") {
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "none";
  }

  const showRole = phase === "revealing" || phase === "revealed";

  return (
    <div className="fixed inset-0 overflow-hidden bg-imposter touch-none select-none">

      {/* Secret card, only rendered while the sleeve is off */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center z-0">
        {showRole && (
          <div className="card-surface rounded-[20px] w-full max-w-sm px-6 pt-7 pb-8 animate-bounceIn">
            {isCivilian ? (
              <>
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-2">
                  {category?.emoji} {category?.name} · the word is
                </p>
                <h2 className="font-poster text-[52px] leading-[0.95] uppercase mt-3 break-words text-balance">{state.secretWord}</h2>
              </>
            ) : (
              <>
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-2">You are the</p>
                <h2 className="font-poster text-[60px] leading-none uppercase mt-2">Imposter</h2>
                {state.hintsEnabled ? (
                  <p className="mt-4 inline-block rounded-full border-[2.5px] border-ink bg-pink px-4 py-1.5 text-[16px] font-bold">
                    Hint: {getHintForWord(state.secretWord, state.categoryId)}
                  </p>
                ) : (
                  <p className="text-[16px] font-semibold mt-3 text-ink-2">Blend in. Don&apos;t get caught.</p>
                )}
              </>
            )}
          </div>
        )}

        {phase === "revealed" && (
          <button onClick={dismiss} className="absolute inset-0 w-full h-full z-10" aria-label="Hide and pass">
            <span className="absolute bottom-6 left-5 right-5 btn-big btn-glass text-xl w-auto!">Hide and pass</span>
          </button>
        )}
      </div>

      {/* Sleeve: identical for every player, lifts on swipe */}
      <div
        className="absolute inset-0 flex flex-col items-center px-5 pt-14 pb-5 z-20 bg-imposter"
        style={{ transform: `translateY(${coverTranslateY}px)`, transition: coverTransition }}
        onMouseDown={phase === "hidden" ? (e) => onDown(e.clientY) : undefined}
        onMouseMove={phase === "hidden" ? (e) => onMove(e.clientY) : undefined}
        onMouseUp={phase === "hidden" ? onUp : undefined}
        onMouseLeave={phase === "hidden" ? onUp : undefined}
        onTouchStart={phase === "hidden" ? (e) => onDown(e.touches[0].clientY) : undefined}
        onTouchMove={phase === "hidden" ? (e) => onMove(e.touches[0].clientY) : undefined}
        onTouchEnd={phase === "hidden" ? onUp : undefined}
      >
        <p className="text-[14px] font-bold text-ink-2">Player {state.currentRevealIndex + 1} of {state.players.length}</p>
        <h1 className="font-poster text-[56px] leading-none uppercase mt-1 text-center break-words text-balance">{player.name}</h1>

        <div className="flex-1 w-full flex items-center justify-center">
          <div className="card-surface tape rounded-[20px] w-full max-w-sm aspect-[4/5] bg-ink! flex flex-col items-center justify-center gap-5 rotate-1">
            <span className="clip-label bg-paper! text-ink!">Private</span>
            <span className="text-[64px]" aria-hidden>🤫</span>
            <span className="text-[15px] font-semibold text-paper text-center px-8">Only {player.name} looks. Everyone else, eyes away.</span>
          </div>
        </div>

        <div className="w-full max-w-lg flex flex-col items-center gap-3">
          <p className="text-[16px] font-bold">Swipe up to reveal</p>
          <button onClick={triggerReveal} className="btn-big btn-white text-xl w-full">Reveal</button>
        </div>
      </div>
    </div>
  );
}
