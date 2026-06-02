"use client";

import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import { discoverData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import DiscoverySlider from "./DiscoverySlider";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUp, moveUpV2 } from "../../animations/motionVarinats";

// ── Tab pill ──────────────────────────────────────────────────────────────────
function TabPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-20 sm:px-[21px] py-[7px] sm:py-[10px] max-[440px]:h-[34px] 3xl:h-[48px] rounded-[50px] border text-description tracking-[-0.03em] font-semibold transition-all duration-300 cursor-pointer min-w-[65px] md:min-w-[112px]
        ${
          active
            ? "bg-secondary text-white border-secondary"
            : "bg-transparent text-secondary border-secondary"
        }
      `}
    >
      {label}
    </button>
  );
}

// ── Highlight item ────────────────────────────────────────────────────────────
function HighlightItem({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col gap-[10px] sm:gap-[15px]">
      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 relative flex-shrink-0">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <p className="text-description tracking-[-0.03em] max-w-[152px]">
        {title}
      </p>
    </div>
  );
}

// ── Left panel ────────────────────────────────────────────────────────────────
function DiscoverLeft({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (i: number) => void;
}) {
  const tab = discoverData.tabs[activeTab];

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <AnimatedHeading
        title={discoverData.heading}
        className="text-secondary sm:max-w-[12ch] mb-[15px] sm:mb-40 3xl:mb-50"
        mode="reveal"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-x-[10px] gap-y-[15px] sm:gap-20 mb-[30px] md:mb-40 3xl:mb-50">
        {discoverData.tabs.map((t, i) => (
          <Reveal key={t.label} variants={moveUpV2} delayRange={i * 0.11}>
            <TabPill
              label={t.label}
              active={i === activeTab}
              onClick={() => setActiveTab(i)}
            />
          </Reveal>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div className="flex flex-col">
          {/* Tab title + description */}
          <div className="flex flex-col gap-[10px] sm:gap-20">
            <motion.h3
              key={activeTab + "-title"}
              variants={moveUp(0.1)}
              initial="hidden"
              animate="show"
              className="text-subHeading tracking-[-0.03em]"
            >
              {tab.title}
            </motion.h3>
            <motion.p
              key={activeTab + "-desc"}
              variants={moveUp(0.18)}
              initial="hidden"
              animate="show"
              className="text-description tracking-[-0.03em] max-w-[50ch]"
            >
              {tab.description}
            </motion.p>
          </div>

          <motion.div
            className="hidden 2xl:block w-full h-px bg-[#D7D7D7] my-40"
            variants={moveUp(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          />

          <div className="hidden 2xl:flex flex-col">
            <motion.h3
              variants={moveUp(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-subHeading tracking-[-0.03em] mb-20"
            >
              Highlights
            </motion.h3>
            <div className="grid grid-cols-3 gap-x-50 3xl:gap-x-80 gap-y-20">
              {tab.highlights.map((h, i) => (
                <Reveal key={h.title} variants={moveUpV2} delayRange={i * 0.11}>
                  <HighlightItem icon={h.icon} title={h.title} />
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Discovery() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="overflow-hidden py-[65px] lg:py-120 3xl:py-150">
      <div className="container">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-20 md:gap-40 2xl:gap-70 3xl:gap-[113px] border-b border-[#D7D7D7] pb-20 sm:pb-40 2xl:pb-120 3xl:pb-150">
          {/* Left */}
          <div className="w-full">
            <DiscoverLeft activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Right */}
          <div className="w-full h-[312px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[700px] 3xl:flex-none 3xl:w-[991px] 3xl:h-[840px]">
            <DiscoverySlider />
          </div>
          <div className="2xl:hidden pt-[10px]">
            <h3 className="text-subHeading tracking-[-0.03em] mb-20">
              Highlights
            </h3>

            <div className="grid grid-cols-3 gap-x-40 gap-y-20">
              {discoverData.tabs[activeTab].highlights.map((h, i) => (
                <Reveal key={h.title} variants={moveUpV2} delayRange={i * 0.11}>
                  <HighlightItem icon={h.icon} title={h.title} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
