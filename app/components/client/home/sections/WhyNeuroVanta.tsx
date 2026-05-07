// ─── Full corrected component ─────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../../animations/motionVarinats";
import { motion } from "framer-motion";

export type WhySlide = {
  icon: string;
  title: string;
  description: string;
};

export type WhySectionData = {
  heading: string;
  slides: WhySlide[];
};

const AUTOPLAY_DELAY = 3000;

function SlideDivider() {
  return (
    <div
      className="absolute right-0 bottom-0 h-full w-[1px] pointer-events-none z-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(251, 247, 244, 0.1) 0%, #FBF7F4 100%)",
      }}
    />
  );
}

function SlideCard({
  slide,
  index,
  isActive,
  isLast,
  onHover,
}: {
  slide: WhySlide;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onHover: (index: number) => void;
}) {
  return (
    <div
      className="relative h-full cursor-pointer select-none pt-60 3xl:pt-80 px-50 3xl:px-70 pb-70 3xl:pb-[74px]"
      onMouseEnter={() => onHover(index)}
    >
      {!isLast && <SlideDivider />}
      <div className="flex flex-col justify-between h-full">
        <div>
          <Image
            src={slide.icon}
            alt="icon"
            width={100}
            height={100}
            className="h-[70px] w-auto"
          />
        </div>
        <div>
          <motion.p
            key={`${index}-${isActive}`}
            initial="hidden"
            animate="show"
            variants={moveUp(0)}
            className={`text-subHeading tracking-[-0.03em] text-secondary ${
              isActive ? "mb-30" : "mb-0"
            }`}
          >
            {slide.title}
          </motion.p>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isActive ? "opacity-100" : "opacity-0 max-h-0"
            }`}
          >
            <motion.p
              key={`${index}-${isActive}-desc`}
              initial="hidden"
              animate="show"
              variants={moveUp(0)}
              className="text-secondary text-19 leading-[1.4210]"
            >
              {slide.description}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhySection({ data }: { data: WhySectionData }) {
  const { heading, slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef(false);
  // ↓ NEW: flag to suppress onSlideChange during programmatic scrolls
  const isProgrammaticScrollRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getSlidesPerView = useCallback((): number => {
    const swiper = swiperRef.current;
    if (!swiper) return 1;
    const spv = swiper.params.slidesPerView;
    return typeof spv === "number" ? Math.floor(spv) : 1;
  }, []);

  const isIndexVisible = useCallback(
    (index: number): boolean => {
      const swiper = swiperRef.current;
      if (!swiper) return true;
      const spv = getSlidesPerView();
      const start = swiper.activeIndex;
      const end = start + spv - 1;
      return index >= start && index <= end;
    },
    [getSlidesPerView],
  );

  const ensureVisible = useCallback(
    (index: number) => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (isIndexVisible(index)) return; // already visible — don't touch the swiper

      const spv = getSlidesPerView();
      const start = swiper.activeIndex;

      isProgrammaticScrollRef.current = true; // ← suppress onSlideChange

      if (index < start) {
        // Active card slid off the LEFT — bring it to the left edge
        swiper.slideTo(index);
      } else {
        // Active card slid off the RIGHT — bring it to the right edge
        swiper.slideTo(index - spv + 1);
      }
    },
    [isIndexVisible, getSlidesPerView],
  );

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isHoveringRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        requestAnimationFrame(() => {
          if (next === 0) {
            isProgrammaticScrollRef.current = true;
            swiperRef.current?.slideTo(0);
          } else {
            ensureVisible(next);
          }
        });
        return next;
      });
    }, AUTOPLAY_DELAY);
  }, [slides.length, ensureVisible]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startAutoplay]);

  const handleSlideHover = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => ensureVisible(index));
    startAutoplay();
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    startAutoplay();
  };

  return (
    <section className="relative w-full bg-primary pt-120 overflow-hidden">
      <div className="container">
        <AnimatedHeading
          title={heading}
          className="text-heading mb-20 lg:mb-60 text-secondary"
          mode="reveal"
        />
      </div>
      <div
        style={{
          background:
            "linear-gradient(270deg, rgba(251, 247, 244, 0.1) 0%, #FBF7F4 48.08%, rgba(251, 247, 244, 0.1) 100%)",
        }}
        className="w-full h-[1px]"
      />

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            // ↓ If we triggered this slide programmatically, ignore it
            if (isProgrammaticScrollRef.current) {
              isProgrammaticScrollRef.current = false;
              return;
            }
            // User swiped manually → follow the leftmost visible slide
            setActiveIndex(swiper.activeIndex);
          }}
          loop={false}
          allowTouchMove={true}
          initialSlide={0}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Reveal variants={moveUpV2} delayRange={index * 0.14}>
                <div className="!h-[270px] sm:!h-[400px] xl:!h-[520px] 3xl:!h-[571px]">
                  <SlideCard
                    slide={slide}
                    index={index}
                    isActive={index === activeIndex}
                    isLast={index === slides.length - 1}
                    onHover={handleSlideHover}
                  />
                </div>
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}