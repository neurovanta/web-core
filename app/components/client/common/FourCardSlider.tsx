"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";

interface FourCardSliderProps {
  data: {
    title: string;
    slides: {
      title: string;
      image: string;
    }[];
  };
}

export default function FourCardSlider({
  data,
}: FourCardSliderProps) {
  const { title, slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  const totalSlides = slides.length;
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
    <section className="bg-cream-bg overflow-hidden">
      <div className="container py-120 3xl:py-150">
        <AnimatedHeading
          title={title}
          mode="reveal"
          className="text-secondary mb-20 lg:mb-60"
        />

        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSlidesPerView(getSlidesPerView(swiper));
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          onBreakpoint={(swiper) => {
            setSlidesPerView(getSlidesPerView(swiper));
          }}
          spaceBetween={15}
          loop={false}
          autoplay={
            isSliding ? { delay: 3000, disableOnInteraction: false } : false
          }
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[360px] md:h-[440px] lg:h-[500px] 3xl:h-[609px] overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-0 right-0 bottom-0 h-[306px] w-full z-30 bg-gradient-to-b from-transparent to-black opacity-80" />
                <p className="absolute bottom-0 left-0 right-0 z-40 text-white text-subHeading px-30 3xl:px-40 py-40 -tracking-[0.03em]">
                  {slide.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination dots */}
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
    </section>
  );
}
