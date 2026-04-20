

"use client";

import { useState, useCallback, createContext, useContext } from "react";
import PageLoadAnimationV2 from "../animations/PageLoadAnimationV2";
import { useLenis } from "./LenisProvider";

type AppShellContextType = { animateIn: boolean };
const AppShellContext = createContext<AppShellContextType>({ animateIn: false });
export const useAppShell = () => useContext(AppShellContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { unlockScroll } = useLenis();
  const [animationDone, setAnimationDone] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setAnimationDone(true);
    setAnimateIn(true);   // no setTimeout — fires immediately
    unlockScroll();
  }, [unlockScroll]);

  return (
    <AppShellContext.Provider value={{ animateIn }}>
      {!animationDone && (
        <PageLoadAnimationV2 onComplete={handleAnimationComplete} />
      )}
      {children}
    </AppShellContext.Provider>
  );
}