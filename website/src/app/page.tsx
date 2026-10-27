"use client";

import { useState } from "react";
import { GameHub } from "@/components/GameHub";
import { ImposterPartyGame } from "@/components/ImposterPartyGame";
import { MafiaGame } from "@/components/mafia/MafiaGame";
import { TuneGame } from "@/components/tune/TuneGame";
import { PotatoGame } from "@/components/potato/PotatoGame";
import { HeadGame } from "@/components/head/HeadGame";
import { OddGame } from "@/components/odd/OddGame";

type GameType = "hub" | "imposter" | "mafia" | "tune" | "potato" | "head" | "odd";

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

  if (currentGame === "potato") {
    return <PotatoGame key="potato" onExit={() => setCurrentGame("hub")} />;
  }

  if (currentGame === "head") {
    return <HeadGame key="head" onExit={() => setCurrentGame("hub")} />;
  }

  if (currentGame === "odd") {
    return <OddGame key="odd" onExit={() => setCurrentGame("hub")} />;
  }

  return null;
}
