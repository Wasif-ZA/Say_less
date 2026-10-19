import type { MafiaRole } from "@/lib/mafia/types";

interface RoleMeta {
  emoji: string;
  label: string;
  colorClass: string;
  glow: string;
  blurb: string;
}

export const ROLE_META: Record<MafiaRole, RoleMeta> = {
  mafia: {
    emoji: "🔪",
    label: "MAFIA",
    colorClass: "text-accent-red",
    glow: "drop-shadow-[0_0_20px_rgba(255,51,102,0.4)]",
    blurb: "Each night, choose someone to take out. Don't get caught.",
  },
  detective: {
    emoji: "🕵️",
    label: "DETECTIVE",
    colorClass: "text-accent-blue",
    glow: "drop-shadow-[0_0_20px_rgba(77,166,255,0.4)]",
    blurb: "Each night, investigate one player to learn if they're Mafia.",
  },
  doctor: {
    emoji: "🩺",
    label: "DOCTOR",
    colorClass: "text-accent-green",
    glow: "drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]",
    blurb: "Each night, protect one player from the Mafia. You can save yourself.",
  },
  civilian: {
    emoji: "🏘️",
    label: "CIVILIAN",
    colorClass: "text-white",
    glow: "drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]",
    blurb: "Find the Mafia before they find you. Vote wisely.",
  },
};
