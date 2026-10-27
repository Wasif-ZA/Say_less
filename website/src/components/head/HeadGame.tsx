"use client";

import { useEffect } from "react";
import { HeadProvider } from "@/context/HeadContext";
import { useHead } from "@/hooks/useHead";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { HeadPhase } from "@/lib/head/types";
import { HeadHomeScreen } from "./HeadHomeScreen";
import { HeadSetupScreen } from "./HeadSetupScreen";
import { HeadReadyScreen } from "./HeadReadyScreen";
import { HeadPlayingScreen } from "./HeadPlayingScreen";
import { HeadTurnEndScreen } from "./HeadTurnEndScreen";
import { HeadSummaryScreen } from "./HeadSummaryScreen";

interface HeadGameProps {
  onExit: () => void;
}

const IN_GAME: HeadPhase[] = ["ready", "playing", "turnEnd", "summary"];

function InnerHead({ onExit }: HeadGameProps) {
  const { state, dispatch } = useHead();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<HeadPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    ready: { home: quit },
    playing: {},
    turnEnd: { home: quit },
    summary: { home: { ...quit, confirm: false } },
  };

  return (
    <>
      <NavBar {...nav[state.phase]} />
      {screenFor(state.phase, onExit)}
    </>
  );
}

function screenFor(phase: HeadPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <HeadHomeScreen />;
    case "setup":
      return <HeadSetupScreen />;
    case "ready":
      return <HeadReadyScreen />;
    case "playing":
      return <HeadPlayingScreen />;
    case "turnEnd":
      return <HeadTurnEndScreen />;
    case "summary":
      return <HeadSummaryScreen onExit={onExit} />;
  }
}

export function HeadGame({ onExit }: HeadGameProps) {
  return (
    <HeadProvider>
      <InnerHead onExit={onExit} />
    </HeadProvider>
  );
}
