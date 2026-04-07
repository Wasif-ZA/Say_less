"use client";

import { useGame } from "@/hooks/useGame";

export function SummaryScreen() {
  const { state, dispatch } = useGame();

  const latestRound = state.roundScores[state.roundScores.length - 1];
  if (!latestRound) return null;

  const townWins = latestRound.townWins;
  const imposters = state.players.filter((p) => latestRound.imposterIds.includes(p.id));

  // Scoreboard
  const scores: Record<string, { name: string; wins: number }> = {};
  state.players.forEach((p) => { scores[p.id] = { name: p.name, wins: 0 }; });
  state.roundScores.forEach((round) => {
    if (round.townWins) {
      state.players.forEach((p) => {
        if (!round.imposterIds.includes(p.id) && scores[p.id]) scores[p.id].wins++;
      });
    } else {
      round.imposterIds.forEach((id) => {
        if (scores[id]) scores[id].wins++;
      });
    }
  });
  const sortedScores = Object.values(scores).sort((a, b) => b.wins - a.wins);

  const bgClass = townWins ? "bg-solid-green" : "bg-gradient-to-b from-[#ff2a5f] to-[#ff6b3d]";
  const resultEmoji = townWins ? "🎉" : "😈";
  const resultText = townWins ? "TOWN WINS" : "IMPOSTER WINS";

  return (
    <div className={`fixed inset-0 ${bgClass} text-white overflow-y-auto scrollbar-hide`}>
      <div className="max-w-lg mx-auto px-5 py-10 flex flex-col gap-8 min-h-full">

        {/* Result */}
        <div className="text-center pt-8 animate-bounceIn">
          <div className="text-[100px] mb-2 drop-shadow-2xl">{resultEmoji}</div>
          <h1 className="font-display text-[48px] font-bold tracking-wide leading-none drop-shadow-lg">
            {resultText}
          </h1>
        </div>

        {/* Reveal cards */}
        <div className="flex flex-col gap-3 animate-fadeInUp stagger-1">
          <div className="card-surface rounded-[24px] p-5 border border-white/15 text-center">
            <p className="font-body text-white/50 text-xs uppercase tracking-widest mb-2">
              The Imposter{imposters.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🕵️</span>
              <span className="font-display text-2xl font-bold">
                {imposters.map((p) => p.name).join(" & ")}
              </span>
            </div>
          </div>

          <div className="card-surface rounded-[24px] p-5 border border-white/15 text-center">
            <p className="font-body text-white/50 text-xs uppercase tracking-widest mb-2">
              The Secret Word
            </p>
            <span className="font-display text-3xl font-bold">{state.secretWord}</span>
          </div>
        </div>

        {/* Scoreboard */}
        {state.roundScores.length > 1 && (
          <div className="animate-fadeInUp stagger-2">
            <p className="font-display font-bold text-white/50 text-xs uppercase tracking-widest mb-3 text-center">
              Scoreboard — Round {state.round}
            </p>
            <div className="card-surface rounded-[24px] border border-white/15 divide-y divide-white/10">
              {sortedScores.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-white/30 text-sm w-5">{i + 1}</span>
                    <span className="font-display font-bold text-[15px]">{s.name}</span>
                  </div>
                  <span className="font-display font-bold text-lg">{s.wins} <span className="text-white/40 text-xs font-body">win{s.wins !== 1 ? "s" : ""}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-auto pb-6 animate-fadeInUp stagger-3">
          <button onClick={() => dispatch({ type: "PLAY_AGAIN" })} className="btn-big btn-white text-2xl">
            PLAY AGAIN
          </button>
          <button onClick={() => dispatch({ type: "CHANGE_CATEGORY" })} className="btn-big btn-glass text-lg" style={{ height: 56 }}>
            Change Category
          </button>
          <button onClick={() => dispatch({ type: "FULL_RESET" })} className="btn-big btn-ghost text-base" style={{ height: 48 }}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
