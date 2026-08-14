"use client";

import { useMafia } from "@/hooks/useMafia";
import { ScreenWrapper } from "../ScreenWrapper";
import { AVATAR_BG, ROLE_META } from "./roleMeta";

interface MafiaSummaryScreenProps {
  onExit: () => void;
}

export function MafiaSummaryScreen({ onExit }: MafiaSummaryScreenProps) {
  const { state, dispatch } = useMafia();
  const townWins = state.winner === "town";

  return (
    <ScreenWrapper bgClassName="bg-dark-immersive">
      {/* Winner banner */}
      <div className="text-center pt-6 pb-5 animate-bounceIn">
        <div className="text-[80px] mb-2">{townWins ? "🎉" : "🔪"}</div>
        <h1 className={`font-display text-[44px] font-bold tracking-wide leading-tight drop-shadow-lg ${
          townWins ? "text-accent-green" : "text-accent-red"
        }`}>
          {townWins ? "TOWN WINS!" : "MAFIA WINS!"}
        </h1>
        <p className="font-body text-white/50 mt-2 text-base">
          {townWins
            ? "Every last Mafia was voted out. Justice served."
            : "The Mafia took over the town. Better luck next time."}
        </p>
      </div>

      {/* Role reveal */}
      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide animate-fadeInUp stagger-2">
        <div className="card-surface rounded-[28px] p-5 border border-white/10">
          <h2 className="font-display text-xl font-bold mb-4">The Whole Truth</h2>
          <div className="flex flex-col gap-2">
            {state.players.map((player, i) => {
              const meta = ROLE_META[player.role];
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
                    player.role === "mafia" ? "bg-accent-red/10 border border-accent-red/20" : "bg-white/5"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0 ${AVATAR_BG[i % AVATAR_BG.length]} ${player.isAlive ? "" : "opacity-40"}`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`flex-1 font-body font-semibold text-[15px] truncate ${player.isAlive ? "text-white" : "text-white/40 line-through"}`}>
                    {player.name}
                  </span>
                  <span className={`font-display font-bold text-sm ${meta.colorClass}`}>
                    {meta.emoji} {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pb-2 animate-fadeInUp stagger-3">
        <button onClick={() => dispatch({ type: "PLAY_AGAIN" })} className="btn-big btn-red text-xl">
          PLAY AGAIN
        </button>
        <button
          onClick={() => dispatch({ type: "FULL_RESET" })}
          className="btn-big btn-glass text-base"
        >
          Change Players
        </button>
        <button onClick={onExit} className="btn-big btn-ghost text-base">
          Exit to Games
        </button>
      </div>
    </ScreenWrapper>
  );
}
