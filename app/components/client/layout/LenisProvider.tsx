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

    // Lenis caches the page height and only re-measures when the <html> box resizes.
    // Height that changes without that (late images, transformed/revealed content)
    // leaves a stale limit, so the page stops short of the footer. When the scroll
    // reaches the cached end, compare with the real height and re-measure if needed.
    const healLimit = () => {
      if (lenis.scroll < lenis.limit - 2) return;
      const real =
        document.documentElement.scrollHeight - window.innerHeight;
      if (Math.abs(real - lenis.limit) > 1) lenis.resize();
    };
    lenis.on("scroll", healLimit);

    const resizeTimer = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 300);

    // all images / fonts done → final measurement
    const onLoad = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    setReady(true);

    return () => {
      gsap.ticker.remove(gsapRafCallback);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.off("scroll", healLimit);
      window.removeEventListener("load", onLoad);
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
      // re-measure Lenis too, not only ScrollTrigger, or its scroll limit stays stale
      lenisRef.current?.resize();
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