"use client";

import Image from "next/image";
import ContactForm from "./ContactForm";
import { contactUsData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { moveUp } from "../../animations/motionVarinats";
import { motion } from "framer-motion";

export default function Main() {
  const { title, description, office } = contactUsData;

  return (
    <section className="w-full container py-120 3xl:py-150">
      <div className="flex flex-col xl:flex-row gap-100 3xl:gap-[105px]">
        {/* ── Left ── */}
        <div className="flex flex-col">
          {/* Title */}
          <AnimatedHeading title={title} className="text-heading mb-20" />

          {/* Description */}
          <SectionDescription
            text={description}
            className="text-description -tracking-[0.03em] text-secondary mb-60 max-w-[624px]"
          />

          {/* Office Card */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveUp(0.1)}
            className="bg-cream-bg p-40 flex flex-col w-fit 3xl:min-w-[529px]"
          >
            <p className="text-subHeading -tracking-[0.03em] text-secondary mb-20">
              {office.title}
            </p>

            <p className="text-description -tracking-[0.03em] text-secondary whitespace-pre-line mb-20">
              {office.address}
            </p>

            <a
              href={office.directionHref}
              target="_blank"
              rel="noopener noreferrer"
              data-text={office.directionLabel}
              className="text-15 text-secondary uppercase underline font-semibold inline-flex items-center gap-[10px] w-fit"
            >
              {office.directionLabel}
              <Image
                src="/assets/icons/view-direction-arrow.svg"
                alt=""
                width={13}
                height={13}
              />
            </a>

            {/* Divider */}
            <motion.div
              className="border-t border-border-color my-30"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              style={{ transformOrigin: "center" }}
            />

            {/* Mail + Phone */}
            <div className="flex items-center gap-[18px]">
              <a
                href={`mailto:${office.mail}`}
                data-text={office.mail}
                className="text-description -tracking-[0.03em] text-secondary underline"
              >
                {office.mail}
              </a>

              <span className="text-secondary">|</span>

              <a
                href={`tel:${office.phone}`}
                data-text={office.phone}
                className="text-description -tracking-[0.03em] text-secondary underline"
              >
                {office.phone}
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
