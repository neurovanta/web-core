"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { AnimatePresence, motion } from "framer-motion";
import { SectionDescription } from "../../animations/SectionDescription";
import { moveUp } from "../../animations/motionVarinats";
import { ElasticEffect } from "../../animations/ElasticEffect";
import { IndividualProduct } from "@/app/types/system";

// ── Pill border via gradient image ───────────────────────────────────────────
function HighlightPill() {
  return (
    <div className="relative w-[99px] h-[38px] sm:w-[120px] sm:h-[45px] md:w-[150px] md:h-[55px] lg:w-[179px] lg:h-[67px] flex items-center justify-center">
      <Image
        src="/assets/images/system-details/highlight/pill.svg"
        alt="pill border"
        fill
        className="pointer-events-none select-none"
        aria-hidden
      />
      <span className="relative z-10 block text-white text-subHeading -tracking-[0.03em]">
        Highlight
      </span>
    </div>
  );
}

// ── Pagination dots ──────────────────────────────────────────────────────────
function Pagination({
  total,
  active,
  onBulletClick,
}: {
  total: number;
  active: number;
  onBulletClick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-[6px] sm:gap-[10px]">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onBulletClick(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`
    h-[3px] border-none p-0 cursor-pointer shrink-0 relative
    before:absolute before:inset-x-0 before:-top-[30px] before:h-[30px]
    after:absolute after:inset-x-0 after:-bottom-[30px] after:h-[30px]
    transition-[width,background-color] duration-400 ease-in-out
    ${i === active ? "w-[31px] sm:w-[50px] bg-white" : "w-[8px] sm:w-[13px] bg-white/60"}
  `}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HighlightSlider({ data }: { data: IndividualProduct["secondSection"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleBulletClick = useCallback((i: number) => {
    swiperRef.current?.slideTo(i);
  }, []);

  return (
    <section className="relative w-full max-h-[554px] sm:max-h-[600px]  md:max-h-[888px] 3xl:h-[888px] overflow-hidden cursor-grab">
      <ElasticEffect />
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={700}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full h-full"
      >
        {data.items.map((slide, i) => (
          <SwiperSlide key={i} className="relative">
            {/* Background image */}
            <div className="relative w-full h-[554px] sm:h-[600px]  md:h-[888px] 3xl:h-[888px] max-h-[888px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={i === 0}
              />
              {/* Dark gradient overlay — left side for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(251.59deg, rgba(0, 0, 0, 0) 12.65%, #000000 108.6%),linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, #000000 100%)",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Overlay UI — sits above swiper, full height ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between container py-[60px] lg:py-120 pointer-events-none">
        {/* Top-left: slide counter */}
        <div className="flex items-center justify-start">
          <div className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] lg:w-[56px] lg:h-[56px] rounded-full bg-white/20 flex items-center justify-center text-white">
            <span className="text-subHeading -tracking-[0.03em]">
              {activeIndex + 1}
            </span>
          </div>
        </div>

        {/* Bottom: content + pagination */}
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-0 items-start lg:items-end lg:justify-between">
          <div className="relative">
            {/* Pill — static, never fades */}
            <div className="absolute bottom-full mb-[30px] sm:mb-50 pointer-events-none">
              <HighlightPill />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <motion.h2
                  initial="hidden"
                  animate="show"
                  variants={moveUp(0.1)}
                  className="h2 text-white mb-[10px] sm:mb-20 text-heading whitespace-pre-line"
                >
                  {data.items[activeIndex].title}
                </motion.h2>

                <SectionDescription
                  text={data.items[activeIndex].description}
                  className="text-description text-white -tracking-[0.03em] max-w-[30ch]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-auto">
            <Pagination
              total={data.items.length}
              active={activeIndex}
              onBulletClick={handleBulletClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
