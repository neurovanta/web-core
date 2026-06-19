"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVarinats";
import { ElasticEffect } from "../../animations/ElasticEffect";
import { AboutType } from "@/app/types/about";

export default function Purposes({ data }: { data: AboutType["secondSection"] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const totalSlides = data.items.length;

  const isSliding = slidesPerView < totalSlides;
  const totalDots = Math.ceil(totalSlides / slidesPerView);
  const activeDotIndex = Math.floor(activeIndex / slidesPerView);

  const getSlidesPerView = (swiper: SwiperType): number => {
    const spv = swiper.params.slidesPerView;
    return typeof spv === "number" ? spv : 1;
  };

  const handleDotClick = (i: number) => {
    const targetIndex = i * slidesPerView;
    const maxIndex = totalSlides - slidesPerView;
    swiperRef.current?.slideTo(Math.min(targetIndex, maxIndex));
  };

  return (
    <section className="bg-cream-bg overflow-hidden relative">
      <ElasticEffect />
      <div className="container py-[60px] lg:py-120 3xl:py-150">
        <AnimatedHeading
          title="OUR PURPOSES"
          mode="reveal"
          className="text-secondary mb-[30px] lg:mb-60"
        />

        {/* Mobile: no Swiper */}
        <div className="flex flex-col md:hidden">
          {data.items.map((item, i) => (
            <div key={i}>
              {i > 0 && (
                <div
                  className="h-px w-full my-20 rotate-180"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(81, 70, 62, 0.1) 0%, #51463E 100%)",
                  }}
                />
              )}
              <Reveal variants={moveUpV2} delayRange={i * 0.14}>
                <div className="flex flex-col flex-1">
                  <div className="w-[40px] h-[40px] sm:w-[55px] sm:h-[55px] relative shrink-0 mb-[15px] sm:mb-20">
                    <Image
                      src={item.icon}
                      alt={item.iconAlt}
                      fill
                      className="object-contain pointer-events-none"
                    />
                  </div>
                  <h3 className="text-subHeading text-secondary mb-[10px] sm:mb-20 tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="text-description text-secondary tracking-[-0.03em]">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        {/* md and above: Swiper */}
        <div className="hidden md:block">
          <Swiper
            className="purposes-swiper"
            watchSlidesProgress
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSlidesPerView(getSlidesPerView(swiper));
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            onBreakpoint={(swiper) => {
              setSlidesPerView(getSlidesPerView(swiper));
            }}
            slidesPerView={1}
            spaceBetween={0}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            allowTouchMove={isSliding}
          >
            {data.items.map((item, i) => (
              <SwiperSlide key={i}>
                <Reveal variants={moveUpV2} delayRange={i * 0.14}>
                  <div className="flex items-stretch">
                    <div
                      className="divider-line w-px shrink-0 self-stretch mr-60 3xl:mr-[63px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(81, 70, 62, 0.1) 0%, #51463E 100%)",
                      }}
                    />
                    <div className="flex flex-col flex-1 max-w-[490px]">
                      <div className="w-[70px] h-[70px] relative shrink-0 mb-50">
                        <Image
                          src={item.icon}
                          alt={item.iconAlt}
                          fill
                          className="object-contain pointer-events-none"
                        />
                      </div>
                      <h3 className="text-subHeading text-secondary mb-20">
                        {item.title}
                      </h3>
                      <p className="text-description text-secondary tracking-[-0.03em] pr-20 3xl:pr-0">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination dots — only when sliding */}
          {isSliding && totalDots > 1 && (
            <div className="flex items-center justify-center gap-2 mt-[50px]">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Go to slide group ${i + 1}`}
                  className="transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      activeDotIndex === i
                        ? "w-[10px] h-[10px] bg-secondary"
                        : "w-[8px] h-[8px] bg-secondary/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
