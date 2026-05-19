"use client";

import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import { discoverData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import DiscoverySlider from "./DiscoverySlider";

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
        px-[21px] py-[10px] 3xl:h-[48px] rounded-[50px] border text-description tracking-[-0.03em] font-semibold transition-all duration-300 cursor-pointer min-w-[112px]
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
    <div className="flex flex-col gap-[15px]">
      <div className="w-10 h-10 relative flex-shrink-0">
        <Image src={icon} alt={title} fill className="object-contain" />
      </div>
      <p className="text-description tracking-[-0.03em] max-w-[152px]">
        {title}
      </p>
    </div>
  );
}

// ── Left panel ────────────────────────────────────────────────────────────────
function DiscoverLeft() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = discoverData.tabs[activeTab];

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <AnimatedHeading
        title={discoverData.heading}
        className="text-secondary max-w-[12ch] mb-40 3xl:mb-50"
        mode="reveal"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-[16px] 3xl:gap-20 mb-40 3xl:mb-50">
        {discoverData.tabs.map((t, i) => (
          <TabPill
            key={t.label}
            label={t.label}
            active={i === activeTab}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div className="flex flex-col">
          {/* Tab title + description */}
          <div className="flex flex-col gap-20">
            <h3 className="text-subHeading tracking-[-0.03em]">{tab.title}</h3>
            <p className="text-description tracking-[-0.03em] max-w-[50ch]">
              {tab.description}
            </p>
          </div>

          <div className="w-full h-px bg-[#D7D7D7] my-40" />
          {/* Highlights grid */}
          <div className="flex flex-col">
            <p className="text-subHeading tracking-[-0.03em] mb-20">
              Highlights
            </p>
            <div className="grid grid-cols-3 gap-x-50 3xl:gap-x-80 gap-y-20">
              {tab.highlights.map((h) => (
                <HighlightItem key={h.title} icon={h.icon} title={h.title} />
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
  return (
    <section className="overflow-hidden py-120 3xl:py-150">
      <div className="container">
        <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-70 3xl:gap-[113px] border-b border-[#D7D7D7] pb-120 3xl:pb-150">
          {/* Left */}
          <div className="w-full">
            <DiscoverLeft />
          </div>

          {/* Right */}
          <div className="w-full h-[500px] sm:h-[600px] xl:h-[700px] 2xl:h-[700px] 3xl:flex-none 3xl:w-[991px] 3xl:h-[840px]">
            <DiscoverySlider />
          </div>
        </div>
      </div>
    </section>
  );
}
