"use client";

import { useContext } from "react";
import { SeatContext } from "@/context/SeatContext";

export function useSeat() {
  const ctx = useContext(SeatContext);
  if (!ctx) throw new Error("useSeat must be used within SeatProvider");
  return ctx;
}
