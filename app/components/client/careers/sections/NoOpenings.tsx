"use client";

import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVarinats";

export default function NoOpenings() {
  return (
    <section className="w-full bg-cream-bg py-[60px] lg:py-120 mb-120 3xl:mb-150">
      <div className="container">
        {/* Header */}
        <AnimatedHeading
          title={"No Current Openings"}
          className="text-heading text-secondary mb-[10px] sm:mb-50"
        />
          <div className={`flex flex-col gap-[10px] sm:gap-20 w-full`}>
            <motion.p
              variants={moveUp(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`!text-subHeading text-secondary tracking-[-3%] max-w-[37ch]`}
            >
              {
                "Thank you for your interest in joining Neuro Vanta. Currently, there are no open vacancies available."
              }
            </motion.p>
            <SectionDescription
              text={
                "We encourage you to check this page regularly for future career opportunities. Alternatively, you may share your profile with us at mail@360-wellness.com, and we will contact you if a sultable opportunity becomes avallable."
              }
              delay={0.8}
              className={`text-description text-secondary md:tracking-[-0.03em] max-w-[100ch]`}
            />
          </div>
      </div>
    </section>
  );
}
