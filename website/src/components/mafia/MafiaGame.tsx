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

interface MafiaGameProps {
  onExit: () => void;
}

function InnerMafia({ onExit }: MafiaGameProps) {
  const { state } = useMafia();

  // Block browser back during an active game — going back would leak roles
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

  switch (state.phase) {
    case "home":
      return <MafiaHomeScreen onExit={onExit} />;
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
