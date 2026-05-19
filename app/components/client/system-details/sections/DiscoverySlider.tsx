"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { discoverGalleryData } from "../data";

function DiscoverySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const slides = discoverGalleryData.slides;

  const goTo = useCallback(
    (i: number) => {
      if (i === activeIndex) return;
      setPrevIndex(activeIndex);
      setActiveIndex(i);
      setAnimKey((k) => k + 1);
    },
    [activeIndex],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, goTo, slides.length]);

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
            className="absolute inset-0 z-10"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <Image
              src={slides[activeIndex].image}
              alt={`Gallery ${activeIndex + 1}`}
              fill
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay — above image (z-10), below pagination (z-20) */}
        <div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 44.18%, #000000 100%)",
          }}
        />

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
                className="object-cover transition-opacity duration-300"
              />

              {/* Active thumbnail dark overlay */}
              {i !== activeIndex && (
                <div className="absolute inset-0 z-10 bg-black/40" />
              )}

              {/* Active thumbnail border */}
              {i === activeIndex && (
                <Image
                  src="/assets/images/system-details/discovery/slider/border.svg"
                  alt=""
                  fill
                  className="object-fill pointer-events-none z-20"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscoverySlider;