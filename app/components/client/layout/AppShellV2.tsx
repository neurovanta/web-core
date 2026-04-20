"use client";

import { useState, useCallback, createContext, useContext } from "react";
import PageLoadAnimationV2 from "../animations/PageLoadAnimationV2";
import { useLenis } from "./LenisProvider";

// Context so Header and HeroSection can read `animateIn`
type AppShellContextType = { animateIn: boolean };
const AppShellContext = createContext<AppShellContextType>({ animateIn: false });
export const useAppShell = () => useContext(AppShellContext);

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { unlockScroll } = useLenis();
  const [animationDone, setAnimationDone] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setAnimationDone(true);
    // Small delay so the last stripe fully disappears before content animates in
    setTimeout(() => {
      setAnimateIn(true);
      unlockScroll();
    }, 10);
  }, [unlockScroll]);

  return (
    <AppShellContext.Provider value={{ animateIn }}>
      {/* Full-screen intro overlay */}
      {!animationDone && (
        <PageLoadAnimationV2 onComplete={handleAnimationComplete} />
      )}

      {/* All layout children — Header, page, Footer */}
      {children}
    </AppShellContext.Provider>
  );
}