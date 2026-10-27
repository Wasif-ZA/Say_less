"use client";

import { useEffect } from "react";
import { GuessProvider } from "@/context/GuessContext";
import { useGuess } from "@/hooks/useGuess";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { GuessPhase } from "@/lib/guess/types";
import { GuessHomeScreen } from "./GuessHomeScreen";
import { GuessSetupScreen } from "./GuessSetupScreen";
import { GuessPickScreen } from "./GuessPickScreen";
import { GuessRevealScreen } from "./GuessRevealScreen";
import { GuessSummaryScreen } from "./GuessSummaryScreen";

interface GuessGameProps {
  onExit: () => void;
}

const IN_GAME: GuessPhase[] = ["guess", "reveal", "summary"];

function InnerGuess({ onExit }: GuessGameProps) {
  const { state, dispatch } = useGuess();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<GuessPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    guess: { home: quit },
    reveal: { home: quit },
    summary: { home: { ...quit, confirm: false } },
  };

  return (
    <>
      <NavBar {...nav[state.phase]} />
      {screenFor(state.phase, onExit)}
    </>
  );
}

function screenFor(phase: GuessPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <GuessHomeScreen />;
    case "setup":
      return <GuessSetupScreen />;
    case "guess":
      return <GuessPickScreen />;
    case "reveal":
      return <GuessRevealScreen />;
    case "summary":
      return <GuessSummaryScreen onExit={onExit} />;
  }
}

export function GuessGame({ onExit }: GuessGameProps) {
  return (
    <GuessProvider>
      <InnerGuess onExit={onExit} />
    </GuessProvider>
  );
}
