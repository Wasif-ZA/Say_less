"use client";

import { useState } from "react";
import { useMafia } from "@/hooks/useMafia";
import { alivePlayers } from "@/lib/mafia/engine";
import type { MafiaPlayer } from "@/lib/mafia/types";
import { AVATAR_BG, ROLE_META } from "./roleMeta";

type Stage = "cover" | "action" | "result";

function TargetGrid({
  targets,
  selectedId,
  onSelect,
  accent,
}: {
  targets: MafiaPlayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  accent: "red" | "blue" | "green";
}) {
  const accentClasses = {
    red: "border-accent-red bg-accent-red/15",
    blue: "border-accent-blue bg-accent-blue/15",
    green: "border-accent-green bg-accent-green/15",
  }[accent];

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {targets.map((target, i) => {
        const isSelected = selectedId === target.id;
        return (
          <button
            key={target.id}
            onClick={() => onSelect(target.id)}
            className={`card-surface rounded-[20px] p-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-all border ${
              isSelected ? accentClasses : "border-white/10"
            }`}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-display font-bold ${AVATAR_BG[i % AVATAR_BG.length]}`}>
              {target.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-display font-bold text-white text-sm text-center leading-tight">
              {target.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MafiaNightScreen() {
  const { state, dispatch } = useMafia();
  const [stage, setStage] = useState<Stage>("cover");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const alive = alivePlayers(state.players);
  const player = alive[state.nightTurnIndex];
  if (!player) return null;

  const meta = ROLE_META[player.role];

  function finishTurn() {
    setStage("cover");
    setSelectedId(null);
    dispatch({ type: "ADVANCE_NIGHT" });
  }

  function confirmAction() {
    if (!selectedId) return;
    if (player.role === "mafia") {
      dispatch({ type: "MAFIA_VOTE", voterId: player.id, targetId: selectedId });
      finishTurn();
    } else if (player.role === "doctor") {
      dispatch({ type: "DOCTOR_SAVE", targetId: selectedId });
      finishTurn();
    } else if (player.role === "detective") {
      setStage("result");
    }
  }

  // ——— Cover: pass the phone ———
  if (stage === "cover") {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-fadeIn flex flex-col items-center gap-5">
          <p className="font-display font-bold text-white/40 tracking-widest uppercase text-base">
            🌙 Night {state.round} — Pass the phone to
          </p>
          <h1 className="font-display text-[52px] font-bold leading-tight drop-shadow-lg">
            {player.name}
          </h1>
          <p className="font-body text-white/40 text-sm">
            Turn {state.nightTurnIndex + 1} of {alive.length} · no peeking, everyone else!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-center">
          <button onClick={() => setStage("action")} className="btn-big btn-glass text-xl max-w-lg w-full">
            I&apos;M {player.name.toUpperCase()} — WAKE UP
          </button>
        </div>
      </div>
    );
  }

  // ——— Detective result ———
  if (stage === "result" && player.role === "detective") {
    const target = state.players.find((p) => p.id === selectedId);
    const isMafia = target?.role === "mafia";
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-bounceIn flex flex-col items-center gap-5">
          <div className="text-[80px]">{isMafia ? "🚨" : "😇"}</div>
          <h2 className={`font-display text-[40px] font-bold leading-tight ${isMafia ? "text-accent-red" : "text-accent-green"}`}>
            {target?.name} {isMafia ? "is MAFIA!" : "is innocent"}
          </h2>
          <p className="font-body text-white/40 text-base max-w-[260px]">
            Keep it to yourself... for now. 🤫
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-center">
          <button onClick={finishTurn} className="btn-big btn-white text-xl max-w-lg w-full">
            DONE — PASS THE PHONE
          </button>
        </div>
      </div>
    );
  }

  // ——— Night action ———
  const isMafia = player.role === "mafia";
  const isDoctor = player.role === "doctor";
  const isDetective = player.role === "detective";

  const targets = isMafia
    ? alive.filter((p) => p.role !== "mafia")
    : isDoctor
      ? alive
      : isDetective
        ? alive.filter((p) => p.id !== player.id)
        : [];

  const partnerVote = isMafia
    ? Object.entries(state.mafiaVotes).find(([voterId]) => voterId !== player.id)
    : undefined;
  const partnerPick = partnerVote ? state.players.find((p) => p.id === partnerVote[1]) : undefined;

  const heading = isMafia
    ? "Choose your target"
    : isDoctor
      ? "Who do you protect?"
      : isDetective
        ? "Who do you investigate?"
        : "The town sleeps";

  const cta = isMafia ? "LOCK IN KILL" : isDoctor ? "PROTECT" : "INVESTIGATE";
  const accent = isMafia ? ("red" as const) : isDoctor ? ("green" as const) : ("blue" as const);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="pt-2 pb-4 text-center animate-slideDown">
          <div className={`text-5xl mb-2 ${meta.glow}`}>{meta.emoji}</div>
          <h1 className="font-display text-[32px] font-bold tracking-wide leading-tight">{heading}</h1>
          {isMafia && partnerPick && (
            <p className="font-body text-accent-red/80 text-sm mt-1">
              A partner picked {partnerPick.name} — majority decides
            </p>
          )}
        </div>

        {player.role === "civilian" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fadeInUp gap-4">
            <div className="text-[80px] animate-float">😴</div>
            <p className="font-body text-white/40 text-base max-w-[260px]">
              You have no night action. Chill for a moment so nobody can tell roles apart, then pass it on.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide animate-fadeInUp">
            <TargetGrid targets={targets} selectedId={selectedId} onSelect={setSelectedId} accent={accent} />
          </div>
        )}

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-5 flex justify-center">
          {player.role === "civilian" ? (
            <button onClick={finishTurn} className="btn-big btn-white text-xl max-w-lg w-full">
              DONE — PASS THE PHONE
            </button>
          ) : (
            <button
              onClick={confirmAction}
              className={`btn-big btn-white text-xl max-w-lg w-full transition-opacity ${selectedId ? "" : "opacity-30 pointer-events-none"}`}
            >
              {selectedId ? cta : "SELECT A PLAYER"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
