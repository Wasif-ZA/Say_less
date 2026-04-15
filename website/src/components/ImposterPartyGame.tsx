"use client";

import { useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { GameProvider } from "@/context/GameContext";
import { HomeScreen } from "@/components/HomeScreen";
import { CategorySelectScreen } from "@/components/CategorySelectScreen";
import { PlayerSetupScreen } from "@/components/PlayerSetupScreen";
import { RoleRevealScreen } from "@/components/RoleRevealScreen";
import { DiscussionScreen } from "@/components/DiscussionScreen";
import { VotingScreen } from "@/components/VotingScreen";
import { SummaryScreen } from "@/components/SummaryScreen";

const screens = {
  category: CategorySelectScreen,
  players: PlayerSetupScreen,
  reveal: RoleRevealScreen,
  discussion: DiscussionScreen,
  voting: VotingScreen,
  summary: SummaryScreen,
} as const;

interface ImposterPartyProps {
  onExit: () => void;
}

function InnerApp({ onExit }: ImposterPartyProps) {
  const { state } = useGame();

  useEffect(() => {
    const gamePhases = ["reveal", "discussion", "voting", "summary"];
    if (gamePhases.includes(state.phase)) {
      const handler = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handler);
      return () => window.removeEventListener("popstate", handler);
    }
  }, [state.phase]);

  if (state.phase === "home") {
    return <HomeScreen onExit={onExit} />;
  }

  const Screen = screens[state.phase];
  return <Screen />;
}

export function ImposterPartyGame({ onExit }: ImposterPartyProps) {
  return (
    <GameProvider>
      <InnerApp onExit={onExit} />
    </GameProvider>
  );
}
