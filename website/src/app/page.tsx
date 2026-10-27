"use client";

import { useState } from "react";
import { GameHub } from "@/components/GameHub";
import { ImposterPartyGame } from "@/components/ImposterPartyGame";
import { MafiaGame } from "@/components/mafia/MafiaGame";
import { TuneGame } from "@/components/tune/TuneGame";

type GameType = "hub" | "imposter" | "mafia" | "tune";

export default function Page() {
  const [currentGame, setCurrentGame] = useState<GameType>("hub");

  if (currentGame === "hub") {
    return <GameHub onSelectGame={setCurrentGame} />;
  }

  if (currentGame === "imposter") {
    return <ImposterPartyGame key="imposter" onExit={() => setCurrentGame("hub")} />;
  }

  if (currentGame === "mafia") {
    return <MafiaGame key="mafia" onExit={() => setCurrentGame("hub")} />;
  }

  if (currentGame === "tune") {
    return <TuneGame key="tune" onExit={() => setCurrentGame("hub")} />;
  }

  return null;
}
