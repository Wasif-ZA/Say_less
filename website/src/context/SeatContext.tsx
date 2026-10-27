"use client";

import { createContext, useReducer } from "react";
import type { SeatState, SeatAction } from "@/lib/seat/types";
import { seatReducer, initialSeatState } from "@/lib/seat/reducer";

interface SeatContextValue {
  state: SeatState;
  dispatch: React.Dispatch<SeatAction>;
}

export const SeatContext = createContext<SeatContextValue | null>(null);

export function SeatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(seatReducer, initialSeatState);

  return (
    <SeatContext.Provider value={{ state, dispatch }}>
      {children}
    </SeatContext.Provider>
  );
}
