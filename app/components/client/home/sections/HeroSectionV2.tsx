
"use client";

import CustomButton from "@/app/components/client/common/CustomButton";
import { motion } from "framer-motion";
import { useAppShell } from "@/app/components/client/layout/AppShellV2";

// Small clip-up reveal for title
const titleVariant = {
  hidden: { y: 20, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    y: 0,
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { delay: 0.1, duration: 0.9, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  },
};

// Each button fades+rises individually
const btnVariant = (delay: number) => ({
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay, duration: 0.7, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  },
});

export default function HeroSection() {
  const { animateIn } = useAppShell();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-end pb-150">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/images/home/hero/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/65" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-50">

        {/* Title — clips up from bottom */}
        <motion.h1
          className="text-70 text-white text-center uppercase leading-[1.142] max-w-[1135px]"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={titleVariant}
        >
          Advanced Longevity. <br /> Designed for Life Performance.
        </motion.h1>

        {/* Buttons — one by one after title */}
        <div className="flex items-center gap-20 flex-wrap justify-center">
          <motion.div
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={btnVariant(0.55)}
          >
            <CustomButton label="For Commercial" href="#" variant={1} />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={btnVariant(0.72)}
          >
            <CustomButton label="For Individual" href="#" variant={1} />
          </motion.div>
        </div>

      </div>
    </section>
  );
}