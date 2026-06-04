"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import Reveal from "@/app/components/client/animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "@/app/components/client/animations/motionVarinats";
import { SectionDescription } from "@/app/components/client/animations/SectionDescription";
import { ElasticEffect } from "../animations/ElasticEffect";

interface TabsImageProps {
  data: {
    title: string;
    subtitle: string;
    tabs: {
      title: string;
      image: string;
    }[];
  };
}

export default function TabsImage({ data }: TabsImageProps) {
  const { title, subtitle, tabs } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  const half = Math.ceil(tabs.length / 2);
  const leftCol = tabs.slice(0, half);
  const rightCol = tabs.slice(half);

  const triggerTransition = (idx: number) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
  };

  return (
    <section className="bg-cream-bg overflow-hidden">
      <div className="container py-[60px] lg:py-120">
        <div className="flex flex-col lg:flex-row lg:items-center gap-60 3xl:gap-[112px]">
          {/* Left Side */}
          <div className="flex flex-col">
            <AnimatedHeading
              title={title}
              mode="reveal"
              className="text-secondary mb-[15px] sm:mb-20 max-w-[14ch]"
            />
            <SectionDescription
              text={subtitle}
              className="text-description text-secondary tracking-[-0.03em] mb-[30px] lg:mb-60"
            />

            <div className="relative w-full aspect-4/3 lg:hidden overflow-hidden mb-[15px] max-[430px]:max-h-[224px] min-[431px]:max-h-[420px]">
              <ElasticEffect />
              {/* Base layer — previous image, always visible underneath */}
              <Image
                src={
                  tabs[activeIndex === 0 ? tabs.length - 1 : activeIndex - 1]
                    ?.image ?? tabs[0].image
                }
                alt="previous"
                fill
                className="object-cover pointer-events-none"
              />

              {/* Wipe-in layer — new image slides over the base */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <Image
                    src={tabs[activeIndex].image}
                    alt={tabs[activeIndex].title}
                    fill
                    className="object-cover pointer-events-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30 3xl:gap-x-[33px]">
              {[leftCol, rightCol].map((col, colIdx) => (
                <ul key={colIdx} className="flex flex-col">
                  {col.map((tab, itemIndex) => {
                    const globalIdx =
                      colIdx === 0 ? itemIndex : leftCol.length + itemIndex;
                    const isActive = globalIdx === activeIndex;
                    // const isLastInCol = itemIndex === col.length - 1;

                    return (
                      <Reveal
                        key={tab.title}
                        variants={moveUpV2}
                        delayRange={itemIndex * 0.14}
                      >
                        <li>
                          <button
                            onClick={() => triggerTransition(globalIdx)}
                            onMouseEnter={() => triggerTransition(globalIdx)}
                            className="group w-full text-left bg-none border-none cursor-pointer xl:min-w-[310px] 3xl:min-w-[350px]"
                          >
                            {colIdx === 0 && itemIndex === 0 && <div className="h-px w-full bg-border-color lg:hidden" />}
                            <div className="flex items-center gap-[6px] justify-between relative overflow-hidden max-h-[49px]">
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
                                className={`relative z-10 text-19 leading-[2.3] h-[40px] flex items-center lg:h-auto xl:leading-[2.631578947368421] lg:tracking-[-0.03em] transition-colors duration-300 ${
                                  isActive
                                    ? "text-secondary font-semibold"
                                    : "text-secondary hover:text-secondary/80"
                                }`}
                              >
                                {tab.title}
                              </span>
                            </div>

                            {/* {!isLastInCol && ( */}
                            <div className="h-px w-full bg-border-color" />
                            {/* )} */}
                          </button>
                        </li>
                      </Reveal>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:block relative w-full lg:flex-1 aspect-4/3 lg:aspect-auto lg:h-[420px] xl:h-[480px] 3xl:h-[578px] overflow-hidden">
            <ElasticEffect />
            {/* Base layer — previous image, always visible underneath */}
            <Image
              src={
                tabs[activeIndex === 0 ? tabs.length - 1 : activeIndex - 1]
                  ?.image ?? tabs[0].image
              }
              alt="previous"
              fill
              className="object-cover pointer-events-none"
            />

            {/* Wipe-in layer — new image slides over the base */}
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  duration: 0.7,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                <Image
                  src={tabs[activeIndex].image}
                  alt={tabs[activeIndex].title}
                  fill
                  className="object-cover pointer-events-none"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
