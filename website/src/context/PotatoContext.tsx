"use client";

import { createContext, useReducer } from "react";
import type { PotatoState, PotatoAction } from "@/lib/potato/types";
import { potatoReducer, initialPotatoState } from "@/lib/potato/reducer";

interface PotatoContextValue {
  state: PotatoState;
  dispatch: React.Dispatch<PotatoAction>;
}

export const PotatoContext = createContext<PotatoContextValue | null>(null);

export function PotatoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(potatoReducer, initialPotatoState);

  return (
    <PotatoContext.Provider value={{ state, dispatch }}>
      {children}
    </PotatoContext.Provider>
  );
}
