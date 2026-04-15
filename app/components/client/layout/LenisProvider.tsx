"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type LenisContextType = {
  scrollTo: (target: number, options?: { duration?: number }) => void;
  isProgrammaticScroll: React.MutableRefObject<boolean>;
};

const LenisContext = createContext<LenisContextType>({
  scrollTo: () => {},
  isProgrammaticScroll: { current: false },
});

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const isProgrammaticScroll = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      overscroll: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const resizeTimer = setTimeout(() => {
      lenis.resize();
    }, 300);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    lenisRef.current.scrollTo(0, { immediate: true });

    const resizeTimer = setTimeout(() => {
      lenisRef.current?.resize();
    }, 300);

    return () => clearTimeout(resizeTimer);
  }, [pathname]);

  const scrollTo = (target: number, options?: { duration?: number }) => {
    if (!lenisRef.current) return;
    isProgrammaticScroll.current = true;
    lenisRef.current.scrollTo(target, {
      ...options,
      onComplete: () => {
        isProgrammaticScroll.current = false;
      },
    });
  };

  return (
    <LenisContext.Provider value={{ scrollTo, isProgrammaticScroll }}>
      {children}
    </LenisContext.Provider>
  );
};