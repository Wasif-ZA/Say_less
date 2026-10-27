"use client";

import { useEffect } from "react";
import { OddProvider } from "@/context/OddContext";
import { useOdd } from "@/hooks/useOdd";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { OddPhase } from "@/lib/odd/types";
import { OddHomeScreen } from "./OddHomeScreen";
import { OddSetupScreen } from "./OddSetupScreen";
import { OddPickScreen } from "./OddPickScreen";
import { OddRevealScreen } from "./OddRevealScreen";
import { OddSummaryScreen } from "./OddSummaryScreen";

interface OddGameProps {
  onExit: () => void;
}

const IN_GAME: OddPhase[] = ["pick", "reveal", "summary"];

function InnerOdd({ onExit }: OddGameProps) {
  const { state, dispatch } = useOdd();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<OddPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    pick: { home: quit },
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

function screenFor(phase: OddPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <OddHomeScreen />;
    case "setup":
      return <OddSetupScreen />;
    case "pick":
      return <OddPickScreen />;
    case "reveal":
      return <OddRevealScreen />;
    case "summary":
      return <OddSummaryScreen onExit={onExit} />;
  }
}

export function OddGame({ onExit }: OddGameProps) {
  return (
    <OddProvider>
      <InnerOdd onExit={onExit} />
    </OddProvider>
  );
}
