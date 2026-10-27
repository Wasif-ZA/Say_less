"use client";

import { createContext, useReducer } from "react";
import type { GuessState, GuessAction } from "@/lib/guess/types";
import { guessReducer, initialGuessState } from "@/lib/guess/reducer";

interface GuessContextValue {
  state: GuessState;
  dispatch: React.Dispatch<GuessAction>;
}

export const GuessContext = createContext<GuessContextValue | null>(null);

export function GuessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(guessReducer, initialGuessState);

  return (
    <GuessContext.Provider value={{ state, dispatch }}>
      {children}
    </GuessContext.Provider>
  );
}
