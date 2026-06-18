"use client";

import { AnimatedHeading } from "../../animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { SectionDescription } from "../../animations/SectionDescription";
import { moveUp, moveUpV2 } from "../../animations/motionVarinats";
import { openPositionsData } from "../data";
import CustomButton from "@/app/components/client/common/CustomButton";
import { motion } from "framer-motion";

export default function OpenPositions() {
  const { title, subtitle, mail, positions } = openPositionsData;

  return (
    <section className="w-full bg-cream-bg py-[60px] lg:py-120 mb-120 3xl:mb-150">
      <div className="container">
        {/* Header */}
        <AnimatedHeading
          title={title}
          className="text-heading text-secondary mb-[10px] sm:mb-50"
        />
        <div className="mb-50">
          <SectionDescription
            text={subtitle}
            className="text-description mb-[2px] sm:mb-[10px]"
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.2)}
            viewport={{ once: true }}
          >
            <a
              data-text={mail}
              href={`mailto:${mail}`}
              className="text-subHeading text-secondary md:underline md:decoration-2 md:underline-offset-3 hover:scale-[1.03] transition-all duration-600 inline-block"
            >
              {mail}
            </a>
          </motion.div>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:border-l border-b sm:border-b-0 border-[#D7D7D7] ">
          {positions.map((pos, i) => (
            <Reveal key={i} variants={moveUpV2} delayRange={i * 0.12}>
              <div
                className={`sm:border-r border-t sm:border-t-0 sm:border-b xl:border-b-0 border-[#D7D7D7] sm:pl-50 3xl:pl-[72px] pr-20 flex flex-col pt-20 pb-20 sm:pb-20 xl:pb-0 sm:pt-[36px]`}
              >
                {/* Role label */}
                <span className="text-19 leading-[1.53] sm:leading-[2.63] md:-tracking-[0.03em] text-secondary mb-[10px]">
                  {pos.role}
                </span>
                {/* Title */}
                <h3 className="text-subHeading text-secondary mb-[10px]">
                  {pos.title}
                </h3>
                {/* Meta: time + location */}
                <div className="flex items-center gap-[10px] sm:gap-20 text-19 leading-[1.53] sm:leading-[2.63] md:-tracking-[0.03em] text-secondary mb-20">
                  <span>{pos.time}</span>
                  <span className="w-[7px] h-[7px] rounded-full bg-secondary inline-block" />
                  <span>{pos.location}</span>
                </div>
                {/* CTA Button */}
                <div>
                  <CustomButton
                    label={pos.btn.label}
                    href={pos.btn.href}
                    variant={2}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
