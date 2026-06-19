"use client";

import { AnimatedHeading } from "../animations/AnimateHeading";
import { SectionDescription } from "../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveUp } from "../animations/motionVarinats";

interface SectionHeaderProps {
  data: {
    title: string;
    subtitle?: string;
    subTitle?: string;
    description?: string;
  };
  maxWTitle?: string;
  maxWSubtitle?: string;
  maxWDescription?: string;
}

export default function SectionHeader({
  data,
  maxWTitle = "",
  maxWSubtitle = "",
  maxWDescription = "",
}: SectionHeaderProps) {
  const subtitle = (data as any).subTitle ?? data.subtitle;
  return (
    <div className="container py-[65px] lg:py-120 3xl:py-150">
      <div className="flex flex-col sm:flex-row justify-between items-start w-full">
        <div
          className={`w-full sm:w-[40%] 3xl:w-[42.4%] shrink-0 mb-[15px] sm:mb-0`}
        >
          <div className="sm:max-w-[88%]">
            <AnimatedHeading
              title={data.title}
              className={`text-heading text-secondary ${maxWTitle}`}
              mode="reveal"
            />
          </div>
        </div>
        <div className="w-full h-px bg-border-color sm:hidden mb-[15px] sm:mb-0" />
        <div className={`flex flex-col gap-[10px] sm:gap-20 w-full`}>
          {subtitle && (
            <motion.p
              variants={moveUp(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`!text-subHeading text-secondary tracking-[-3%] ${maxWSubtitle}`}
            >
              {subtitle}
            </motion.p>
          )}
          {data.description && (
            <SectionDescription
              text={data.description}
              delay={0.8}
              className={`text-description text-secondary md:tracking-[-0.03em] ${maxWDescription}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
