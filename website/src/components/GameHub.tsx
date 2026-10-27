"use client";

import { useState } from "react";
import { line, useLoadSeed } from "@/lib/lines";
import { Art } from "@/components/Art";
import { ScreenWrapper } from "./ScreenWrapper";

interface GameHubProps {
  onSelectGame: (game: "imposter" | "mafia" | "tune" | "potato" | "head" | "odd" | "guess" | "seat" | "sneak") => void;
}

const GAMES = [
  { id: "imposter", title: "Imposter Party", line: "Everyone gets the word except one.", players: "3+ players", emoji: "role-imposter", card: "bg-cobalt text-paper" },
  { id: "mafia", title: "Mafia", line: "The town sleeps. The Mafia doesn't.", players: "4+ players", emoji: "role-mafia", card: "bg-ink text-paper" },
  { id: "tune", title: "On the Dial", line: "One clue. Land it on the dial.", players: "2+ players", emoji: "emote-spark", card: "bg-tangerine text-ink" },
  { id: "potato", title: "Hot Potato", line: "Say it fast. Pass it faster.", players: "2+ players", emoji: "sticker-timer", card: "bg-hot text-ink" },
  { id: "head", title: "Head Case", line: "Everyone knows the word except you.", players: "2+ players", emoji: "emote-shock", card: "bg-go text-ink" },
  { id: "odd", title: "Odd One Out", line: "Pick what the crowd picks.", players: "3+ players", emoji: "sticker-vote", card: "bg-accent-blue text-ink" },
  { id: "guess", title: "Rough Guess", line: "Nobody knows. Closest wins.", players: "2+ players", emoji: "emote-spark", card: "bg-accent-orange text-ink" },
  { id: "seat", title: "Hot Seat", line: "Who's most likely to? Vote in secret.", players: "3+ players", emoji: "emote-grin", card: "bg-cobalt text-paper" },
  { id: "sneak", title: "Sneaky", line: "Pull off your secret mission. Don't get caught.", players: "3+ players", emoji: "sticker-shh", card: "bg-ink text-paper" },
] as const;

const STICKERS = [
  { e: "emote-shock", r: "-rotate-6", p: "left-0 top-2" },
  { e: "sticker-shh", r: "rotate-3", p: "left-12 top-0" },
  { e: "sticker-vote", r: "-rotate-2", p: "left-24 top-3" },
];

export function GameHub({ onSelectGame }: GameHubProps) {
  const seed = useLoadSeed();
  const [duo, setDuo] = useState(false);
  const games = duo ? GAMES.filter((g) => g.players === "2+ players") : GAMES;
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
          <div className="flex gap-2" role="group" aria-label="How many players">
            {[false, true].map((d) => (
              <button
                key={String(d)}
                onClick={() => setDuo(d)}
                aria-pressed={duo === d}
                className={`flex-1 h-11 rounded-full border-[2.5px] border-ink font-bold ${duo === d ? "bg-ink text-paper" : "bg-paper text-ink"}`}
              >
                {d ? "Just the two of us" : "All games"}
              </button>
            ))}
          </div>
          {games.map((g, i) => (
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
