"use client";

import { createContext, useReducer } from "react";
import type { MafiaState, MafiaAction } from "@/lib/mafia/types";
import { mafiaReducer, initialMafiaState } from "@/lib/mafia/reducer";

interface MafiaContextValue {
  state: MafiaState;
  dispatch: React.Dispatch<MafiaAction>;
}

export const MafiaContext = createContext<MafiaContextValue | null>(null);

export function MafiaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mafiaReducer, initialMafiaState);

  return (
    <MafiaContext.Provider value={{ state, dispatch }}>
      {children}
    </MafiaContext.Provider>
  );
}
