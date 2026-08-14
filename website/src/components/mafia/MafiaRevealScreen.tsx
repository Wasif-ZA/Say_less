"use client";

import { useRef, useState, useCallback } from "react";
import { useMafia } from "@/hooks/useMafia";
import { ROLE_META } from "./roleMeta";

type RevealPhase = "hidden" | "revealing" | "revealed" | "hiding";

const COVER_COLORS = ["bg-solid-blue", "bg-solid-orange", "bg-accent-pink", "bg-solid-green"];
const COVER_ICONS = ["🌃", "🌙", "🏙️", "🌆", "🌉", "⭐"];

export function MafiaRevealScreen() {
  const { state, dispatch } = useMafia();
  const [phase, setPhase] = useState<RevealPhase>("hidden");
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const lockedRef = useRef(false);

  const allRevealed = state.currentRevealIndex >= state.players.length;
  const player = state.players[state.currentRevealIndex];

  const coverColor = COVER_COLORS[state.currentRevealIndex % COVER_COLORS.length];
  const coverIcon = COVER_ICONS[state.currentRevealIndex % COVER_ICONS.length];

  const advance = useCallback(() => {
    lockedRef.current = false;
    dispatch({ type: "ADVANCE_REVEAL" });
    setPhase("hidden");
    setDragY(0);
  }, [dispatch]);

  const dismiss = useCallback(() => {
    if (phase !== "revealed") return;
    setPhase("hiding");
    setTimeout(advance, 250);
  }, [phase, advance]);

  function triggerReveal() {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setPhase("revealing");
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
    setDragY(0);
  }

  // All roles dealt — night falls
  if (allRevealed) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-bounceIn flex flex-col items-center gap-6">
          <div className="text-[80px] drop-shadow-2xl">🌙</div>
          <h2 className="font-display text-[44px] font-bold text-white leading-tight drop-shadow-md">
            Night Falls
          </h2>
          <p className="font-body text-white/40 text-base max-w-[280px]">
            Everyone close your eyes. The phone will guide each player through the night — pass it around in order.
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "BEGIN_NIGHT" })}
          className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-[#ff1b6b] to-transparent flex justify-center"
        >
          <span className="btn-big btn-white text-2xl max-w-lg w-full">BEGIN NIGHT 1</span>
        </button>
      </div>
    );
  }

  if (!player) return null;

  const meta = ROLE_META[player.role];
  const partners = state.players.filter((p) => p.role === "mafia" && p.id !== player.id);

  let coverTranslateY = dragY;
  let coverTransition = isDragging ? "none" : "transform 0.3s cubic-bezier(0.16,1,0.3,1)";
  if (phase === "revealing" || phase === "revealed") {
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "transform 0.4s cubic-bezier(0.4,0,0.2,1)";
  }
  if (phase === "hiding") {
    coverTranslateY = -window.innerHeight - 100;
    coverTransition = "none";
  }

  const showRole = phase === "revealing" || phase === "revealed" || phase === "hiding";

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white touch-none select-none">

      {/* BOTTOM LAYER — role content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
        {showRole && (
          <div className="animate-bounceIn flex flex-col items-center gap-4">
            <div className={`text-[80px] ${meta.glow}`}>{meta.emoji}</div>
            <h2 className={`font-display text-[48px] font-bold tracking-wide leading-tight ${meta.colorClass}`}>
              {meta.label}
            </h2>
            {player.role === "mafia" && partners.length > 0 && (
              <div className="bg-white/8 border border-white/10 rounded-2xl px-6 py-4">
                <p className="font-body text-white/50 text-sm mb-1">Your partners in crime:</p>
                <p className="font-display text-xl text-white font-bold">
                  {partners.map((p) => p.name).join(" · ")}
                </p>
              </div>
            )}
            <p className="font-body text-white/40 max-w-[270px] leading-relaxed text-base">
              {meta.blurb}
            </p>
          </div>
        )}

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

      {/* TOP LAYER — cover */}
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
        <div className="mt-8">
          <h1 className="font-display text-[44px] font-bold tracking-wide drop-shadow-lg px-6 text-center">
            {player.name}
          </h1>
          <p className="font-body text-white/50 text-sm text-center mt-1">
            Player {state.currentRevealIndex + 1} of {state.players.length}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute w-56 h-56 bg-black/10 rounded-full" />
          <div className="text-[110px] drop-shadow-2xl z-10">{coverIcon}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-display font-bold text-xl text-center leading-tight drop-shadow-sm max-w-[200px]">
            Swipe up to see your role
          </p>
          <div className="text-4xl font-bold mt-2 animate-bounce drop-shadow-sm">︿</div>
        </div>
      </div>
    </div>
  );
}
