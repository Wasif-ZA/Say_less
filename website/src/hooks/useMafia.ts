"use client";

import { useContext } from "react";
import { MafiaContext } from "@/context/MafiaContext";

export function useMafia() {
  const ctx = useContext(MafiaContext);
  if (!ctx) throw new Error("useMafia must be used within MafiaProvider");
  return ctx;
}
