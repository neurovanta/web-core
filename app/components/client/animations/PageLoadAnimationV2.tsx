"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageLoadAnimationProps {
  onComplete: () => void;
}

export default function PageLoadAnimation({
  onComplete,
}: PageLoadAnimationProps) {
  const [revealLogo, setRevealLogo] = useState(false);
  const [wipeActive, setWipeActive] = useState(false);
  const [fadeLogo, setFadeLogo] = useState(false);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealLogo(true));
    const t0 = setTimeout(() => setFadeLogo(true), 1900);
    const t1 = setTimeout(() => setWipeActive(true), 2300);
    // last stripe: 2300 + 1300 = 3600ms
    const t2 = setTimeout(() => {
      setVisible(false);
      onCompleteRef.current();
      // }, 3620);
    }, 3550);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  const stripes = [
    { duration: 0.75, origin: "0% 50%" },
    { duration: 0.95, origin: "100% 50%" },
    { duration: 1.2, origin: "0% 50%" },
    { duration: 1.3, origin: "100% 50%" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {stripes.map((stripe, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: wipeActive ? 0 : 1 }}
          transition={{
            duration: stripe.duration,
            delay: 0,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            top: `${i * 25}%`,
            height: "25%",
            background: "#ffffff",
            transformOrigin: stripe.origin,
            zIndex: 1,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={fadeLogo ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 1, 1] }}
          style={{
            width: 260,
            height: 44,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src="/assets/logos/header-logo-full.svg"
            alt="Logo"
            width={500}
            height={150}
            style={{
              width: "auto",
              height: 40,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: revealLogo ? "-100%" : "0%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: "#ffffff",
              zIndex: 3,
            }}
          />
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: revealLogo ? "100%" : "0%" }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              background: "#ffffff",
              zIndex: 3,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
