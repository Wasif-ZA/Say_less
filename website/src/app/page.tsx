"use client";

import { useState } from "react";
import { GameHub } from "@/components/GameHub";
import { ImposterPartyGame } from "@/components/ImposterPartyGame";

type GameType = "hub" | "imposter";

export default function Page() {
  const [currentGame, setCurrentGame] = useState<GameType>("hub");

  if (currentGame === "hub") {
    return <GameHub onSelectGame={setCurrentGame} />;
  }

  if (currentGame === "imposter") {
    return <ImposterPartyGame key="imposter" onExit={() => setCurrentGame("hub")} />;
  }

  return null;
}
