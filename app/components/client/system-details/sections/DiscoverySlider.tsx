"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { discoverGalleryData } from "../data";
import { ElasticEffect } from "../../animations/ElasticEffect";

const AUTOPLAY_MS = 4000;

function DiscoverySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const slides = discoverGalleryData.slides;

  const goTo = useCallback(
    (i: number, dir?: 1 | -1) => {
      if (i === activeIndex) return;
      const resolvedDir = dir ?? (i > activeIndex ? 1 : -1);
      setDirection(resolvedDir);
      setPrevIndex(activeIndex);
      setActiveIndex(i);
      setAnimKey((k) => k + 1);
    },
    [activeIndex],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % slides.length, 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [activeIndex, goTo, slides.length]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x < -50) {
        goTo((activeIndex + 1) % slides.length, 1);
      } else if (info.offset.x > 50) {
        goTo((activeIndex - 1 + slides.length) % slides.length, -1);
      }
    },
    [activeIndex, goTo, slides.length],
  );

  // clip-path: slide in from right (forward) or from left (backward)
  const clipInitial =
    direction === 1 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-hidden">
        {prevIndex !== null && (
          <div className="absolute inset-0 z-0">
            <Image
              src={slides[prevIndex].image}
              alt={`Gallery ${prevIndex + 1}`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <AnimatePresence mode="sync">
          <motion.div
            key={animKey}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            initial={{ clipPath: clipInitial }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            <ElasticEffect />
            <Image
              src={slides[activeIndex].image}
              alt={`Gallery ${activeIndex + 1}`}
              fill
              className="object-cover pointer-events-none"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.18%, #000000 100%)",
          }}
        />

        {/* Thumbnails */}
        <div className="absolute bottom-30 left-30 3xl:bottom-40 3xl:left-40 z-20 flex items-center gap-[15.6px]">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative shrink-0 overflow-hidden cursor-pointer p-0 border-0 bg-transparent w-[100px] h-[60px] 2xl:w-[125px] 2xl:h-[75px] 3xl:w-[137.27px] 3xl:h-[86.57px]"
            >
              <Image
                src={slide.image}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />

              {/* Dim overlay for inactive */}
              <motion.div
                className="absolute inset-0 z-10 bg-black"
                animate={{ opacity: i === activeIndex ? 0 : 0.4 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              {/* Active border SVG */}
              <AnimatePresence>
                {i === activeIndex && (
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/assets/images/system-details/discovery/slider/border.svg"
                      alt=""
                      fill
                      className="object-fill"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscoverySlider;