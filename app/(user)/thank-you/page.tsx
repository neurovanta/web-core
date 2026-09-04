"use client";

import CustomButton from "@/app/components/client/common/CustomButton";
import { motion } from "framer-motion";
import { useAppShell } from "@/app/components/client/layout/AppShell";

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

// Subtext fades+rises after the title
const textVariant = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.8,
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

export default function ThankYou() {
  const { animateIn } = useAppShell();

  return (
    <section className="steam-bg relative w-full h-svh flex flex-col items-center justify-end pb-[60px] md:pb-150 overflow-hidden bg-[#0a0a0a]">
      {/* Rising steam wisps */}
      <div className="pointer-events-none absolute inset-0">
        <div className="steam-wisp wisp-1" />
        <div className="steam-wisp wisp-2" />
        <div className="steam-wisp wisp-3" />
        <div className="steam-wisp wisp-4" />
        <div className="steam-wisp wisp-5" />
        <div className="steam-wisp wisp-6" />
        <div className="steam-wisp wisp-7" />
        <div className="steam-wisp wisp-8" />
        <div className="steam-wisp-fast wisp-9" />
        <div className="steam-wisp-fast wisp-10" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/60" />

      <div className="container relative z-10 flex flex-1 justify-center mt-[200px] flex-col items-center text-center gap-20 sm:gap-50 ">
        {/* Thank You — clips up from bottom, then a shimmer sweeps across it on a loop */}
        <motion.h1
          className="shimmer-text text-150 text-center uppercase leading-[1.142] max-w-[1135px]"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={titleVariant}
        >
          Thank You
        </motion.h1>

        <motion.p
          className="text-white/80 text-center max-w-[560px] text-lg"
          initial="hidden"
          animate={animateIn ? "visible" : "hidden"}
          variants={textVariant}
        >
          Your submission has been received. Our team will get back to you
          shortly.
        </motion.p>

        {/* Buttons — one by one after title/text */}
        <div className="flex items-center gap-[10px] sm:gap-20 flex-wrap justify-center">
          <motion.div
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={btnVariant(0.65)}
          >
            <CustomButton label="Back To Home" href="/" variant={1} />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .shimmer-text {
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.65) 35%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.65) 65%,
            rgba(255, 255, 255, 0.65) 100%
          );
          background-size: 250% 100%;
          background-position: 200% 0;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer-sweep 3.2s ease-in-out 1.2s infinite;
        }

        @keyframes shimmer-sweep {
          0% {
            background-position: 200% 0;
          }
          55% {
            background-position: -50% 0;
          }
          100% {
            background-position: -50% 0;
          }
        }

        .steam-wisp,
        .steam-wisp-fast {
          position: absolute;
          bottom: -25%;
          width: 50vw;
          max-width: 720px;
          height: 75vh;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.32) 0%,
            rgba(255, 255, 255, 0.14) 40%,
            rgba(255, 255, 255, 0.04) 65%,
            transparent 80%
          );
          filter: blur(26px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          mix-blend-mode: screen;
        }

        .steam-wisp-fast {
          filter: blur(18px);
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.18) 40%,
            rgba(255, 255, 255, 0.05) 65%,
            transparent 80%
          );
        }

        .wisp-1 {
          left: -12%;
          animation: rise-a 10s infinite;
        }
        .wisp-2 {
          left: 12%;
          width: 34vw;
          height: 58vh;
          animation: rise-b 13s infinite;
          animation-delay: -4s;
        }
        .wisp-3 {
          left: 38%;
          width: 42vw;
          height: 68vh;
          animation: rise-a 11s infinite;
          animation-delay: -7s;
        }
        .wisp-4 {
          left: 58%;
          width: 32vw;
          height: 54vh;
          animation: rise-b 14s infinite;
          animation-delay: -2s;
        }
        .wisp-5 {
          left: 76%;
          width: 38vw;
          height: 62vh;
          animation: rise-a 12s infinite;
          animation-delay: -9s;
        }
        .wisp-6 {
          left: 26%;
          width: 24vw;
          height: 48vh;
          animation: rise-b 9s infinite;
          animation-delay: -5s;
        }
        .wisp-7 {
          left: 4%;
          width: 28vw;
          height: 52vh;
          animation: rise-a 15s infinite;
          animation-delay: -3s;
        }
        .wisp-8 {
          left: 88%;
          width: 30vw;
          height: 56vh;
          animation: rise-b 13.5s infinite;
          animation-delay: -6.5s;
        }
        .wisp-9 {
          left: 48%;
          width: 20vw;
          height: 40vh;
          animation: rise-a 7s infinite;
          animation-delay: -1.5s;
        }
        .wisp-10 {
          left: 66%;
          width: 18vw;
          height: 38vh;
          animation: rise-b 6.5s infinite;
          animation-delay: -3.5s;
        }

        @keyframes rise-a {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          50% {
            transform: translateY(-48vh) translateX(4vw) scale(1.15);
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(-3vw) scale(1.35);
            opacity: 0;
          }
        }

        @keyframes rise-b {
          0% {
            transform: translateY(0) translateX(0) scale(0.95);
            opacity: 0;
          }
          12% {
            opacity: 0.95;
          }
          50% {
            transform: translateY(-42vh) translateX(-5vw) scale(1.1);
          }
          80% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(-95vh) translateX(3vw) scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}