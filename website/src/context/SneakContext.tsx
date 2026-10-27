"use client";

import { createContext, useReducer } from "react";
import type { SneakState, SneakAction } from "@/lib/sneak/types";
import { sneakReducer, initialSneakState } from "@/lib/sneak/reducer";

interface SneakContextValue {
  state: SneakState;
  dispatch: React.Dispatch<SneakAction>;
}

export const SneakContext = createContext<SneakContextValue | null>(null);

export function SneakProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sneakReducer, initialSneakState);

  return (
    <SneakContext.Provider value={{ state, dispatch }}>
      {children}
    </SneakContext.Provider>
  );
}
