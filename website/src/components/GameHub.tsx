"use client";

import { line, useLoadSeed } from "@/lib/lines";
import { Art } from "@/components/Art";
import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter" | "mafia" | "tune") => void;
}

const GAMES = [
  { id: "imposter", title: "Imposter Party", line: "Everyone gets the word except one.", players: "3+ players", emoji: "role-imposter", card: "bg-cobalt text-paper" },
  { id: "mafia", title: "Mafia", line: "The town sleeps. The Mafia doesn't.", players: "4+ players", emoji: "role-mafia", card: "bg-ink text-paper" },
  { id: "tune", title: "On the Dial", line: "One clue. Land it on the dial.", players: "3+ players", emoji: "emote-spark", card: "bg-tangerine text-ink" },
] as const;

const STICKERS = [
  { e: "emote-shock", r: "-rotate-6", p: "left-0 top-2" },
  { e: "sticker-shh", r: "rotate-3", p: "left-12 top-0" },
  { e: "sticker-vote", r: "-rotate-2", p: "left-24 top-3" },
];

export function GameHub({ onSelectGame }: GameHubProps) {
  const seed = useLoadSeed();
  return (
    <ScreenWrapper bgClassName="bg-hub">
      <div className="flex flex-col flex-1 justify-between gap-8 py-4 w-full">
        <div className="animate-slideDown pt-4">
          <div className="relative h-20 w-44 mb-3" aria-hidden>
            {STICKERS.map((s) => (
              <span key={s.e} className={`absolute ${s.p} ${s.r} w-16 h-16`}>
                <Art name={s.e} className="w-16 h-16" />
              </span>
            ))}
          </div>
          <h1 className="font-poster text-[96px] leading-[0.86] uppercase">Say<br />less</h1>
          <p className="text-[17px] font-semibold mt-4 text-ink-2">{line("hubTagline", seed)}</p>
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
              <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden><Art name={g.emoji} className="w-20 h-20" /></span>
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
}
