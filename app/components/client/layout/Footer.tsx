"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialType } from "./data";
import { SectionDescription } from "../animations/SectionDescription";
import { moveUp, moveUpV2 } from "../animations/motionVarinats";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
import { useAutoplayActive } from "@/app/hooks/useAutoplayActive";
import { useLenis } from "@/app/components/client/layout/LenisProvider";
import { NavData } from "@/app/types/header";
import { usePathname } from "next/navigation";
import { toExternalHref } from "@/lib/externalLink";

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

/* ─── Background overlay (Figma: black 80% + bottom linear 70%) ───── */
const footerOverlay: React.CSSProperties = {
  background:
    "linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), linear-gradient(180deg, rgba(0, 0, 0, 0) 70.42%, rgba(0, 0, 0, 0.7) 117.44%)",
};

/* ─── Divider ─────────────────────────────────────────────────────── */
function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        viewport={{ once: true }}
        className="absolute inset-0 bg-white/20 origin-center"
      />
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function Footer({ navData }: { navData: NavData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLElement>(null);
  // background drift runs only while the footer is on screen and the tab is visible
  const bgPlaying = useAutoplayActive(footerRef);
  const pathname = usePathname();
  const addressHref = toExternalHref(navData.contact.addressLink);
  const { scrollTo } = useLenis();

  const handleHashLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const [path, hash] = href.split("#");
    if (!hash) return;
    if (path.replace(/\/$/, "") !== pathname) return; // different page, let Link navigate normally

    e.preventDefault();
    if (window.location.hash === `#${hash}`) {
      window.dispatchEvent(new HashChangeEvent("hashchange")); // same hash clicked again
    } else {
      window.location.hash = hash; // native assignment fires hashchange
    }
  };

  const footerMenus = [
    {
      heading: navData.footer.solutionsLabel || "Solutions",
      items: navData.footer.solutions
        .filter((s) => !s.isHidden)
        .map((s) => ({
          label: s.thumbnailTitle,
          href: `/solutions/${s.slug}`,
        })),
    },
    {
      heading: navData.footer.systemsLabel || "Longevity Systems",
      items: navData.footer.systems
        .filter((s) => !s.isHidden)
        .map((s) => ({
          label: s.title,
          href: `/longevity-systems/#${s.title.toLowerCase().replace(/\s+/g, "-")}`,
        })),
    },
    {
      heading: "Quick Links",
      items: navData.footer.quickLinks
        .filter((l) => !l.isHidden)
        .map((l) => ({ label: l.label, href: l.link })),
    },
  ];

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

  const socials = navData.socials.filter((s) => !s.isHidden);

  const socialLinks = (
    <div className="flex flex-wrap gap-x-30 gap-y-[5px]">
      {socials.map((s, index) => (
        <Reveal key={s.type} variants={moveUpV2} delayRange={index * 0.13}>
          <Link
            href={s.link}
            className="contact-link text-19 leading-[1.42] tracking-[-0.03em] hover:scale-[1.05] transition-transform duration-300"
            style={
              s.type === "instagram"
                ? instagramGradient
                : (socialStyles[s.type as SocialType] ?? {})
            }
            data-text={s.label}
          >
            {s.label}
          </Link>
        </Reveal>
      ))}
    </div>
  );

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-black text-white border-t border-white/30">
      {/* ── Background image + overlay ── */}
      <Image
        src={navData.footer.image || "/assets/images/footer/footer-bg.jpg"}
        alt={navData.footer.imageAlt || ""}
        fill
        sizes="100vw"
        className={`bg-drift ${bgPlaying ? "is-playing" : ""} object-cover object-center pointer-events-none select-none`}
      />
      <div className="absolute inset-0" style={footerOverlay} aria-hidden />

      <div className="relative z-10 container pt-[60px] md:pt-120 3xl:pt-[128px]">
        {/* ── Top row: logo + contact ── */}
        <div className="flex flex-col gap-y-30 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo: left-to-right clip-path reveal.
              The in-view observer sits on the unclipped wrapper — a fully
              clipped element has no visible area, so it would never trigger. */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.div
              variants={{
                hidden: { clipPath: "inset(0% 100% 0% 0%)" },
                show: {
                  clipPath: "inset(0% 0% 0% 0%)",
                  transition: { duration: 1.4, ease: [0.77, 0, 0.175, 1] },
                },
              }}
              className="will-change-[clip-path]"
            >
              <Link href="/" aria-label="Neuro Vanta home" className="block">
                <Image
                  src="/assets/logos/footer-logo.svg"
                  alt="Neuro Vanta"
                  width={1717}
                  height={218}
                  className="w-[200px] md:w-[260px] xl:w-[320px] 3xl:w-[366px] h-auto"
                />
              </Link>
            </motion.div>
          </motion.div>

          <div className="text-white text-30 leading-[1.3] flex flex-col sm:items-start">
            <motion.div
              variants={moveUp(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Link
                href={`mailto:${navData.contact.email}`}
                className="contact-link w-fit"
                data-text={navData.contact.email}
              >
                {navData.contact.email}
              </Link>
            </motion.div>
            <motion.div
              variants={moveUp(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Link
                href={`tel:${navData.contact.phone}`}
                className="contact-link w-fit"
                data-text={navData.contact.phone}
              >
                {navData.contact.phone}
              </Link>
            </motion.div>
          </div>
        </div>

        <Divider className="mt-40 md:mt-70 3xl:mt-[69px]" />

        {/* ── Middle: address + menus ── */}
        <div className="mt-40 md:mt-70 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_repeat(3,auto)] gap-x-120 gap-y-40 xl:gap-y-60 2xl:gap-y-40">
          {/* Address + socials */}
          <div className="flex flex-col gap-y-25 xl:gap-y-30">
            {addressHref ? (
              <a
                href={addressHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-white/70 transition-colors duration-300 hover:text-white"
              >
                <SectionDescription
                  text={navData.contact.address}
                  className="text-inherit text-19 leading-[1.42] whitespace-pre-line tracking-[-0.03em]"
                />
              </a>
            ) : (
              <SectionDescription
                text={navData.contact.address}
                className="text-white/70 text-19 leading-[1.42] whitespace-pre-line tracking-[-0.03em]"
              />
            )}
            {socialLinks}
          </div>

          {/* Mobile accordion */}
          <div className="xl:hidden border-t border-white/20">
            {footerMenus.map((menu, index) => (
              <Reveal
                key={menu.heading}
                delayRange={index * 0.13}
                variants={moveUpV2}
              >
                <div
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={index < footerMenus.length - 1 ? "border-b border-white/20" : ""}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    aria-expanded={openIndex === index}
                    className="w-full flex items-center justify-between py-20"
                  >
                    <span className="text-white text-subHeading tracking-[-0.03em]">
                      {menu.heading}
                    </span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src="/assets/icons/down-arrow-tip.svg"
                        alt=""
                        width={13}
                        height={13}
                        className="h-[7px] w-auto brightness-0 invert"
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.ul
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="pb-20 flex flex-col text-white/50"
                        >
                          {menu.items.map(({ label, href }) => (
                            <li key={label}>
                              <Link
                                href={href}
                                onClick={(e) => handleHashLinkClick(e, href)}
                                data-text={label}
                                className="contact-link text-19 leading-[2.3] tracking-[-0.03em] w-fit"
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

          {/* Desktop columns */}
          {footerMenus.map((menu, i) => (
            <Reveal
              key={menu.heading}
              variants={moveUpV2}
              delayRange={i * 0.14}
              className="hidden xl:block"
            >
              <h3 className="text-white text-30 leading-[1.23] mb-40 tracking-[-0.031em]">
                {menu.heading}
              </h3>
              <ul className="flex flex-col text-white/50">
                {menu.items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={(e) => handleHashLinkClick(e, href)}
                      data-text={label}
                      className="contact-link text-19 leading-[1.789] tracking-[-0.03em] w-fit"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Divider className="mt-[10px] xl:mt-80 2xl:mt-100" />

        {/* ── Copyright ── */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.2)}
          className="py-20 3xl:pb-[22px] text-white/50 text-15 leading-[2.66666667] tracking-[-0.03em]"
        >
          Copyright {new Date().getFullYear()}© Neuro Vanta All Rights
        </motion.p>
      </div>
    </footer>
  );
}
