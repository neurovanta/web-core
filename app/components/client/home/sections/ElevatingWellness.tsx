"use client";

import Image from "next/image";
import { useState } from "react";
import { elevatingWellnessData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVarinats";
import { motion } from "framer-motion";

export default function ElevatingWellness() {
  const { heading, items } = elevatingWellnessData;

  const [activeIndex, setActiveIndex] = useState(0);
  const [reloadKeys, setReloadKeys] = useState<Record<number, number>>({});

  const handleActivate = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setReloadKeys((prev) => ({
      ...prev,
      [index]: (prev[index] ?? 0) + 1,
    }));
  };
  return (
    <section className="bg-cream-bg py-120 3xl:py-0 3xl:pt-150 3xl:pb-170 min-[1700px]:py-[177px] overflow-hidden">
      <div className="container">
        <div className="grid xl:grid-cols-[320px_auto] 3xl:grid-cols-[364px_auto] gap-x-160 3xl:gap-x-225">
          <AnimatedHeading
            title={heading}
            className="xl:col-span-1 xl:col-start-2 col-start-1 text-heading text-secondary max-w-[20ch] mb-20 lg:mb-60"
            mode="reveal"
          />

          <motion.div
            key={activeIndex}
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden xl:flex items-center justify-center"
          >
            <Image
              key={`${activeIndex}-${reloadKeys[activeIndex] ?? 0}`}
              src={`${items[activeIndex].image}?v=${reloadKeys[activeIndex] ?? 0}`}
              alt={items[activeIndex].label}
              width={500}
              height={500}
              className="object-contain xl:h-[290px] 3xl:h-[366px] w-auto"
              unoptimized
            />
          </motion.div>

          <ul className="list-none border-t border-[#c9b8a8]">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Reveal
                  key={item.id}
                  variants={moveUpV2}
                  delayRange={index * 0.13}
                >
                  <li
                    onMouseEnter={() => handleActivate(index)}
                    onClick={() => handleActivate(index)}
                    className={`border-b border-[#c9b8a8] cursor-pointer transition-all duration-400 pr-30 ${
                      isActive ? "xl:pl-30" : "pl-0"
                    }`}
                  >
                    <div className="flex items-center justify-between py-25">
                      <span
                        className={`text-subHeading text-secondary tracking-[-0.03em] transition-all duration-300 ${isActive ? "font-semibold" : ""}`}
                      >
                        {item.label}
                      </span>
                      <div className="flex items-center gap-10">
                        <Image
                          src="/assets/icons/down-arrow-tip.svg"
                          alt="Expand item"
                          width={13}
                          height={13}
                          className={`h-[10px] 3xl:h-[12px] w-auto transition-transform duration-300 xl:hidden ${isActive ? "rotate-180" : "rotate-0"}`}
                        />
                        <div className="hidden xl:block">
                          <Image
                            src="/assets/icons/top-right-arrow-secondary-50.svg"
                            alt="arrow"
                            width={50}
                            height={50}
                            className={`shrink-0 transition-all duration-300 w-auto h-[50px] ${
                              isActive
                                ? "opacity-100 translate-x-0 translate-y-0"
                                : "opacity-0 -translate-x-4 translate-y-4"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-[max-height] duration-400 xl:hidden ${isActive ? "max-h-[600px] pb-25" : "max-h-0"}`}
                    >
                      <motion.div
                        key={activeIndex}
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="px-30 py-20"
                      >
                        <Image
                          key={`mobile-${index}-${reloadKeys[index] ?? 0}`}
                          src={`${item.image}?v=${reloadKeys[index] ?? 0}`}
                          alt={item.label}
                          width={500}
                          height={500}
                          className="object-contain h-[170px] md:h-[220px] w-full"
                          unoptimized
                        />
                      </motion.div>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
