"use client";

import CareersForm from "../sections/CareerForm";
import { careersFormData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";
import { useState, useEffect } from "react";

export default function CareersApply() {
  const { title, subtitle, description } = careersFormData;
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="mt-[125px] xl:mt-[230px] 3xl:mt-[290px] sm:pb-[65px] lg:pb-120 3xl:pb-150 sm:border-b sm:border-border-color">
      <div className={`w-full flex flex-col xl:flex-row gap-[30px] sm:gap-60 md:gap-100 3xl:gap-[85px] justify-between ${isMobile ? "" : "container"}`}>
        {/* Left: Text content */}
        <div className={`flex flex-col ${isMobile ? "px-[16px]" : ""}`}>
          <AnimatedHeading
            title={title}
            className="text-heading xl:mb-50 max-w-[15ch] sm:max-w-[14ch]"
          />
          <div className="block xl:hidden w-full h-px bg-border-color my-[15px] sm:my-20 md:my-40" />
          <SectionDescription
            text={subtitle}
            className="text-subHeading tracking-[-0.03em] text-secondary mb-[10px] sm:mb-20 max-w-[25ch]"
          />
          <SectionDescription
            text={description}
            className="text-description text-secondary md:tracking-[-0.03em] max-w-[43ch]"
          />
        </div>

        {/* Right: Form */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.2)}
          className="flex-1 max-w-[1021px]"
        >
          <CareersForm />
        </motion.div>
      </div>
    </section>
  );
}
