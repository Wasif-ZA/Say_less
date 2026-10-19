"use client";

import { line, useMountSeed } from "@/lib/lines";
import { Art } from "@/components/Art";
import { useGame } from "@/hooks/useGame";

export function SummaryScreen() {
  const { state, dispatch } = useGame();
  const seed = useMountSeed();

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
  const roundWinners = new Set(
    state.players.filter((p) => latestRound.imposterIds.includes(p.id) !== townWins).map((p) => p.id)
  );
  const sortedScores = Object.entries(scores)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));
  const ranks = sortedScores.map((s) => 1 + sortedScores.filter((o) => o.wins > s.wins).length);
  const MEDALS = ["🥇", "🥈", "🥉"];

  const bgClass = townWins ? "bg-hub" : "bg-imposter";
  const resultText = townWins ? "TOWN WINS" : "IMPOSTER WINS";

  return (
    <div className={`fixed inset-0 ${bgClass} text-white overflow-y-auto scrollbar-hide`}>
      <div className="max-w-lg mx-auto px-5 py-10 flex flex-col gap-8 min-h-full">

        {/* Result */}
        <div className="relative pt-8 animate-maskIn">
          <span className={`absolute right-0 top-4 rotate-6 w-24 h-24 rounded-full border-[2.5px] border-ink flex flex-col items-center justify-center text-center font-bold text-[13px] leading-tight uppercase ${townWins ? "bg-go" : "bg-hot"}`}>
            <Art name={townWins ? "role-civilian" : "role-imposter"} className="w-11 h-11" />
            {townWins ? "Caught" : "Escaped"}
          </span>
          <h1 className="font-poster text-[60px] leading-[0.9] uppercase pr-28 text-balance">
            {resultText.split(" ").map((w) => <span key={w} className="block">{w}</span>)}
          </h1>
          <p className="text-[18px] font-semibold mt-3">{line(townWins ? "townWins" : "imposterWins", seed)}</p>
        </div>

        {/* Reveal cards */}
        <div className="flex flex-col gap-3 animate-fadeInUp stagger-1">
          <div className="card-surface rounded-[24px] p-5 border border-white/15 text-center">
            <p className="font-body text-white/75 text-xs uppercase tracking-widest mb-2">
              The Imposter{imposters.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Art name="role-imposter" className="w-10 h-10" />
              <span className="font-display text-2xl font-bold">
                {imposters.map((p) => p.name).join(" & ")}
              </span>
            </div>
          </div>

          <div className="card-surface rounded-[24px] p-5 border border-white/15 text-center">
            <p className="font-body text-white/75 text-xs uppercase tracking-widest mb-2">
              The Secret Word
            </p>
            <span className="font-display text-3xl font-bold">{state.secretWord}</span>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="animate-fadeInUp stagger-1">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-poster text-[34px] leading-none uppercase">Leaderboard</h2>
            <span className="text-[14px] font-bold">
              {state.roundScores.length} round{state.roundScores.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="card-surface rounded-[20px] overflow-hidden ruled">
            {sortedScores.map((s, i) => (
              <div key={s.id} className={`grid grid-cols-[40px_1fr_auto] items-center gap-3 px-4 py-3 ${ranks[i] === 1 && s.wins > 0 ? "bg-go" : ""}`}>
                <span className="text-[22px] text-center font-bold tabular-nums">
                  {s.wins > 0 && ranks[i] <= 3 ? MEDALS[ranks[i] - 1] : ranks[i]}
                </span>
                <span className="text-[17px] font-bold truncate">
                  {s.name}
                  {roundWinners.has(s.id) && <span className="ml-2 badge text-[12px]! px-2!">+1</span>}
                </span>
                <span className="text-[22px] font-bold tabular-nums">{s.wins}</span>
              </div>
            ))}
          </div>
        </div>

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
