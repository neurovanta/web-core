"use client";

import CustomButton from "@/app/components/client/common/CustomButton";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppShell } from "@/app/components/client/layout/AppShell";
import { HomeType } from "@/app/types/home";

// Small clip-up reveal for title
const titleVariant = {
  hidden: { y: 20, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    y: 0,
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      delay: 0.1,
      duration: 0.9,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
};

// Each button fades+rises individually
const btnVariant = (delay: number) => ({
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
});

export default function HeroSection({
  data,
}: {
  data: HomeType["firstSection"];
}) {
  const { animateIn, revealStarted } = useAppShell();
  const videoRef = useRef<HTMLVideoElement>(null);

  // CMS values, with the bundled assets as fallback when a field is empty.
  const videoSrc = data.video || "/assets/videos/hero-bg-2.mp4";
  const posterSrc = data.posterImage || "/assets/images/home/hero/hero-poster.jpg";

  // Video buffers from page load (preload="auto") but only starts playing —
  // from its first frame — once the intro's white stripes begin to wipe away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !revealStarted) return;
    video.currentTime = 0;
    video.play().catch(() => {
      // Autoplay blocked (e.g. iOS Low Power Mode) — the poster stays visible.
    });
  }, [revealStarted, videoSrc]);

  return (
    <section className="relative w-full h-svh flex flex-col items-center justify-end pb-[60px] md:pb-150">
      {/* key: a changed <source> src doesn't reload a mounted <video>, so remount on change */}
      <video
        key={videoSrc}
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        aria-label={data.videoAlt || undefined}
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/65" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-20 sm:gap-50">
        {/* Title — clips up from bottom */}
        <motion.h1
          className="text-70 text-white text-center uppercase leading-[1.142] max-w-[1135px]"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={titleVariant}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />

        {/* Buttons — one by one after title */}
        <div className="flex items-center gap-[10px] sm:gap-20 flex-wrap justify-center">
          <motion.div
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={btnVariant(0.55)}
          >
            <CustomButton
              label={data.buttons[0].label}
              href={data.buttons[0].href}
              variant={1}
            />
          </motion.div>

          {/* <motion.div
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={btnVariant(0.72)}
          >
            <CustomButton label="For Individual" href="#" variant={1} />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
