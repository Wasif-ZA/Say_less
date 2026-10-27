"use client";

import { useContext } from "react";
import { SneakContext } from "@/context/SneakContext";

export function useSneak() {
  const ctx = useContext(SneakContext);
  if (!ctx) throw new Error("useSneak must be used within SneakProvider");
  return ctx;
}
