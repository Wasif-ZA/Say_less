"use client";

import { useEffect } from "react";
import { PotatoProvider } from "@/context/PotatoContext";
import { usePotato } from "@/hooks/usePotato";
import { NavBar, type NavTarget } from "@/components/NavBar";
import type { PotatoPhase } from "@/lib/potato/types";
import { PotatoHomeScreen } from "./PotatoHomeScreen";
import { PotatoSetupScreen } from "./PotatoSetupScreen";
import { PotatoReadyScreen } from "./PotatoReadyScreen";
import { PotatoPlayingScreen } from "./PotatoPlayingScreen";
import { PotatoBoomScreen } from "./PotatoBoomScreen";
import { PotatoSummaryScreen } from "./PotatoSummaryScreen";

interface PotatoGameProps {
  onExit: () => void;
}

const IN_GAME: PotatoPhase[] = ["ready", "playing", "boom", "summary"];

function InnerPotato({ onExit }: PotatoGameProps) {
  const { state, dispatch } = usePotato();

  useEffect(() => {
    if (!IN_GAME.includes(state.phase)) return;
    const handler = () => window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [state.phase]);

  const quit: NavTarget = { label: "Home", onClick: () => dispatch({ type: "FULL_RESET" }), confirm: true };
  const nav: Record<PotatoPhase, { back?: NavTarget; home?: NavTarget }> = {
    home: { back: { label: "Games", onClick: onExit } },
    setup: { back: { label: "Back", onClick: () => dispatch({ type: "SET_PHASE", phase: "home" }) } },
    ready: { home: quit },
    playing: { home: quit },
    boom: { home: quit },
    summary: { home: { ...quit, confirm: false } },
  };

  return (
    <>
      <NavBar {...nav[state.phase]} />
      {screenFor(state.phase, onExit)}
    </>
  );
}

function screenFor(phase: PotatoPhase, onExit: () => void) {
  switch (phase) {
    case "home":
      return <PotatoHomeScreen />;
    case "setup":
      return <PotatoSetupScreen />;
    case "ready":
      return <PotatoReadyScreen />;
    case "playing":
      return <PotatoPlayingScreen />;
    case "boom":
      return <PotatoBoomScreen />;
    case "summary":
      return <PotatoSummaryScreen onExit={onExit} />;
  }
}

export function PotatoGame({ onExit }: PotatoGameProps) {
  return (
    <PotatoProvider>
      <InnerPotato onExit={onExit} />
    </PotatoProvider>
  );
}
