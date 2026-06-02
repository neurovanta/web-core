"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../animations/motionVarinats";
import { ElasticEffect } from "../animations/ElasticEffect";
import SliderNavButton from "./SliderButton";
import { motion } from "framer-motion";

interface FourCardSliderProps {
  data: {
    title: string;
    slides: {
      title: string;
      image: string;
    }[];
  };
}

export default function FourCardSlider({ data }: FourCardSliderProps) {
  const { title, slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

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

  const updateNavState = (swiper: SwiperType) => {
    setPrevDisabled(swiper.isBeginning);
    setNextDisabled(swiper.isEnd);
  };

  return (
    <section className="bg-cream-bg overflow-hidden">
      <div className="container py-[60px] lg:py-120">
        <div className="flex justify-between items-start mb-[30px] lg:mb-60">
          <AnimatedHeading
            title={title}
            mode="reveal"
            className="text-secondary"
          />
          {isSliding && (
            <div className="hidden sm:flex justify-center items-center gap-[10px]">
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
          )}
        </div>

        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSlidesPerView(getSlidesPerView(swiper));
            updateNavState(swiper);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            updateNavState(swiper);
          }}
          onBreakpoint={(swiper) => {
            setSlidesPerView(getSlidesPerView(swiper));
            updateNavState(swiper);
          }}
          spaceBetween={15}
          loop={false}
          autoplay={
            isSliding ? { delay: 3000, disableOnInteraction: false } : false
          }
          breakpoints={{
            0: { slidesPerView: 1.158 },
            460: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          centeredSlides={true}
          centeredSlidesBounds={true}
          className="!overflow-visible min-[460px]:!overflow-hidden"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <Reveal variants={moveUpV2} delayRange={i * 0.15}>
                <div className="relative w-full group h-[359px] md:h-[440px] lg:h-[500px] 3xl:h-[609px] overflow-hidden">
                  <ElasticEffect />
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover pointer-events-none group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute left-0 right-0 bottom-0 h-[306px] w-full z-30 bg-linear-to-b from-transparent to-black opacity-80" />
                  <p className="absolute bottom-0 left-0 right-0 z-40 text-white text-subHeading px-30 3xl:px-40 py-40 -tracking-[0.03em]">
                    {slide.title}
                  </p>
                </div>
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination dots */}
        {isSliding && totalDots > 1 && (
          <div className="items-center justify-center gap-2 mt-[50px] hidden sm:flex">
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

        {isSliding && (
          <motion.div
            variants={moveUp(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex sm:hidden justify-center items-center gap-[10px] pt-[30px]"
          >
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
