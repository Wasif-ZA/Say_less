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
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { GamePhase } from "@/lib/types";

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
  const { state, dispatch } = useGame();

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

  const go = (phase: GamePhase) => () => dispatch({ type: "SET_PHASE", phase });
  const home: NavTarget = { label: "Home", onClick: go("home"), confirm: true };
  const nav: Record<GamePhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    category: { back: { label: "Back", onClick: go("home") } },
    players: { back: { label: "Back", onClick: go("category") }, home: { ...home, confirm: false } },
    reveal: { back: { label: "Redeal", onClick: go("players"), confirm: true }, home },
    discussion: { home },
    voting: { back: { label: "Back", onClick: go("discussion") }, home },
    summary: { home: { ...home, confirm: false } },
  };

  const Screen = state.phase === "home" ? null : screens[state.phase];
  return (
    <>
      <NavBar {...nav[state.phase]} />
      {Screen ? <Screen /> : <HomeScreen />}
    </>
  );
}

export function ImposterPartyGame({ onExit }: ImposterPartyProps) {
  return (
    <GameProvider>
      <InnerApp onExit={onExit} />
    </GameProvider>
  );
}
