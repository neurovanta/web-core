"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { slides } from "../data";
import SliderNavButton from "../../common/SliderButton";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL = slides.length;
const TRANS_MS = 750;
const FADE_MS = 270;
const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";
const COLOR = "#51463E";
const BG = "#F5F0EA";
const DOT = 11;
const BADGE = 50;
const SVG_SIZE = 1780;
const SVG_R = 889.5;

const ACTIVE_DEG = 0;
const PREV_DEG = -62;
const NEXT_DEG = 62;

function angleOffset(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.sin(rad), y: -r * Math.cos(rad) };
}

export default function ExperienceJourneySlider() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionW, setSectionW] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => setSectionW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clampedW = Math.min(sectionW, SVG_SIZE);
  const scale = clampedW / SVG_SIZE;
  const R = SVG_R * scale;
  const visibleH = Math.min(R, 1600 * scale);
  const arcAreaH = visibleH + BADGE + 34;
  const circleCenterX = sectionW / 2;
  const circleCenterY = arcAreaH;

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedSlide, setDisplayedSlide] = useState(slides[0]);
  const [textVisible, setTextVisible] = useState(true);
  const [animDeg, setAnimDeg] = useState(0);
  const animRef = useRef(false);
  const swapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (target: number) => {
      if (animRef.current) return;
      const idx = ((target % TOTAL) + TOTAL) % TOTAL;
      if (idx === activeIndex) return;
      const dir = target > activeIndex ? 1 : -1;
      animRef.current = true;
      setTextVisible(false);
      setAnimDeg((prev) => prev - dir * 60);
      swapRef.current = setTimeout(() => {
        setDisplayedSlide(slides[idx]);
        setActiveIndex(idx);
        setTextVisible(true);
      }, FADE_MS);
      lockRef.current = setTimeout(() => {
        animRef.current = false;
      }, TRANS_MS);
    },
    [activeIndex],
  );

  useEffect(
    () => () => {
      if (swapRef.current) clearTimeout(swapRef.current);
      if (lockRef.current) clearTimeout(lockRef.current);
    },
    [],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const fixedDots = [
    {
      dataIdx: (activeIndex - 1 + TOTAL) % TOTAL,
      deg: PREV_DEG,
      role: "prev" as const,
    },
    { dataIdx: activeIndex, deg: ACTIVE_DEG, role: "active" as const },
    {
      dataIdx: (activeIndex + 1) % TOTAL,
      deg: NEXT_DEG,
      role: "next" as const,
    },
  ];

  if (!sectionW)
    return (
      <section
        ref={sectionRef}
        className="w-full min-h-[600px]"
        style={{ backgroundColor: BG }}
      />
    );

  return (
    <section
      ref={sectionRef}
      className="relative w-full select-none overflow-hidden bg-cream-bg max-h-[669px] 3xl:max-h-[779px]"
    >
      <div className="absolute top-0 z-10 w-full">
        <div className="flex items-start justify-between container pt-120 3xl:pt-[117px]">
          <AnimatedHeading
            title={"The Experience Journey"}
            className="text-heading max-w-[15ch]"
          />
          <span className="text-subHeading tracking-[-0.03em]">
            <span className="text-secondary">
              {String(activeIndex + 1).padStart(2, "0")}/
            </span>
            <span className="text-secondary/50">
              {String(TOTAL).padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>

      <div
        className="relative w-full mt-[160px] 3xl:mt-[210px]"
        style={{ height: arcAreaH }}
      >
        <div
          className="absolute z-20 flex flex-col items-center pointer-events-none"
          style={{ left: "50%", top: 0, transform: "translateX(-50%)" }}
        >
          <div className="flex items-center justify-center rounded-full shrink-0 w-[50px] h-[50px] 3xl:w-[56px] 3xl:h-[56px] tracking-[-0.03em] text-subHeading bg-secondary text-white">
            {activeIndex + 1}
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1780 1780"
          fill="none"
          className="absolute pointer-events-none"
          style={{
            width: clampedW,
            height: clampedW,
            left: (sectionW - clampedW) / 2,
            top: arcAreaH - R,
          }}
          aria-hidden="true"
        >
          <circle
            cx="890"
            cy="890"
            r="889.5"
            stroke={COLOR}
            strokeWidth={1 / scale}
          />
        </svg>

        <div
          className="absolute pointer-events-none"
          style={{
            width: R * 2,
            height: R * 2,
            left: circleCenterX - R,
            top: circleCenterY - R,
            transform: `rotate(${animDeg}deg)`,
            transformOrigin: `${R}px ${R}px`,
            transition: `transform ${TRANS_MS}ms ${EASE}`,
            willChange: "transform",
          }}
        >
          {fixedDots.map(({ dataIdx, role }) => {
            const isActive = role === "active";
            const angleDeg =
              role === "prev"
                ? PREV_DEG
                : role === "next"
                  ? NEXT_DEG
                  : ACTIVE_DEG;
            const { x, y } = angleOffset(angleDeg - animDeg, R);
            const pos = { left: R + x - DOT / 2, top: R + y - DOT / 2 };
            return (
              <button
                key={role}
                onClick={() =>
                  !isActive &&
                  goTo(role === "prev" ? activeIndex - 1 : activeIndex + 1)
                }
                aria-label={slides[dataIdx].title}
                className="absolute focus-visible:outline-none pointer-events-auto"
                style={{
                  width: DOT,
                  height: DOT,
                  left: pos.left,
                  top: pos.top,
                  zIndex: isActive ? 20 : 10,
                  cursor: isActive ? "default" : "pointer",
                }}
              >
                <span
                  className="block rounded-full"
                  style={{ width: DOT, height: DOT, backgroundColor: COLOR }}
                />
              </button>
            );
          })}
        </div>

        <div className="absolute top-100 left-0 right-0 z-10 flex flex-col items-center text-center">
          <div
            className="w-px h-[120px] 3xl:h-[135px] my-[8px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${COLOR} 30%, ${COLOR} 70%, transparent)`,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={displayedSlide.title}
              className="flex flex-col items-center"
              style={{ minHeight: 80 }}
            >
              <motion.h3
                className="text-subHeading tracking-[-0.03em] mb-20"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.25, 0, 0.2, 1] }}
              >
                {displayedSlide.title}
              </motion.h3>

              <motion.p
                className="text-description max-w-[54ch]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0, 0.2, 1],
                  delay: 0.07,
                }}
              >
                {displayedSlide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-[10px] mt-50">
            <SliderNavButton direction="prev" onClick={goPrev} />
            <SliderNavButton direction="next" onClick={goNext} />
          </div>
        </div>
      </div>
    </section>
  );
}
