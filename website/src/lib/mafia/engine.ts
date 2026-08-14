import type { MafiaPlayer, MafiaWinner } from "./types";

export const MIN_MAFIA_PLAYERS = 4;

/** Mafia can never be half (or more) of the town, or the game starts over. */
export function maxMafiaFor(playerCount: number): number {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

/** Sensible default: roughly a quarter of the group. */
export function recommendedMafiaFor(playerCount: number): number {
  return Math.min(maxMafiaFor(playerCount), Math.max(1, Math.floor(playerCount / 4)));
}

export function assignMafiaRoles(
  players: MafiaPlayer[],
  mafiaCount: number,
  doctorEnabled: boolean,
  detectiveEnabled: boolean
): MafiaPlayer[] {
  const indices = players.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const roleByIndex = new Map<number, MafiaPlayer["role"]>();
  let cursor = 0;
  for (let k = 0; k < mafiaCount && cursor < indices.length; k++) {
    roleByIndex.set(indices[cursor++], "mafia");
  }
  if (detectiveEnabled && cursor < indices.length) {
    roleByIndex.set(indices[cursor++], "detective");
  }
  if (doctorEnabled && cursor < indices.length) {
    roleByIndex.set(indices[cursor++], "doctor");
  }

  return players.map((p, i) => ({
    ...p,
    role: roleByIndex.get(i) ?? "civilian",
    isAlive: true,
  }));
}

/** Most-voted target wins; ties go to whichever target was picked first. */
export function resolveMafiaTarget(mafiaVotes: Record<string, string>): string | null {
  const counts = new Map<string, number>();
  for (const targetId of Object.values(mafiaVotes)) {
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [targetId, count] of counts) {
    if (count > bestCount) {
      best = targetId;
      bestCount = count;
    }
  }
  return best;
}

export function alivePlayers(players: MafiaPlayer[]): MafiaPlayer[] {
  return players.filter((p) => p.isAlive);
}

export function checkWinner(players: MafiaPlayer[]): MafiaWinner | null {
  const alive = alivePlayers(players);
  const mafia = alive.filter((p) => p.role === "mafia").length;
  if (mafia === 0) return "town";
  if (mafia >= alive.length - mafia) return "mafia";
  return null;
}
