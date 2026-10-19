"use client";

import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter" | "mafia") => void;
}

const GAMES = [
  {
    id: "imposter",
    title: "Imposter Party",
    line: "Everyone gets the word except one.",
    players: "3+ players",
    emoji: "🕵️",
    card: "bg-imposter text-white",
    tilt: "-rotate-2",
  },
  {
    id: "mafia",
    title: "Mafia",
    line: "The town sleeps. The Mafia doesn't.",
    players: "4+ players",
    emoji: "🌃",
    card: "bg-mafia text-acid",
    tilt: "rotate-2",
  },
] as const;

export function GameHub({ onSelectGame }: GameHubProps) {
  return (
    <ScreenWrapper bgClassName="bg-ink">
      <div className="flex flex-col flex-1 justify-center gap-10 py-8 w-full">
        <div className="animate-slideDown">
          <h1 className="font-display text-[64px] font-bold leading-[0.9] tracking-tight">
            Say<br />less.
          </h1>
          <p className="font-body text-white/60 text-lg mt-3">One phone. Pass it round. Trust no one.</p>
        </div>

        <div className="flex flex-col gap-6">
          {GAMES.map((g, i) => (
            <button
              key={g.id}
              onClick={() => onSelectGame(g.id)}
              className={`animate-fadeInUp stagger-${i + 1} relative w-full min-h-[168px] rounded-[24px] border-[3px] border-ink p-6 text-left overflow-hidden shadow-[0_8px_0_#000] transition-transform duration-150 active:translate-y-1 active:shadow-[0_3px_0_#000] ${g.card} ${g.tilt}`}
            >
              <span className="absolute -right-3 -bottom-4 text-[110px] leading-none select-none" aria-hidden>
                {g.emoji}
              </span>
              <span className="inline-block rounded-full border-2 border-current px-3 py-0.5 text-xs font-bold uppercase opacity-80">
                {g.players}
              </span>
              <h2 className="font-display text-[38px] font-bold leading-none mt-4 max-w-[70%]">{g.title}</h2>
              <p className="font-body font-semibold text-[15px] mt-2 max-w-[62%] opacity-80">{g.line}</p>
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}
