"use client";

import { useEffect } from "react";
import { TuneProvider } from "@/context/TuneContext";
import { useTune } from "@/hooks/useTune";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { TunePhase } from "@/lib/tune/types";
import { TuneHomeScreen } from "./TuneHomeScreen";
import { TuneSetupScreen } from "./TuneSetupScreen";
import { TunePsychicScreen } from "./TunePsychicScreen";
import { TuneGuessScreen } from "./TuneGuessScreen";
import { TuneRevealScreen } from "./TuneRevealScreen";
import { TuneSummaryScreen } from "./TuneSummaryScreen";

interface TuneGameProps {
  onExit: () => void;
}

const IN_GAME: TunePhase[] = ["psychic", "guess", "reveal", "summary"];

function InnerTune({ onExit }: TuneGameProps) {
  const { state, dispatch } = useTune();

  // Block browser back mid-round, going back would show the target
  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<TunePhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    psychic: { home: quit },
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

function screenFor(phase: TunePhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <TuneHomeScreen />;
    case "setup":
      return <TuneSetupScreen />;
    case "psychic":
      return <TunePsychicScreen />;
    case "guess":
      return <TuneGuessScreen />;
    case "reveal":
      return <TuneRevealScreen />;
    case "summary":
      return <TuneSummaryScreen onExit={onExit} />;
  }
}

export function TuneGame({ onExit }: TuneGameProps) {
  return (
    <TuneProvider>
      <InnerTune onExit={onExit} />
    </TuneProvider>
  );
}
