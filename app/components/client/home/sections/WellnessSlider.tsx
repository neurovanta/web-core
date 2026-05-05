"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import CustomButton from "../../common/CustomButton";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVarinats";

export type Slide = {
  number: string;
  title: string;
  image: string;
};

export type WellnessSliderData = {
  heading: string;
  description: string;
  buttons: { label: string; href: string }[];
  slides: Slide[];
};

const AUTOPLAY_DELAY = 3000;
const TRANSITION_DURATION = 700; // ms — must match CSS transition below

function preloadImage(src: string): void {
  if (!src) return;
  const img = new window.Image();
  img.src = src;
}

export default function WellnessSlider({
  data,
  descriptionMaxWidth = "max-w-[52ch]",
}: {
  data: WellnessSliderData;
  descriptionMaxWidth?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Tracks which image is "settled" in the base layer after the crossfade finishes
  const [baseIndex, setBaseIndex] = useState(0);
  // Controls opacity of the incoming (top) layer: false = 0, true = 1
  const [topVisible, setTopVisible] = useState(false);
  // The image currently fading in on top
  const [topIndex, setTopIndex] = useState<number | null>(null);

  const { slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Preload neighbours whenever active index changes ──────────────────────
  useEffect(() => {
    const next = (activeIndex + 1) % slides.length;
    const prev = (activeIndex - 1 + slides.length) % slides.length;
    preloadImage(slides[next].image);
    preloadImage(slides[prev].image);
  }, [activeIndex, slides]);

  // ── Preload ALL images once on mount ─────────────────────────────────────
  useEffect(() => {
    slides.forEach((s) => preloadImage(s.image));
  }, [slides]);

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === baseIndex) return;

      // Clear any pending settle
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

      setTopIndex(nextIndex);
      setTopVisible(false);

      // One microtask tick to ensure the top layer renders at opacity-0 first,
      // then trigger the fade-in.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTopVisible(true);
        });
      });

      settleTimerRef.current = setTimeout(() => {
        setBaseIndex(nextIndex);
        setTopVisible(false);
        setTopIndex(null);
      }, TRANSITION_DURATION + 50); // +50ms buffer
    },
    [baseIndex],
  );

  useEffect(() => {
    transitionTo(activeIndex);
  }, [activeIndex, transitionTo]);

  // ── Swiper visibility helper ──────────────────────────────────────────────
  const isIndexVisible = useCallback((index: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return true;
    const spv =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1;
    const start = swiper.activeIndex;
    const end = start + Math.floor(spv) - 1;
    return index >= start && index <= end;
  }, []);

  // ── Autoplay ──────────────────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => {
        const next = prev + 1 >= slides.length ? 0 : prev + 1;
        requestAnimationFrame(() => {
          if (next === 0) {
            swiperRef.current?.slideTo(0);
          } else if (!isIndexVisible(next)) {
            swiperRef.current?.slideTo(next);
          }
        });
        return next;
      });
    }, AUTOPLAY_DELAY);
  }, [slides.length, isIndexVisible]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startAutoplay]);

  // Cleanup settle timer on unmount
  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  const handleSlideClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIndex(index);
    requestAnimationFrame(() => {
      if (!isIndexVisible(index)) {
        swiperRef.current?.slideTo(index);
      }
    });
    startAutoplay();
  };

  return (
    // <section className="relative w-full h-[90vh] sm:h-[80vh] xl:h-[92vh] overflow-hidden">
    <section className="relative w-full h-dvh overflow-hidden">
      {/* ── Background layers ─────────────────────────────────────────────── */}

      {/* Base layer — always fully opaque, holds the "settled" image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slides[baseIndex].image})`,
          filter: "brightness(0.45)",
          willChange: "background-image",
        }}
      />

      {/* Top layer — fades in over base, then gets replaced */}
      {topIndex !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slides[topIndex].image})`,
            filter: "brightness(0.45)",
            opacity: topVisible ? 1 : 0,
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            willChange: "opacity",
          }}
        />
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="container relative z-10 h-full flex flex-col py-120 3xl:py-0 3xl:pt-120 3xl:pb-[112px]">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-20">
            <AnimatedHeading
              title={data.heading}
              className="text-white text-heading max-w-[900px] 2xl:max-w-[985px]"
            />
            <div className="mb-60 md:mb-0">
              <SectionDescription
                text={data.description}
                className={`text-white text-19 leading-[1.52] ${descriptionMaxWidth}`}
              />
            </div>
          </div>

          <div className="hidden min-[870px]:flex min-[870px]:flex-col items-end gap-20 shrink-0 xl:pt-[13px]">
            {data.buttons.map((btn, i) => (
              <Reveal key={btn.label} variants={moveUpV2} delayRange={i * 0.2}>
                <CustomButton label={btn.label} href={btn.href} variant={1} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="flex min-[870px]:hidden flex-col items-end gap-20 shrink-0 sm:mt-20">
          {data.buttons.map((btn) => (
            <Reveal key={btn.label} variants={moveUpV2} delayRange={0.2}>
              <CustomButton label={btn.label} href={btn.href} variant={1} />
            </Reveal>
          ))}
        </div>

        <div className="flex-1" />

        {/* ── Slide strip ─────────────────────────────────────────────────── */}
        <div className="[&_.swiper-wrapper]:items-end">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              requestAnimationFrame(() => {
                setActiveIndex(swiper.activeIndex);
              });
            }}
            spaceBetween={29}
            loop={false}
            allowTouchMove={true}
            initialSlide={0}
            breakpoints={{
              0: { slidesPerView: 2 },
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
                        <span className="block text-15 leading-[1.73] mb-[14px] transition-colors duration-300 text-white/40">
                          {slide.number}
                        </span>
                        <span
                          className={`block text-19 leading-[1.5263] mb-25 min-h-[45px] 2xl:min-h-0 transition-colors duration-300 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-white/60"
                          }`}
                        >
                          {slide.title}
                        </span>

                        {/* Progress line */}
                        <div className="relative w-full h-[2px] overflow-hidden">
                          {/* Base gradient line */}
                          <div
                            className="absolute inset-0 opacity-60 h-px"
                            style={{
                              background:
                                "linear-gradient(90deg, #E2D3C3 0%, rgba(226, 211, 195, 0.1) 100%)",
                            }}
                          />
                          {/* Active animated line */}
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
