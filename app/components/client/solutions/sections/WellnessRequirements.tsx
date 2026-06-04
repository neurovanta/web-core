"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import CustomButton from "../../common/CustomButton";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../../animations/motionVarinats";
import { motion } from "framer-motion";

export type Slide = {
  number: string;
  title: string;
  image: string;
};

export type WellnessSliderData = {
  heading: string;
  description: string;
  button: { label: string; href: string };
  slides: Slide[];
};

const AUTOPLAY_DELAY = 3000;
const TRANSITION_DURATION = 700;

function preloadImage(src: string): void {
  if (!src) return;
  const img = new window.Image();
  img.src = src;
}

export default function WellnessRequirements({
  data,
  descriptionMaxWidth = "max-w-[54ch]",
}: {
  data: WellnessSliderData;
  descriptionMaxWidth?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);
  const [topVisible, setTopVisible] = useState(false);
  const [topIndex, setTopIndex] = useState<number | null>(null);

  const { slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  useEffect(() => {
    const next = (activeIndex + 1) % slides.length;
    const prev = (activeIndex - 1 + slides.length) % slides.length;
    preloadImage(slides[next].image);
    preloadImage(slides[prev].image);
  }, [activeIndex, slides]);

  useEffect(() => {
    slides.forEach((s) => preloadImage(s.image));
  }, [slides]);

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === baseIndex) return;
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

      setTopIndex(nextIndex);
      setTopVisible(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTopVisible(true);
        });
      });

      settleTimerRef.current = setTimeout(() => {
        setBaseIndex(nextIndex);
        setTopVisible(false);
        setTopIndex(null);
      }, TRANSITION_DURATION + 50);
    },
    [baseIndex],
  );

  useEffect(() => {
    transitionTo(activeIndex);
  }, [activeIndex, transitionTo]);

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
      if (!swiper || isIndexVisible(index)) return;

      const spv = getSlidesPerView();
      const start = swiper.activeIndex;

      isProgrammaticScrollRef.current = true;

      if (index < start) {
        swiper.slideTo(index);
      } else {
        swiper.slideTo(index - spv + 1);
      }
    },
    [isIndexVisible, getSlidesPerView],
  );

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => {
        const next = prev + 1 >= slides.length ? 0 : prev + 1;
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

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  const handleSlideClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIndex(index);
    requestAnimationFrame(() => ensureVisible(index));
    startAutoplay();
  };

  const handleSectionTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleSectionTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
    const deltaY = Math.abs(
      touchStartYRef.current - e.changedTouches[0].clientY,
    );

    // Only treat as horizontal swipe (ignore scrolls)
    if (Math.abs(deltaX) < 50 || deltaY > Math.abs(deltaX)) return;

    if (deltaX > 0) {
      // Swipe left → next
      const next = activeIndex + 1 >= slides.length ? 0 : activeIndex + 1;
      handleSlideClick(next);
    } else {
      // Swipe right → prev
      const prev = activeIndex - 1 < 0 ? slides.length - 1 : activeIndex - 1;
      handleSlideClick(prev);
    }
  };

  return (
    <section
      onTouchStart={handleSectionTouchStart}
      onTouchEnd={handleSectionTouchEnd}
      className="relative w-full overflow-hidden min-h-[600px] sm:min-h-0"
    >
      {/* Base layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slides[baseIndex].image})`,
          willChange: "background-image",
        }}
      />

      {/* Top layer */}
      {topIndex !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slides[topIndex].image})`,
            opacity: topVisible ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            willChange: "opacity",
          }}
        />
      )}

      <div className="absolute inset-0 bg-black/70" />

      <div className="container relative z-10 flex flex-col justify-between py-[60px] lg:py-120 min-h-[600px] sm:min-h-0 sm:h-auto">
        <div className="flex flex-col">
          <AnimatedHeading
            title={data.heading}
            className="text-white text-heading max-w-[23ch] mb-[15px] sm:mb-20"
          />
          <SectionDescription
            text={data.description}
            className={`text-white text-19 leading-[1.52] mb-[30px] sm:mb-50 ${descriptionMaxWidth}`}
          />
          <motion.div
            variants={moveUp(0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <CustomButton
              label={data.button.label}
              href={data.button.href}
              variant={1}
            />
          </motion.div>
        </div>

        <div className="[&_.swiper-wrapper]:items-end mt-120 relative">
          <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center bg-primary h-[22px] w-[50px] text-[12px] font-semibold rounded-full">
            <span className="text-secondary">0{activeIndex + 1}/</span>
            <span className="text-secondary/40">0{slides.length}</span>
          </div>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              if (isProgrammaticScrollRef.current) {
                isProgrammaticScrollRef.current = false;
                return;
              }
              requestAnimationFrame(() => {
                setActiveIndex(swiper.activeIndex);
              });
            }}
            spaceBetween={29}
            loop={false}
            allowTouchMove={true}
            initialSlide={0}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1500: { slidesPerView: 4, spaceBetween: 30 },
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <SwiperSlide key={slide.number}>
                  <Reveal variants={moveUpV2} delayRange={index * 0.15}>
                    <div>
                      <button
                        onClick={() => handleSlideClick(index)}
                        className="w-full text-left focus:outline-none cursor-pointer"
                      >
                        <span
                          className={`block not-odd:text-15 leading-[1.666] sm:leading-[1.73] mb-[5px] sm:mb-[14px] transition-colors duration-300 ${isActive ? "text-white" : "text-white/40"}`}
                        >
                          {slide.number}
                        </span>
                        <span
                          className={`block text-19 leading-[1.5263] mb-20 sm:mb-25 sm:min-h-[45px] 2xl:min-h-0 transition-colors duration-300 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-white/60"
                          }`}
                        >
                          {slide.title}
                        </span>

                        <div className="relative w-full h-[2px] overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-60 h-px"
                            style={{
                              background:
                                "linear-gradient(90deg, #E2D3C3 0%, rgba(226, 211, 195, 0.1) 100%)",
                            }}
                          />
                          {isActive && (
                            <div
                              key={`progress-${activeIndex}`}
                              className="absolute inset-0 origin-left"
                              style={{
                                background:
                                  "linear-gradient(90deg, #E2D3C3 0%, rgba(226, 211, 195, 0.1) 100%)",
                                animation: `progress-bar ${AUTOPLAY_DELAY}ms linear forwards`,
                              }}
                            />
                          )}
                        </div>
                      </button>
                    </div>
                  </Reveal>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-bar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
