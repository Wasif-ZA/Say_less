"use client";

import { createContext, useReducer } from "react";
import type { HeadState, HeadAction } from "@/lib/head/types";
import { headReducer, initialHeadState } from "@/lib/head/reducer";

interface HeadContextValue {
  state: HeadState;
  dispatch: React.Dispatch<HeadAction>;
}

export const HeadContext = createContext<HeadContextValue | null>(null);

export function HeadProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(headReducer, initialHeadState);

  return (
    <HeadContext.Provider value={{ state, dispatch }}>
      {children}
    </HeadContext.Provider>
  );
}
