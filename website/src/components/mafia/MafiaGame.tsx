"use client";

import { useEffect } from "react";
import { MafiaProvider } from "@/context/MafiaContext";
import { useMafia } from "@/hooks/useMafia";
import { MafiaHomeScreen } from "./MafiaHomeScreen";
import { MafiaSetupScreen } from "./MafiaSetupScreen";
import { MafiaRevealScreen } from "./MafiaRevealScreen";
import { MafiaNightScreen } from "./MafiaNightScreen";
import { MafiaDawnScreen } from "./MafiaDawnScreen";
import { MafiaDayScreen } from "./MafiaDayScreen";
import { MafiaVerdictScreen } from "./MafiaVerdictScreen";
import { MafiaSummaryScreen } from "./MafiaSummaryScreen";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { MafiaPhase } from "@/lib/mafia/types";

interface MafiaGameProps {
  onExit: () => void;
}

function InnerMafia({ onExit }: MafiaGameProps) {
  const { state, dispatch } = useMafia();

  // Block browser back during an active game, going back would leak roles
  useEffect(() => {
    const gamePhases = ["reveal", "night", "dawn", "day", "verdict", "summary"];
    if (gamePhases.includes(state.phase)) {
      const handler = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handler);
      return () => window.removeEventListener("popstate", handler);
    }
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<MafiaPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    reveal: { back: { label: "Redeal", onClick: () => dispatch({ type: "SET_PHASE", phase: "setup" }), confirm: true }, home: quit },
    night: { home: quit },
    dawn: { home: quit },
    day: { home: quit },
    verdict: { home: quit },
    summary: { home: { ...quit, confirm: false } },
  };

  return (
    <>
      <NavBar {...nav[state.phase]} />
      {screenFor(state.phase, onExit)}
    </>
  );
}

function screenFor(phase: MafiaPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <MafiaHomeScreen />;
    case "setup":
      return <MafiaSetupScreen />;
    case "reveal":
      return <MafiaRevealScreen />;
    case "night":
      return <MafiaNightScreen />;
    case "dawn":
      return <MafiaDawnScreen />;
    case "day":
      return <MafiaDayScreen />;
    case "verdict":
      return <MafiaVerdictScreen />;
    case "summary":
      return <MafiaSummaryScreen onExit={onExit} />;
  }
}

export function MafiaGame({ onExit }: MafiaGameProps) {
  return (
    <MafiaProvider>
      <InnerMafia onExit={onExit} />
    </MafiaProvider>
  );
}
