"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { motion, AnimatePresence } from "framer-motion";

export type LongevitySlide = {
  image: string;
  title: string;
  href: string;
};

export type LongevityCategory = {
  label: string;
  slides: LongevitySlide[];
};

export type LongevitySystemsData = {
  heading: string;
  categories: LongevityCategory[];
};

// Split categories into two columns (left: first half, right: second half)
function splitColumns<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

export default function LongevitySystems({
  data,
}: {
  data: LongevitySystemsData;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leftCol, rightCol] = splitColumns(data.categories);

  const handleCategoryClick = (index: number) => {
    setActiveIndex(index);
  };

  // Inline the container left padding for the slider's pl
  const containerRef = useRef<HTMLDivElement>(null);
  const inset = useContainerInset(containerRef);

  return (
    <section className="py-120 3xl:py-150 overflow-hidden">
      {/* ── UPPER: container ── */}
      <div ref={containerRef} className="container">
        <div className="flex flex-wrap items-start justify-between gap-y-20 gap-x-8 mb-60">
          {/* Heading */}
          <h2 className="text-secondary text-heading">{data.heading}</h2>

          {/* Category grid — two columns */}
          <div className="grid grid-cols-2 lg:flex gap-30 3xl:gap-[34px]">
            {[leftCol, rightCol].map((col, colIdx) => (
              <ul key={colIdx} className="flex flex-col lg:w-[380px]">
                {col.map((cat) => {
                  const globalIdx =
                    colIdx === 0
                      ? leftCol.indexOf(cat)
                      : leftCol.length + rightCol.indexOf(cat);
                  const isActive = globalIdx === activeIndex;
                  const rightColLastItem =
                    colIdx === 1 &&
                    rightCol.indexOf(cat) === rightCol.length - 1;
                  const leftColLastItem =
                    colIdx === 0 && globalIdx === leftCol.length - 1;

                  return (
                    <li key={cat.label}>
                      <button
                        onClick={() => handleCategoryClick(globalIdx)}
                        className="group w-full text-left bg-none border-none cursor-pointer "
                      >
                        <div className="flex items-center justify-between lg:py-[16px] relative overflow-hidden min-h-[60px]">
                          {/* Animated bg — expands from w-0 to w-full */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                key={globalIdx}
                                className="absolute inset-y-0 left-0 pointer-events-none"
                                style={{
                                  background:
                                    "linear-gradient(90deg, rgba(224, 224, 224, 0) 0%, #E0E0E0 48.56%, rgba(224, 224, 224, 0) 100%)",
                                }}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                exit={{ width: "0%" }}
                                transition={{
                                  duration: 0.35,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                          </AnimatePresence>

                          <span
                            className={`relative z-10 text-19 leading-[1] tracking-[-0.03em] transition-colors duration-300 ${isActive
                                ? "text-secondary font-semibold"
                                : "text-secondary hover:text-secondary/80"
                              }`}
                          >
                            {cat.label}
                          </span>

                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="relative z-10"
                              >
                                <Image
                                  src="/assets/icons/top-right-arrow-secondary.svg"
                                  alt="Arrow right tip"
                                  width={250}
                                  height={250}
                                  className="h-[18px] w-auto object-contain pointer-events-none"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {!rightColLastItem && !leftColLastItem && (
                          <div className="h-px w-full bg-border-color" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingLeft: inset }}>
        <Swiper
          slidesPerView={1.16}
          spaceBetween={20}
          breakpoints={{
            1650: {
              slidesPerView: 3.16,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3.16,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.16,
            },
         
          }}
          className="!overflow-visible"
        >
          {data.categories[activeIndex].slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <SlideCard slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function SlideCard({ slide }: { slide: LongevitySlide }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={slide.href} className="block group">
      {/* Image container */}
      <div
        className="relative overflow-hidden h-[250px] lg:h-[420px] 3xl:h-[550px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"
            }`}
          style={{ background: "#00000066" }}
        />

        {/* Arrow — top right on hover */}
        <div
          className={`absolute top-30 right-30 3xl:top-[34px] 3xl:right-[34px] transition-all duration-300 ${hovered
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-8 -translate-x-8"
            }`}
        >
          <Image
            src="/assets/icons/top-right-arrow.svg"
            alt="Arrow right tip"
            width={200}
            height={200}
            className="h-[80px] w-auto object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Title */}
      <p className="mt-30 text-subHeading tracking-[-0.03em] text-secondary">
        {slide.title}
      </p>
    </Link>
  );
}
