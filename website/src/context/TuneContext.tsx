"use client";

import { createContext, useReducer } from "react";
import type { TuneState, TuneAction } from "@/lib/tune/types";
import { tuneReducer, initialTuneState } from "@/lib/tune/reducer";

interface TuneContextValue {
  state: TuneState;
  dispatch: React.Dispatch<TuneAction>;
}

export const TuneContext = createContext<TuneContextValue | null>(null);

export function TuneProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tuneReducer, initialTuneState);

  return (
    <TuneContext.Provider value={{ state, dispatch }}>
      {children}
    </TuneContext.Provider>
  );
}
