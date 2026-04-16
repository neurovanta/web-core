"use client";

import { useState } from "react";
import { heroStatsData } from "../data";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../../common/CustomButton";

interface StatRowProps {
  number: string;
  label: string;
  icon: string;
  isActive: boolean;
  isLast: boolean;
  onHover: () => void;
  onClick: () => void;
}
export function StatRow({
  number,
  label,
  icon,
  isActive,
  isLast,
  onHover,
  onClick,
}: StatRowProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {/* Top border */}
      <div className="h-px w-full bg-border-color z-0" />

      <div className={`relative py-40 ${isActive ? "px-60" : ""} transition-all duration-300 ease-in-out`}>
        {/* Active bg */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute inset-[-1px] z-10 bg-primary"
              
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              exit={{ width: "0%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex items-center  min-h-[70px]">
          {/* Number */}
          <span className="text-heading text-secondary shrink-0">
            {number}
          </span>

          {/* Label */}
          <span className="flex-1 text-subHeading tracking-[-0.03em] text-secondary lg:pl-[300px] 3xl:pl-[350px]">
            {label}
          </span>

          {/* Icon — only on active */}
          <div className="flex justify-end shrink-0">
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <Image src={icon} alt={label} width={100} height={100} className="object-contain w-auto h-[50px] 2xl:w-[73px] 2xl:h-[70px] pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom border — last item only */}
      {isLast && <div className="h-px w-full bg-border-color z-0" />}
    </div>
  );
}

export default function HeroStats() {
  const { title, description, button, stats } = heroStatsData;
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="w-full bg-cream-bg py-120">
      <div className="container flex flex-col">
        {/* Left col */}
        <div className="flex flex-col md:mb-120">
          <div>
            <h1 className="text-heading text-secondary mb-20 md:mb-50 max-w-[1313px]">
              {title}
            </h1>
            <p className="text-19 leading-[1.47] text-secondary max-w-[730px] tracking-[-0.03em]">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-between lg:gap-x-170 gap-y-5 items-end">
          {/* Custom button */}
          <div className="mt-12 lg:mt-0">
            <CustomButton label="About Neuro Vanta" href="#" variant={2} />
          </div>
          <div className="flex flex-col lg:flex-1 w-full max-w-[1136px]">
            {stats.map((stat, idx) => (
              <StatRow
                key={stat.id}
                number={stat.number}
                label={stat.label}
                icon={stat.icon}
                isActive={activeIndex === idx}
                isLast={idx === stats.length - 1}
                onHover={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
