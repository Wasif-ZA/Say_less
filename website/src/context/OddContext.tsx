"use client";

import { createContext, useReducer } from "react";
import type { OddState, OddAction } from "@/lib/odd/types";
import { oddReducer, initialOddState } from "@/lib/odd/reducer";

interface OddContextValue {
  state: OddState;
  dispatch: React.Dispatch<OddAction>;
}

export const OddContext = createContext<OddContextValue | null>(null);

export function OddProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(oddReducer, initialOddState);

  return (
    <OddContext.Provider value={{ state, dispatch }}>
      {children}
    </OddContext.Provider>
  );
}
