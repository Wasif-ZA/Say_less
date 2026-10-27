"use client";

import { useContext } from "react";
import { GuessContext } from "@/context/GuessContext";

export function useGuess() {
  const ctx = useContext(GuessContext);
  if (!ctx) throw new Error("useGuess must be used within GuessProvider");
  return ctx;
}
