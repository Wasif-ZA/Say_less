"use client";

import { useContext } from "react";
import { HeadContext } from "@/context/HeadContext";

export function useHead() {
  const ctx = useContext(HeadContext);
  if (!ctx) throw new Error("useHead must be used within HeadProvider");
  return ctx;
}
