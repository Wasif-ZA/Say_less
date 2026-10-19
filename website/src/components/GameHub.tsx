"use client";

import Image from "next/image";
import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter" | "mafia") => void;
}

const GAMES = [
  { id: "imposter", title: "Imposter Party", line: "Everyone gets the word except one.", players: "3+ players", animal: "silver-fox" },
  { id: "mafia", title: "Mafia", line: "The town sleeps. The Mafia doesn't.", players: "4+ players", animal: "lynx" },
] as const;

export function GameHub({ onSelectGame }: GameHubProps) {
  return (
    <ScreenWrapper bgClassName="scene-hub">
      <div className="flex flex-col flex-1 justify-between gap-8 py-6 w-full">
        <div className="animate-slideDown pt-6">
          <h1 className="font-display text-[64px] font-bold leading-[0.9] tracking-tight drop-shadow-lg">
            Say<br />less.
          </h1>
          <p className="font-body font-semibold text-white/90 text-lg mt-3 drop-shadow-md">One phone. Pass it round. Trust no one.</p>
        </div>

        <div className="flex flex-col gap-4">
          {GAMES.map((g, i) => (
            <button
              key={g.id}
              onClick={() => onSelectGame(g.id)}
              className={`animate-fadeInUp stagger-${i + 1} card-surface relative w-full min-h-[150px] rounded-[24px] p-5 pr-36 text-left overflow-hidden transition-transform duration-150 active:scale-[0.98]`}
            >
              <Image
                src={`/animals/${g.animal}.webp`}
                alt=""
                width={256}
                height={256}
                className="absolute -right-4 bottom-0 w-40 h-40 object-contain"
                priority
              />
              <span className="text-xs font-bold uppercase tracking-wide text-clay">{g.players}</span>
              <h2 className="font-display text-[32px] font-bold leading-none mt-2">{g.title}</h2>
              <p className="font-body font-semibold text-[15px] mt-2 text-white/70">{g.line}</p>
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}
