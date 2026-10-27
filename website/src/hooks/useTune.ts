"use client";

import { useContext } from "react";
import { TuneContext } from "@/context/TuneContext";

export function useTune() {
  const ctx = useContext(TuneContext);
  if (!ctx) throw new Error("useTune must be used within TuneProvider");
  return ctx;
}
