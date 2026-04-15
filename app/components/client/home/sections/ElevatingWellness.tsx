"use client";

import Image from "next/image";
import { useState } from "react";
import { elevatingWellnessData } from "../data";

export default function ElevatingWellness() {
  const { heading, items } = elevatingWellnessData;

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-cream-bg py-120 3xl:py-0 3xl:pt-150 3xl:pb-170 min-[1700px]:py-[177px]">
      <div className="container">
        <div className="grid xl:grid-cols-[320px_auto] 3xl:grid-cols-[364px_auto]  gap-x-160 3xl:gap-x-225">
          {/* Row 1 — Col 1: empty */}
          <div className="hidden xl:block" />

          {/* Row 1 — Col 2: Heading */}
          <h2 className="text-heading text-secondary max-w-[885px] mb-60">
            {heading}
          </h2>

          {/* Row 2 — Col 1: Image (xl+ only) */}
          <div className="hidden xl:flex items-center justify-center">
            <Image
              src={items[activeIndex].image}
              alt={items[activeIndex].label}
              width={500}
              height={500}
              className="object-contain xl:h-[290px] 3xl:h-[366px] w-auto"
            />
          </div>

          {/* Row 2 — Col 2: List */}
          <ul className="list-none border-t border-[#c9b8a8]">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <li
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`border-b border-[#c9b8a8] cursor-pointer transition-all duration-400 ${isActive ? "xl:px-30" : "px-0"
                    }`}
                >
                  <div className="flex items-center justify-between py-25">
                    <span
                      className={`text-subHeading text-secondary tracking-[-0.03em] transition-all duration-300 ${isActive ? "font-semibold" : ""
                        }`}
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
                          className={`shrink-0 transition-all duration-200 w-auto h-[50px] ${isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-1"
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden transition-[max-height] duration-400 xl:hidden ${isActive ? "max-h-[600px] pb-25" : "max-h-0"
                      }`}
                  >
                    <div className="px-30">
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={500}
                        height={500}
                        className="object-contain h-[250px] md:h-[290px] w-full"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
