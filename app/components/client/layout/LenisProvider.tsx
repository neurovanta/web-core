// "use client";

// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { usePathname } from "next/navigation";
// import Lenis from "lenis";

// type LenisContextType = {
//   scrollTo: (target: number, options?: { duration?: number }) => void;
//   isProgrammaticScroll: React.MutableRefObject<boolean>;
//   lockScroll: () => void;
//   unlockScroll: () => void;
//   ready: boolean;
// };

// const LenisContext = createContext<LenisContextType>({
//   scrollTo: () => {},
//   isProgrammaticScroll: { current: false },
//   lockScroll: () => {},
//   unlockScroll: () => {},
//   ready: false,
// });

// export const useLenis = () => useContext(LenisContext);

// export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
//   const lenisRef = useRef<Lenis | null>(null);
//   const isProgrammaticScroll = useRef(false);
//   const pathname = usePathname();
//   const rafIdRef = useRef<number>(0);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     // Lock at CSS level immediately — before Lenis even initialises.
//     // This covers the gap between first paint and useEffect running.
//     document.documentElement.style.overflow = "hidden";

//     const lenis = new Lenis({
//       duration: 1.5,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       smoothWheel: true,
//       overscroll: false,
//     });

//     lenisRef.current = lenis;
//     lenis.stop();

//     function raf(time: number) {
//       lenis.raf(time);
//       rafIdRef.current = requestAnimationFrame(raf);
//     }
//     rafIdRef.current = requestAnimationFrame(raf);

//     const resizeTimer = setTimeout(() => {
//       lenis.resize();
//     }, 300);

//     setReady(true);

//     return () => {
//       cancelAnimationFrame(rafIdRef.current);
//       clearTimeout(resizeTimer);
//       lenis.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (!lenisRef.current) return;
//     lenisRef.current.scrollTo(0, { immediate: true });

//     const resizeTimer = setTimeout(() => {
//       lenisRef.current?.resize();
//     }, 300);

//     return () => clearTimeout(resizeTimer);
//   }, [pathname]);

//   const scrollTo = (target: number, options?: { duration?: number }) => {
//     if (!lenisRef.current) return;
//     isProgrammaticScroll.current = true;
//     lenisRef.current.scrollTo(target, {
//       ...options,
//       onComplete: () => {
//         isProgrammaticScroll.current = false;
//       },
//     });
//   };

//   const lockScroll = () => {
//     document.documentElement.style.overflow = "hidden";
//     lenisRef.current?.stop();
//   };

//   const unlockScroll = () => {
//     // Remove CSS lock first, then start Lenis
//     document.documentElement.style.overflow = "";
//     lenisRef.current?.start();
//   };

//   return (
//     <LenisContext.Provider
//       value={{
//         scrollTo,
//         isProgrammaticScroll,
//         lockScroll,
//         unlockScroll,
//         ready,
//       }}
//     >
//       {children}
//     </LenisContext.Provider>
//   );
// };






"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisContextType = {
  scrollTo: (target: number, options?: { duration?: number }) => void;
  isProgrammaticScroll: React.MutableRefObject<boolean>;
  lockScroll: () => void;
  unlockScroll: () => void;
  ready: boolean;
};

const LenisContext = createContext<LenisContextType>({
  scrollTo: () => {},
  isProgrammaticScroll: { current: false },
  lockScroll: () => {},
  unlockScroll: () => {},
  ready: false,
});

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const isProgrammaticScroll = useRef(false);
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      overscroll: false,
    });

lenisRef.current = lenis;
    lenis.stop();
    const gsapRafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapRafCallback);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);

    const resizeTimer = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 300);

    setReady(true);

    return () => {
      gsap.ticker.remove(gsapRafCallback);
      lenis.off("scroll", ScrollTrigger.update);
      clearTimeout(resizeTimer);
      lenis.destroy();
    };
  }, []);

useEffect(() => {
    if (!lenisRef.current) return;
    lenisRef.current.scrollTo(0, { immediate: true });

    const resizeTimer = setTimeout(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    }, 300);
    const pendingImages = Array.from(document.images).filter(
      (img) => !img.complete,
    );
    const imagePromises = pendingImages.map(
      (img) =>
        new Promise<void>((res) => {
          img.addEventListener("load", () => res(), { once: true });
          img.addEventListener("error", () => res(), { once: true });
        }),
    );

    Promise.all([document.fonts.ready, ...imagePromises]).then(() => {
      ScrollTrigger.refresh();
    });

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

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    lenisRef.current?.stop();
  };

  const unlockScroll = () => {
    // Remove CSS lock first, then start Lenis
    document.documentElement.style.overflow = "";
    lenisRef.current?.start();
  };

  return (
    <LenisContext.Provider
      value={{
        scrollTo,
        isProgrammaticScroll,
        lockScroll,
        unlockScroll,
        ready,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
};