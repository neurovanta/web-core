"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import CustomButton from "../../common/CustomButton";

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

export default function WellnessSlider({ data }: { data: WellnessSliderData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Returns true if the given slide index is currently within the visible range
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

  const handleSlideClick = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => {
      if (!isIndexVisible(index)) {
        swiperRef.current?.slideTo(index);
      }
    });
    startAutoplay();
  };

  return (
    <section className="relative w-full h-[90vh] sm:h-[80vh] xl:h-[92vh] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${slides[activeIndex].image})`,
          filter: "brightness(0.45)",
        }}
      />

      <div className="container relative z-10 h-full flex flex-col py-120 3xl:py-0 3xl:pt-120 3xl:pb-[112px]">
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-8">
          <h1 className="text-white text-heading max-w-[985px]">
            {data.heading}
          </h1>

          <div className="hidden sm:flex sm:flex-col items-end gap-20 shrink-0">
            {data.buttons.map((btn) => (
              <CustomButton
                key={btn.label}
                label={btn.label}
                href={btn.href}
                variant={1}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-20 max-w-[701px] mb-60 md:mb-0">
          <p className="text-white text-19 leading-[1.52]">
            {data.description}
          </p>
        </div>
        <div className="flex sm:hidden flex-col items-end gap-20 shrink-0">
          {data.buttons.map((btn) => (
            <CustomButton
              key={btn.label}
              label={btn.label}
              href={btn.href}
              variant={1}
            />
          ))}
        </div>
        {/* Spacer */}
        <div className="flex-1" />

        {/* Slide strip */}
        <div>
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => {
              requestAnimationFrame(() => {
                setActiveIndex(swiper.activeIndex);
              });
            }}
            spaceBetween={30}
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
                  <button
                    onClick={() => handleSlideClick(index)}
                    className="w-full text-left focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`block text-15 leading-[1.73] mb-[14px] transition-colors duration-300 ${
                        isActive ? "text-white" : "text-white/40"
                      }`}
                    >
                      {slide.number}
                    </span>

                    <span
                      className={`block text-19 leading-[1.5263] mb-25 transition-colors duration-300 ${
                        isActive ? "text-white font-semibold" : "text-white/60"
                      }`}
                    >
                      {slide.title}
                    </span>

                    {/* Progress line */}
                    <div className="relative w-full h-[2px] overflow-hidden">
                      {/* Base gradient line — always visible */}
                      <div
                        className="absolute inset-0 opacity-60 h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, #E2D3C3 0%, rgba(226, 211, 195, 0.1) 100%)",
                        }}
                      />
                      {/* Active line — slides in from left over the base */}
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-bar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}