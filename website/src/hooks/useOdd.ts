"use client";

import { useContext } from "react";
import { OddContext } from "@/context/OddContext";

export function useOdd() {
  const ctx = useContext(OddContext);
  if (!ctx) throw new Error("useOdd must be used within OddProvider");
  return ctx;
}
