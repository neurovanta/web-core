"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { elevatingWellnessData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVarinats";
import { motion } from "framer-motion";
import { HomeType } from "@/app/types/home";
import { HomePageData } from "@/app/types/home";

export default function ElevatingWellness({
  data,
  industries,
}: {
  data: HomeType["seventhSection"];
  industries: HomePageData["industries"];
}) {
  const heading = data.title;

  const [activeIndex, setActiveIndex] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  // src of the icon on screen: a fresh in-memory copy (blob: URL) once the icon is downloaded
  const [iconSrc, setIconSrc] = useState<string>(industries[0]?.homeAnimatedIcon ?? "");
  const blobsRef = useRef<Record<number, Blob>>({});
  const currentUrlRef = useRef<string | null>(null);

  // The animated SVG icons live on Dropbox (~1s+ per request). Download each one once, up front,
  // and keep it in memory; hovering then shows it instantly instead of waiting on the network.
  useEffect(() => {
    let cancelled = false;
    industries.forEach((industry, index) => {
      const url = industry.homeAnimatedIcon;
      if (!url) return;
      fetch(url)
        .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
        .then((blob) => {
          if (!cancelled) blobsRef.current[index] = blob;
        })
        .catch(() => {
          /* falls back to the direct URL */
        });
    });
    return () => {
      cancelled = true;
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    };
  }, [industries]);

  const showIcon = (index: number) => {
    // a new blob: URL per hover makes the browser load a fresh SVG document, so its
    // animation starts from the beginning - without another network request
    const blob = blobsRef.current[index];
    if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    currentUrlRef.current = blob ? URL.createObjectURL(blob) : null;
    setIconSrc(currentUrlRef.current ?? industries[index]?.homeAnimatedIcon ?? "");
  };

  const handleActivate = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setPlayKey((k) => k + 1);
    showIcon(index);
  };

  return (
    <section className="bg-cream-bg py-[60px] lg:py-120 3xl:py-0 3xl:pt-150 3xl:pb-170 min-[1700px]:py-[177px] overflow-hidden">
      <div className="container">
        <div className="grid xl:grid-cols-[320px_auto] 3xl:grid-cols-[364px_auto] gap-x-160 3xl:gap-x-225">
          <AnimatedHeading
            title={heading}
            className="xl:col-span-1 xl:col-start-2 col-start-1 text-heading text-secondary max-w-[20ch] mb-[15px] sm:mb-20 lg:mb-60"
            mode="reveal"
          />

          <motion.div
            key={activeIndex}
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden xl:flex items-center justify-center"
          >
            {iconSrc && (
              // plain <img>: the src is an in-memory blob: URL (see showIcon)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={playKey}
                src={iconSrc}
                alt={industries[activeIndex]?.thumbnailTitle ?? ""}
                width={500}
                height={500}
                className="object-contain xl:h-[290px] 3xl:h-[366px] w-auto"
              />
            )}
          </motion.div>

          {/* Mobile / Tablet */}
          <ul className="xl:hidden list-none border-t border-border-color">
            {industries.map((industry, index) => (
              <Reveal
                key={industry._id}
                variants={moveUpV2}
                delayRange={index * 0.13}
              >
                <li className="border-b border-border-color">
                  <Link href={`/industries/${industry.slug}`}>
                    <div className="flex items-center justify-between py-[31px] h-[96px] sm:h-auto">
                      <div className="flex items-center gap-[30px] sm:gap-80">
                        <Image
                          src={industry.homeAnimatedMobIcon}
                          alt={industry.thumbnailTitle}
                          width={60}
                          height={60}
                          className="w-[32px] h-[32px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] object-contain shrink-0"
                        />

                        <span className="text-subHeading text-secondary tracking-[-0.03em] max-w-[222px] md:max-w-full">
                          {industry.thumbnailTitle}
                        </span>
                      </div>

                      <div className="w-[34px] h-[34px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]  rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Image
                          src="/assets/icons/down-arrow-tip.svg"
                          alt="arrow"
                          width={14}
                          height={14}
                          className="w-[14px] sm:w-[16px] md:w-[18px] h-auto -rotate-90"
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          {/* Desktop - Existing Accordion */}
          <ul className="hidden xl:block list-none border-t border-[#c9b8a8]">
            {industries.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <Reveal
                  key={item._id}
                  variants={moveUpV2}
                  delayRange={index * 0.13}
                >
                  <li
                    onMouseEnter={() => handleActivate(index)}
                    onClick={() => handleActivate(index)}
                    className={`border-b border-[#c9b8a8] cursor-pointer transition-all duration-400 pr-30 ${
                      isActive ? "xl:pl-30" : "pl-0"
                    }`}
                  >
                    <Link href={`/industries/${item.slug}`}>
                      <div className="flex items-center justify-between py-25">
                        <span
                          className={`text-subHeading text-secondary tracking-[-0.03em] transition-all duration-300 ${
                            isActive ? "font-semibold" : ""
                          }`}
                        >
                          {item.thumbnailTitle}
                        </span>

                        <Image
                          src="/assets/icons/top-right-arrow-secondary-50.svg"
                          alt="arrow"
                          width={50}
                          height={50}
                          className={`shrink-0 transition-all duration-300 w-auto h-[50px] ${
                            isActive
                              ? "opacity-100 translate-x-0 translate-y-0"
                              : "opacity-0 -translate-x-4 translate-y-4"
                          }`}
                        />
                      </div>
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
