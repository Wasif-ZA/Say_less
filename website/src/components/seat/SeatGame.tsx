"use client";

import { useEffect } from "react";
import { SeatProvider } from "@/context/SeatContext";
import { useSeat } from "@/hooks/useSeat";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { SeatPhase } from "@/lib/seat/types";
import { SeatHomeScreen } from "./SeatHomeScreen";
import { SeatSetupScreen } from "./SeatSetupScreen";
import { SeatVoteScreen } from "./SeatVoteScreen";
import { SeatRevealScreen } from "./SeatRevealScreen";
import { SeatSummaryScreen } from "./SeatSummaryScreen";

interface SeatGameProps {
  onExit: () => void;
}

const IN_GAME: SeatPhase[] = ["vote", "reveal", "summary"];

function InnerSeat({ onExit }: SeatGameProps) {
  const { state, dispatch } = useSeat();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<SeatPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    vote: { home: quit },
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

function screenFor(phase: SeatPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <SeatHomeScreen />;
    case "setup":
      return <SeatSetupScreen />;
    case "vote":
      return <SeatVoteScreen />;
    case "reveal":
      return <SeatRevealScreen />;
    case "summary":
      return <SeatSummaryScreen onExit={onExit} />;
  }
}

export function SeatGame({ onExit }: SeatGameProps) {
  return (
    <SeatProvider>
      <InnerSeat onExit={onExit} />
    </SeatProvider>
  );
}
