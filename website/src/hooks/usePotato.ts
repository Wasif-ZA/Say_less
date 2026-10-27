"use client";

import { useContext } from "react";
import { PotatoContext } from "@/context/PotatoContext";

export function usePotato() {
  const ctx = useContext(PotatoContext);
  if (!ctx) throw new Error("usePotato must be used within PotatoProvider");
  return ctx;
}
