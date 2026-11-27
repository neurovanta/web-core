"use client";

import { RefObject, useEffect, useState, useSyncExternalStore } from "react";

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const getPageVisible = () => document.visibilityState === "visible";
const getPageVisibleServer = () => true;

/**
 * True while the element is (at least partly) inside the viewport AND the
 * browser tab is visible. Autoplaying sliders use it to pause timers and
 * re-renders that nobody can see.
 */
export function useAutoplayActive<T extends Element>(
  ref: RefObject<T | null>,
): boolean {
  const [inView, setInView] = useState(false);
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    getPageVisible,
    getPageVisibleServer,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return inView && pageVisible;
}
