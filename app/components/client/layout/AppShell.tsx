"use client";

import {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import PageLoadAnimation from "../animations/PageLoadAnimation";
import { useLenis } from "./LenisProvider";

type AppShellContextType = {
  /** Intro fully finished — content entrance animations may run. */
  animateIn: boolean;
  /** Intro's white stripes have started wiping away — page is becoming visible. */
  revealStarted: boolean;
};
const AppShellContext = createContext<AppShellContextType>({
  animateIn: false,
  revealStarted: false,
});
export const useAppShell = () => useContext(AppShellContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { unlockScroll, ready } = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [animationDone, setAnimationDone] = useState(false);
  const [animateIn, setAnimateIn] = useState(!isHome);
  const [revealStarted, setRevealStarted] = useState(!isHome);

  useEffect(() => {
    if (!isHome && ready) {
      unlockScroll();
    }
  }, [isHome, ready, unlockScroll]);

  const handleRevealStart = useCallback(() => setRevealStarted(true), []);

  const handleAnimationComplete = useCallback(() => {
    setRevealStarted(true);
    setAnimationDone(true);
    setAnimateIn(true);
    unlockScroll();
  }, [unlockScroll]);

  return (
    <AppShellContext.Provider value={{ animateIn, revealStarted }}>
      {isHome && !animationDone && (
        <PageLoadAnimation
          onRevealStart={handleRevealStart}
          onComplete={handleAnimationComplete}
        />
      )}
      {children}
    </AppShellContext.Provider>
  );
}
