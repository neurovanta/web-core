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
    <section className="w-full bg-cream-bg py-120 mb-120 3xl:mb-150">
      <div className="container">
        {/* Header */}
        <AnimatedHeading
          title={title}
          className="text-heading text-secondary mb-50"
        />
        <div className="mb-50">
          <SectionDescription
            text={subtitle}
            className="text-description mb-[10px]"
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.4)}
          >
            <a
              data-text={mail}
              href={`mailto:${mail}`}
              className="text-subHeading text-secondary underline decoration-2 underline-offset-3"
            >
              {mail}
            </a>
          </motion.div>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-border-color">
          {positions.map((pos, i) => (
            <Reveal key={i} variants={moveUpV2} delayRange={i * 0.12}>
              <div className="border-r border-border-color pl-50 3xl:pl-[72px] pr-20 flex flex-col pt-[36px]">
                {/* Role label */}
                <span className="text-19 leading-[2.63] -tracking-[0.03em] text-secondary mb-[10px]">
                  {pos.role}
                </span>
                {/* Title */}
                <h3 className="text-subHeading text-secondary mb-[10px]">
                  {pos.title}
                </h3>
                {/* Meta: time + location */}
                <div className="flex items-center gap-20 text-19 leading-[2.63] -tracking-[0.03em] text-secondary mb-20">
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
