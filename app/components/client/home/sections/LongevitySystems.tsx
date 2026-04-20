// "use client";

// import { useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { useContainerInset } from "@/app/hooks/useContainerInset";
// import { motion, AnimatePresence } from "framer-motion";
// import { AnimatedHeading } from "../../animations/AnimateHeading";
// import Reveal from "../../animations/RevealItemsOneByOneAnimation";
// import { moveUpV2 } from "../../animations/motionVarinats";

// export type LongevitySlide = {
//   image: string;
//   title: string;
//   href: string;
// };

// export type LongevityCategory = {
//   label: string;
//   slides: LongevitySlide[];
// };

// export type LongevitySystemsData = {
//   heading: string;
//   categories: LongevityCategory[];
// };

// // Split categories into two columns (left: first half, right: second half)
// function splitColumns<T>(arr: T[]): [T[], T[]] {
//   const mid = Math.ceil(arr.length / 2);
//   return [arr.slice(0, mid), arr.slice(mid)];
// }

// export default function LongevitySystems({
//   data,
// }: {
//   data: LongevitySystemsData;
// }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [leftCol, rightCol] = splitColumns(data.categories);

//   const handleCategoryClick = (index: number) => {
//     setActiveIndex(index);
//   };

//   // Inline the container left padding for the slider's pl
//   const containerRef = useRef<HTMLDivElement>(null);
//   const inset = useContainerInset(containerRef);

//   return (
//     <section className="py-120 3xl:py-150 overflow-hidden">
//       {/* ── UPPER: container ── */}
//       <div ref={containerRef} className="container">
//         <div className="flex flex-wrap  items-start justify-between gap-y-20 gap-x-8 mb-60">
//           {/* Heading */}
//           {/* <h2 className="text-secondary text-heading">{data.heading}</h2> */}
//           <AnimatedHeading title={data.heading} className="text-secondary text-heading" mode="reveal" />

//           {/* Category grid — two columns */}
//           <div className="grid grid-cols-2 lg:flex gap-30 3xl:gap-[34px] w-fit lg:ml-auto ">
//             {[leftCol, rightCol].map((col, colIdx) => (
//               <ul key={colIdx} className="flex flex-col lg:w-[380px]">
//                 {col.map((cat, itemIndex) => {
//                   const globalIdx =
//                     colIdx === 0
//                       ? leftCol.indexOf(cat)
//                       : leftCol.length + rightCol.indexOf(cat);
//                   const isActive = globalIdx === activeIndex;
//                   const rightColLastItem =
//                     colIdx === 1 &&
//                     rightCol.indexOf(cat) === rightCol.length - 1;
//                   const leftColLastItem =
//                     colIdx === 0 && globalIdx === leftCol.length - 1;

//                   return (
//                     <Reveal key={cat.label} variants={moveUpV2} delayRange={itemIndex * 0.14}>
//                     <li>
//                       <button
//                         onClick={() => handleCategoryClick(globalIdx)}
//                         className="group w-full text-left bg-none border-none cursor-pointer "
//                       >
//                         <div className="flex items-center justify-between relative overflow-hidden min-h-[60px] md:min-h-0">
//                           {/* Animated bg — expands from w-0 to w-full */}
//                           <AnimatePresence>
//                             {isActive && (
//                               <motion.span
//                                 key={globalIdx}
//                                 className="absolute inset-y-0 left-0 pointer-events-none"
//                                 style={{
//                                   background:
//                                     "linear-gradient(90deg, rgba(224, 224, 224, 0) 0%, #E0E0E0 48.56%, rgba(224, 224, 224, 0) 100%)",
//                                 }}
//                                 initial={{ width: "0%" }}
//                                 animate={{ width: "100%" }}
//                                 exit={{ width: "0%" }}
//                                 transition={{
//                                   duration: 0.35,
//                                   ease: "easeInOut",
//                                 }}
//                               />
//                             )}
//                           </AnimatePresence>

//                           <span
//                             className={`relative z-10 text-19 leading-[1.2] 2xl:leading-[2.631578947368421] tracking-[-0.03em] transition-colors duration-300 ${isActive
//                                 ? "text-secondary font-semibold"
//                                 : "text-secondary hover:text-secondary/80"
//                               }`}
//                           >
//                             {cat.label}
//                           </span>

//                           <AnimatePresence>
//                             {isActive && (
//                               <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 transition={{ duration: 0.2, ease: "easeOut" }}
//                                 className="relative z-10"
//                               >
//                                 <Image
//                                   src="/assets/icons/top-right-arrow-secondary.svg"
//                                   alt="Arrow right tip"
//                                   width={250}
//                                   height={250}
//                                   className="h-[18px] w-auto object-contain pointer-events-none"
//                                 />
//                               </motion.div>
//                             )}
//                           </AnimatePresence>
//                         </div>

//                         {!rightColLastItem && !leftColLastItem && (
//                           <div className="h-px w-full bg-border-color" />
//                         )}
//                       </button>
//                     </li>
//                     </Reveal>
//                   );
//                 })}
//               </ul>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ paddingLeft: inset }}>
//         <Swiper
//           slidesPerView={1.16}
//           spaceBetween={20}
//           breakpoints={{
//             1650: {
//               slidesPerView: 3.17,
//               spaceBetween: 30,
//             },
//             1024: {
//               slidesPerView: 3.16,
//               spaceBetween: 20,
//             },
//             768: {
//               slidesPerView: 2.16,
//             },

//           }}
//           className="!overflow-visible"
//         >
//           {data.categories[activeIndex].slides.map((slide, i) => (
//             <SwiperSlide key={i}>
//               <SlideCard slide={slide} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// }

// function SlideCard({ slide }: { slide: LongevitySlide }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Link href={slide.href} className="block group">
//       {/* Image container */}
//       <div
//         className="relative overflow-hidden h-[250px] lg:h-[420px] 3xl:h-[550px]"
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         <Image
//           src={slide.image}
//           alt={slide.title}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-105"
//         />

//         {/* Hover overlay */}
//         <div
//           className={`absolute inset-0 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"
//             }`}
//           style={{ background: "#00000066" }}
//         />

//         {/* Arrow — top right on hover */}
//         <div
//           className={`absolute top-30 right-30 3xl:top-[34px] 3xl:right-[34px] transition-all duration-300 ${hovered
//               ? "opacity-100 translate-y-0 translate-x-0"
//               : "opacity-0 translate-y-8 -translate-x-8"
//             }`}
//         >
//           <Image
//             src="/assets/icons/top-right-arrow.svg"
//             alt="Arrow right tip"
//             width={200}
//             height={200}
//             className="h-[80px] w-auto object-contain pointer-events-none"
//           />
//         </div>
//       </div>

//       {/* Title */}
//       <p className="mt-30 text-subHeading tracking-[-0.03em] text-secondary">
//         {slide.title}
//       </p>
//     </Link>
//   );
// }

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../../animations/motionVarinats";
import gsap from "gsap";

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

function splitColumns<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function preloadImages(srcs: string[]): void {
  srcs.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

export default function LongevitySystems({
  data,
}: {
  data: LongevitySystemsData;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pendingSlides, setPendingSlides] = useState<LongevitySlide[] | null>(
    null,
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingIndexRef = useRef<number>(0);
  const animKeyRef = useRef<number>(0);
  const swiperRef = useRef<any>(null);

  const overlayWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayTitleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── NEW: refs for the currently-visible base slide titles ──
  const baseTitleRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [leftCol, rightCol] = splitColumns(data.categories);

  const containerRef = useRef<HTMLDivElement>(null);
  const inset = useContainerInset(containerRef);

  useEffect(() => {
    const allSrcs = data.categories.flatMap((cat) =>
      cat.slides.map((s) => s.image),
    );
    preloadImages(allSrcs);
  }, [data.categories]);

  const handleCategoryHover = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      preloadImages(data.categories[index].slides.map((s) => s.image));
    },
    [activeIndex, data.categories],
  );

  const handleCategoryClick = useCallback(
    (index: number) => {
      if (index === activeIndex) return;

      setActiveIndex(index);
      swiperRef.current?.slideTo(0, 700);

      // Kill any running timeline immediately
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      // ── GSAP: animate current base titles out (move up + fade) ──
      baseTitleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: 0,
          y: -40,
          duration: 0.35,
          ease: "power2.in",
          delay: i * 0.06,
        });
      });

      const nextSlides = data.categories[index].slides;

      overlayWrapRefs.current = new Array(nextSlides.length).fill(null);
      overlayTitleRefs.current = new Array(nextSlides.length).fill(null);

      pendingIndexRef.current = index;
      animKeyRef.current += 1;

      setPendingSlides(nextSlides);
    },
    [activeIndex, data.categories],
  );

  // useEffect + rAF: wait for React to commit overlay DOM before GSAP touches it
  useEffect(() => {
    if (!pendingSlides) return;

    const capturedKey = animKeyRef.current;

    const raf = requestAnimationFrame(() => {
      if (capturedKey !== animKeyRef.current) return;

      const maxLen = pendingSlides.length;
      const mounted = overlayWrapRefs.current.filter(Boolean);
      if (mounted.length === 0) return;

      for (let i = 0; i < maxLen; i++) {
        const wrap = overlayWrapRefs.current[i];
        const titleEl = overlayTitleRefs.current[i];
        if (wrap) {
          gsap.set(wrap, {
            clipPath: "inset(0 100% 0 0)",
            transformOrigin: "left center",
          });
        }
        if (titleEl) {
          gsap.set(titleEl, { opacity: 0, y: 14 });
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (capturedKey !== animKeyRef.current) return;
          setVisibleIndex(pendingIndexRef.current);
          setPendingSlides(null);
          tlRef.current = null;
        },
      });

      tlRef.current = tl;

      for (let i = 0; i < maxLen; i++) {
        const wrap = overlayWrapRefs.current[i];
        const titleEl = overlayTitleRefs.current[i];

        if (wrap) {
          tl.to(
            wrap,
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.72,
              ease: "expo.out",
            },
            i * 0.1,
          );
        }
        if (titleEl) {
          tl.to(
            titleEl,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
            },
            i * 0.1 + 0.35,
          );
        }
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pendingSlides]);

  return (
    <section className="py-120 3xl:py-150 overflow-hidden">
      <div ref={containerRef} className="container">
        <div className="flex flex-wrap items-start justify-between gap-y-20 gap-x-8 mb-60">
          <AnimatedHeading
            title={data.heading}
            className="text-secondary text-heading"
            mode="reveal"
          />

          <div className="grid grid-cols-2 lg:flex gap-[10px] sm:gap-30 3xl:gap-[34px] w-fit lg:ml-auto">
            {[leftCol, rightCol].map((col, colIdx) => (
              <ul key={colIdx} className="flex flex-col lg:w-[380px]">
                {col.map((cat, itemIndex) => {
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
                    <Reveal
                      key={cat.label}
                      variants={moveUpV2}
                      delayRange={itemIndex * 0.14}
                    >
                      <li>
                        <button
                          onClick={() => handleCategoryClick(globalIdx)}
                          onMouseEnter={() => handleCategoryHover(globalIdx)}
                          className="group w-full text-left bg-none border-none cursor-pointer"
                        >
                          <div className="flex items-center gap-[6px] justify-between relative overflow-hidden min-h-[60px]">
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
                              data-text={cat.label}
                              className={`contact-link relative z-10 text-[12px] md:text-19 leading-[1.2] 2xl:leading-[2.631578947368421] tracking-[-0.03em] transition-colors duration-300 ${
                                isActive
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
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                  }}
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
                    </Reveal>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* ── SLIDER ── */}
      <div style={{ paddingLeft: inset }}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.16}
          spaceBetween={20}
          speed={700}
          breakpoints={{
            1650: { slidesPerView: 3.17, spaceBetween: 30 },
            1024: { slidesPerView: 3.16, spaceBetween: 20 },
            768: { slidesPerView: 2.16 },
          }}
          className="!overflow-visible"
        >
          {(pendingSlides ?? data.categories[visibleIndex].slides).map(
            (_, i) => {
              const baseSlide = data.categories[visibleIndex].slides[i];
              const pending = pendingSlides?.[i];

              return (
                <SwiperSlide key={`${visibleIndex}-${i}`}>
                  <div className="relative overflow-hidden">
                    {/* BASE layer */}
                    {baseSlide && (
                      <SlideCard
                        slide={baseSlide}
                        index={visibleIndex}
                        // ── pass ref so LongevitySystems can GSAP-animate the title out ──
                        titleRef={(el) => {
                          baseTitleRefs.current[i] = el;
                        }}
                      />
                    )}

                    {/* OVERLAY layer — animated in via GSAP clipPath */}
                    {pending && (
                      <div
                        ref={(el) => {
                          overlayWrapRefs.current[i] = el;
                        }}
                        className="absolute inset-0 z-10 will-change-[clip-path]"
                      >
                        {/* Image */}
                        <div className="relative overflow-hidden h-[250px] lg:h-[420px] 3xl:h-[550px]">
                          <Image
                            src={pending.image}
                            alt={pending.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        {/* Overlay title — enters from below via GSAP */}
                        <div className="overflow-hidden mt-30">
                          <p
                            ref={(el) => {
                              overlayTitleRefs.current[i] = el;
                            }}
                            className="text-subHeading tracking-[-0.03em] text-secondary"
                          >
                            {pending.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            },
          )}
        </Swiper>
      </div>
    </section>
  );
}

// ── SlideCard: title is now a plain <p> with a forwarded ref ──
// Framer Motion AnimatePresence removed from the title — GSAP owns the exit.
function SlideCard({
  slide,
  index,
  titleRef,
}: {
  slide: LongevitySlide;
  index: number;
  titleRef?: (el: HTMLParagraphElement | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={slide.href} className="block group">
      {/* ── IMAGE — completely untouched ── */}
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
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "#00000066" }}
        />
        <div
          className={`absolute top-30 right-30 3xl:top-[34px] 3xl:right-[34px] transition-all duration-300 ${
            hovered
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-8 -translate-x-8"
          }`}
        >
          <Image
            src="/assets/icons/top-right-arrow.svg"
            alt="Arrow right tip"
            width={200}
            height={200}
            className="h-[40px] md:h-[50px] xl:h-[80px] w-auto object-contain pointer-events-none"
          />
        </div>
      </div>

      {/* Title — plain <p> with ref; GSAP animates it out on category click */}
      <div className="overflow-hidden mt-30">
        <p
          ref={titleRef}
          className="text-subHeading tracking-[-0.03em] text-secondary"
        >
          {slide.title}
        </p>
      </div>
    </Link>
  );
}
