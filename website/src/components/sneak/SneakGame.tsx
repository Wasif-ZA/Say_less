"use client";

import { useEffect } from "react";
import { SneakProvider } from "@/context/SneakContext";
import { useSneak } from "@/hooks/useSneak";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { SneakPhase } from "@/lib/sneak/types";
import { SneakHomeScreen } from "./SneakHomeScreen";
import { SneakSetupScreen } from "./SneakSetupScreen";
import { SneakDealScreen } from "./SneakDealScreen";
import { SneakLiveScreen } from "./SneakLiveScreen";
import { SneakDebriefScreen } from "./SneakDebriefScreen";
import { SneakSummaryScreen } from "./SneakSummaryScreen";

interface SneakGameProps {
  onExit: () => void;
}

const IN_GAME: SneakPhase[] = ["deal", "live", "debrief", "summary"];

function InnerSneak({ onExit }: SneakGameProps) {
  const { state, dispatch } = useSneak();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<SneakPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    deal: { home: quit },
    live: { home: quit },
    debrief: { home: quit },
    summary: { home: { ...quit, confirm: false } },
  };

  return (
    <>
      <NavBar {...nav[state.phase]} />
      {screenFor(state.phase, onExit)}
    </>
  );
}

function screenFor(phase: SneakPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <SneakHomeScreen />;
    case "setup":
      return <SneakSetupScreen />;
    case "deal":
      return <SneakDealScreen />;
    case "live":
      return <SneakLiveScreen />;
    case "debrief":
      return <SneakDebriefScreen />;
    case "summary":
      return <SneakSummaryScreen onExit={onExit} />;
  }
}

export function SneakGame({ onExit }: SneakGameProps) {
  return (
    <SneakProvider>
      <InnerSneak onExit={onExit} />
    </SneakProvider>
  );
}
