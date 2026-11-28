"use client";

import { RefObject, useEffect, useState, useSyncExternalStore } from "react";

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const getPageVisible = () => document.visibilityState === "visible";
const getPageVisibleServer = () => true;

// Is the element hidden underneath something else at the middle of its visible
// area? (e.g. a sticky section that the next sticky section has slid over)
const isCovered = (el: Element) => {
  const r = el.getBoundingClientRect();
  const top = Math.max(r.top, 0);
  const bottom = Math.min(r.bottom, window.innerHeight);
  if (bottom <= top) return true;
  const x = Math.min(Math.max(r.left + r.width / 2, 0), window.innerWidth - 1);
  const hit = document.elementFromPoint(x, (top + bottom) / 2);
  return !!hit && !el.contains(hit);
};

/**
 * True while the element is (at least partly) inside the viewport AND the
 * browser tab is visible. Autoplaying sliders use it to pause timers and
 * re-renders that nobody can see.
 *
 * `detectCovered`: also false while another element covers it, for stacked
 * sticky sections that stay "in the viewport" underneath the next one.
 */
export function useAutoplayActive<T extends Element>(
  ref: RefObject<T | null>,
  { detectCovered = false }: { detectCovered?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  const [covered, setCovered] = useState(false);
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

  // Only checked while in view, at most once per frame.
  useEffect(() => {
    const el = ref.current;
    if (!detectCovered || !inView || !el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setCovered(isCovered(el));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, detectCovered, inView]);

  return inView && pageVisible && !(detectCovered && covered);
}
