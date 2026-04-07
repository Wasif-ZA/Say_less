"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useGame } from "@/hooks/useGame";
import { getCategoryById, getHintForWord } from "@/lib/wordbanks";

type RevealPhase = "hidden" | "revealing" | "revealed" | "hiding";

const COVER_COLORS = ["bg-solid-blue", "bg-solid-orange", "bg-accent-pink", "bg-solid-green"];
const ICONS = ["🤸‍♂️", "🤹", "🏄‍♂️", "🧘", "🧗‍♂️", "🏇"];

export function RoleRevealScreen() {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<RevealPhase>("hidden");
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showFirstPlayer, setShowFirstPlayer] = useState(false);
  const startYRef = useRef(0);
  const lockedRef = useRef(false);

  const player = state.players[state.currentRevealIndex];
  const category = getCategoryById(state.categoryId || "");
  const isLast = state.currentRevealIndex >= state.players.length - 1;

  const coverColor = COVER_COLORS[state.currentRevealIndex % COVER_COLORS.length];
  const coverIcon = ICONS[state.currentRevealIndex % ICONS.length];

  // Randomly pick who goes first (stable for the round)
  const firstPlayer = useMemo(() => {
    const idx = Math.floor(Math.random() * state.players.length);
    return state.players[idx];
  }, [state.players]);

  // Navigate to discussion when all players have revealed
  useEffect(() => {
    if (state.currentRevealIndex >= state.players.length && !showFirstPlayer) {
      setShowFirstPlayer(true);
    }
  }, [state.currentRevealIndex, state.players.length, showFirstPlayer]);

  // Advance to next player
  const advance = useCallback(() => {
    lockedRef.current = false;
    dispatch({ type: "ADVANCE_REVEAL" });
    // Reset for next player
    setPhase("hidden");
    setDragY(0);
  }, [dispatch]);

  // Tap to continue — dismiss the revealed role
  const dismiss = useCallback(() => {
    if (phase !== "revealed") return;
    setPhase("hiding");
    // Brief pause then advance
    setTimeout(advance, 250);
  }, [phase, advance]);

  // Trigger reveal (cover slides off)
  function triggerReveal() {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPhase("revealing");
    // After the cover transition completes, mark as fully revealed
    setTimeout(() => setPhase("revealed"), 400);
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
    // Snap back if not past threshold
    setDragY(0);
  }

  // "Who goes first" announcement after all reveals
  if (showFirstPlayer) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-bounceIn flex flex-col items-center gap-6">
          <div className="text-[80px] drop-shadow-2xl">👆</div>
          <p className="font-display font-bold text-white/40 tracking-widest uppercase text-lg">
            Goes First
          </p>
          <h2 className="font-display text-[48px] font-bold text-white leading-tight drop-shadow-md">
            {firstPlayer?.name}
          </h2>
          <p className="font-body text-white/40 text-base mt-2 max-w-[280px]">
            Start describing the word — without saying it!
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "discussion" })}
          className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#ff1b6b] to-transparent flex justify-center"
        >
          <span className="btn-big btn-white text-2xl max-w-lg w-full">START DISCUSSION</span>
        </button>
      </div>
    );
  }

  if (!player) return null;

  const isCivilian = player.role === "civilian";

  // Cover position: during drag it follows finger, on reveal it flies off screen
  let coverTranslateY = dragY;
  let coverTransition = isDragging ? "none" : "transform 0.3s cubic-bezier(0.16,1,0.3,1)";
  if (phase === "revealing" || phase === "revealed") {
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "transform 0.4s cubic-bezier(0.4,0,0.2,1)";
  }
  if (phase === "hiding") {
    // Cover stays off screen during hiding
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "none";
  }

  // Show role content when cover is moving away or gone
  const showRole = phase === "revealing" || phase === "revealed" || phase === "hiding";

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white touch-none select-none">

      {/* BOTTOM LAYER — Role content (always mounted, just invisible when covered) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
        {showRole && (
          isCivilian ? (
            <div className="animate-bounceIn flex flex-col items-center gap-5">
              <div className="text-[80px] drop-shadow-2xl">{category?.emoji || "🎭"}</div>
              <p className="font-display font-bold text-white/40 tracking-widest uppercase text-lg">The Word Is</p>
              <h2 className="font-display text-[48px] font-bold text-white leading-tight drop-shadow-md">
                {state.secretWord}
              </h2>
            </div>
          ) : (
            <div className="animate-bounceIn flex flex-col items-center gap-4">
              <div className="text-[80px] drop-shadow-[0_0_30px_rgba(255,51,102,0.5)]">🕵️</div>
              <h2 className="font-display text-[48px] font-bold text-accent-red tracking-wide drop-shadow-[0_0_20px_rgba(255,51,102,0.3)]">
                IMPOSTER
              </h2>
              {state.hintsEnabled ? (
                <div className="mt-3 bg-white/8 border border-white/10 rounded-2xl px-6 py-4">
                  <p className="font-body text-white/40 text-xs uppercase tracking-widest mb-1">Hint</p>
                  <p className="font-display text-xl text-white font-bold">{getHintForWord(state.secretWord)}</p>
                </div>
              ) : (
                <p className="font-body text-white/40 mt-3 max-w-[260px] leading-relaxed text-base">
                  Blend in. Don&apos;t let them catch you!
                </p>
              )}
            </div>
          )
        )}

        {/* Tap to continue prompt */}
        {phase === "revealed" && (
          <button
            onClick={dismiss}
            className="absolute inset-0 w-full h-full z-10"
            aria-label="Tap to continue"
          >
            <span className="absolute bottom-14 left-0 right-0 animate-pulse text-white/30 font-display font-bold text-sm tracking-widest uppercase">
              Tap anywhere to continue
            </span>
          </button>
        )}
      </div>

      {/* TOP LAYER — Cover screen (slides up on swipe) */}
      <div
        className={`absolute inset-0 flex flex-col items-center pt-10 pb-16 z-20 ${coverColor}`}
        style={{ transform: `translateY(${coverTranslateY}px)`, transition: coverTransition }}
        onMouseDown={phase === "hidden" ? (e) => onDown(e.clientY) : undefined}
        onMouseMove={phase === "hidden" ? (e) => onMove(e.clientY) : undefined}
        onMouseUp={phase === "hidden" ? onUp : undefined}
        onMouseLeave={phase === "hidden" ? onUp : undefined}
        onTouchStart={phase === "hidden" ? (e) => onDown(e.touches[0].clientY) : undefined}
        onTouchMove={phase === "hidden" ? (e) => onMove(e.touches[0].clientY) : undefined}
        onTouchEnd={phase === "hidden" ? onUp : undefined}
      >
        {/* Player name */}
        <div className="mt-8">
          <h1 className="font-display text-[44px] font-bold tracking-wide drop-shadow-lg px-6 text-center">
            {player.name}
          </h1>
          <p className="font-body text-white/50 text-sm text-center mt-1">
            Player {state.currentRevealIndex + 1} of {state.players.length}
          </p>
        </div>

        {/* Center icon */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-56 h-56 bg-black/10 rounded-full" />
          <div className="text-[110px] drop-shadow-2xl z-10">
            {coverIcon}
          </div>
        </div>

        {/* Swipe hint */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-display font-bold text-xl text-center leading-tight drop-shadow-sm max-w-[200px]">
            Swipe up to reveal
          </p>
          <div className="text-4xl font-bold mt-2 animate-bounce drop-shadow-sm">︿</div>
        </div>
      </div>
    </div>
  );
}
