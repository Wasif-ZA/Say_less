"use client";

import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter" | "mafia") => void;
}

const GAMES = [
  { id: "imposter", title: "Imposter Party", line: "Everyone gets the word except one.", players: "3+ players", emoji: "🕵️", card: "bg-pink" },
  { id: "mafia", title: "Mafia", line: "The town sleeps. The Mafia doesn't.", players: "4+ players", emoji: "🌙", card: "bg-ink text-paper" },
] as const;

const STICKERS = [
  { e: "🤫", r: "-rotate-6", p: "left-0 top-2" },
  { e: "🕵️", r: "rotate-3", p: "left-10 top-0" },
  { e: "🗳️", r: "-rotate-2", p: "left-20 top-3" },
];

export function GameHub({ onSelectGame }: GameHubProps) {
  return (
    <ScreenWrapper bgClassName="bg-hub">
      <div className="flex flex-col flex-1 justify-between gap-8 py-4 w-full">
        <div className="animate-slideDown pt-4">
          <div className="relative h-16 w-36 mb-3" aria-hidden>
            {STICKERS.map((s) => (
              <span key={s.e} className={`absolute ${s.p} ${s.r} w-14 h-14 rounded-full bg-paper border-[2.5px] border-ink flex items-center justify-center text-3xl`}>
                {s.e}
              </span>
            ))}
          </div>
          <h1 className="font-poster text-[96px] leading-[0.86] uppercase">Say<br />less</h1>
          <p className="text-[17px] font-semibold mt-4 text-ink-2">One phone. Pass it round. Trust no one.</p>
        </div>

        <div className="flex flex-col gap-4">
          {GAMES.map((g, i) => (
            <button
              key={g.id}
              onClick={() => onSelectGame(g.id)}
              className={`animate-fadeInUp stagger-${i + 1} relative w-full rounded-[20px] border-[2.5px] border-ink p-5 pr-24 text-left shadow-[4px_4px_0_#0b0d12] transition-transform duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#0b0d12] ${g.card}`}
            >
              <span className="badge">{g.players}</span>
              <h2 className="font-poster text-[44px] leading-none uppercase mt-3">{g.title}</h2>
              <p className="text-[15px] font-semibold mt-2">{g.line}</p>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[52px]" aria-hidden>{g.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}
