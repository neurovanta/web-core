"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import { AnimatedHeading } from "../animations/AnimateHeading";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../animations/motionVarinats";
import { motion } from "framer-motion";
import SliderNavButton from "../common/SliderButton";
import { ElasticEffect } from "../animations/ElasticEffect";

export type CommonSlide = {
  icon: string;
  title: string;
};

export type CommonSectionData = {
  heading: string;
  slides: CommonSlide[];
};

const AUTOPLAY_DELAY = 3000;

function CommonSlideDivider() {
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

function CommonSlideCard({
  slide,
  index,
}: {
  slide: CommonSlide;
  index: number;
}) {
  return (
<div className="relative h-full select-none pt-20 sm:pt-60 3xl:pt-80 px-20 sm:px-50 3xl:px-70 pb-20 sm:pb-70 3xl:pb-[74px] bg-[#FBF7F433] border-x border-x-[#FBF7F4]/10 sm:bg-transparent mx-[16px] sm:mx-0">
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

  <div className="hidden sm:block">
    <CommonSlideDivider />
  </div>
  <div className="flex flex-col justify-between h-full">
    <div>
      <Image
        src={slide.icon}
        alt="icon"
        width={100}
        height={100}
        className="h-[40px] w-[40px] sm:h-[70px] sm:w-auto pointer-events-none mb-20 sm:mb-0"
      />
    </div>
    <div>
      <motion.p
        key={`${index}`}
        initial="hidden"
        animate="show"
        variants={moveUp(0)}
        className={`text-subHeading tracking-[-0.03em] text-secondary max-w-[256px] sm:max-w-[15ch] sm:whitespace-pre-line`}
      >
        {slide.title}
      </motion.p>
    </div>
  </div>
</div>
  );
}

export default function CommonSlider({ data }: { data: CommonSectionData }) {
  const { heading, slides } = data;
  const swiperRef = useRef<SwiperType | null>(null);

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
    setActiveIndex(swiper.activeIndex + 1);
  };

  return (
    <section className="relative w-full bg-primary py-[60px] sm:py-0 sm:pt-120 overflow-hidden">
      <ElasticEffect />
      <div className="container flex flex-col sm:flex-row justify-between items-start">
        <AnimatedHeading
          title={heading}
          className="text-heading mb-[15px] sm:mb-20 lg:mb-60 text-secondary w-full"
          mode="reveal"
        />
        <div className="sm:hidden w-full bg-[#FBF7F4] h-px mb-[15px] sm:mb-0" />
        {showNav && (
          <div className="flex items-center w-full justify-between sm:justify-end mb-[30px] sm:mb-0">
            <div className="sm:hidden bg-secondary h-[22px] w-[50px] flex items-center justify-center text-[12px] text-semibold rounded-[51px]">
              <span className="text-primary">0{activeIndex}/</span>
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

      <div>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateNavState(swiper);
          }}
          onSlideChange={(swiper) => updateNavState(swiper)}
          onBreakpoint={(swiper) => updateNavState(swiper)}
          loop={false}
          allowTouchMove={true}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
          }}
          speed={800}
          initialSlide={0}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Reveal variants={moveUpV2} delayRange={index * 0.14}>
                <div className="!min-h-[126px] sm:!h-[320px] xl:!h-[420px] 3xl:!h-[471px]">
                  <CommonSlideCard slide={slide} index={index} />
                </div>
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
