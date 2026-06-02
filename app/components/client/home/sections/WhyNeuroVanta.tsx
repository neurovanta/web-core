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
import { ElasticEffect } from "../../animations/ElasticEffect";
import SliderNavButton from "../../common/SliderButton";

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
      className="relative h-full select-none pt-20 sm:pt-60 3xl:pt-80 px-20 sm:px-50 3xl:px-70 pb-20 sm:pb-70 3xl:pb-[74px] bg-[#FBF7F433] border-x border-x-[#FBF7F4]/10 sm:bg-transparent mx-[16px] sm:mx-0"
      onMouseEnter={() => onHover(index)}
    >
        {/* gradient top & bottom borders */}
  <span
    className="absolute inset-x-0 top-0 h-px pointer-events-none sm:hidden"
    style={{
      background: "linear-gradient(270deg, rgba(251, 247, 244, 0.1) 0%, #FBF7F4 48.08%, rgba(251, 247, 244, 0.1) 100%)",
    }}
  />
  <span
    className="absolute inset-x-0 bottom-0 h-px pointer-events-none sm:hidden"
    style={{
      background: "linear-gradient(270deg, rgba(251, 247, 244, 0.1) 0%, #FBF7F4 48.08%, rgba(251, 247, 244, 0.1) 100%)",
    }}
  />
      <div className="hidden sm:block">{!isLast && <SlideDivider />}</div>
      <div className="flex flex-col justify-between h-full">
        <div className="mb-[30px] sm:mb-0">
          <Image
            src={slide.icon}
            alt="icon"
            width={100}
            height={100}
            className="h-[40px] w-[40px] sm:h-[50px] md:h-[70px] sm:w-auto"
          />
        </div>
        <div>
          <motion.p
            key={`${index}-${isActive}`}
            initial="hidden"
            animate="show"
            variants={moveUp(0)}
            className={`text-subHeading tracking-[-0.03em] text-secondary ${
              isActive ? "mb-[10px] sm:mb-30" : "mb-0"
            }`}
          >
            {slide.title}
          </motion.p>
<div
  className={`overflow-hidden transition-all duration-500 ${
    isActive
      ? "opacity-100 max-h-[300px]"
      : "opacity-0 max-h-0"
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
  const [showNav, setShowNav] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

    const updateNavState = (swiper: SwiperType) => {
    // Show nav only if not all slides are visible at once
    const slidesPerView = swiper.params.slidesPerView as number;
    setShowNav(slides.length > Math.floor(slidesPerView));
    setPrevDisabled(swiper.isBeginning);
    setNextDisabled(swiper.isEnd);
setActiveIndex(swiper.activeIndex);
  };

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
    <section className="relative w-full bg-primary py-[60px] sm:py-0 sm:pt-120 overflow-hidden">
      <ElasticEffect />
      <div className="container flex flex-col sm:flex-row justify-between items-start">
        <AnimatedHeading
          title={heading}
          className="text-heading mb-[15px] sm:mb-20 lg:mb-60 text-secondary"
          mode="reveal"
        />
        <div className="sm:hidden w-full bg-[#FBF7F4] h-px mb-[15px] sm:mb-0" />
        {showNav && (
          <div className="flex items-center w-full justify-between sm:justify-end mb-[30px] sm:mb-0">
            <div className="sm:hidden bg-secondary h-[22px] w-[50px] flex items-center justify-center text-[12px] text-semibold rounded-[51px]">
              <span className="text-primary">
                {String(activeIndex + 1).padStart(2, "0")}/
              </span>
              <span className="text-primary/40">0{slides.length}</span>
            </div>
            <div className="flex items-center gap-[10px] pt-[5px]">
              <SliderNavButton
                direction="prev"
                disabled={prevDisabled}
                onClick={() => swiperRef.current?.slidePrev()}
              />
              <SliderNavButton
                direction="next"
                disabled={nextDisabled}
                onClick={() => swiperRef.current?.slideNext()}
              />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background:
            "linear-gradient(270deg, rgba(251, 247, 244, 0.1) 0%, #FBF7F4 48.08%, rgba(251, 247, 244, 0.1) 100%)",
        }}
        className="w-full h-px hidden sm:block"
      />

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateNavState(swiper);
          }}
          onSlideChange={(swiper) => {
            // ↓ If we triggered this slide programmatically, ignore it
            if (isProgrammaticScrollRef.current) {
              isProgrammaticScrollRef.current = false;
              return;
            }
            // User swiped manually → follow the leftmost visible slide
            setActiveIndex(swiper.activeIndex);
            updateNavState(swiper);
          }}
          onBreakpoint={(swiper) => updateNavState(swiper)}
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
                <div className="!min-h-[230px] sm:!h-[400px] xl:!h-[520px] 3xl:!h-[571px]">
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
