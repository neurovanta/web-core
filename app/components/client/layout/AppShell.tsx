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

type AppShellContextType = { animateIn: boolean };
const AppShellContext = createContext<AppShellContextType>({
  animateIn: false,
});
export const useAppShell = () => useContext(AppShellContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { unlockScroll, ready } = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [animationDone, setAnimationDone] = useState(false);
  const [animateIn, setAnimateIn] = useState(!isHome);

  useEffect(() => {
    if (!isHome && ready) {
      unlockScroll();
    }
  }, [isHome, ready, unlockScroll]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationDone(true);
    setAnimateIn(true);
    unlockScroll();
  }, [unlockScroll]);

  return (
    <AppShellContext.Provider value={{ animateIn }}>
      {isHome && !animationDone && (
        <PageLoadAnimation onComplete={handleAnimationComplete} />
      )}
      {children}
    </AppShellContext.Provider>
  );
}
