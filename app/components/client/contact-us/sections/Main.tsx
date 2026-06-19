"use client";

import Image from "next/image";
import ContactForm from "./ContactForm";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { moveUp } from "../../animations/motionVarinats";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ContactType } from "@/app/types/contact";

export default function Main({ data }: { data: ContactType["firstSection"] }) {
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
    <section className={`w-full py-[65px] lg:py-120 3xl:py-150 ${isMobile ? "" : "container"}`}>
      <div className="flex flex-col xl:flex-row gap-[30px] sm:gap-100 3xl:gap-[105px]">
        {/* ── Left ── */}
        <div className={`flex flex-col ${isMobile ? "px-[16px]" : ""}`}>
          {/* Title */}
          <AnimatedHeading title={data.title} className="text-heading mb-[10px] sm:mb-20" />

          {/* Description */}
          <SectionDescription
            text={data.description}
            className="text-description md:-tracking-[0.03em] text-secondary mb-[30px] sm:mb-60 max-w-[624px]"
          />

          {/* Office Card */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveUp(0.1)}
            className="bg-cream-bg p-20 sm:p-40 flex flex-col w-full sm:w-fit 3xl:min-w-[529px]"
          >
            <p className="text-subHeading -tracking-[0.03em] text-secondary mb-[10px] sm:mb-20">
              {data.office.title}
            </p>

            <p className="text-description -tracking-[0.03em] text-secondary whitespace-pre-line mb-[15px] sm:mb-20">
              {data.office.address}
            </p>

            <a
              href={data.office.directionHref}
              target="_blank"
              rel="noopener noreferrer"
              data-text={data.office.directionLabel}
              className="text-15 text-secondary uppercase underline font-semibold inline-flex items-center gap-[10px] w-fit hover:scale-[1.03] transition-all duration-300"
            >
              {data.office.directionLabel}
              <Image
                src="/assets/icons/view-direction-arrow.svg"
                alt=""
                width={13}
                height={13}
              />
            </a>

            {/* Divider */}
            <motion.div
              className="border-t border-border-color my-20 sm:my-30"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              style={{ transformOrigin: "center" }}
            />

            {/* Mail + Phone */}
            <div className="flex items-center gap-[15px] sm:gap-[18px]">
              <a
                href={`mailto:${data.office.mail}`}
                data-text={data.office.mail}
                className="text-description -tracking-[0.03em] text-secondary underline hover:scale-[1.03] transition-all duration-300"
              >
                {data.office.mail}
              </a>

              <span className="text-secondary">|</span>

              <a
                href={`tel:${data.office.phone}`}
                data-text={data.office.phone}
                className="text-description -tracking-[0.03em] text-secondary underline hover:scale-[1.03] transition-all duration-300"
              >
                {data.office.phone}
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Form ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.2)}
          className="flex-1"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
