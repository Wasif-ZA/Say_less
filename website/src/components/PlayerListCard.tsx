"use client";

import { useEffect, useRef, useState } from "react";

interface PlayerListCardProps {
  players: { id: string; name: string }[];
  min: number;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function PlayerListCard({ players, min, onAdd, onRemove, onRename }: PlayerListCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editingId]);

  function handleRename(id: string, rawName: string) {
    let name = rawName.trim();
    if (!name) name = `Player ${players.findIndex((p) => p.id === id) + 1}`;
    const others = players.filter((p) => p.id !== id);
    if (others.some((p) => p.name === name)) {
      let s = 2;
      while (others.some((p) => p.name === `${name} ${s}`)) s++;
      name = `${name} ${s}`;
    }
    onRename(id, name);
    setEditingId(null);
  }

  const canRemove = players.length > min;

  return (
    <div className="card-surface rounded-[24px] p-5">
      <h2 className="font-display text-2xl font-bold">Players</h2>
      <p className="text-ink-2 text-sm mb-4">{players.length} players · minimum {min}</p>
      <div className="flex flex-col gap-2">
        {players.map((player, i) => (
          <div key={player.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 border-[1.5px] border-ink/15">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-tangerine border-[2.5px] border-ink">
              {i + 1}
            </div>
            {editingId === player.id ? (
              <input
                ref={inputRef}
                defaultValue={player.name}
                onBlur={(e) => handleRename(player.id, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                className="flex-1 min-w-0 bg-mint font-semibold rounded-xl px-3 py-1.5 text-[15px]"
                maxLength={20}
              />
            ) : (
              <button onClick={() => setEditingId(player.id)} className="flex-1 text-left font-semibold text-[15px] truncate">
                {player.name}
              </button>
            )}
            {canRemove && (
              <button
                onClick={() => onRemove(player.id)}
                aria-label={`Remove ${player.name}`}
                className="w-8 h-8 flex items-center justify-center rounded-full text-lg active:scale-95"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="w-full mt-3 border-2 border-dashed border-ink/30 rounded-2xl py-3 font-semibold text-sm active:scale-[0.98]"
      >
        + Add Player
      </button>
    </div>
  );
}
