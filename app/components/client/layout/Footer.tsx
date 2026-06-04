"use client";

import Image from "next/image";
import Link from "next/link";
import { footerMenus, socialLinks, SocialType } from "./data";
import { SectionDescription } from "../animations/SectionDescription";
import { moveUp, moveUpV2 } from "../animations/motionVarinats";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLenis } from "@/app/components/client/layout/LenisProvider";

/* ─── Social brand styles ─────────────────────────────────────────── */
const socialStyles: Record<SocialType, React.CSSProperties> = {
  facebook: { color: "#416FF0" },
  instagram: {},
  linkedin: { color: "#2671AD" },
  youtube: { color: "#D92935" },
};

const instagramGradient: React.CSSProperties = {
  background:
    "linear-gradient(90deg, #4C66C7 0%, #F04D5A 35.1%, #FAD85C 66.83%, #C92AAA 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Splits items: first 4 in col-1, anything beyond col-2 */
function splitItems<T>(items: T[]): [T[], T[]] {
  if (items.length <= 4) return [items, []];
  return [items.slice(0, 4), items.slice(4)];
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
const { scrollTo } = useLenis();

const handleToggle = (index: number) => {
  const isOpening = openIndex !== index;
  setOpenIndex(isOpening ? index : null);

  if (isOpening) {
    setTimeout(() => {
      const el = itemRefs.current[index];
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom > viewportHeight - 40) {
        const targetY = window.scrollY + rect.top - 80;
        scrollTo(targetY, { duration: 0.8 });
      }
    }, 50);
  }
};

  return (
    <footer className="bg-white overflow-hidden">
      {/* ── Main content container ── */}
      <div className="container pb-[30px] sm:pb-80 3xl:pb-[84px]">
        {/* Logo */}
        <div className="w-full relative h-full max-h-[218px] mt-[40px] overflow-hidden">
          <Image
            src="/assets/logos/footer-logo.svg"
            alt="Neuro Vanta"
            width={2000}
            height={300}
            className="w-full h-full max-h-[218px]"
          />

          {/* LEFT HALF */}
          <motion.div
            initial={{ x: "0%" }}
            whileInView={{ x: "-100%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            viewport={{ once: true }}
            className="absolute top-0 left-0 w-1/2 h-full bg-white z-10"
          />

          {/* RIGHT HALF */}
          <motion.div
            initial={{ x: "0%" }}
            whileInView={{ x: "100%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            viewport={{ once: true }}
            className="absolute top-0 right-0 w-1/2 h-full bg-white z-10"
          />
        </div>

        {/* ── Top section: address + contact ── */}
        <div className="flex flex-wrap mt-[60px] md:mt-80 gap-y-20 3xl:mt-[136px]">
          {/* Left – address */}
          <div className="sm:w-[51%] 3xl:pt-[16px]">
            <SectionDescription
              text={[
                "Neuro Vanta",
                "P.O.Box 13653, 901 – SIT Tower",
                "Dubai Silicon Oasis",
                "Dubai, UAE",
              ].join("\n")}
              className="text-secondary text-19 leading-[1.54] sm:leading-[1.42] whitespace-pre-line md:tracking-[-0.03em]"
            />
          </div>

          {/* Right – email, phone, then gap, then socials */}
          <div className="sm:w-[49%]">
            <div className="text-secondary text-subHeading lg:text-60 flex flex-col mb-20 sm:mb-50">
              <motion.div
                variants={moveUp(0)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link
                  href="mailto:mail@360-wellness.com"
                  className="contact-link leading-[1.3] sm:leading-[1.433] w-fit"
                  data-text="mail@360-wellness.com"
                >
                  mail@360-wellness.com
                </Link>
              </motion.div>
              <motion.div
                variants={moveUp(0.15)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link
                  href="tel:+97143332175"
                  className="contact-link leading-[1.3] sm:leading-[1.433] w-fit"
                  data-text="+97143332175"
                >
                  +97143332175
                </Link>
              </motion.div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-x-30 gap-y-[5px]">
              {socialLinks.map(({ label, href, type }, index) => (
                <Reveal
                  key={type}
                  variants={moveUpV2}
                  delayRange={index * 0.13}
                >
                  <Link
                    href={href}
                    className="contact-link text-19 leading-[1.42] tracking-[-0.03em] hover:scale-[1.05] transition-transform duration-300"
                    style={
                      type === "instagram"
                        ? instagramGradient
                        : socialStyles[type]
                    }
                    data-text={label}
                  >
                    {label}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-px w-full mt-[60px] lg:mb-80 3xl:mt-120 3xl:mb-100">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            viewport={{ once: true }}
            className="absolute inset-0 bg-border-color origin-center"
          />
        </div>

        {/* ── Mobile Menu ── */}
        <div className="lg:hidden">
          {footerMenus.map((menu, index) => (
            <Reveal
              key={menu.heading}
              delayRange={index * 0.13}
              variants={moveUpV2}
            >
              <div ref={(el) => { itemRefs.current[index] = el; }} className="border-b border-border-color">
                <button
                  type="button"
onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between py-20"
                >
                  <span className="text-secondary text-subHeading tracking-[-0.03em]">
                    {menu.heading}
                  </span>

                  <motion.span
                    animate={{
                      rotate: openIndex === index ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-secondary"
                  >
                    <Image
                      src="/assets/icons/down-arrow-tip.svg"
                      alt="Chevron Down"
                      width={13}
                      height={13}
                      className={`h-[7px] xl:h-[9px] 3xl:h-[10px] w-auto object-fill transition-transform duration-300 ${
                        openIndex === index ? "rotate-0" : ""
                      }`}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <motion.ul
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pb-20 flex flex-col"
                      >
                        {menu.items.map(({ label, href }) => (
                          <li key={label}>
                            <Link
                              href={href}
                              className="contact-link text-secondary text-19 leading-[2.3] tracking-[-0.03em]"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Desk Menu ── */}
        <div className="hidden lg:flex flex-wrap gap-y-20 gap-x-50 3xl:gap-x-[150px]">
          {footerMenus.map((menu, i) => {
            const [col1, col2] = splitItems(menu.items);
            const isWide = col2.length > 0;

            return (
              <Reveal
                key={menu.heading}
                variants={moveUpV2}
                delayRange={i * 0.14}
              >
                <div>
                  {/* Heading */}
                  <h3 className="text-secondary text-subHeading mb-2.5 md:mb-40 tracking-[-0.031em]">
                    {menu.heading}
                  </h3>

                  {/* Items: single or double column */}
                  <div
                    className={
                      isWide ? "flex flex-col sm:flex-row sm:gap-50" : ""
                    }
                  >
                    {/* Column 1 (always present) */}
                    <ul className="flex flex-col">
                      {col1.map(({ label, href }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            data-text={label}
                            className="contact-link text-secondary text-19 leading-[1.789] tracking-[-0.03em] hover:opacity-70 transition-opacity w-fit"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Column 2 (only when items > 4) */}
                    {col2.length > 0 && (
                      <ul className="flex flex-col">
                        {col2.map(({ label, href }) => (
                          <li key={label}>
                            <Link
                              href={href}
                              data-text={label}
                              className="contact-link text-secondary text-19 leading-[1.789] tracking-[-0.03em] hover:opacity-70 transition-opacity w-fit"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
        }}
        variants={moveUp(0.2)}
        className="w-full py-[19px] md:py-[10px] bg-[#FFF8F0]"
      >
        <div className="container">
          <p className="text-secondary text-19 md:text-15 leading-[1.54] md:leading-[2.666] md:tracking-[-0.03em]">
            Copyright {new Date().getFullYear()}© Neuro Vanta All Rights
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
