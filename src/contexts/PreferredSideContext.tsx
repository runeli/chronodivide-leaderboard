"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PreferredSide } from "@/lib/api";

interface PreferredSideContextValue {
  preferredSide: PreferredSide | undefined;
  setPreferredSide: (side: PreferredSide | undefined) => void;
}

const PreferredSideContext = createContext<PreferredSideContextValue>({
  preferredSide: undefined,
  setPreferredSide: () => {},
});

export function PreferredSideProvider({ children }: { children: ReactNode }) {
  const [preferredSide, setPreferredSide] = useState<PreferredSide | undefined>(undefined);

  return (
    <PreferredSideContext.Provider value={{ preferredSide, setPreferredSide }}>
      {children}
    </PreferredSideContext.Provider>
  );
}

export function usePreferredSide() {
  return useContext(PreferredSideContext);
}
